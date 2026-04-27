import type { AppConfig, GamePresetId, KeySlot } from "./storage";

export interface GamePreset {
  id: GamePresetId;
  label: string;
  description: string;
  apply: (cfg: AppConfig) => Partial<AppConfig>;
}

const slot = (key: string, delay = 100): KeySlot => ({
  id: crypto.randomUUID(),
  key,
  delay,
  enabled: true,
  assign: "All",
});

export const PRESETS: GamePreset[] = [
  {
    id: "custom",
    label: "Custom",
    description: "Cấu hình tự do — không áp preset nào.",
    apply: () => ({}),
  },
  {
    id: "king-legacy-fish",
    label: "King Legacy — Fish",
    description: "Auto câu cá: bấm phím cast định kỳ, nhấp chuột reel.",
    apply: () => ({
      mode: "Easy",
      slots: [],
      autoClick: true,
      autoClickDelay: 100,
      holdEnabled: false,
      fishingEnabled: true,
      fishingCastKey: "F",
      fishingCastDelay: 4000,
      fishingReelDelay: 1500,
      weaponManual: false,
      weaponAuto: false,
    }),
  },
  {
    id: "king-legacy-combat",
    label: "King Legacy — Combat",
    description: "Spam Z X C V + auto-click trái.",
    apply: () => ({
      mode: "Boss Rush",
      slots: [slot("Z"), slot("X"), slot("C"), slot("V")],
      autoClick: true,
      autoClickDelay: 100,
      weaponAuto: true,
      weaponAutoDelay: 100,
      weaponAutoKey1: "1",
      weaponAutoKey2: "2",
      fishingEnabled: false,
    }),
  },
  {
    id: "blox-fruit-combat",
    label: "Blox Fruit — Combat",
    description: "Spam M1 + Z X C F skill + đổi vũ khí 1↔2.",
    apply: () => ({
      mode: "Boss Rush",
      slots: [slot("Z"), slot("X"), slot("C"), slot("F")],
      autoClick: true,
      autoClickDelay: 100,
      weaponAuto: true,
      weaponAutoDelay: 100,
      weaponAutoKey1: "1",
      weaponAutoKey2: "2",
      holdEnabled: true,
      holdKey: "Shift",
      holdDelay: 100,
      fishingEnabled: false,
    }),
  },
  {
    id: "blox-fruit-mastery",
    label: "Blox Fruit — Mastery Farm",
    description: "Cycle skill phím Z/X/C/V/F/G để cày mastery.",
    apply: () => ({
      mode: "Infinity Tower",
      slots: [slot("Z"), slot("X"), slot("C"), slot("V"), slot("F"), slot("G")],
      autoClick: false,
      weaponAuto: true,
      weaponAutoDelay: 100,
      weaponAutoKey1: "1",
      weaponAutoKey2: "2",
      fishingEnabled: false,
    }),
  },
  {
    id: "sailor-piece-easy",
    label: "Sailor Piece — Easy Farm",
    description: "Spam E + Q + auto-click cho farm cơ bản.",
    apply: () => ({
      mode: "Easy",
      slots: [slot("E"), slot("Q")],
      autoClick: true,
      autoClickDelay: 100,
      weaponManual: false,
      weaponAuto: false,
      fishingEnabled: false,
    }),
  },
  {
    id: "sailor-piece-boss",
    label: "Sailor Piece — Boss Rush",
    description: "Spam skill + đổi vũ khí 1↔2 cho Boss Rush.",
    apply: () => ({
      mode: "Boss Rush",
      slots: [slot("E"), slot("Q"), slot("R"), slot("F")],
      autoClick: true,
      autoClickDelay: 100,
      weaponAuto: true,
      weaponAutoDelay: 100,
      weaponAutoKey1: "1",
      weaponAutoKey2: "2",
      holdEnabled: true,
      holdKey: "Shift",
      holdDelay: 100,
    }),
  },
  {
    id: "anime-defenders",
    label: "Anime Defenders / TD",
    description: "Auto-click liên tục để place + upgrade unit.",
    apply: () => ({
      mode: "Easy",
      slots: [],
      autoClick: true,
      autoClickDelay: 100,
      holdEnabled: false,
      weaponManual: false,
      weaponAuto: false,
      fishingEnabled: false,
    }),
  },
  {
    id: "generic-mash",
    label: "Generic — Mash 1234",
    description: "Cycle phím 1, 2, 3, 4 — preset đa năng.",
    apply: () => ({
      mode: "Easy",
      slots: [slot("1"), slot("2"), slot("3"), slot("4")],
      autoClick: false,
      weaponManual: false,
      weaponAuto: false,
      fishingEnabled: false,
    }),
  },
];
