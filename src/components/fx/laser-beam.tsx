"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Sinar laser besar yang jatuh dari tepi atas halaman dan MENDARAT di sebuah card
// (target). Saat menyentuh tepi atas card, cahaya pecah: flash, menyebar sepanjang
// tepi, menyinari muka card (lihat <LaserCardGlow/>), lalu mengalir di sisi card.
//
// Pakai:
//   const ref = useRef<HTMLDivElement>(null)
//   <LaserBeam target={ref} delay={1.8} />          // sibling di belakang card
//   <div ref={ref}> …card… <LaserCardGlow delay={1.8} /> </div>
//
// Warna mengikuti --primary. Reduced-motion: langsung tampil final tanpa animasi.

export const LASER_DROP = 1.0; // durasi sinar jatuh (detik)
const FALL_EASE = [0.5, 0, 0.9, 0.5] as const; // mulai pelan, makin cepat
const MELT_EASE = [0.16, 1, 0.3, 1] as const; // meledak lalu mengendap

const mix = (pct: number, base = "var(--primary)") =>
  `color-mix(in oklch, ${base} ${pct}%, transparent)`;

// Garis aliran: mulai di tepi atas card (500,0), menyapu keluar sepanjang tepi,
// lalu turun di sisi card. Dikerjakan untuk sisi kanan lalu dicerminkan ke kiri.
type Pt = [number, number];
const RIGHT: Pt[][] = [
  [[500, 0], [600, -10], [700, -20], [760, 60], [840, 400], [860, 820]],
  [[500, 0], [580, -4], [660, -4], [700, 70], [760, 420], [770, 820]],
  [[500, 0], [560, -30], [720, -80], [820, 20], [940, 380], [960, 820]],
];
const toPath = (p: Pt[]) =>
  `M${p[0][0]} ${p[0][1]} C ${p[1][0]} ${p[1][1]}, ${p[2][0]} ${p[2][1]}, ${p[3][0]} ${p[3][1]} S ${p[4][0]} ${p[4][1]}, ${p[5][0]} ${p[5][1]}`;
const LINES = RIGHT.flatMap((p) => [toPath(p), toPath(p.map(([x, y]) => [1000 - x, y] as Pt))]);

type Geo = { lx: number; ly: number; w: number; h: number };

