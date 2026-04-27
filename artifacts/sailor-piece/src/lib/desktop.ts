/**
 * Renderer-side wrapper around the Electron preload bridge (window.autokey).
 * - When running in the browser, every method becomes a no-op so the app
 *   stays usable for development / preview.
 * - When running in the Electron build, the methods route through IPC into
 *   nut-js for real OS-wide key/mouse injection.
 */
import { dbg } from "./debug";

interface AutokeyBridge {
  isElectron: true;
  isAvailable: () => Promise<boolean>;
  pressKey: (k: string) => Promise<{ ok: boolean; error?: string }>;
  click: () => Promise<{ ok: boolean; error?: string }>;
  clickAt: (x: number, y: number) => Promise<{ ok: boolean; error?: string }>;
  screenSize: () => Promise<{ width: number; height: number }>;
}

declare global {
  interface Window {
    autokey?: AutokeyBridge;
  }
}

let nativeReady = false;

export async function initDesktop() {
  if (typeof window === "undefined" || !window.autokey?.isElectron) {
    dbg.info("Running in browser — keystroke injection disabled");
    return false;
  }
  try {
    nativeReady = await window.autokey.isAvailable();
    if (nativeReady) {
      dbg.ok("Desktop bridge ready — real keystrokes/clicks ENABLED");
    } else {
      dbg.warn("Electron detected but native injector failed to load");
    }
  } catch (err) {
    dbg.err(`initDesktop: ${String(err)}`);
  }
  return nativeReady;
}

export function isDesktop(): boolean {
  return !!window.autokey?.isElectron;
}

export function isInjectionReady(): boolean {
  return nativeReady;
}

/** Fire-and-forget single key press. */
export function pressKey(key: string) {
  if (!nativeReady || !window.autokey) return;
  window.autokey.pressKey(key).then((r) => {
    if (!r.ok) dbg.err(`pressKey "${key}": ${r.error}`);
  });
}

/** Fire-and-forget left click at current mouse position. */
export function click() {
  if (!nativeReady || !window.autokey) return;
  window.autokey.click().then((r) => {
    if (!r.ok) dbg.err(`click: ${r.error}`);
  });
}

/** Fire-and-forget move + left click at absolute screen position. */
export function clickAt(x: number, y: number) {
  if (!nativeReady || !window.autokey) return;
  window.autokey.clickAt(x, y).then((r) => {
    if (!r.ok) dbg.err(`clickAt(${x},${y}): ${r.error}`);
  });
}
