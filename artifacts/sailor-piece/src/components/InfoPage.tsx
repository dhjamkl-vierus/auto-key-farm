import { Card } from "./cheat/Card";
import { ShieldAlert, Github, MessageCircle, Cpu } from "lucide-react";
import { StatusStrip } from "./StatusStrip";
import { useT } from "@/i18n";

export function InfoPage() {
  const t = useT();
  return (
    <div className="grid gap-4">
      <Card title={t("info.about")} icon={<Cpu className="w-3.5 h-3.5" />}>
        <div className="grid gap-2 text-sm">
          <Row k={t("info.systems")} v="Error Mod Systems" />
          <Row k={t("info.name")} v="AutoKey-Farm" />
          <Row k={t("info.version")} v="v1 BETA" />
          <Row k={t("info.original")} v="Dhja" />
          <Row k={t("info.port")} v="JS / HTML / CSS / JSON" />
          <Row k={t("info.license")} v="CC BY-NC" />
        </div>
      </Card>

      <Card title={t("info.connection")} icon={<ShieldAlert className="w-3.5 h-3.5" />}>
        <StatusStrip />
        <div
          className="text-[11px] mt-3 p-2 rounded-md border"
          style={{
            color: "var(--text-dim)",
            borderColor: "var(--border-soft)",
            background: "var(--bg-base)",
          }}
        >
          {t("info.connectionDesc")}
        </div>
      </Card>

      <Card title={t("info.community")} icon={<MessageCircle className="w-3.5 h-3.5" />}>
        <div className="flex flex-wrap gap-2">
          <a
            href="https://discord.gg/9dkmX6pAZd"
            target="_blank"
            rel="noreferrer"
            className="btn"
            style={{ background: "#5865F2", color: "#fff", borderColor: "transparent" }}
          >
            <MessageCircle className="w-3.5 h-3.5" /> {t("info.joinDiscord")}
          </a>
          <a
            href="https://www.youtube.com/@Dhja"
            target="_blank"
            rel="noreferrer"
            className="btn"
          >
            <Github className="w-3.5 h-3.5" /> {t("info.youtube")}
          </a>
        </div>
      </Card>

      <Card title={t("info.disclaimer")} icon={<ShieldAlert className="w-3.5 h-3.5" />}>
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-dim)" }}>
          {t("info.disclaimerBody")}
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
