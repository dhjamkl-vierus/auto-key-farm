import { useLog, formatTs, clearLog } from "@/lib/debug";
import { Trash2, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function DebugTicker({ enabled }: { enabled: boolean }) {
  const log = useLog();
  const visible = enabled ? log.slice(-6) : [];

  return (
    <div
      className="border-t border-[var(--border-soft)] px-4 py-2 flex items-center gap-3 text-[11px] font-mono shrink-0"
      style={{ background: "var(--bg-panel)", color: "var(--text-dim)", minHeight: 36 }}
    >
      <div
        className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded-md"
        style={{
          background: "var(--bg-elev)",
          color: "var(--accent)",
          border: "1px solid var(--border-soft)",
        }}
      >
        <Terminal className="w-3 h-3" />
        DEBUG
      </div>

      <div className="flex-1 flex items-center gap-3 overflow-hidden">
        {visible.length === 0 ? (
          <span className="opacity-50">{enabled ? "waiting for events…" : "debug disabled"}</span>
        ) : (
          <AnimatePresence initial={false}>
            {visible.map((e) => (
              <motion.span
                key={e.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1 whitespace-nowrap"
                style={{
                  color:
                    e.level === "ok" ? "var(--good)" :
                    e.level === "warn" ? "var(--warn)" :
                    e.level === "err" ? "var(--bad)" :
                    "var(--text-dim)",
                }}
              >
                <span className="opacity-50">[{formatTs(e.ts)}]</span>
                {e.msg}
                {e.count > 1 && <span className="opacity-60">×{e.count}</span>}
              </motion.span>
            ))}
          </AnimatePresence>
        )}
      </div>

      <button onClick={clearLog} className="btn btn-ghost p-1" title="Clear">
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}
