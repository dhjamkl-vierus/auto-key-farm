export type ThemeId =
  | "void"
  | "neon"
  | "crimson"
  | "hacker"
  | "midnight"
  | "dracula"
  | "ocean"
  | "sunset"
  | "cyberpunk"
  | "synthwave"
  | "forest"
  | "royal"
  | "lava"
  | "aurora"
  | "sakura"
  | "toxic"
  | "bloodmoon"
  | "frost"
  | "gold"
  | "carbon"
  | "inferno"
  | "mint";

export interface ThemeMeta {
  id: ThemeId;
  label: string;
  swatch: [string, string];
}

export const THEMES: ThemeMeta[] = [
  { id: "void", label: "Void Purple", swatch: ["#a855f7", "#ec4899"] },
  { id: "neon", label: "Neon Cyan", swatch: ["#38bdf8", "#22d3ee"] },
  { id: "crimson", label: "Crimson", swatch: ["#ef4444", "#f97316"] },
  { id: "hacker", label: "Hacker", swatch: ["#22c55e", "#84cc16"] },
  { id: "midnight", label: "Midnight", swatch: ["#ffffff", "#c0c0c0"] },
  { id: "dracula", label: "Dracula", swatch: ["#bd93f9", "#ff79c6"] },
  { id: "ocean", label: "Ocean", swatch: ["#64ffda", "#38bdf8"] },
  { id: "sunset", label: "Sunset", swatch: ["#f472b6", "#fb923c"] },
  { id: "cyberpunk", label: "Cyberpunk", swatch: ["#facc15", "#ec4899"] },
  { id: "synthwave", label: "Synthwave", swatch: ["#ff00ff", "#00ffff"] },
  { id: "forest", label: "Forest", swatch: ["#16a34a", "#65a30d"] },
  { id: "royal", label: "Royal", swatch: ["#fbbf24", "#7c3aed"] },
  { id: "lava", label: "Lava", swatch: ["#fb7185", "#f97316"] },
  { id: "aurora", label: "Aurora", swatch: ["#34d399", "#60a5fa"] },
  { id: "sakura", label: "Sakura", swatch: ["#f9a8d4", "#fbcfe8"] },
  { id: "toxic", label: "Toxic", swatch: ["#a3e635", "#facc15"] },
  { id: "bloodmoon", label: "Blood Moon", swatch: ["#dc2626", "#7f1d1d"] },
  { id: "frost", label: "Frost", swatch: ["#bae6fd", "#e0f2fe"] },
  { id: "gold", label: "Gold", swatch: ["#fbbf24", "#f59e0b"] },
  { id: "carbon", label: "Carbon", swatch: ["#525252", "#fb923c"] },
  { id: "inferno", label: "Inferno", swatch: ["#ef4444", "#facc15"] },
  { id: "mint", label: "Mint", swatch: ["#6ee7b7", "#a7f3d0"] },
];

export function applyTheme(id: ThemeId) {
  if (id === "void") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", id);
  }
}
