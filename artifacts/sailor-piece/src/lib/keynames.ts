/**
 * Key naming helpers.
 * - getKeyLabel: turn a KeyboardEvent into a stable display name (e.g. "F1", "A", "Space", "ArrowUp").
 * - matchesShortcut: compare a configured hotkey string against a KeyboardEvent.
 */
export function getKeyLabel(e: KeyboardEvent): string {
  if (e.key.startsWith("F") && /^F\d{1,2}$/.test(e.key)) return e.key;
  if (e.key === " ") return "Space";
  if (e.key === "Escape") return "Esc";
  if (e.key === "Control" || e.key === "Shift" || e.key === "Alt" || e.key === "Meta") return e.key;
  if (e.key.length === 1) return e.key.toUpperCase();
  return e.key;
}

export function matchesShortcut(label: string, e: KeyboardEvent): boolean {
  return getKeyLabel(e).toLowerCase() === label.toLowerCase();
}
