/**
 * Inline debug log with anti-spam de-duplication.
 * Mirrors the AHK LastLogMsg / LogMsgCount trick.
 */
import { useSyncExternalStore } from "react";

export type LogLevel = "info" | "ok" | "warn" | "err";

export interface LogEntry {
  id: number;
  ts: number;
  level: LogLevel;
  msg: string;
  count: number;
}

const MAX = 80;
let _id = 0;
let entries: LogEntry[] = [];
const listeners = new Set<() => void>();

function notify() {
  entries = entries.slice(); // new ref
  listeners.forEach((l) => l());
}

export function log(level: LogLevel, msg: string) {
  const last = entries[entries.length - 1];
  if (last && last.msg === msg && last.level === level) {
    last.count += 1;
    last.ts = Date.now();
    notify();
    return;
  }
  entries.push({ id: ++_id, ts: Date.now(), level, msg, count: 1 });
  if (entries.length > MAX) entries = entries.slice(entries.length - MAX);
  notify();
}

export const dbg = {
  info: (m: string) => log("info", m),
  ok: (m: string) => log("ok", m),
  warn: (m: string) => log("warn", m),
  err: (m: string) => log("err", m),
};

export function clearLog() {
  entries = [];
  notify();
}

export function useLog(): LogEntry[] {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => entries,
    () => entries,
  );
}

export function formatTs(ts: number) {
  const d = new Date(ts);
  return d.toTimeString().slice(0, 8);
}
