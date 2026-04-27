import { Card } from "./cheat/Card";
import { ShieldAlert, Github, MessageCircle, Cpu } from "lucide-react";
import { StatusStrip } from "./StatusStrip";

export function InfoPage() {
  return (
    <div className="grid gap-4">
      <Card title="About" icon={<Cpu className="w-3.5 h-3.5" />}>
        <div className="grid gap-2 text-sm">
          <Row k="Name" v="Sailor Piece electron" />
          <Row k="Version" v="v5.1 BETA" />
          <Row k="Original" v="Yato (AHK Keyspammer)" />
          <Row k="Port" v="JS / HTML / CSS / JSON" />
          <Row k="License" v="CC BY-NC" />
        </div>
      </Card>

      <Card title="Connection" icon={<ShieldAlert className="w-3.5 h-3.5" />}>
        <StatusStrip />
        <div
          className="text-[11px] mt-3 p-2 rounded-md border"
          style={{
            color: "var(--text-dim)",
            borderColor: "var(--border-soft)",
            background: "var(--bg-base)",
          }}
        >
          IP, country and ping are detected from your browser via a public IP-info service so the
          menu can show your actual region — same as a desktop overlay would.
        </div>
      </Card>

      <Card title="Community" icon={<MessageCircle className="w-3.5 h-3.5" />}>
        <div className="flex flex-wrap gap-2">
          <a
            href="https://discord.gg/9dkmX6pAZd"
            target="_blank"
            rel="noreferrer"
            className="btn"
            style={{ background: "#5865F2", color: "#fff", borderColor: "transparent" }}
          >
            <MessageCircle className="w-3.5 h-3.5" /> Join Discord
          </a>
          <a
            href="https://www.youtube.com/@yatoark"
            target="_blank"
            rel="noreferrer"
            className="btn"
          >
            <Github className="w-3.5 h-3.5" /> YouTube — @yatoark
          </a>
        </div>
      </Card>

      <Card title="Disclaimer" icon={<ShieldAlert className="w-3.5 h-3.5" />}>
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-dim)" }}>
          This is a browser port of the original AHK script. A web page cannot inject keystrokes
          into other applications — the macro engine here simulates the same scheduling and
          produces a debug log on the same cadence the desktop tool would. Use the original AHK
          tool only with games that <b>do not</b> run anti-cheat (Valorant, CS, Genshin, LoL,
          etc.).
        </p>
      </Card>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-[var(--border-soft)] last:border-0">
      <span className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{k}</span>
      <span className="font-mono text-sm">{v}</span>
    </div>
  );
}
