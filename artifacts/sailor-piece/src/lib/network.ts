/**
 * Fetches the user's public IP + country and pings a public endpoint
 * so the panel can show "Server / Ping / Country" like a cheat tool.
 */
export interface NetInfo {
  ip: string;
  country: string;
  countryCode: string;
  city: string;
  isp: string;
  region: string;
}

export async function fetchNetInfo(): Promise<NetInfo> {
  const res = await fetch("https://ipapi.co/json/");
  if (!res.ok) throw new Error("ipapi failed");
  const j = await res.json();
  return {
    ip: j.ip ?? "—",
    country: j.country_name ?? "Unknown",
    countryCode: (j.country_code ?? "").toLowerCase(),
    city: j.city ?? "",
    region: j.region ?? "",
    isp: j.org ?? "",
  };
}

export async function pingMs(): Promise<number> {
  // Round-trip to a small static asset
  const start = performance.now();
  try {
    await fetch("https://www.cloudflare.com/cdn-cgi/trace", {
      cache: "no-store",
      mode: "no-cors",
    });
  } catch {
    /* opaque is fine */
  }
  return Math.round(performance.now() - start);
}
