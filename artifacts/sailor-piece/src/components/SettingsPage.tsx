import { useState } from "react";
import { Palette, Keyboard, Webhook, Eye, Bug, ChevronDown, ChevronUp, Gamepad2 } from "lucide-react";
import { DebugHistory } from "./DebugHistory";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "./cheat/Card";
import { Switch } from "./cheat/Switch";
import { KeyCapture } from "./KeyCapture";
import { THEMES, type ThemeId } from "@/lib/themes";
import { PRESETS } from "@/lib/presets";
import type { AppConfig, GamePresetId } from "@/lib/storage";
import { dbg } from "@/lib/debug";
import { sendDiscord } from "@/lib/macro";

interface Props {
  cfg: AppConfig;
  set: <K extends keyof AppConfig>(key: K, v: AppConfig[K]) => void;
  applyAll: (patch: Partial<AppConfig>) => void;
}

const COLLAPSED_COUNT = 8;

export function SettingsPage({ cfg, set, applyAll }: Props) {
  const [showAllThemes, setShowAllThemes] = useState(false);
  const visibleThemes = showAllThemes ? THEMES : THEMES.slice(0, COLLAPSED_COUNT);
  const hiddenCount = THEMES.length - COLLAPSED_COUNT;

  return (
    <div className="grid gap-4">
      {/* GAME PRESET */}
      <Card title="Game Preset" icon={<Gamepad2 className="w-3.5 h-3.5" />}>
        <div className="text-xs mb-3" style={{ color: "var(--text-dim)" }}>
          Chọn một preset có sẵn để cấu hình tự động cho game Roblox tương ứng.
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
        title="Appearance Color"
        icon={<Palette className="w-3.5 h-3.5" />}
        right={
          hiddenCount > 0 && (
            <button
              onClick={() => setShowAllThemes((v) => !v)}
              className="btn text-xs"
            >
              {showAllThemes ? (
                <>
                  <ChevronUp className="w-3 h-3" /> Ẩn bớt
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" /> Xem tất cả ({hiddenCount}+)
                </>
              )}
            </button>
          )
        }
      >
        <div className="text-xs mb-3" style={{ color: "var(--text-dim)" }}>
          {THEMES.length} themes available. Currently <b style={{ color: "var(--accent)" }}>{THEMES.find(t => t.id === cfg.theme)?.label}</b>.
        </div>
        <div className="grid grid-cols-4 gap-2">
          <AnimatePresence initial={false}>
            {visibleThemes.map((t) => (
              <motion.button
                key={t.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.18 }}
                onClick={() => {
                  set("theme", t.id as ThemeId);
                  dbg.info(`Theme changed to ${t.label}`);
                }}
                className="rounded-lg p-3 text-xs font-semibold border transition-all"
                style={{
                  background: "var(--bg-base)",
                  borderColor: cfg.theme === t.id ? "var(--accent)" : "var(--border-soft)",
                  boxShadow: cfg.theme === t.id ? "0 0 18px -6px var(--accent-glow)" : undefined,
                  color: cfg.theme === t.id ? "var(--accent)" : "var(--text-dim)",
                }}
              >
                <div className="flex justify-center mb-2">
                  <div
                    className="w-10 h-10 rounded-md"
                    style={{
                      background: `linear-gradient(135deg, ${t.swatch[0]}, ${t.swatch[1]})`,
                      boxShadow: `0 0 12px ${t.swatch[0]}55`,
                    }}
                  />
                </div>
                {t.label}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </Card>

      <Card title="Hotkeys" icon={<Keyboard className="w-3.5 h-3.5" />}>
        <div className="text-xs mb-3" style={{ color: "var(--text-dim)" }}>
          Pick any key on your keyboard. Click a button below, then press the key you want.
        </div>
        <div className="grid grid-cols-3 gap-3">
          <HotkeyField label="Toggle Macro" value={cfg.toggleKey} onChange={(v) => set("toggleKey", v)} />
          <HotkeyField label="Show / Hide Menu" value={cfg.showHideKey} onChange={(v) => set("showHideKey", v)} />
          <HotkeyField label="Exit App" value={cfg.exitKey} onChange={(v) => set("exitKey", v)} />
        </div>
      </Card>

      <Card title="Discord Webhook" icon={<Webhook className="w-3.5 h-3.5" />}
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
                Heartbeat interval (minutes)
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
              Send test
            </button>
          </div>
        </div>
      </Card>

      <Card title="Inline Debug" icon={<Bug className="w-3.5 h-3.5" />}
        right={<Switch checked={cfg.debugEnabled} onChange={(v) => set("debugEnabled", v)} />}
      >
        <div className="text-xs flex items-center gap-2" style={{ color: "var(--text-dim)" }}>
          <Eye className="w-3.5 h-3.5" />
          Debug messages are shown inline at the bottom of the menu and de-duplicated automatically (no spam).
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
