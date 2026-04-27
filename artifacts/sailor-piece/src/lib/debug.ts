/**
 * Inline debug log with anti-spam de-duplication AND throttle.
 * Mirrors the AHK LastLogMsg / LogMsgCount trick + adds a 200ms cooldown
 * so a runaway timer can never flood the UI.
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
const THROTTLE_MS = 180;
let _id = 0;
let entries: LogEntry[] = [];
let lastEmit = 0;
const listeners = new Set<() => void>();

function notify() {
  entries = entries.slice(); // new ref
  listeners.forEach((l) => l());
}

export function log(level: LogLevel, msg: string) {
  const now = Date.now();
  const last = entries[entries.length - 1];

  // Same message back-to-back? Just bump the count, skip notifying too often.
  if (last && last.msg === msg && last.level === level) {
    last.count += 1;
    last.ts = now;
    if (now - lastEmit < THROTTLE_MS) return;
    lastEmit = now;
    notify();
    return;
  }

  // New message: always insert, but throttle pure-spam-different-msg too.
  entries.push({ id: ++_id, ts: now, level, msg, count: 1 });
  if (entries.length > MAX) entries = entries.slice(entries.length - MAX);
  if (now - lastEmit < THROTTLE_MS && level === "info") return;
  lastEmit = now;
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
