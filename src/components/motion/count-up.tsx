"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

export function CountUp({ to, format }: { to: number; format?: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const controls = animate(0, to, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        el.textContent = format ? format(v) : String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [inView, to, format]);

  return <span ref={ref}>0</span>;
}
