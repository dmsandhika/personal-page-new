"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Sapaan dalam berbagai bahasa. Warna terang yang menyala di latar hitam.
const GREETINGS: { text: string; label: string; color: string; lang?: string }[] = [
  { text: "Halo", label: "Indonesia", color: "#c7f24a", lang: "id" },
  { text: "Hello", label: "English", color: "#4ad3ff", lang: "en" },
  { text: "Hola", label: "Español", color: "#ffb84a", lang: "es" },
  { text: "Bonjour", label: "Français", color: "#ff6ad5", lang: "fr" },
  { text: "你好", label: "中文", color: "#8b7bff", lang: "zh" },
  { text: "こんにちは", label: "日本語", color: "#5affc2", lang: "ja" },
];

const STEP_MS = 300; // durasi tiap sapaan tampil

export function SplashScreen() {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      if (i >= GREETINGS.length) {
        clearInterval(interval);
        setDone(true);
      } else {
        setIndex(i);
      }
    }, STEP_MS);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const current = GREETINGS[index];

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={() => {
            document.body.style.overflow = "";
          }}
        >
          <div className="tech-grid pointer-events-none absolute inset-0 opacity-[0.15]" />

          <div className="flex flex-col items-center gap-5">
            <AnimatePresence mode="wait">
              <motion.span
                key={index}
                lang={current.lang}
                className="font-display text-6xl font-bold tracking-tight sm:text-8xl"
                style={{ color: current.color }}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
              >
                {current.text}
              </motion.span>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.span
                key={`label-${index}`}
                className="font-mono text-[0.7rem] tracking-[0.35em] text-muted-foreground uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
              >
                {current.label}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Garis progress tipis */}
          <div className="absolute bottom-14 h-px w-32 overflow-hidden bg-foreground/15">
            <motion.div
              className="h-full"
              style={{ backgroundColor: current.color }}
              animate={{ width: `${((index + 1) / GREETINGS.length) * 100}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
