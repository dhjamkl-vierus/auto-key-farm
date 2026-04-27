import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  title: ReactNode;
  icon?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
  delay?: number;
}

export function Card({ title, icon, right, children, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay }}
      className="cheat-card cheat-card-glow p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="section-title">
          {icon}
          <span>{title}</span>
        </div>
        {right}
      </div>
      <div className="divider-x mb-3" />
      <div>{children}</div>
    </motion.div>
  );
}
