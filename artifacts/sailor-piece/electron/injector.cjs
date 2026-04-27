/**
 * Native injection layer.
 * Wraps @nut-tree-fork/nut-js so the macro engine can press real keys
 * and click the real mouse OS-wide. Lazy-loaded so the app still launches
 * (with a clear warning) if the native module fails to install.
 */
let nut = null;
let ready = false;
let loadError = null;

async function init() {
  try {
    nut = await import("@nut-tree-fork/nut-js");
    // Speed up — default delays would lag the macro.
    if (nut.keyboard) nut.keyboard.config.autoDelayMs = 0;
    if (nut.mouse) nut.mouse.config.autoDelayMs = 0;
    ready = true;
    console.log("[injector] nut-js ready");
  } catch (err) {
    loadError = err;
    ready = false;
    console.warn("[injector] nut-js not loaded:", err && err.message);
  }
}

function isReady() {
  return ready;
}

/**
 * Map a renderer-side key label (from getKeyLabel) to a nut-js Key enum value.
 */
function mapKey(label) {
  if (!nut) throw new Error("nut-js not loaded");
  const Key = nut.Key;
  const k = String(label).trim();
  // F-keys
  if (/^F\d{1,2}$/i.test(k)) return Key[k.toUpperCase()];
  // Single character (letter or digit)
  if (k.length === 1) {
    const upper = k.toUpperCase();
    if (/[A-Z]/.test(upper)) return Key[upper];
    if (/[0-9]/.test(upper)) return Key["Num" + upper];
  }
  // Named keys
  const named = {
    Space: Key.Space,
    Enter: Key.Enter,
    Esc: Key.Escape,
    Escape: Key.Escape,
    Tab: Key.Tab,
    Shift: Key.LeftShift,
    Ctrl: Key.LeftControl,
    Control: Key.LeftControl,
    Alt: Key.LeftAlt,
    ArrowUp: Key.Up,
    ArrowDown: Key.Down,
    ArrowLeft: Key.Left,
    ArrowRight: Key.Right,
    Backspace: Key.Backspace,
    Delete: Key.Delete,
  };
  if (named[k]) return named[k];
  throw new Error("Unmapped key: " + label);
}

async function pressKey(label) {
  if (!ready) throw new Error("nut-js not ready");
  const k = mapKey(label);
  await nut.keyboard.pressKey(k);
  await nut.keyboard.releaseKey(k);
}

async function click() {
  if (!ready) throw new Error("nut-js not ready");
  await nut.mouse.leftClick();
}

async function clickAt(x, y) {
  if (!ready) throw new Error("nut-js not ready");
  await nut.mouse.setPosition(new nut.Point(x, y));
  await nut.mouse.leftClick();
}

module.exports = { init, isReady, pressKey, click, clickAt, get loadError() { return loadError; } };
