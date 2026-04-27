import { useEffect, useState } from "react";
import { Wifi, Globe2, Activity, MapPin } from "lucide-react";
import { fetchNetInfo, pingMs, type NetInfo } from "@/lib/network";

export function StatusStrip() {
  const [net, setNet] = useState<NetInfo | null>(null);
  const [ping, setPing] = useState<number | null>(null);
  const [online, setOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    fetchNetInfo()
      .then(setNet)
      .catch(() => setNet(null));

    const refreshPing = () => pingMs().then(setPing).catch(() => setPing(null));
    refreshPing();
    const t = window.setInterval(refreshPing, 5000);

    const goOnline = () => { setOnline(true); fetchNetInfo().then(setNet).catch(() => {}); };
    const goOffline = () => { setOnline(false); setPing(null); };
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      clearInterval(t);
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // Privacy: never reveal the actual IP, only the connectivity flag.
  const ipReachable = online && !!net?.ip && net.ip !== "offline" && net.ip !== "—";
  const ipLabel = ipReachable ? "Online" : "Offline";
  const ipColor = ipReachable ? "var(--good)" : "var(--bad)";
  const country = ipReachable ? net?.country || "Unknown" : "Unknown";
  const flag = ipReachable ? net?.countryCode : "";

  return (
    <div
      className="flex items-center gap-3 text-xs flex-wrap"
      style={{ color: "var(--text-dim)" }}
    >
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--bg-elev)] border border-[var(--border-soft)]">
        <Activity
          className="w-3.5 h-3.5"
          style={{
            color: ping == null
              ? "var(--text-muted)"
              : ping < 100 ? "var(--good)" : ping < 300 ? "var(--warn)" : "var(--bad)",
          }}
        />
        <span className="font-mono">Ping: <b>{ping == null ? "—" : `${ping}ms`}</b></span>
      </div>
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--bg-elev)] border border-[var(--border-soft)]">
        <Wifi className="w-3.5 h-3.5" style={{ color: ipColor }} />
        <span className="font-mono">
          IP: <b style={{ color: ipColor }}>{ipLabel}</b>
        </span>
      </div>
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--bg-elev)] border border-[var(--border-soft)]">
        {flag ? (
          <img
            src={`https://flagcdn.com/${flag}.svg`}
            className="w-4 h-3 rounded-sm object-cover"
            alt=""
            onError={(e) => ((e.currentTarget.style.display = "none"))}
          />
        ) : (
          <Globe2 className="w-3.5 h-3.5" />
        )}
        <span>{country}</span>
      </div>
      {ipReachable && net?.city && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--bg-elev)] border border-[var(--border-soft)]">
          <MapPin className="w-3.5 h-3.5" />
          <span>{net.city}{net.region ? `, ${net.region}` : ""}</span>
        </div>
      )}
    </div>
  );
}
