import { motion } from "framer-motion";
import { Minus, Maximize2, X } from "lucide-react";

interface Props {
  onMinimize: () => void;
  onExit: () => void;
}

export function Header({ onMinimize, onExit }: Props) {
  return (
    <header className="relative h-[150px] overflow-hidden border-b border-[var(--border-soft)]">
      {/* background layers */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(700px 220px at 78% 50%, color-mix(in srgb, var(--accent) 40%, transparent), transparent 60%)",
        }}
      />
      <img
        src="luffy.png"
        alt=""
        className="absolute right-0 top-0 h-full object-contain pointer-events-none select-none"
        style={{
          maskImage: "linear-gradient(to left, black 50%, transparent 95%)",
          WebkitMaskImage: "linear-gradient(to left, black 50%, transparent 95%)",
          filter: "drop-shadow(0 0 30px var(--accent-glow))",
        }}
        draggable={false}
      />

      {/* window controls */}
      <div className="absolute right-3 top-3 flex items-center gap-1.5 z-10">
        <button onClick={onMinimize} className="btn btn-ghost p-1.5" title="Show / Hide (F2)">
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button className="btn btn-ghost p-1.5" title="Maximize">
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onExit}
          className="btn btn-ghost p-1.5 hover:!border-[var(--bad)] hover:text-[var(--bad)]"
          title="Exit (F3)"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* title */}
      <div className="relative z-10 h-full flex items-center pl-6 gap-4">
        <motion.img
          src="logo.png"
          alt="Sailor Piece"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="h-[110px] drop-shadow-[0_0_20px_var(--accent-glow)]"
          draggable={false}
        />
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="font-display tracking-[0.18em] text-3xl font-bold glow-text"
            style={{ color: "var(--text-base)" }}
          >
            AUTOKEY-FARM
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="text-xs mt-1 flex items-center gap-1.5"
            style={{ color: "var(--text-dim)" }}
          >
            <span style={{ color: "var(--accent)" }}>⚡</span> Next Generation Systems
            <span className="opacity-30">|</span>
            <span className="font-mono">v1 BETA</span>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
