"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

function Word({
  children,
  range,
  progress,
}: {
  children: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}
    </motion.span>
  );
}

// Paragraf yang menyala kata demi kata mengikuti scroll.
export function RevealText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const paragraphs = text.split(/\n+/).map((p) => p.split(/\s+/).filter(Boolean));
  const total = Math.max(1, paragraphs.reduce((n, p) => n + p.length, 0));
  // Indeks kata global awal tiap paragraf
  const offsets = paragraphs.map((_, i) =>
    paragraphs.slice(0, i).reduce((n, p) => n + p.length, 0)
  );

  return (
    <div ref={ref} className={className}>
      {paragraphs.map((words, pi) => (
        <p key={pi} className={pi > 0 ? "mt-6" : undefined}>
          {words.map((w, wi) => {
            const idx = offsets[pi] + wi;
            return (
              <span key={wi}>
                <Word
                  range={[idx / total, Math.min(1, (idx + 1) / total + 0.04)]}
                  progress={scrollYProgress}
                >
                  {w}
                </Word>{" "}
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}
