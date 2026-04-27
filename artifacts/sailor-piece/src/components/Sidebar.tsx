import { Home, Info, Settings as SettingsIcon, MessageCircle, Sparkles } from "lucide-react";

export type TabId = "home" | "info" | "settings" | "soon";

interface Props {
  active: TabId;
  onChange: (id: TabId) => void;
}

const items: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Trang Chủ", icon: Home },
  { id: "info", label: "Thông Tin", icon: Info },
  { id: "settings", label: "Cài Đặt", icon: SettingsIcon },
  { id: "soon", label: "Comming Soon....", icon: Sparkles },
];

export function Sidebar({ active, onChange }: Props) {
  return (
    <aside className="w-[200px] shrink-0 border-r border-[var(--border-soft)] flex flex-col bg-[var(--bg-panel)]">
      <nav className="flex-1 py-4 px-2 flex flex-col gap-1">
        {items.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: isActive ? "var(--bg-elev)" : "transparent",
                color: isActive ? "var(--text-base)" : "var(--text-dim)",
                border: `1px solid ${isActive ? "var(--border-strong)" : "transparent"}`,
              }}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r"
                  style={{ background: "var(--accent)", boxShadow: "0 0 12px var(--accent-glow)" }}
                />
              )}
              <Icon className="w-4 h-4" />
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-3 border-t border-[var(--border-soft)] flex flex-col gap-2">
        <a
          href="https://discord.gg/9dkmX6pAZd"
          target="_blank"
          rel="noreferrer"
          className="btn justify-start text-xs"
          style={{ background: "#5865F2", color: "#fff", borderColor: "transparent" }}
        >
          <MessageCircle className="w-3.5 h-3.5" /> Discord
        </a>
        <div className="text-[10px] text-center" style={{ color: "var(--text-muted)" }}>
          Original By <span style={{ color: "var(--accent)" }}>Dhja</span>
        </div>
      </div>
    </aside>
  );
}
