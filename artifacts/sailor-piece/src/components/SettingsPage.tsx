import { useState } from "react";
import { Palette, Keyboard, Webhook, Eye, Bug, ChevronDown, ChevronUp, Gamepad2, Languages } from "lucide-react";
import { DebugHistory } from "./DebugHistory";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "./cheat/Card";
import { Switch } from "./cheat/Switch";
import { KeyCapture } from "./KeyCapture";
import { LanguageSelector, CurrentLanguageBadge } from "./LanguageSelector";
import { THEMES, type ThemeId } from "@/lib/themes";
import { PRESETS } from "@/lib/presets";
import type { AppConfig, GamePresetId } from "@/lib/storage";
import { dbg } from "@/lib/debug";
import { sendDiscord } from "@/lib/macro";
import { useT, type Lang } from "@/i18n";

interface Props {
  cfg: AppConfig;
  set: <K extends keyof AppConfig>(key: K, v: AppConfig[K]) => void;
  applyAll: (patch: Partial<AppConfig>) => void;
}

const COLLAPSED_COUNT = 8;

export function SettingsPage({ cfg, set, applyAll }: Props) {
  const t = useT();
  const [showAllThemes, setShowAllThemes] = useState(false);
  const visibleThemes = showAllThemes ? THEMES : THEMES.slice(0, COLLAPSED_COUNT);
  const hiddenCount = THEMES.length - COLLAPSED_COUNT;

  return (
    <div className="grid gap-4">
      {/* LANGUAGE */}
      <Card
        title={t("set.language")}
        icon={<Languages className="w-3.5 h-3.5" />}
        right={<CurrentLanguageBadge />}
      >
        <div className="text-xs mb-3" style={{ color: "var(--text-dim)" }}>
          {t("set.languageDesc")}
        </div>
        <LanguageSelector
          value={cfg.language}
          onChange={(l: Lang) => {
            set("language", l);
            dbg.info(`Language changed to ${l}`);
          }}
        />
      </Card>

      {/* GAME PRESET */}
      <Card title={t("set.preset")} icon={<Gamepad2 className="w-3.5 h-3.5" />}>
        <div className="text-xs mb-3" style={{ color: "var(--text-dim)" }}>
          {t("set.presetDesc")}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                const patch = p.apply(cfg);
                applyAll({ ...patch, gamePreset: p.id as GamePresetId });
                dbg.ok(`Applied preset: ${p.label}`);
              }}
              className="rounded-lg p-3 text-left border transition-all"
              style={{
                background: "var(--bg-base)",
                borderColor: cfg.gamePreset === p.id ? "var(--accent)" : "var(--border-soft)",
                boxShadow: cfg.gamePreset === p.id ? "0 0 18px -6px var(--accent-glow)" : undefined,
              }}
            >
              <div
                className="font-semibold text-sm"
                style={{ color: cfg.gamePreset === p.id ? "var(--accent)" : "var(--text-base)" }}
              >
                {p.label}
              </div>
              <div className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>
                {p.description}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* APPEARANCE */}
      <Card
        title={t("set.appearance")}
        icon={<Palette className="w-3.5 h-3.5" />}
        right={
          hiddenCount > 0 && (
            <button
              onClick={() => setShowAllThemes((v) => !v)}
              className="btn text-xs"
            >
              {showAllThemes ? (
                <>
                  <ChevronUp className="w-3 h-3" /> {t("set.hideAll")}
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" /> {t("set.viewAll", { count: hiddenCount })}
                </>
              )}
            </button>
          )
        }
      >
        <div className="text-xs mb-3" style={{ color: "var(--text-dim)" }}>
          {t("set.themesAvailable", { count: THEMES.length })}{" "}
          <b style={{ color: "var(--accent)" }}>{THEMES.find(th => th.id === cfg.theme)?.label}</b>.
        </div>
        <div className="grid grid-cols-4 gap-2">
          <AnimatePresence initial={false}>
            {visibleThemes.map((th) => (
              <motion.button
                key={th.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.18 }}
                onClick={() => {
                  set("theme", th.id as ThemeId);
                  dbg.info(`Theme changed to ${th.label}`);
                }}
                className="rounded-lg p-3 text-xs font-semibold border transition-all"
                style={{
                  background: "var(--bg-base)",
                  borderColor: cfg.theme === th.id ? "var(--accent)" : "var(--border-soft)",
                  boxShadow: cfg.theme === th.id ? "0 0 18px -6px var(--accent-glow)" : undefined,
                  color: cfg.theme === th.id ? "var(--accent)" : "var(--text-dim)",
                }}
              >
                <div className="flex justify-center mb-2">
                  <div
                    className="w-10 h-10 rounded-md"
                    style={{
                      background: `linear-gradient(135deg, ${th.swatch[0]}, ${th.swatch[1]})`,
                      boxShadow: `0 0 12px ${th.swatch[0]}55`,
                    }}
                  />
                </div>
                {th.label}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </Card>

      <Card title={t("set.hotkeysTitle")} icon={<Keyboard className="w-3.5 h-3.5" />}>
        <div className="text-xs mb-3" style={{ color: "var(--text-dim)" }}>
          {t("set.hotkeysDesc")}
        </div>
        <div className="grid grid-cols-3 gap-3">
          <HotkeyField label={t("set.toggleMacro")} value={cfg.toggleKey} onChange={(v) => set("toggleKey", v)} />
          <HotkeyField label={t("set.showHide")} value={cfg.showHideKey} onChange={(v) => set("showHideKey", v)} />
          <HotkeyField label={t("set.exitApp")} value={cfg.exitKey} onChange={(v) => set("exitKey", v)} />
        </div>
      </Card>

      <Card title={t("set.webhook")} icon={<Webhook className="w-3.5 h-3.5" />}
        right={<Switch checked={cfg.useWebhook} onChange={(v) => set("useWebhook", v)} />}
      >
        <div className="grid gap-2">
          <input
            placeholder="https://discord.com/api/webhooks/..."
            value={cfg.webhookUrl}
            onChange={(e) => set("webhookUrl", e.target.value)}
            className="input"
            disabled={!cfg.useWebhook}
          />
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
                {t("set.heartbeat")}
              </div>
              <input
                type="number"
                min={1}
                value={cfg.webhookIntervalMin}
                onChange={(e) => set("webhookIntervalMin", Math.max(1, Number(e.target.value) || 1))}
                className="input"
                disabled={!cfg.useWebhook}
              />
            </div>
            <button
              className="btn btn-primary self-end"
              disabled={!cfg.useWebhook || !cfg.webhookUrl}
              onClick={async () => {
                try {
                  await sendDiscord(cfg.webhookUrl, "Test message", "AutoKey-Farm webhook works.");
                  dbg.ok("Webhook test sent");
                } catch {
                  dbg.err("Webhook test failed");
                }
              }}
            >
              {t("set.sendTest")}
            </button>
          </div>
        </div>
      </Card>

      <Card title={t("set.debug")} icon={<Bug className="w-3.5 h-3.5" />}
        right={<Switch checked={cfg.debugEnabled} onChange={(v) => set("debugEnabled", v)} />}
      >
        <div className="text-xs flex items-center gap-2" style={{ color: "var(--text-dim)" }}>
          <Eye className="w-3.5 h-3.5" />
          {t("set.debugDesc")}
        </div>
      </Card>

      <DebugHistory />
    </div>
  );
}

function HotkeyField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
        {label}
      </div>
      <KeyCapture value={value} onChange={onChange} className="w-full justify-between" />
    </div>
  );
}
