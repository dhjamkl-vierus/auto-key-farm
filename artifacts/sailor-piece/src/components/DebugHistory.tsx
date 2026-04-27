import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "./cheat/Card";
import { ScrollText, ChevronDown, ChevronUp, Trash2, Eye, EyeOff } from "lucide-react";
import { useLog, formatTs, clearLog } from "@/lib/debug";

const COLLAPSED_COUNT = 6;

export function DebugHistory() {
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const log = useLog();
  const reversed = [...log].reverse(); // newest first
  const visible = expanded ? reversed : reversed.slice(0, COLLAPSED_COUNT);

  return (
    <Card
      title="Debug History"
      icon={<ScrollText className="w-3.5 h-3.5" />}
      right={
        <div className="flex items-center gap-1">
          <button onClick={() => setOpen((v) => !v)} className="btn btn-ghost text-xs p-1.5" title={open ? "Hide" : "Show"}>
            {open ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <button onClick={clearLog} className="btn btn-ghost text-xs p-1.5" title="Clear all entries">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      }
    >
      {!open ? (
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
          History is hidden. Click <Eye className="w-3 h-3 inline" /> above to show.
        </div>
      ) : log.length === 0 ? (
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
          No log entries yet. Toggle macro on to start producing events.
        </div>
      ) : (
        <>
          <div
            className="rounded-lg border font-mono text-[11px] overflow-y-auto"
            style={{
              background: "var(--bg-base)",
              borderColor: "var(--border-soft)",
              maxHeight: expanded ? 360 : 200,
            }}
          >
            <AnimatePresence initial={false}>
              {visible.map((e) => (
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

          {log.length > COLLAPSED_COUNT && (
            <div className="flex items-center justify-between mt-2">
              <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                Showing <b>{visible.length}</b> of <b>{log.length}</b> entries.
              </div>
              <button onClick={() => setExpanded((v) => !v)} className="btn text-xs">
                {expanded ? (
                  <><ChevronUp className="w-3 h-3" /> Ẩn bớt</>
                ) : (
                  <><ChevronDown className="w-3 h-3" /> Xem tất cả ({log.length - COLLAPSED_COUNT}+)</>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
