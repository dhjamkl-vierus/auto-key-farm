import { useEffect, useState } from "react";
import { Crosshair } from "lucide-react";

export interface MousePos {
  x: number;
  y: number;
}

interface Props {
  value: MousePos | null;
  onChange: (v: MousePos) => void;
  className?: string;
}

/**
 * Click button → next mouse-down anywhere captures coordinates.
 * Coordinates are screen-pixel based so they're meaningful when ported
 * back to a desktop wrapper (Electron + nut-js etc.).
 */
export function MousePosCapture({ value, onChange, className = "" }: Props) {
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    if (!recording) return;
    // Skip the activating click itself
    let armed = false;
    const arm = window.setTimeout(() => { armed = true; }, 80);

    const handler = (e: MouseEvent) => {
      if (!armed) return;
      e.preventDefault();
      e.stopPropagation();
      onChange({ x: Math.round(e.screenX), y: Math.round(e.screenY) });
      setRecording(false);
    };
    document.addEventListener("mousedown", handler, true);

    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setRecording(false);
    };
    window.addEventListener("keydown", esc, true);

    return () => {
      window.clearTimeout(arm);
      document.removeEventListener("mousedown", handler, true);
      window.removeEventListener("keydown", esc, true);
    };
  }, [recording, onChange]);

  return (
    <button
      type="button"
      onClick={() => setRecording(true)}
      className={`btn ${className}`}
    >
      <Crosshair className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
      {recording ? (
        <>
          <span className="spinner" /> click anywhere…
        </>
      ) : value ? (
        <span className="font-mono">
          ({value.x}, {value.y})
        </span>
      ) : (
        <span className="opacity-60">pick position</span>
      )}
    </button>
  );
}
