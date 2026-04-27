/**
 * Replaces IniRead / IniWrite from the AHK script.
 * One JSON blob in localStorage = one preset config.
 */
import type { ThemeId } from "./themes";

export type MacroMode = "Easy" | "Boss Rush" | "Infinity Tower";

export interface KeySlot {
  id: string;
  key: string;        // single character or named key (e.g. "e", "1", "Space")
  delay: number;      // ms between sends
  enabled: boolean;
  assign: "All" | "Melee" | "Sword";
}

export interface AppConfig {
  // Mode
  mode: MacroMode;

  // Weapon Switching
  weaponManual: boolean;
  weaponManualDelay: number;
  weaponSlot1: string;
  weaponSlot2: string;
  weaponAuto: boolean;
  weaponAutoDelay: number;

  // Target keys
  slots: KeySlot[];

  // Auto Click
  autoClick: boolean;
  autoClickDelay: number;

  // Hotkeys
  toggleKey: string;   // e.g. "F1"
  showHideKey: string; // e.g. "F2"
  exitKey: string;     // e.g. "F3"

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
  weaponManual: false,
  weaponManualDelay: 5000,
  weaponSlot1: "1",
  weaponSlot2: "2",
  weaponAuto: false,
  weaponAutoDelay: 5000,
  slots: [
    { id: crypto.randomUUID(), key: "e", delay: 100, enabled: true, assign: "All" },
    { id: crypto.randomUUID(), key: "q", delay: 150, enabled: true, assign: "All" },
  ],
  autoClick: false,
  autoClickDelay: 100,
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
