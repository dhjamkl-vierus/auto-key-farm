import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "./cheat/Card";
import { ScrollText, Trash2, Eye, EyeOff } from "lucide-react";
import { useLog, formatTs, clearLog } from "@/lib/debug";
import { useT } from "@/i18n";

/**
 * Up to ~7 entries are visible at once; beyond that the panel becomes
 * scrollable instead of growing or hiding. No "expand" button — the user
 * can scroll for older items.
 */
const ROW_HEIGHT = 28;        // px per row (matches py-1.5 + 11px font + border)
const MAX_VISIBLE_ROWS = 7;
const PANEL_MAX = ROW_HEIGHT * MAX_VISIBLE_ROWS;

export function DebugHistory() {
  const t = useT();
  const [open, setOpen] = useState(true);
  const log = useLog();
  const reversed = [...log].reverse(); // newest first

  return (
    <Card
      title={t("set.history")}
      icon={<ScrollText className="w-3.5 h-3.5" />}
      right={
        <div className="flex items-center gap-1">
          <button
            onClick={() => setOpen((v) => !v)}
            className="btn btn-ghost text-xs p-1.5"
            title={open ? t("set.historyHide") : t("set.historyShow")}
          >
            {open ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <button onClick={clearLog} className="btn btn-ghost text-xs p-1.5" title={t("set.historyClear")}>
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      }
    >
      {!open ? (
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
          {t("set.historyHidden")}
        </div>
      ) : log.length === 0 ? (
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
          {t("set.historyEmpty")}
        </div>
      ) : (
        <>
          <div
            className="rounded-lg border font-mono text-[11px] overflow-y-auto"
            style={{
              background: "var(--bg-base)",
              borderColor: "var(--border-soft)",
              maxHeight: PANEL_MAX,
            }}
          >
            <AnimatePresence initial={false}>
              {reversed.map((e) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="px-3 py-1.5 flex items-center gap-2 border-b border-[var(--border-soft)] last:border-0"
                >
                  <span className="opacity-50 shrink-0">[{formatTs(e.ts)}]</span>
                  <span
                    className="px-1.5 rounded text-[9px] font-bold uppercase shrink-0"
                    style={{
                      color:
                        e.level === "ok" ? "var(--good)" :
                        e.level === "warn" ? "var(--warn)" :
                        e.level === "err" ? "var(--bad)" :
                        "var(--accent)",
                      background: "var(--bg-elev)",
                    }}
                  >
                    {e.level}
                  </span>
                  <span className="flex-1 truncate" style={{ color: "var(--text-base)" }}>
                    {e.msg}
                  </span>
                  {e.count > 1 && (
                    <span className="opacity-60 shrink-0">×{e.count}</span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {log.length > MAX_VISIBLE_ROWS && (
            <div className="text-[10px] mt-2" style={{ color: "var(--text-muted)" }}>
              {t("set.historyShowing", { visible: MAX_VISIBLE_ROWS, total: log.length })}
            </div>
          )}
        </>
      )}
    </Card>
  );
}
