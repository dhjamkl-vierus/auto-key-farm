/**
 * Macro engine. Mirrors AHK ToggleSpam / ResumeMacro / StopAllTimers.
 *
 * NOTE (browser limitation): a webpage cannot inject keystrokes into other
 * applications — that requires an OS-level binary. This engine SIMULATES the
 * macro: it emits debug events on the same intervals the AHK script would
 * spam keys, so the visible cadence (timers, status, runtime, debug log,
 * weapon swap) is identical to the desktop tool.
 *
 * Hardening:
 *  - Single-source timer registry, every start clears any existing timers
 *    before scheduling new ones (no duplicate-loop on rapid ON/OFF).
 *  - Mode normalization in one place (applyMode).
 *  - Per-slot key normalization.
 *  - Counters reset on every start so the user sees a fresh session number.
 */
import { dbg } from "./debug";
import { normalizeKey, type AppConfig, type KeySlot, type MacroMode } from "./storage";

type Listener = (state: MacroState) => void;

export interface MacroState {
  active: boolean;
  startedAt: number | null;
  runtimeMs: number;
  totalSends: number;
  totalClicks: number;
  currentMelee: 1 | 2;
  currentWeapon: 1 | 2;
}

const initial: MacroState = {
  active: false,
  startedAt: null,
  runtimeMs: 0,
  totalSends: 0,
  totalClicks: 0,
  currentMelee: 1,
  currentWeapon: 1,
};

class MacroEngine {
  private state: MacroState = { ...initial };
  private listeners = new Set<Listener>();
  private timers: number[] = [];
  private clickTimer: number | null = null;
  private holdTimer: number | null = null;
  private meleeManualTimer: number | null = null;
  private meleeAutoTimer: number | null = null;
  private fishingTimer: number | null = null;
  private runtimeTimer: number | null = null;
  private webhookTimer: number | null = null;
  private cfg: AppConfig | null = null;

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
  getState = (): MacroState => this.state;

  private emit() {
    this.state = { ...this.state };
    this.listeners.forEach((l) => l(this.state));
  }

  private clearAllTimers() {
    this.timers.forEach((t) => clearInterval(t));
    this.timers = [];
    if (this.clickTimer != null) { clearInterval(this.clickTimer); this.clickTimer = null; }
    if (this.holdTimer != null) { clearInterval(this.holdTimer); this.holdTimer = null; }
    if (this.meleeManualTimer != null) { clearInterval(this.meleeManualTimer); this.meleeManualTimer = null; }
    if (this.meleeAutoTimer != null) { clearInterval(this.meleeAutoTimer); this.meleeAutoTimer = null; }
    if (this.fishingTimer != null) { clearInterval(this.fishingTimer); this.fishingTimer = null; }
    if (this.runtimeTimer != null) { clearInterval(this.runtimeTimer); this.runtimeTimer = null; }
    if (this.webhookTimer != null) { clearInterval(this.webhookTimer); this.webhookTimer = null; }
  }

  setConfig(cfg: AppConfig) {
    this.cfg = applyMode(cfg);
    if (this.state.active) {
      this.clearAllTimers();
      this.scheduleAll();
    }
  }

  start() {
    if (!this.cfg) return;
    if (this.state.active) return;

    this.state = {
      ...this.state,
      active: true,
      startedAt: Date.now(),
      runtimeMs: 0,
      totalSends: 0,
      totalClicks: 0,
      currentMelee: 1,
      currentWeapon: 1,
    };
    this.emit();

    dbg.ok(`Macro toggled ON — mode "${this.cfg.mode}"`);
    this.clearAllTimers();
    this.scheduleAll();
  }

