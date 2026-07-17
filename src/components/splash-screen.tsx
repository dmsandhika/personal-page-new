"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Sapaan dalam berbagai bahasa. Tiap item punya teks + warna cerah sendiri.
const GREETINGS: { text: string; color: string; lang?: string }[] = [
  { text: "Halo", color: "#6d5efc", lang: "id" },
  { text: "Hello", color: "#ff5470", lang: "en" },
  { text: "Hola", color: "#43aa8b", lang: "es" },
  { text: "Bonjour", color: "#9b5de5", lang: "fr" },
  { text: "你好", color: "#ff9f1c", lang: "zh" },
  { text: "こんにちは", color: "#4cc9f0", lang: "ja" },
];

const STEP_MS = 260; // durasi tiap sapaan tampil

export function SplashScreen() {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Kunci scroll selama splash tampil
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          onAnimationComplete={() => {
            document.body.style.overflow = "";
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              lang={current.lang}
              className="text-5xl font-bold tracking-tight sm:text-7xl"
              style={{ color: current.color }}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.1, ease: "easeOut" }}
            >
              {current.text}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
