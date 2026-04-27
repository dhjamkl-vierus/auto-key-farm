import { motion } from "framer-motion";
import { Sparkles, Rocket, Lock } from "lucide-react";

export function ComingSoonPage() {
  return (
    <div className="h-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="cheat-card cheat-card-glow scanline relative max-w-2xl w-full p-10 text-center"
      >
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

        <div className="relative">
          <motion.div
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center justify-center mb-4"
          >
            <span
              className="inline-flex items-center justify-center w-16 h-16 rounded-full"
              style={{
                background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
                boxShadow: "0 0 40px var(--accent-glow)",
              }}
            >
              <Sparkles className="w-8 h-8 text-white" />
            </span>
          </motion.div>

          <motion.h1
            initial={{ y: -6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-display text-4xl font-bold tracking-[0.2em] glow-text"
            style={{ color: "var(--text-base)" }}
          >
            COMMING SOON......
          </motion.h1>

          <motion.div
            initial={{ y: -4, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold mt-3"
            style={{ color: "var(--accent)" }}
          >
            Hệ Thống Sắp Ra Mắt
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm mt-4 max-w-md mx-auto"
            style={{ color: "var(--text-dim)" }}
          >
            Hệ thống mới đang được phát triển. Hãy theo dõi Discord để nhận
            thông báo ngay khi mở khoá!
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center gap-6 mt-8 text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4" style={{ color: "var(--accent)" }} />
              In Development
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" style={{ color: "var(--accent)" }} />
              Beta Locked
            </div>
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-8 h-1 rounded-full origin-left"
            style={{
              background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
              boxShadow: "0 0 12px var(--accent-glow)",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