export function LaserBeam({
  target,
  delay = 1.8,
  className = "",
}: {
  target?: RefObject<HTMLElement | null>;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const still = !!reduce;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [g, setG] = useState<Geo | null>(null);
  const hit = delay + LASER_DROP; // saat sinar menyentuh card

  // Ukur posisi tepi atas card relatif terhadap lapisan ini.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const measure = () => {
      const wr = wrap.getBoundingClientRect();
      const t = target?.current;
      if (t) {
        const r = t.getBoundingClientRect();
        setG({ lx: r.left - wr.left + r.width / 2, ly: r.top - wr.top, w: r.width, h: r.height });
      } else {
        setG({ lx: wr.width / 2, ly: wr.height * 0.6, w: 320, h: 400 });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    if (target?.current) ro.observe(target.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [target]);

  const pool = (wMul: number, h: number, delayAdd: number, dur: number, stops: string) =>
    g && (
      <div
        className="absolute"
        style={{ left: g.lx - (g.w * wMul) / 2, top: g.ly - h / 2, width: g.w * wMul, height: h }}
      >
        <motion.div
          className="size-full"
          style={{ originX: 0.5, originY: 0.5 }}
          initial={still ? false : { scaleX: 0.04, scaleY: 0.1, opacity: 0 }}
          animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
          transition={{ duration: dur, delay: hit - 0.05 + delayAdd, ease: MELT_EASE }}
        >
          <div className="laser-breathe size-full rounded-[50%] blur-3xl" style={{ background: stops }} />
        </motion.div>
      </div>
    );

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden opacity-60 lg:opacity-100 dark:mix-blend-screen ${className}`}
    >
      {g && (
        <>
          {/* Kolam cahaya lebar yang menyebar sepanjang tepi atas card */}
          {pool(5, 560, 0.2, 2.8, `radial-gradient(50% 50% at 50% 50%, ${mix(55)}, ${mix(18)} 50%, transparent 72%)`)}
          {pool(3, 320, 0, 2.0, `radial-gradient(50% 50% at 50% 50%, white, ${mix(85)} 30%, ${mix(30)} 58%, transparent 74%)`)}

          {/* Halo kolom sinar */}
          <div
            className="absolute"
            style={{ left: g.lx - g.w * 0.45, top: 0, width: g.w * 0.9, height: g.ly + 40 }}
          >
            <motion.div
              className="size-full"
              style={{ originX: 0.5, originY: 0 }}
              initial={still ? false : { scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: LASER_DROP, delay, ease: FALL_EASE }}
            >
              <div
                className="laser-breathe size-full blur-3xl"
                style={{ background: `linear-gradient(to bottom, ${mix(70)}, ${mix(90)} 80%, ${mix(40)})` }}
              />
            </motion.div>
          </div>

          {/* Garis aliran yang menyapu keluar sepanjang tepi lalu turun di sisi card */}
          <svg
            viewBox="0 0 1000 820"
            preserveAspectRatio="none"
            fill="none"
            className="absolute overflow-visible"
            style={{ left: g.lx - g.w * 1.6, top: g.ly, width: g.w * 3.2, height: g.h * 1.5 }}
          >
            {LINES.map((d, i) => (
              <motion.path
                key={`draw-${i}`}
                d={d}
                stroke={mix(55)}
                strokeWidth={1.2}
                vectorEffect="non-scaling-stroke"
                initial={still ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.8, delay: hit + 0.2 + (i >> 1) * 0.12, ease: MELT_EASE }}
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
                  stroke={mix(85)}
                  strokeWidth={1.4}
                  vectorEffect="non-scaling-stroke"
                  strokeDasharray="0.16 0.84"
                  className="laser-flow"
                  style={{ animationDelay: `${-i * 0.8}s`, animationDuration: `${5 + (i % 3)}s` }}
                />
              ))}
            </motion.g>
          </svg>

          {/* Kolom sinar terang (tebal) */}
          <div
            className="absolute"
            style={{ left: g.lx - 22, top: 0, width: 44, height: g.ly }}
          >
            <motion.div
              className="size-full"
              style={{ originX: 0.5, originY: 0 }}
              initial={still ? false : { scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: LASER_DROP, delay, ease: FALL_EASE }}
            >
              <div
                className="laser-breathe size-full blur-md"
                style={{ background: `linear-gradient(to bottom, ${mix(70)}, white 75%)` }}
              />
            </motion.div>
          </div>

          {/* Inti tajam */}
          <div className="absolute" style={{ left: g.lx - 2.5, top: 0, width: 5, height: g.ly }}>
            <motion.div
              className="size-full rounded-full"
              style={{
                originX: 0.5,
                originY: 0,
                background: "white",
                boxShadow: `0 0 20px 4px ${mix(90)}, 0 0 80px 14px ${mix(55)}`,
              }}
              initial={still ? false : { scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: LASER_DROP, delay, ease: FALL_EASE }}
            />
          </div>

          {/* Pulse idle yang meluncur turun di dalam sinar, aktif setelah intro */}
          <motion.div
            className="absolute overflow-hidden rounded-full"
            style={{ left: g.lx - 2.5, top: 0, width: 5, height: g.ly }}
            initial={still ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: hit + 1.5, duration: 1 }}
          >
            <div
              className="laser-pulse h-1/3 w-full"
              style={{ background: "linear-gradient(to bottom, transparent, white, transparent)" }}
            />
          </motion.div>

          {/* Kepala sinar: titik terang yang memimpin, meledak saat menyentuh card */}
          {!still && (
            <div className="absolute" style={{ left: g.lx - 18, top: 0, width: 36, height: g.ly }}>
              <motion.div
                className="absolute left-0 size-9 rounded-full"
                style={{
                  marginTop: -18,
                  background: `radial-gradient(circle, white, ${mix(90)} 40%, transparent 70%)`,
                }}
                initial={{ top: "0%", opacity: 0, scale: 0.6 }}
                animate={{ top: "100%", opacity: [0, 1, 1, 0], scale: [0.6, 1, 1.5, 4] }}
                transition={{
                  duration: LASER_DROP,
                  delay,
                  ease: FALL_EASE,
                  opacity: { times: [0, 0.1, 0.8, 1], duration: LASER_DROP, delay },
                  scale: { times: [0, 0.1, 0.8, 1], duration: LASER_DROP, delay },
                }}
              />
            </div>
          )}

          {/* Flash tumbukan + garis panas sepanjang tepi atas card */}
          {!still && (
            <>
              <motion.div
                className="absolute rounded-full"
                style={{
                  left: g.lx - g.w * 0.6,
                  top: g.ly - g.w * 0.6,
                  width: g.w * 1.2,
                  height: g.w * 1.2,
                  background: `radial-gradient(circle, white, ${mix(80)} 35%, transparent 68%)`,
                }}
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: [0, 1, 0], scale: [0.2, 1.1, 1.6] }}
                transition={{ duration: 1.1, delay: hit - 0.05, ease: "easeOut" }}
              />
              <motion.div
                className="absolute h-[3px] rounded-full blur-[1px]"
                style={{
                  left: g.lx - g.w * 0.8,
                  top: g.ly - 1,
                  width: g.w * 1.6,
                  background: `linear-gradient(to right, transparent, white 30%, white 70%, transparent)`,
                  boxShadow: `0 0 24px 4px ${mix(80)}`,
                  originX: 0.5,
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: [0, 1, 0.9] }}
                transition={{ duration: 1.4, delay: hit - 0.05, ease: MELT_EASE }}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

// Cahaya yang jatuh ke MUKA card: taruh di dalam elemen card (overflow-hidden).
export function LaserCardGlow({ delay = 1.8 }: { delay?: number }) {
  const reduce = useReducedMotion();
  const hit = delay + LASER_DROP;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-screen">
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: [0, 1, 0.85] }}
        transition={{ duration: 1.6, delay: hit - 0.05, ease: "easeOut" }}
        style={{
          background: `radial-gradient(75% 50% at 50% 0%, white, ${mix(80)} 38%, transparent 75%)`,
        }}
      />
      <motion.div
        className="absolute inset-x-0 top-0 h-[2px]"
        initial={reduce ? false : { opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1.2, delay: hit - 0.05, ease: MELT_EASE }}
        style={{ background: "linear-gradient(to right, transparent, white 25%, white 75%, transparent)" }}
      />
    </div>
  );
}
