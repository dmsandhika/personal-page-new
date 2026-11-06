"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// three.js berat — dimuat hanya di client, setelah halaman interaktif, dan
// dilewati untuk pengguna yang memilih reduced motion.
const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false });

export function SceneBackground() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setTimeout(() => setEnabled(true), 300);
    return () => window.clearTimeout(id);
  }, []);

  return enabled ? <HeroScene /> : null;
}
