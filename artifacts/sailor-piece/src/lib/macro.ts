/**
 * Macro engine. Mirrors AHK ToggleSpam / ResumeMacro / StopAllTimers.
 *
 * NOTE (browser limitation): a webpage cannot inject keystrokes into other
 * applications — that requires an OS-level binary. This engine SIMULATES the
 * macro: it emits debug events on the same intervals the AHK script would
 * spam keys. The visual behavior (timers, status, runtime, debug log,
 * weapon swap cadence) is identical to the desktop tool.
 */
import { dbg } from "./debug";
import type { AppConfig, KeySlot } from "./storage";

type Listener = (state: MacroState) => void;

export interface MacroState {
  active: boolean;
  startedAt: number | null;
  runtimeMs: number;
  totalSends: number;
  totalClicks: number;
  currentMelee: 1 | 2;
}

const initial: MacroState = {
  active: false,
  startedAt: null,
  runtimeMs: 0,
  totalSends: 0,
  totalClicks: 0,
  currentMelee: 1,
};

class MacroEngine {
  private state: MacroState = { ...initial };
  private listeners = new Set<Listener>();
  private timers: number[] = [];
  private clickTimer: number | null = null;
  private meleeManualTimer: number | null = null;
  private meleeAutoTimer: number | null = null;
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
    if (this.meleeManualTimer != null) { clearInterval(this.meleeManualTimer); this.meleeManualTimer = null; }
    if (this.meleeAutoTimer != null) { clearInterval(this.meleeAutoTimer); this.meleeAutoTimer = null; }
    if (this.runtimeTimer != null) { clearInterval(this.runtimeTimer); this.runtimeTimer = null; }
    if (this.webhookTimer != null) { clearInterval(this.webhookTimer); this.webhookTimer = null; }
  }

  setConfig(cfg: AppConfig) {
    this.cfg = cfg;
    if (this.state.active) {
      // hot-reload while running
      this.stop(true);
      this.start();
    }
  }

  start() {
    if (!this.cfg) return;
    if (this.state.active) return;

    const cfg = this.cfg;
    this.state = {
      ...this.state,
      active: true,
      startedAt: Date.now(),
      runtimeMs: 0,
      currentMelee: 1,
    };
    this.emit();

    dbg.ok(`Macro toggled ON — mode "${cfg.mode}"`);

    // Per-key timers
    const activeSlots = cfg.slots.filter((s) => s.enabled && s.key.trim().length > 0);
    activeSlots.forEach((slot) => this.startSlotTimer(slot));

    // Auto Click
    if (cfg.autoClick) {
      this.clickTimer = window.setInterval(() => {
        this.state.totalClicks += 1;
        this.emit();
        dbg.info(`Auto-click (${cfg.autoClickDelay}ms)`);
      }, Math.max(20, cfg.autoClickDelay));
    }

    // Weapon swap (manual: 1 <-> 2 keys)
    if (cfg.mode !== "Easy" && cfg.weaponManual) {
      this.meleeManualTimer = window.setInterval(() => {
        const nextSlot = this.state.currentMelee === 1 ? 2 : 1;
        const key = nextSlot === 1 ? cfg.weaponSlot1 : cfg.weaponSlot2;
        this.state.currentMelee = nextSlot as 1 | 2;
        this.state.totalSends += 1;
        this.emit();
        dbg.info(`Weapon swap → slot ${nextSlot} (key "${key}")`);
      }, Math.max(50, cfg.weaponManualDelay));
    }

    // Weapon swap (auto: cycle "1" key)
    if (cfg.mode !== "Easy" && cfg.weaponAuto) {
      this.meleeAutoTimer = window.setInterval(() => {
        this.state.totalSends += 1;
        this.emit();
        dbg.info(`Auto weapon switch tick (${cfg.weaponAutoDelay}ms)`);
      }, Math.max(50, cfg.weaponAutoDelay));
    }

    // Runtime ticker
    this.runtimeTimer = window.setInterval(() => {
      if (this.state.startedAt) {
        this.state.runtimeMs = Date.now() - this.state.startedAt;
        this.emit();
      }
    }, 250);

    // Webhook heartbeat
    if (cfg.useWebhook && cfg.webhookUrl) {
      this.webhookTimer = window.setInterval(() => {
        sendDiscord(cfg.webhookUrl, "Sailor Piece status", `Runtime: ${formatRuntime(this.state.runtimeMs)} • sends: ${this.state.totalSends}`);
      }, Math.max(60_000, cfg.webhookIntervalMin * 60_000));
      sendDiscord(cfg.webhookUrl, "Macro started", `Mode: ${cfg.mode}`);
    }
  }

  private startSlotTimer(slot: KeySlot) {
    const t = window.setInterval(() => {
      this.state.totalSends += 1;
      this.emit();
      dbg.info(`Sent key "${slot.key}" (${slot.delay}ms${slot.assign !== "All" ? ", " + slot.assign : ""})`);
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

export { sendDiscord };
