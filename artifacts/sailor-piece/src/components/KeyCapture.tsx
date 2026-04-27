import { useEffect, useRef, useState } from "react";
import { getKeyLabel } from "@/lib/keynames";

interface Props {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  placeholder?: string;
}

/**
 * Click → recording mode. Press any key → captured.
 * IMPORTANT: we blur the button immediately so that pressing Space/Enter
 * captures the key instead of re-triggering the button click.
 */
export function KeyCapture({ value, onChange, className = "", placeholder = "Press a key" }: Props) {
  const [recording, setRecording] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!recording) return;
    const handler = (e: KeyboardEvent) => {
      // Modifier-only presses are ignored, anything else is captured.
      if (["Control", "Shift", "Alt", "Meta"].includes(e.key)) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.key === "Escape") {
        setRecording(false);
        return;
      }
      onChange(getKeyLabel(e));
      setRecording(false);
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [recording, onChange]);

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={() => {
        setRecording(true);
        // 🔥 fix Space/Enter bug: blur so the button can't re-fire its own click
        btnRef.current?.blur();
      }}
      className={`btn ${className}`}
    >
      <span className="kbd">{value || "—"}</span>
      {recording ? (
        <>
          <span className="spinner" /> {placeholder}…
        </>
      ) : (
        <span className="text-xs opacity-60">click to change</span>
      )}
    </button>
  );
}
