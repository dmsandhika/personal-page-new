"use client";

import { useEffect, useRef, type RefObject } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Sinar laser besar yang jatuh dari tepi atas halaman dan MENDARAT di sebuah card.
// Saat menyentuh tepi atas card, cahaya "meleleh": gumpalan cahaya lunak menyembur
// sepanjang tepi, melambat, lalu menetes ke bawah di sisi card. Digambar di canvas
// (blending aditif + sprite radial) supaya tepinya cair dan menyatu, bukan bentuk kaku.
//
//   const ref = useRef<HTMLDivElement>(null)
//   <LaserBeam target={ref} delay={1.8} />            // di belakang card
//   <div ref={ref}> …card… <LaserCardGlow delay={1.8} /> </div>
//
// Warna mengikuti --primary. Reduced-motion: satu frame statis, tanpa loop.

export const LASER_DROP = 1.0; // detik sinar jatuh sampai card
const RES = 0.5; // resolusi canvas (glow lunak tak perlu resolusi penuh)
const MAX_PARTICLES = 260;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const smooth = (x: number) => x * x * (3 - 2 * x);

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  r0: number;
  seed: number;
};
type Geo = { lx: number; ly: number; w: number; h: number; cw: number; ch: number };

// Sprite gumpalan: warna primary, pusat memutih ("panas"), tepi memudar halus.
function makeSprite(color: string, hot: number) {
  const S = 128;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const x = c.getContext("2d")!;
  x.fillStyle = color;
  x.fillRect(0, 0, S, S);
  x.globalCompositeOperation = "source-atop";
  let g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, `rgba(255,255,255,${hot})`);
  g.addColorStop(0.45, `rgba(255,255,255,${hot * 0.25})`);
  g.addColorStop(1, "rgba(255,255,255,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, S, S);
  x.globalCompositeOperation = "destination-in";
  g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, "rgba(0,0,0,1)");
  g.addColorStop(0.25, "rgba(0,0,0,0.75)");
  g.addColorStop(0.5, "rgba(0,0,0,0.32)");
  g.addColorStop(0.75, "rgba(0,0,0,0.08)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, S, S);
  return c;
}

