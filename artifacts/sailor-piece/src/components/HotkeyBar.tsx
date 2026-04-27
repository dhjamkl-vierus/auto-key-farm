import { Power, Eye, LogOut } from "lucide-react";
import type { AppConfig } from "@/lib/storage";

interface Props {
  cfg: AppConfig;
}

export function HotkeyBar({ cfg }: Props) {
  return (
    <div
      className="flex items-center gap-2 text-[11px] px-3 py-1.5 rounded-lg border border-[var(--border-soft)] bg-[var(--bg-panel)]"
      style={{ color: "var(--text-dim)" }}
    >
      <span
        className="font-bold tracking-widest mr-1"
        style={{ color: "var(--accent)" }}
      >
        HOTKEYS
      </span>
      <span className="flex items-center gap-1">
        <span className="kbd">{cfg.toggleKey}</span>
        <Power className="w-3 h-3" /> Toggle
      </span>
      <span className="opacity-30">|</span>
      <span className="flex items-center gap-1">
        <span className="kbd">{cfg.showHideKey}</span>
        <Eye className="w-3 h-3" /> Show / Hide
      </span>
      <span className="opacity-30">|</span>
      <span className="flex items-center gap-1">
        <span className="kbd">{cfg.exitKey}</span>
        <LogOut className="w-3 h-3" /> Exit
      </span>
    </div>
  );
}
