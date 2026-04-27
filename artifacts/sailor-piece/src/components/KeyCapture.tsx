import { useEffect, useState } from "react";
import { getKeyLabel } from "@/lib/keynames";

interface Props {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  placeholder?: string;
}

export function KeyCapture({ value, onChange, className = "", placeholder = "Press a key" }: Props) {
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    if (!recording) return;
    const handler = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      // Skip pure modifier presses
      if (["Control", "Shift", "Alt", "Meta"].includes(e.key)) return;
      onChange(getKeyLabel(e));
      setRecording(false);
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [recording, onChange]);

  return (
    <button
      type="button"
      onClick={() => setRecording((r) => !r)}
      className={`btn ${className}`}
    >
      {recording ? (
        <>
          <span className="spinner" /> {placeholder}…
        </>
      ) : (
        <>
          <span className="kbd">{value || "—"}</span>
          <span className="text-xs opacity-60">click to change</span>
        </>
      )}
    </button>
  );
}