function resolvePrimary(host: HTMLElement) {
  const probe = document.createElement("span");
  probe.style.display = "none";
  probe.style.color = "var(--primary)";
  host.appendChild(probe);
  const c = getComputedStyle(probe).color;
  probe.remove();
  return c || "#34d399";
}

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
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let geo: Geo = { lx: 0, ly: 0, w: 320, h: 400, cw: 0, ch: 0 };
    let soft = makeSprite("#34d399", 0.25);
    let hot = makeSprite("#34d399", 1);
    const rebuildSprites = () => {
      const col = resolvePrimary(wrap);
      soft = makeSprite(col, 0.22);
      hot = makeSprite(col, 1);
    };
    rebuildSprites();

    const measure = () => {
      const wr = wrap.getBoundingClientRect();
      const t = target?.current;
      const base = t
        ? (() => {
            const r = t.getBoundingClientRect();
            return { lx: r.left - wr.left + r.width / 2, ly: r.top - wr.top, w: r.width, h: r.height };
          })()
        : { lx: wr.width / 2, ly: wr.height * 0.6, w: 320, h: 400 };
      geo = { ...base, cw: wr.width, ch: wr.height };
      canvas.width = Math.max(1, Math.round(wr.width * RES));
      canvas.height = Math.max(1, Math.round(wr.height * RES));
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    if (target?.current) ro.observe(target.current);
    const mo = new MutationObserver(rebuildSprites); // ganti tema -> warna baru
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });

    const parts: Particle[] = [];
    let emitAcc = 0;

    const blob = (img: HTMLCanvasElement, x: number, y: number, rx: number, ry: number, a: number) => {
      if (a <= 0.003) return;
      ctx.globalAlpha = a;
      ctx.drawImage(img, x - rx, y - ry, rx * 2, ry * 2);
    };

    const step = (t: number, dt: number) => {
      const { lx, ly, w } = geo;
      const hitT = t - LASER_DROP;
      // laju semburan: meledak saat tumbukan, lalu turun ke aliran tipis yang bertahan
      if (hitT > 0) {
        emitAcc += (16 + 80 * Math.exp(-hitT / 0.75)) * dt;
        while (emitAcc >= 1 && parts.length < MAX_PARTICLES) {
          emitAcc -= 1;
          const dir = Math.random() < 0.5 ? -1 : 1;
          const burst = hitT < 0.6 ? 1.5 : 1;
          const sp = (90 + Math.random() * 340) * burst;
          parts.push({
            x: lx + (Math.random() - 0.5) * w * 0.35,
            y: ly - 4 + Math.random() * 8,
            vx: dir * sp,
            vy: -30 + Math.random() * 50,
            age: 0,
            life: 2.4 + Math.random() * 2.2,
            r0: 24 + Math.random() * 34,
            seed: Math.random() * 6.28,
          });
        }
        emitAcc = Math.min(emitAcc, 3);
      }
      const edge = w * 0.5 - 6;
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.age += dt;
        if (p.age >= p.life) {
          parts.splice(i, 1);
          continue;
        }
        const out = Math.abs(p.x - lx) > edge;
        p.vx *= Math.exp(-(out ? 2.2 : 1.5) * dt); // melambat seperti cairan kental
        // di luar tepi card: cahaya menetes turun, makin deras makin panjang
        p.vy += (out ? 420 : 40) * dt;
        p.vy *= Math.exp(-(out ? 0.6 : 2.5) * dt);
        p.x += (p.vx + Math.sin(t * 1.6 + p.seed) * 10) * dt;
        p.y += p.vy * dt;
      }
    };

    const draw = (t: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (t < 0) return;
      ctx.setTransform(RES, 0, 0, RES, 0, 0);
      ctx.globalCompositeOperation = "lighter";
      const { lx, ly, w } = geo;
      const hitT = t - LASER_DROP;
      const dropT = clamp(t / LASER_DROP, 0, 1);
      const headY = ly * Math.pow(dropT, 2.2); // mulai pelan, makin cepat
      const breathe = 0.92 + 0.08 * Math.sin(t * 1.8);

      // kolam cahaya di tepi atas card, melebar pelan (ease-out)
      if (hitT > 0) {
        const e = easeOutCubic(clamp(hitT / 2.6, 0, 1));
        blob(soft, lx, ly + 20, w * 2.1 * e + 20, 150 * e + 8, 0.5 * breathe);
        blob(soft, lx, ly, w * 3.4 * e + 20, 260 * e + 8, 0.26 * breathe);
        blob(hot, lx, ly, w * 0.95 * e + 10, 95 * e + 6, 0.5 * breathe);
      }

      // kolom sinar: tumpukan gumpalan; melebar (funnel) menjelang card
      if (headY > 1) {
        const layers: [number, number, HTMLCanvasElement, number][] = [
          [w * 0.55, 0.11, soft, 1],
          [w * 0.24, 0.2, soft, 1],
          [Math.max(13, w * 0.08), 0.36, hot, 0],
        ];
        for (const [R, a, img, flare] of layers) {
          const stepY = Math.max(3, R * 0.45);
          for (let y = 0; y <= headY; y += stepY) {
            const f = flare ? 1 + 1.3 * smooth(clamp((y - (ly - 190)) / 190, 0, 1)) : 1;
            const sway = Math.sin(y * 0.02 - t * 3.2) * (R > 20 ? 3 : 1.2);
            // ujung kepala sinar menipis halus
            const tip = clamp((headY - y) / 60, 0, 1);
            blob(img, lx + sway, y, R * f, R * f * 1.2, a * breathe * (0.35 + 0.65 * tip));
          }
        }
      }
      // kepala sinar
      if (dropT < 1) blob(hot, lx, headY, w * 0.16, w * 0.16, 0.9);

      // ledakan cahaya saat menyentuh card (memudar halus)
      if (hitT > 0 && hitT < 1.6) {
        const a = Math.exp(-hitT * 2.6);
        blob(hot, lx, ly, w * (0.55 + hitT * 1.1), w * (0.28 + hitT * 0.4), 0.95 * a);
      }

      // gumpalan lelehan: membesar & memudar seiring umur, memanjang saat jatuh
      for (const p of parts) {
        const k = p.age / p.life;
        const alpha = 0.34 * Math.pow(1 - k, 1.6) * Math.min(1, p.age / 0.18);
        const r = p.r0 * (1 + 1.5 * k);
        const stretch = 1 + clamp(p.vy / 160, 0, 2.6);
        blob(soft, p.x, p.y, r * 0.9, r * stretch, alpha);
        if (k < 0.4) blob(hot, p.x, p.y, r * 0.35, r * 0.35 * stretch, alpha * 0.9);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    let raf = 0;
    if (reduce) {
      // frame statis: percepat simulasi lalu gambar sekali
      for (let t = 0; t < 4.5; t += 1 / 30) step(t, 1 / 30);
      draw(4.5);
    } else {
      const start = performance.now();
      let last = start;
      const loop = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        const t = (now - start) / 1000 - delay;
        if (t >= 0) step(t, dt);
        draw(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
    };
  }, [target, delay, reduce]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden opacity-60 lg:opacity-100 dark:mix-blend-screen ${className}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  );
}

const mix = (pct: number) => `color-mix(in oklch, var(--primary) ${pct}%, transparent)`;

// Cahaya yang jatuh ke MUKA card: taruh di dalam elemen card (overflow-hidden).
// Menyebar & merembes ke bawah dengan gerak pegas pelan (bukan fade kaku).
export function LaserCardGlow({ delay = 1.8 }: { delay?: number }) {
  const reduce = useReducedMotion();
  const hit = delay + LASER_DROP;
  const spring = (stiffness: number, damping: number, extra = 0) => ({
    type: "spring" as const,
    stiffness,
    damping,
    mass: 1.4,
    delay: hit - 0.05 + extra,
  });
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-screen">
      {/* titik panas di tepi atas, menyebar */}
      <motion.div
        className="absolute inset-0 origin-top"
        initial={reduce ? false : { opacity: 0, scaleX: 0.25, scaleY: 0.2 }}
        animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
        transition={spring(26, 9)}
      >
        <div
          className="laser-breathe size-full"
          style={{ background: `radial-gradient(80% 52% at 50% 0%, white, ${mix(80)} 36%, transparent 76%)` }}
        />
      </motion.div>
      {/* lelehan yang merembes pelan ke bawah muka card */}
      <motion.div
        className="absolute inset-0 origin-top"
        initial={reduce ? false : { opacity: 0, scaleY: 0.1 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={spring(10, 7, 0.25)}
      >
        <div
          className="laser-breathe size-full"
          style={{ background: `radial-gradient(70% 78% at 50% 0%, ${mix(55)}, ${mix(20)} 50%, transparent 82%)` }}
        />
      </motion.div>
    </div>
  );
}
