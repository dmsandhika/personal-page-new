"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { FadeIn } from "@/components/motion/fade-in";

// Garis timeline yang terisi mengikuti scroll.
export function Timeline({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.6"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <div ref={ref} className="relative space-y-6">
      <div className="absolute inset-y-0 inset-s-0 w-px bg-border" aria-hidden />
      <motion.div
        aria-hidden
        style={{ scaleY }}
        className="absolute inset-y-0 inset-s-0 w-px origin-top bg-primary shadow-[0_0_12px_var(--primary)]"
      />
      {children}
    </div>
  );
}

export function TimelineItem({
  period,
  badge,
  title,
  subtitle,
  meta,
  description,
  logo,
  delay = 0,
}: {
  period: string;
  badge: string;
  title: string;
  subtitle: string;
  meta?: string | null;
  description?: string | null;
  logo?: string | null;
  delay?: number;
}) {
  return (
    <FadeIn delay={delay}>
      <div className="group relative ps-8 sm:ps-10">
        <span className="absolute -inset-s-1.25 top-8 size-2.5 rounded-full bg-border ring-4 ring-background transition-all duration-300 group-hover:scale-150 group-hover:bg-primary group-hover:shadow-[0_0_14px_var(--primary)]" />
        <div
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
            e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
          }}
          className="spotlight relative overflow-hidden rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-primary/40 sm:p-7"
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <p className="font-mono text-xs tracking-wider text-muted-foreground">{period}</p>
            <span className="rounded-full border border-primary/40 px-2 py-0.5 font-mono text-[0.6rem] tracking-wider text-primary uppercase">
              {badge}
            </span>
          </div>
          <div className="mt-3 flex items-start gap-4">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt=""
                className="size-12 shrink-0 rounded-xl border border-border bg-background object-contain p-1.5"
              />
            ) : null}
            <div>
              <h3 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                {title}
              </h3>
              <p className="mt-1 text-sm text-primary">
                {subtitle}
                {meta ? <span className="text-muted-foreground"> · {meta}</span> : null}
              </p>
            </div>
          </div>
          {description && (
            <p className="mt-4 leading-relaxed whitespace-pre-line text-foreground/75">
              {description}
            </p>
          )}
        </div>
      </div>
    </FadeIn>
  );
}
