import { useEffect, useState } from "react";
import { Wifi, Globe2, Activity, MapPin } from "lucide-react";
import { fetchNetInfo, pingMs, type NetInfo } from "@/lib/network";

export function StatusStrip() {
  const [net, setNet] = useState<NetInfo | null>(null);
  const [ping, setPing] = useState<number | null>(null);

  useEffect(() => {
    fetchNetInfo().then(setNet).catch(() => setNet({
      ip: "offline", country: "Unknown", countryCode: "", city: "", region: "", isp: "",
    }));
    const refreshPing = () => pingMs().then(setPing).catch(() => {});
    refreshPing();
    const t = window.setInterval(refreshPing, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="flex items-center gap-3 text-xs flex-wrap"
      style={{ color: "var(--text-dim)" }}
    >
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--bg-elev)] border border-[var(--border-soft)]">
        <Activity className="w-3.5 h-3.5" style={{ color: ping == null ? "var(--text-muted)" : ping < 100 ? "var(--good)" : ping < 300 ? "var(--warn)" : "var(--bad)" }} />
        <span className="font-mono">Ping: <b>{ping == null ? "—" : `${ping}ms`}</b></span>
      </div>
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--bg-elev)] border border-[var(--border-soft)]">
        <Wifi className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
        <span className="font-mono">IP: <b>{net?.ip ?? "…"}</b></span>
      </div>
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--bg-elev)] border border-[var(--border-soft)]">
        {net?.countryCode ? (
          <img
            src={`https://flagcdn.com/${net.countryCode}.svg`}
            className="w-4 h-3 rounded-sm object-cover"
            alt=""
            onError={(e) => ((e.currentTarget.style.display = "none"))}
          />
        ) : (
          <Globe2 className="w-3.5 h-3.5" />
        )}
        <span>{net?.country ?? "…"}</span>
      </div>
      {net?.city && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--bg-elev)] border border-[var(--border-soft)]">
          <MapPin className="w-3.5 h-3.5" />
          <span>{net.city}{net.region ? `, ${net.region}` : ""}</span>
        </div>
      )}
    </div>
  );
}
