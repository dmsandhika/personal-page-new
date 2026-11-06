"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

// Sorotan lembut yang mengikuti kursor (hanya perangkat dengan mouse).
export function CursorGlow() {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 120, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX - 250);
      y.set(e.clientY - 250);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed top-0 left-0 z-0 hidden size-[500px] rounded-full [@media(hover:hover)]:block"
    >
      <div
        className="size-full rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklch, var(--primary) 16%, transparent), transparent)",
        }}
      />
    </motion.div>
  );
}
