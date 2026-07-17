// Latar dark-tech: grid halus + fade radial supaya grid meredup di tepi,
// ditambah satu glow aksen tipis. Fixed di belakang konten, tanpa ganggu klik.
export function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Grid teknis dengan mask radial agar memudar ke tepi */}
      <div
        className="tech-grid absolute inset-0 opacity-40 dark:opacity-30"
        style={{
          maskImage:
            "radial-gradient(120% 90% at 50% 0%, black, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(120% 90% at 50% 0%, black, transparent 75%)",
        }}
      />
      {/* Glow aksen di kanan-atas */}
      <div
        className="absolute -top-40 right-0 h-[70vh] w-[60vw] opacity-60"
        style={{
          background:
            "radial-gradient(50% 50% at 75% 25%, color-mix(in oklch, var(--primary) 14%, transparent), transparent 70%)",
        }}
      />
    </div>
  );
}
