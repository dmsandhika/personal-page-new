import { SceneBackground } from "@/components/three/scene-background";
import { CursorGlow } from "@/components/fx/cursor-glow";
import { ScrollProgress } from "@/components/fx/scroll-progress";

// Lapisan latar global: scene three.js, grid redup, grain, sorotan kursor,
// dan bar progres scroll. Semuanya di belakang konten & tidak menangkap klik.
export function AuroraBackground() {
  return (
    <>
      <ScrollProgress />
      <SceneBackground />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
        <div
          className="tech-grid absolute inset-0 opacity-30 dark:opacity-20"
          style={{
            maskImage: "radial-gradient(110% 80% at 50% 0%, black, transparent 70%)",
            WebkitMaskImage: "radial-gradient(110% 80% at 50% 0%, black, transparent 70%)",
          }}
        />
        <div
          className="absolute -top-40 right-0 h-[70vh] w-[60vw] opacity-60"
          style={{
            background:
              "radial-gradient(50% 50% at 75% 25%, color-mix(in oklch, var(--primary) 14%, transparent), transparent 70%)",
          }}
        />
      </div>
      <div aria-hidden className="grain pointer-events-none fixed inset-0 z-[55]" />
      <CursorGlow />
    </>
  );
}
