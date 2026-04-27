import { useEffect, useRef, useState } from "react";
import { getKeyLabel } from "@/lib/keynames";

interface Props {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  placeholder?: string;
}

/**
 * Bullet-proof key capture.
 * Pattern: install the keydown listener INSIDE onClick (no useEffect),
 * remove it on first keypress. A `captured` ref guards against double-fire
 * from key auto-repeat or multiple events queued before React re-renders.
 * `setRecording(false)` is the LAST thing the handler does, so the button
 * is guaranteed to leave recording mode and re-render with the new label.
 */
export function KeyCapture({ value, onChange, className = "", placeholder = "Press a key" }: Props) {
  const [recording, setRecording] = useState(false);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const cleanupRef = useRef<(() => void) | null>(null);

  // Safety: if the component unmounts while recording, drop the listener.
  useEffect(() => () => { cleanupRef.current?.(); cleanupRef.current = null; }, []);

  const startCapture = () => {
    // If already recording, ignore extra clicks (button is sticky).
    if (cleanupRef.current) return;
    setRecording(true);

    let captured = false;
    const handler = (e: KeyboardEvent) => {
      if (captured) return;
      // Pure modifier keys: wait for the actual key.
      if (["Control", "Shift", "Alt", "Meta"].includes(e.key)) return;
      e.preventDefault();
      e.stopPropagation();
      captured = true;
      cleanup();
      if (e.key !== "Escape") {
        onChangeRef.current(getKeyLabel(e));
      }
      // Force the state flip into a fresh microtask so React commits the
      // parent's `value` update first, then this component re-renders with
      // recording=false AND the new value already in props.
      Promise.resolve().then(() => setRecording(false));
    };
    const cleanup = () => {
      window.removeEventListener("keydown", handler, true);
      cleanupRef.current = null;
    };
    window.addEventListener("keydown", handler, true);
    cleanupRef.current = cleanup;
  };

  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={startCapture}
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
