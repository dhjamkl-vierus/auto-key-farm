export type ThemeId =
  | "void"
  | "neon"
  | "crimson"
  | "hacker"
  | "midnight"
  | "dracula"
  | "ocean"
  | "sunset";

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
];

export function applyTheme(id: ThemeId) {
  if (id === "void") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", id);
  }
}
