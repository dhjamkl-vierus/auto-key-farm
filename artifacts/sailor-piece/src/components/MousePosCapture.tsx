import { useEffect, useRef, useState } from "react";
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

export function MousePosCapture({ value, onChange, className = "" }: Props) {
  const [recording, setRecording] = useState(false);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!recording) return;
    let armed = false;
    const arm = window.setTimeout(() => { armed = true; }, 80);

    const handler = (e: MouseEvent) => {
      if (!armed) return;
      e.preventDefault();
      e.stopPropagation();
      onChangeRef.current({ x: Math.round(e.screenX), y: Math.round(e.screenY) });
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
  }, [recording]);

  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
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
