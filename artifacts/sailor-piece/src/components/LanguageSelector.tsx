import { Globe } from "lucide-react";
import { LANGUAGES, useI18n, type Lang } from "@/i18n";

interface Props {
  value: Lang;
  onChange: (l: Lang) => void;
}

/**
 * 26-language picker. The active language gets the accent treatment;
 * other tiles show the country flag + native script + English name.
 */
export function LanguageSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {LANGUAGES.map((l) => {
        const active = l.code === value;
        return (
          <button
            key={l.code}
            onClick={() => onChange(l.code)}
            className="rounded-lg p-2.5 text-left border transition-all flex items-start gap-2"
            style={{
              background: "var(--bg-base)",
              borderColor: active ? "var(--accent)" : "var(--border-soft)",
              boxShadow: active ? "0 0 18px -6px var(--accent-glow)" : undefined,
            }}
          >
            <img
              src={`https://flagcdn.com/${l.flag}.svg`}
              className="w-6 h-4 mt-0.5 rounded-sm object-cover shrink-0"
              alt=""
              loading="lazy"
              onError={(e) => ((e.currentTarget.style.display = "none"))}
            />
            <div className="min-w-0 flex-1">
              <div
                className="text-xs font-semibold truncate"
                style={{ color: active ? "var(--accent)" : "var(--text-base)" }}
                dir={l.rtl ? "rtl" : "ltr"}
              >
                {l.native}
              </div>
              <div className="text-[10px] truncate" style={{ color: "var(--text-muted)" }}>
                {l.english}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/** Small wrapper showing the globe icon + current selection label. */
export function CurrentLanguageBadge() {
  const { lang } = useI18n();
  const meta = LANGUAGES.find((l) => l.code === lang);
  return (
    <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-dim)" }}>
      <Globe className="w-3.5 h-3.5" />
      <span className="font-mono">{meta?.native ?? lang}</span>
      <span className="opacity-50">·</span>
      <span>{meta?.english ?? ""}</span>
    </div>
  );
}
