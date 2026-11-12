// Sinar laser vertikal dari atas halaman: inti terang, pulse yang meluncur turun,
// glow melengkung di bawah, dan garis tipis yang mengalir. CSS + SVG saja.
// Warna mengikuti --primary; animasi mati otomatis bila prefers-reduced-motion.
const mix = (pct: number, base = "var(--primary)") =>
  `color-mix(in oklch, ${base} ${pct}%, transparent)`;

// Garis melengkung: mulai dari dasar sinar (x=500), melebar ke kiri/kanan lalu turun.
const LINES = [
  "M500 0 C 500 260, 470 330, 380 420 S 250 640, 230 820",
  "M500 0 C 500 260, 530 330, 620 420 S 750 640, 770 820",
  "M500 0 C 500 240, 450 300, 330 380 S 130 560, 90 820",
  "M500 0 C 500 240, 550 300, 670 380 S 870 560, 910 820",
  "M500 0 C 500 280, 485 360, 440 460 S 380 700, 372 820",
  "M500 0 C 500 280, 515 360, 560 460 S 620 700, 628 820",
];

export function LaserBeam({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 top-0 -z-0 h-[110vh] overflow-hidden dark:mix-blend-screen ${className}`}
      style={{
        maskImage: "linear-gradient(to bottom, black 70%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent)",
      }}
    >
      {/* Kolom sinar, dipusatkan di --laser-x */}
      <div
        className="absolute top-0 h-full w-[min(100vw,1000px)] -translate-x-1/2"
        style={{ left: "var(--laser-x, 50%)" }}
      >
        {/* Glow lantai melengkung */}
        <div
          className="laser-breathe absolute top-[34%] left-1/2 h-[46%] w-full -translate-x-1/2 rounded-[50%] blur-3xl"
          style={{
            background: `radial-gradient(50% 50% at 50% 30%, ${mix(70)}, ${mix(25)} 55%, transparent 75%)`,
          }}
        />
        {/* Halo lebar di sepanjang sinar */}
        <div
          className="laser-breathe absolute top-0 left-1/2 h-[70%] w-[38%] -translate-x-1/2 blur-3xl"
          style={{
            background: `linear-gradient(to bottom, ${mix(80)}, ${mix(35)} 60%, transparent)`,
          }}
        />
        {/* Garis tipis mengalir */}
        <svg
          viewBox="0 0 1000 820"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full"
          fill="none"
        >
          {LINES.map((d, i) => (
            <path
              key={i}
              d={d}
              pathLength={1}
              stroke={mix(55)}
              strokeWidth={1.2}
              vectorEffect="non-scaling-stroke"
              strokeDasharray="0.22 0.78"
              className="laser-flow"
              style={{ animationDelay: `${-i * 0.9}s`, animationDuration: `${5 + (i % 3)}s` }}
            />
          ))}
        </svg>
        {/* Glow dekat inti */}
        <div
          className="laser-breathe absolute top-0 left-1/2 h-[62%] w-[9%] -translate-x-1/2 blur-xl"
          style={{
            background: `linear-gradient(to bottom, ${mix(100)}, ${mix(60)} 70%, transparent)`,
          }}
        />
        {/* Inti sinar */}
        <div
          className="absolute top-0 left-1/2 h-[58%] w-[3px] -translate-x-1/2 rounded-full"
          style={{
            background: `linear-gradient(to bottom, white, ${mix(100, "var(--primary)")} 55%, transparent)`,
            boxShadow: `0 0 18px 2px ${mix(90)}, 0 0 60px 8px ${mix(50)}`,
          }}
        />
        {/* Pulse cahaya yang meluncur turun */}
        <div className="absolute top-0 left-1/2 h-[58%] w-[3px] -translate-x-1/2 overflow-hidden rounded-full">
          <div
            className="laser-pulse h-1/3 w-full"
            style={{ background: "linear-gradient(to bottom, transparent, white, transparent)" }}
          />
        </div>
      </div>
    </div>
  );
}
