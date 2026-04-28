import { useMemo, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import {
  Power, Cog, Target, MousePointerClick, Plus, Minus, Trash2,
  Sword, Swords, Hand, Fish, Sparkles,
} from "lucide-react";
import { Card } from "./cheat/Card";
import { Switch } from "./cheat/Switch";
import { type AppConfig, type FishingGame, type KeySlot, type MacroMode, type MousePos, isFirstEverVisit } from "@/lib/storage";
import { macro, formatRuntime, type MacroState } from "@/lib/macro";
import { dbg } from "@/lib/debug";
import { KeyCapture } from "./KeyCapture";
import { MousePosCapture } from "./MousePosCapture";
import { useT } from "@/i18n";

interface Props {
  cfg: AppConfig;
  set: <K extends keyof AppConfig>(key: K, v: AppConfig[K]) => void;
}

const MODES: MacroMode[] = ["Easy", "Boss Rush", "Infinity Tower"];

function useMacroState(): MacroState {
  return useSyncExternalStore(macro.subscribe.bind(macro), macro.getState, macro.getState);
}

export function MainPage({ cfg, set }: Props) {
  const t = useT();
  const state = useMacroState();
  const showWeapon = cfg.mode !== "Easy";

  const isFirst = useMemo(() => isFirstEverVisit(), []);

  const updateSlot = (id: string, patch: Partial<KeySlot>) => {
    set("slots", cfg.slots.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };
  const addSlot = () => {
    if (cfg.slots.length >= 10) return;
    set("slots", [
      ...cfg.slots,
      { id: crypto.randomUUID(), key: "", delay: 100, enabled: false, assign: "All" },
    ]);
    dbg.info("Added new key slot");
  };
  const removeSlot = (id: string) => {
    if (cfg.slots.length <= 1) return;
    set("slots", cfg.slots.filter((s) => s.id !== id));
  };

  const modeLabel = (m: MacroMode) =>
    m === "Easy" ? t("mode.easy") : m === "Boss Rush" ? t("mode.boss") : t("mode.infinity");

  return (
    <div className="grid gap-4">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="cheat-card cheat-card-glow scanline relative overflow-hidden p-4"
      >
        <div className="text-lg font-bold flex items-center gap-2">
          <span style={{ color: "var(--accent)" }}>▸</span>
          {isFirst ? t("main.welcome") : t("main.welcomeBack")}
        </div>
        <div className="text-sm mt-1" style={{ color: "var(--text-dim)" }}>
          ▸ {t("main.tagline")}
        </div>
      </motion.div>

      {/* MAIN — system status */}
      <Card
        title={t("card.main")}
        icon={<Power className="w-3.5 h-3.5" />}
        delay={0.05}
        right={
          <div
            className="flex items-center gap-2 text-xs font-mono px-2 py-1 rounded-md"
            style={{
              background: "var(--bg-elev)",
              color: state.active ? "var(--good)" : "var(--text-muted)",
            }}
          >
            <span
              className="inline-block w-2 h-2 rounded-full dot-pulse"
              style={{ background: state.active ? "var(--good)" : "var(--text-muted)" }}
            />
            {t("card.runtime")}: <b>{formatRuntime(state.runtimeMs)}</b>
          </div>
        }
      >
        <div className="flex items-center justify-between py-2">
          <div>
            <div className="font-bold text-sm">{t("status.systemStatus")}</div>
            <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              {t("status.pressTo", { key: cfg.toggleKey }).split(cfg.toggleKey).map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && <span className="kbd">{cfg.toggleKey}</span>}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-xs font-bold w-10 text-right"
              style={{ color: state.active ? "var(--good)" : "var(--bad)" }}
            >
              {state.active ? t("status.on") : t("status.off")}
            </span>
            <Switch checked={state.active} onChange={() => macro.toggle()} label={t("status.system")} />
          </div>
        </div>

        <div className="divider-x my-2" />

        <div className="flex items-center justify-between py-2">
          <div>
            <div className="font-bold text-sm">{t("mode.title")}</div>
            <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              {t("mode.subtitle")}
            </div>
          </div>
          <div className="flex gap-1">
            {MODES.map((m) => (
              <button
                key={m}
                onClick={() => set("mode", m)}
                className="btn text-xs"
                style={{
                  background: cfg.mode === m
                    ? "linear-gradient(135deg, var(--accent), var(--accent-2))"
                    : "var(--bg-elev)",
                  borderColor: cfg.mode === m ? "transparent" : "var(--border-soft)",
                  color: cfg.mode === m ? "#fff" : "var(--text-dim)",
                  boxShadow: cfg.mode === m ? "0 0 18px var(--accent-glow)" : undefined,
                }}
              >
                {modeLabel(m)}
              </button>
            ))}
          </div>
        </div>

        <div className="divider-x my-2" />
        <div className="grid grid-cols-3 gap-2 mt-2 text-center">
          <Stat label={t("stat.sends")} value={state.totalSends} />
          <Stat label={t("stat.clicks")} value={state.totalClicks} />
          <Stat label={t("stat.activeSlots")} value={cfg.slots.filter((s) => s.enabled).length} />
        </div>
      </Card>

      {/* MODE SETTINGS — Weapon switching */}
      {showWeapon && (
        <Card title={t("modeSettings.title")} icon={<Cog className="w-3.5 h-3.5" />} delay={0.08}>
          <div className="grid gap-3">
            <WeaponRow
              icon={<Sword className="w-4 h-4" style={{ color: "var(--accent)" }} />}
              label={t("weapon.manual")}
              enabled={cfg.weaponManual}
              onToggle={(v) => set("weaponManual", v)}
            >
              <div className="grid grid-cols-3 gap-2 items-end mt-2">
                <LabeledInput
                  label={t("weapon.delay")}
                  value={cfg.weaponManualDelay}
                  onChange={(v) => set("weaponManualDelay", v)}
                />
                <LabeledMouse
                  label={t("weapon.pos1")}
                  value={cfg.weaponManualPos1}
                  onChange={(v) => set("weaponManualPos1", v)}
                />
                <LabeledMouse
                  label={t("weapon.pos2")}
                  value={cfg.weaponManualPos2}
                  onChange={(v) => set("weaponManualPos2", v)}
                />
              </div>
            </WeaponRow>

            <WeaponRow
              icon={<Swords className="w-4 h-4" style={{ color: "var(--accent-2)" }} />}
              label={t("weapon.auto")}
              enabled={cfg.weaponAuto}
              onToggle={(v) => set("weaponAuto", v)}
            >
              <div className="grid grid-cols-2 gap-2 items-end mt-2">
                <LabeledInput
                  label={t("weapon.swapDelay")}
                  value={cfg.weaponAutoDelay}
                  onChange={(v) => set("weaponAutoDelay", v)}
                />
                <div
                  className="text-[11px] rounded-md px-2 py-2 border"
                  style={{
                    color: "var(--text-dim)",
                    background: "var(--bg-base)",
                    borderColor: "var(--border-soft)",
                  }}
                >
                  {t("weapon.autoExplain")}
                </div>
              </div>
            </WeaponRow>
          </div>
        </Card>
      )}

      {/* TARGET KEY */}
      <Card
        title={t("target.title")}
        icon={<Target className="w-3.5 h-3.5" />}
        delay={0.12}
        right={
          <div className="flex gap-1">
            <button onClick={addSlot} className="btn text-xs" disabled={cfg.slots.length >= 10}>
              <Plus className="w-3 h-3" /> {t("target.add")}
            </button>
            <button onClick={() => removeSlot(cfg.slots[cfg.slots.length - 1]?.id)} className="btn text-xs" disabled={cfg.slots.length <= 1}>
              <Minus className="w-3 h-3" /> {t("target.remove")}
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-[68px_1fr_120px_36px] gap-2 mb-2 text-[10px] font-bold tracking-wider uppercase" style={{ color: "var(--text-muted)" }}>
          <div className="text-center">{t("target.colOnOff")}</div>
          <div>{t("target.colKey")}</div>
          <div>{t("target.colDelay")}</div>
          <div></div>
        </div>
        <div className="grid gap-1.5">
          {cfg.slots.map((s, idx) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18, delay: idx * 0.02 }}
              className="grid grid-cols-[68px_1fr_120px_36px] gap-2 items-center"
            >
              <div className="flex items-center justify-center">
                <Switch checked={s.enabled} onChange={(v) => updateSlot(s.id, { enabled: v })} />
              </div>
              <KeyCapture
                value={s.key}
                onChange={(v) => updateSlot(s.id, { key: v })}
                placeholder={t("target.pressKey")}
              />
              <input
                type="number"
                min={20}
                value={s.delay}
                onChange={(e) => updateSlot(s.id, { delay: Math.max(20, Number(e.target.value) || 20) })}
                className="input"
              />
              <button
                onClick={() => removeSlot(s.id)}
                className="btn p-1.5"
                disabled={cfg.slots.length <= 1}
                title={t("target.removeTip")}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* AUTO CLICK */}
      <Card title={t("ac.title")} icon={<MousePointerClick className="w-3.5 h-3.5" />} delay={0.16}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-bold text-sm">{t("ac.enable")}</div>
            <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              {t("ac.desc")}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                {t("ac.delay")}
              </div>
              <input
                type="number"
                min={20}
                value={cfg.autoClickDelay}
                onChange={(e) => set("autoClickDelay", Math.max(20, Number(e.target.value) || 20))}
                className="input w-28"
              />
            </div>
            <Switch checked={cfg.autoClick} onChange={(v) => set("autoClick", v)} />
          </div>
        </div>
      </Card>

      {/* HOLD KEY */}
      <Card title={t("hold.title")} icon={<Hand className="w-3.5 h-3.5" />} delay={0.20}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="min-w-[180px]">
            <div className="font-bold text-sm">{t("hold.enable")}</div>
            <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              {t("hold.desc")}
            </div>
          </div>
          <div className="flex items-end gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
                {t("hold.key")}
              </div>
              <KeyCapture
                value={cfg.holdKey}
                onChange={(v) => set("holdKey", v)}
                className="min-w-[150px]"
              />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
                {t("hold.delay")}
              </div>
              <input
                type="number"
                min={20}
                value={cfg.holdDelay}
                onChange={(e) => set("holdDelay", Math.max(20, Number(e.target.value) || 20))}
                className="input w-28"
              />
            </div>
            <div className="self-center">
              <Switch checked={cfg.holdEnabled} onChange={(v) => set("holdEnabled", v)} />
            </div>
          </div>
        </div>
      </Card>

      {/* FISHING ASSIST */}
      <Card title={t("fish.title")} icon={<Fish className="w-3.5 h-3.5" />} delay={0.24}>
        {/* Tab switcher: King Legacy / Blox Fruits */}
        <div className="flex gap-1 mb-3 p-1 rounded-lg w-fit" style={{ background: "var(--bg-base)", border: "1px solid var(--border-soft)" }}>
          <FishTab
            active={cfg.fishingGame === "king-legacy"}
            label={t("fish.tabKL")}
            onClick={() => set("fishingGame", "king-legacy" as FishingGame)}
          />
          <FishTab
            active={cfg.fishingGame === "blox-fruits"}
            label={t("fish.tabBF")}
            onClick={() => set("fishingGame", "blox-fruits" as FishingGame)}
          />
        </div>

        {cfg.fishingGame === "king-legacy" ? (
          <>
            <div className="text-[11px] mb-3" style={{ color: "var(--text-muted)" }}>
              {t("fish.klDesc")}
            </div>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="min-w-[200px]">
                <div className="font-bold text-sm">{t("fish.enable")}</div>
                <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  {t("fish.desc")}
                </div>
              </div>
              <div className="flex items-end gap-3 flex-wrap">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
                    {t("fish.castKey")}
                  </div>
                  <KeyCapture
                    value={cfg.fishingCastKey}
                    onChange={(v) => set("fishingCastKey", v)}
                    className="min-w-[140px]"
                  />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
                    {t("fish.castHold")}
                  </div>
                  <input
                    type="number"
                    min={100}
                    value={cfg.fishingCastHoldMs}
                    onChange={(e) => set("fishingCastHoldMs", Math.max(100, Number(e.target.value) || 100))}
                    className="input w-28"
                  />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
                    {t("fish.castEvery")}
                  </div>
                  <input
                    type="number"
                    min={500}
                    value={cfg.fishingCastDelay}
                    onChange={(e) => set("fishingCastDelay", Math.max(500, Number(e.target.value) || 500))}
                    className="input w-28"
                  />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
                    {t("fish.reelAfter")}
                  </div>
                  <input
                    type="number"
                    min={100}
                    value={cfg.fishingReelDelay}
                    onChange={(e) => set("fishingReelDelay", Math.max(100, Number(e.target.value) || 100))}
                    className="input w-28"
                  />
                </div>
                <div className="self-center">
                  <Switch checked={cfg.fishingEnabled} onChange={(v) => set("fishingEnabled", v)} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div
            className="rounded-lg border p-8 text-center flex flex-col items-center gap-3"
            style={{ background: "var(--bg-base)", borderColor: "var(--border-soft)" }}
          >
            <div
              className="inline-flex items-center justify-center w-12 h-12 rounded-full"
              style={{
                background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
                boxShadow: "0 0 24px var(--accent-glow)",
              }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="font-display text-xl font-bold tracking-widest glow-text" style={{ color: "var(--text-base)" }}>
              {t("fish.bfComingSoon")}
            </div>
            <div className="text-[12px] max-w-md" style={{ color: "var(--text-dim)" }}>
              {t("fish.bfHelp")}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md py-2 border border-[var(--border-soft)] bg-[var(--bg-base)]">
      <div className="text-lg font-bold font-mono glow-text" style={{ color: "var(--accent)" }}>
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
        {label}
      </div>
    </div>
  );
}

function FishTab({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 text-xs font-semibold rounded-md transition-all"
      style={{
        background: active ? "linear-gradient(135deg, var(--accent), var(--accent-2))" : "transparent",
        color: active ? "#fff" : "var(--text-dim)",
        boxShadow: active ? "0 0 14px var(--accent-glow)" : undefined,
      }}
    >
      {label}
    </button>
  );
}

function WeaponRow({
  icon, label, enabled, onToggle, children,
}: {
  icon: React.ReactNode;
  label: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="rounded-lg p-3 border"
      style={{
        background: "var(--bg-base)",
        borderColor: enabled ? "var(--border-strong)" : "var(--border-soft)",
        boxShadow: enabled ? "0 0 22px -10px var(--accent-glow)" : undefined,
        transition: "all .2s",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          {icon}
          {label}
        </div>
        <Switch checked={enabled} onChange={onToggle} />
      </div>
      {enabled && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>{children}</motion.div>}
    </div>
  );
}

function LabeledInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>{label}</div>
      <input
        type="number"
        min={50}
        value={value}
        onChange={(e) => onChange(Math.max(50, Number(e.target.value) || 50))}
        className="input"
      />
    </div>
  );
}

function LabeledMouse({ label, value, onChange }: { label: string; value: MousePos | null; onChange: (v: MousePos) => void }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>{label}</div>
      <MousePosCapture value={value} onChange={onChange} className="w-full justify-start" />
    </div>
  );
}
