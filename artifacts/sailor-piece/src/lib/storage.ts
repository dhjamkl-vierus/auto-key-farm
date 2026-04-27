/**
 * Replaces IniRead / IniWrite from the AHK script.
 * One JSON blob in localStorage = one preset config.
 */
import type { ThemeId } from "./themes";

export type MacroMode = "Easy" | "Boss Rush" | "Infinity Tower";
export type GamePresetId =
  | "custom"
  | "king-legacy-fish"
  | "king-legacy-combat"
  | "blox-fruit-combat"
  | "blox-fruit-mastery"
  | "sailor-piece-easy"
  | "sailor-piece-boss"
  | "anime-defenders"
  | "generic-mash";

export interface KeySlot {
  id: string;
  key: string;        // single character or named key (e.g. "e", "1", "Space")
  delay: number;      // ms between sends
  enabled: boolean;
  assign: "All" | "Melee" | "Sword";
}

export interface MousePos { x: number; y: number; }

export interface AppConfig {
  // Mode
  mode: MacroMode;
  gamePreset: GamePresetId;

  // Weapon Switching — Manual = mouse positions on screen
  weaponManual: boolean;
  weaponManualDelay: number;
  weaponManualPos1: MousePos | null;
  weaponManualPos2: MousePos | null;

  // Weapon Switching — Auto = cycles keys 1 and 2 on the keyboard
  weaponAuto: boolean;
  weaponAutoDelay: number;
  weaponAutoKey1: string;
  weaponAutoKey2: string;

  // Target keys
  slots: KeySlot[];

  // Auto Click
  autoClick: boolean;
  autoClickDelay: number;

  // Hold Key (sits below Auto Clicker)
  holdEnabled: boolean;
  holdKey: string;
  holdDelay: number;

  // Fishing assist (King Legacy / Blox Fruits style)
  fishingEnabled: boolean;
  fishingCastKey: string;
  fishingCastDelay: number;     // ms to wait between casts
  fishingReelDelay: number;     // ms to wait before clicking to reel

  // Hotkeys
  toggleKey: string;
  showHideKey: string;
  exitKey: string;

  // System
  theme: ThemeId;
  webhookUrl: string;
  useWebhook: boolean;
  webhookIntervalMin: number;

  // Inline debug behavior
  debugEnabled: boolean;
}

export const DEFAULT_CONFIG: AppConfig = {
  mode: "Easy",
  gamePreset: "custom",
  weaponManual: false,
  weaponManualDelay: 100,
  weaponManualPos1: null,
  weaponManualPos2: null,
  weaponAuto: false,
  weaponAutoDelay: 100,
  weaponAutoKey1: "1",
  weaponAutoKey2: "2",
  slots: [
    { id: crypto.randomUUID(), key: "E", delay: 100, enabled: false, assign: "All" },
  ],
  autoClick: false,
  autoClickDelay: 100,
  holdEnabled: false,
  holdKey: "Shift",
  holdDelay: 100,
  fishingEnabled: false,
  fishingCastKey: "F",
  fishingCastDelay: 4000,
  fishingReelDelay: 1500,
  toggleKey: "F1",
  showHideKey: "F2",
  exitKey: "F3",
  theme: "void",
  webhookUrl: "",
  useWebhook: false,
  webhookIntervalMin: 10,
  debugEnabled: true,
};

const STORAGE_KEY = "sailor-piece.config.v1";
const VISITED_KEY = "sailor-piece.visited";

/** Anti-corrupt loader: any parse error falls back to defaults */
export function loadConfig(): AppConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CONFIG };
    const parsed = JSON.parse(raw) as Partial<AppConfig>;
    return { ...DEFAULT_CONFIG, ...parsed, slots: parsed.slots ?? DEFAULT_CONFIG.slots };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function saveConfig(cfg: AppConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  } catch {
    /* ignore quota errors */
  }
}

/** Returns true the very first time the app is opened on this device. */
export function isFirstEverVisit(): boolean {
  try {
    const v = localStorage.getItem(VISITED_KEY);
    if (v) return false;
    localStorage.setItem(VISITED_KEY, String(Date.now()));
    return true;
  } catch {
    return false;
  }
}

/** Normalize a single character to upper-case (named keys preserved). */
export function normalizeKey(key: string): string {
  if (!key) return "";
  return key.length === 1 ? key.toUpperCase() : key;
}