  private scheduleAll() {
    if (!this.cfg) return;
    const cfg = this.cfg;

    const activeSlots = cfg.slots.filter((s) => s.enabled && s.key.trim().length > 0);
    activeSlots.forEach((slot) => this.startSlotTimer(slot));

    if (cfg.autoClick) {
      this.clickTimer = window.setInterval(() => {
        this.state.totalClicks += 1;
        this.emit();
        dbg.info(`Auto-click (${cfg.autoClickDelay}ms)`);
      }, Math.max(20, cfg.autoClickDelay));
    }

    if (cfg.holdEnabled && cfg.holdKey) {
      const k = normalizeKey(cfg.holdKey);
      this.holdTimer = window.setInterval(() => {
        this.state.totalSends += 1;
        this.emit();
        dbg.info(`Hold "${k}" tick (${cfg.holdDelay}ms)`);
      }, Math.max(20, cfg.holdDelay));
    }

    // Manual = mouse positions: alternate clicking pos 1 and pos 2
    if (cfg.mode !== "Easy" && cfg.weaponManual) {
      this.meleeManualTimer = window.setInterval(() => {
        const next = this.state.currentMelee === 1 ? 2 : 1;
        const pos = next === 1 ? cfg.weaponManualPos1 : cfg.weaponManualPos2;
        this.state.currentMelee = next as 1 | 2;
        this.state.totalSends += 1;
        this.emit();
        if (pos) {
          dbg.info(`Mouse-click slot ${next} at (${pos.x}, ${pos.y})`);
        } else {
          dbg.warn(`Slot ${next} mouse position not set`);
        }
      }, Math.max(50, cfg.weaponManualDelay));
    }

    // Auto = cycle key 1 and key 2 on the keyboard
    if (cfg.mode !== "Easy" && cfg.weaponAuto) {
      this.meleeAutoTimer = window.setInterval(() => {
        const next = this.state.currentWeapon === 1 ? 2 : 1;
        const key = next === 1
          ? normalizeKey(cfg.weaponAutoKey1)
          : normalizeKey(cfg.weaponAutoKey2);
        this.state.currentWeapon = next as 1 | 2;
        this.state.totalSends += 1;
        this.emit();
        dbg.info(`Pressed "${key}" (auto weapon swap)`);
      }, Math.max(50, cfg.weaponAutoDelay));
    }

    // Fishing: cast key + reel click on a stagger
    if (cfg.fishingEnabled) {
      const cast = () => {
        dbg.ok(`Cast rod — pressed "${normalizeKey(cfg.fishingCastKey)}"`);
        this.state.totalSends += 1;
        this.emit();
        window.setTimeout(() => {
          if (!this.state.active) return;
          dbg.ok(`Reel — mouse click`);
          this.state.totalClicks += 1;
          this.emit();
        }, Math.max(100, cfg.fishingReelDelay));
      };
      cast();
      this.fishingTimer = window.setInterval(cast,
        Math.max(500, cfg.fishingCastDelay + cfg.fishingReelDelay));
    }

    this.runtimeTimer = window.setInterval(() => {
      if (this.state.startedAt) {
        this.state.runtimeMs = Date.now() - this.state.startedAt;
        this.emit();
      }
    }, 250);

    if (cfg.useWebhook && cfg.webhookUrl) {
      this.webhookTimer = window.setInterval(() => {
        sendDiscord(cfg.webhookUrl, "AutoKey-Farm status",
          `Runtime: ${formatRuntime(this.state.runtimeMs)} • sends: ${this.state.totalSends}`);
      }, Math.max(60_000, cfg.webhookIntervalMin * 60_000));
      sendDiscord(cfg.webhookUrl, "Macro started", `Mode: ${cfg.mode} • Preset: ${cfg.gamePreset}`);
    }
  }

  private startSlotTimer(slot: KeySlot) {
    const k = normalizeKey(slot.key);
    const t = window.setInterval(() => {
      this.state.totalSends += 1;
      this.emit();
      dbg.info(`Sent key "${k}" (${slot.delay}ms${slot.assign !== "All" ? ", " + slot.assign : ""})`);
    }, Math.max(20, slot.delay));
    this.timers.push(t);
  }

  stop(silent = false) {
    if (!this.state.active && !silent) return;
    const ranFor = this.state.runtimeMs;
    this.clearAllTimers();
    this.state = {
      ...this.state,
      active: false,
      startedAt: null,
      runtimeMs: 0,
    };
    this.emit();
    if (!silent) {
      dbg.warn(`Macro toggled OFF (ran ${formatRuntime(ranFor)})`);
      if (this.cfg?.useWebhook && this.cfg.webhookUrl) {
        sendDiscord(this.cfg.webhookUrl, "Macro stopped", `Total sends: ${this.state.totalSends}`);
      }
    }
  }

  toggle() {
    if (this.state.active) this.stop();
    else this.start();
  }
}

/** Mode logic layer — Easy mode disables all weapon switching. */
export function applyMode(cfg: AppConfig): AppConfig {
  if (cfg.mode === "Easy") {
    return { ...cfg, weaponManual: false, weaponAuto: false };
  }
  return cfg;
}

export const macro = new MacroEngine();

export function formatRuntime(ms: number) {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

async function sendDiscord(url: string, title: string, description: string) {
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [{ title, description, color: 0xa855f7, timestamp: new Date().toISOString() }],
      }),
    });
  } catch {
    /* swallow */
  }
}

export type { MacroMode };
export { sendDiscord };
