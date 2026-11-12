"use client";

import { motion, useReducedMotion } from "framer-motion";

// Sinar laser vertikal dengan animasi intro sekali jalan:
//   1. sinar jatuh dari tepi atas (ujungnya terang, makin cepat ke bawah)
//   2. begitu menyentuh dasar, cahaya "meleleh": kolam glow melebar & halo menebal
//   3. garis tipis melengkung tergambar keluar dari titik tumbukan
//   4. setelah itu idle halus (napas + pulse + garis mengalir)
// Warna mengikuti --primary. Reduced-motion: langsung tampil final tanpa animasi.

const mix = (pct: number, base = "var(--primary)") =>
  `color-mix(in oklch, ${base} ${pct}%, transparent)`;

const LINES = [
  "M500 0 C 500 260, 470 330, 380 420 S 250 640, 230 820",
  "M500 0 C 500 260, 530 330, 620 420 S 750 640, 770 820",
  "M500 0 C 500 240, 450 300, 330 380 S 130 560, 90 820",
  "M500 0 C 500 240, 550 300, 670 380 S 870 560, 910 820",
  "M500 0 C 500 280, 485 360, 440 460 S 380 700, 372 820",
  "M500 0 C 500 280, 515 360, 560 460 S 620 700, 628 820",
];

const DROP = 1.0; // durasi sinar jatuh (detik)
const FALL_EASE = [0.5, 0, 0.9, 0.5] as const; // mulai pelan, makin cepat
const MELT_EASE = [0.16, 1, 0.3, 1] as const; // meledak lalu mengendap

export function LaserBeam({ delay = 1.8, className = "" }: { delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  const still = !!reduce;
  const hit = delay + DROP; // saat sinar menyentuh dasar

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 top-0 h-[110vh] overflow-hidden dark:mix-blend-screen ${className}`}
      style={{
        maskImage: "linear-gradient(to bottom, black 70%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent)",
      }}
    >
      <div
        className="absolute top-0 h-full w-[min(100vw,1000px)] -translate-x-1/2"
        style={{ left: "var(--laser-x, 50%)" }}
      >
        {/* Kolam glow lantai: melebar dari titik tumbukan (meleleh) */}
        <div className="absolute top-[34%] left-1/2 h-[46%] w-full -translate-x-1/2">
          <motion.div
            className="size-full"
            style={{ originX: 0.5, originY: 0.2 }}
            initial={still ? false : { scaleX: 0.08, scaleY: 0.05, opacity: 0 }}
            animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
            transition={{ duration: 2.2, delay: hit - 0.05, ease: MELT_EASE }}
          >
            <div
              className="laser-breathe size-full rounded-[50%] blur-3xl"
              style={{
                background: `radial-gradient(50% 50% at 50% 30%, ${mix(70)}, ${mix(25)} 55%, transparent 75%)`,
              }}
            />
          </motion.div>
        </div>

        {/* Halo di sepanjang sinar: jatuh lalu menebal */}
        <div className="absolute top-0 left-1/2 h-[70%] w-[38%] -translate-x-1/2">
          <motion.div
            className="size-full"
            style={{ originX: 0.5, originY: 0 }}
            initial={still ? false : { scaleX: 0.12, scaleY: 0, opacity: 0.6 }}
            animate={{ scaleX: [0.12, 0.12, 1], scaleY: [0, 0.83, 1], opacity: 1 }}
            transition={{
              duration: DROP + 1.6,
              delay,
              times: [0, DROP / (DROP + 1.6), 1],
              ease: [FALL_EASE, MELT_EASE] as never,
            }}
          >
            <div
              className="laser-breathe size-full blur-3xl"
              style={{ background: `linear-gradient(to bottom, ${mix(80)}, ${mix(35)} 60%, transparent)` }}
            />
          </motion.div>
        </div>

        {/* Garis melengkung: tergambar keluar setelah tumbukan, lalu mengalir */}
        <svg
          viewBox="0 0 1000 820"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full"
          fill="none"
        >
          {LINES.map((d, i) => (
            <motion.path
              key={`draw-${i}`}
              d={d}
              stroke={mix(40)}
              strokeWidth={1.2}
              vectorEffect="non-scaling-stroke"
              initial={still ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.8, delay: hit + 0.15 + i * 0.1, ease: MELT_EASE }}
            />
          ))}
          <motion.g
            initial={still ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: hit + 2.4 }}
          >
            {LINES.map((d, i) => (
              <path
                key={`flow-${i}`}
                d={d}
                pathLength={1}
                stroke={mix(75)}
                strokeWidth={1.4}
                vectorEffect="non-scaling-stroke"
                strokeDasharray="0.18 0.82"
                className="laser-flow"
                style={{ animationDelay: `${-i * 0.9}s`, animationDuration: `${5 + (i % 3)}s` }}
              />
            ))}
          </motion.g>
        </svg>

        {/* Glow dekat inti */}
        <div className="absolute top-0 left-1/2 h-[62%] w-[9%] -translate-x-1/2">
          <motion.div
            className="size-full"
            style={{ originX: 0.5, originY: 0 }}
            initial={still ? false : { scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: DROP, delay, ease: FALL_EASE }}
          >
            <div
              className="laser-breathe size-full blur-xl"
              style={{ background: `linear-gradient(to bottom, ${mix(100)}, ${mix(60)} 70%, transparent)` }}
            />
          </motion.div>
        </div>

        {/* Inti sinar: tumbuh dari atas ke bawah */}
        <div className="absolute top-0 left-1/2 h-[58%] w-[3px] -translate-x-1/2">
          <motion.div
            className="size-full rounded-full"
            style={{
              originX: 0.5,
              originY: 0,
              background: `linear-gradient(to bottom, white, ${mix(100)} 55%, transparent)`,
              boxShadow: `0 0 18px 2px ${mix(90)}, 0 0 60px 8px ${mix(50)}`,
            }}
            initial={still ? false : { scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: DROP, delay, ease: FALL_EASE }}
          />
        </div>

        {/* Kepala sinar: titik terang yang memimpin jatuhnya, lalu padam saat menyentuh dasar */}
        {!still && (
          <div className="absolute top-0 left-1/2 h-[58%] w-6 -translate-x-1/2">
            <motion.div
              className="absolute left-0 size-6 rounded-full"
              style={{
                marginTop: -12,
                background: `radial-gradient(circle, white, ${mix(90)} 40%, transparent 70%)`,
              }}
              initial={{ top: "0%", opacity: 0, scale: 0.6 }}
              animate={{ top: "100%", opacity: [0, 1, 1, 0], scale: [0.6, 1, 1.4, 3] }}
              transition={{
                duration: DROP,
                delay,
                ease: FALL_EASE,
                opacity: { times: [0, 0.1, 0.8, 1], duration: DROP, delay },
                scale: { times: [0, 0.1, 0.8, 1], duration: DROP, delay },
              }}
            />
          </div>
        )}

        {/* Pulse idle yang meluncur turun, aktif setelah intro */}
        <motion.div
          className="absolute top-0 left-1/2 h-[58%] w-[3px] -translate-x-1/2 overflow-hidden rounded-full"
          initial={still ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: hit + 1.5, duration: 1 }}
        >
          <div
            className="laser-pulse h-1/3 w-full"
            style={{ background: "linear-gradient(to bottom, transparent, white, transparent)" }}
          />
        </motion.div>
      </div>
    </div>
  );
}
