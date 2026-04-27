import { useEffect, useRef, useState } from "react";
import { getKeyLabel } from "@/lib/keynames";

interface Props {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  placeholder?: string;
}

/**
 * Bullet-proof key capture:
 *  - onMouseDown.preventDefault() so the button never gets keyboard focus,
 *    which means Space/Enter can never re-trigger this same button.
 *  - useRef wraps onChange so the effect ONLY depends on `recording`
 *    (parent re-renders no longer churn the listener).
 *  - The handler always calls setRecording(false) at the end → button always
 *    leaves recording mode and re-renders showing the new key label.
 */
export function KeyCapture({ value, onChange, className = "", placeholder = "Press a key" }: Props) {
  const [recording, setRecording] = useState(false);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!recording) return;
    const handler = (e: KeyboardEvent) => {
      // Pure modifiers? Wait for the real key.
      if (["Control", "Shift", "Alt", "Meta"].includes(e.key)) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.key === "Escape") {
        setRecording(false);
        return;
      }
      onChangeRef.current(getKeyLabel(e));
      setRecording(false);
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [recording]);

  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => setRecording(true)}
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
