"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import type { Profile } from "@/lib/types";
import { useLocale } from "@/lib/i18n/locale-context";
import { pickByLocale } from "@/lib/i18n/dictionaries";
import { Tilt } from "@/components/fx/tilt";
import { Magnetic } from "@/components/fx/magnetic";
import { LaserBeam, LaserCardGlow } from "@/components/fx/laser-beam";

const ease = [0.22, 1, 0.36, 1] as const;

function Corner({ className }: { className: string }) {
  return <span className={`absolute size-4 border-primary ${className}`} />;
}

// Nama dipecah per kata; tiap huruf naik dari balik mask dengan stagger.
function SplitName({ text }: { text: string }) {
  let n = 0;
  return (
    <>
      {text.split(" ").map((word, wi) => (
        <span key={wi} className="inline-block overflow-hidden pb-[0.08em] align-bottom whitespace-nowrap">
          {Array.from(word).map((ch, ci) => (
            <motion.span
              key={ci}
              className="inline-block"
              initial={{ y: "115%", rotate: 6 }}
              animate={{ y: 0, rotate: 0 }}
              transition={{ duration: 0.9, delay: 1.9 + n++ * 0.035, ease }}
            >
              {ch}
            </motion.span>
          ))}
          {" "}
        </span>
      ))}
    </>
  );
}

export function Hero({ profile }: { profile: Profile }) {
  const { locale, t } = useLocale();
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 600], [0, 120]);
  const imgY = useTransform(scrollY, [0, 600], [0, -60]);
  const fade = useTransform(scrollY, [0, 500], [1, 0]);

  const title = pickByLocale(locale, {
    id: profile.title,
    en: profile.title_en,
    ar: profile.title_ar,
    jv: profile.title_jv,
  });
  const avatarByLocale: Record<string, string | null> = {
    id: profile.avatar_url,
    en: profile.avatar_url_en,
    ar: profile.avatar_url_ar,
    jv: profile.avatar_url_jv,
  };
  const avatarUrl = avatarByLocale[locale] || profile.avatar_url;

  // Delay disesuaikan dengan durasi splash screen (~1.8 dtk).
  const d = 1.8;

  return (
    <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-24 sm:px-10 sm:py-28">
      {/* Full-bleed: keluar dari max-w section agar sinar menempel di tepi atas layar */}
      <div className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2">
        <LaserBeam target={cardRef} delay={d} />
      </div>
      <div className="relative z-10 grid items-center gap-10 sm:gap-14 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        <motion.div style={{ y: textY, opacity: fade }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: d, ease }}
            className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-border bg-card/40 py-1.5 ps-3 pe-4 font-mono text-[0.7rem] tracking-[0.2em] text-muted-foreground uppercase backdrop-blur-sm"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            {profile.location ? `${t("hero.basedIn")} ${profile.location}` : t("hero.available")}
          </motion.div>

          <h1
            aria-label={profile.name}
            className="font-display text-[clamp(2.5rem,7vw,5.75rem)] leading-[0.95] font-bold tracking-tighter"
          >
            <span aria-hidden>
              <SplitName text={profile.name} />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: d + 0.7, ease }}
            className="mt-7 flex items-center gap-3 text-lg text-muted-foreground sm:text-2xl"
          >
            <span className="font-mono text-primary">{"//"}</span>
            <span className="bg-linear-to-r from-foreground to-primary bg-clip-text text-transparent">
              {title}
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: d + 1, ease }}
            className="mt-12"
          >
            <Magnetic>
              <a
                href="#about"
                aria-label={t("hero.scrollAria")}
                className="group inline-flex items-center gap-3 rounded-full border border-border bg-card/40 py-2 ps-2 pe-5 font-mono text-xs tracking-[0.2em] uppercase backdrop-blur-sm transition-colors hover:border-primary hover:text-primary"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <ArrowDown className="size-3.5 animate-bounce" />
                </span>
                {t("hero.scrollAria")}
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        {avatarUrl && (
          <div ref={cardRef} className="mx-auto w-full max-w-xs lg:mx-0 lg:justify-self-end">
          <motion.div
            style={{ y: imgY }}
            initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: d + 0.2, ease }}
          >
            <Tilt max={10} className="rounded-2xl">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card/40 shadow-[0_30px_80px_-30px_var(--primary)]">
                <motion.img
                  key={avatarUrl}
                  src={avatarUrl}
                  alt={profile.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.45, ease }}
                  className="aspect-4/5 w-full object-cover transition-all duration-700 ease-out hover:scale-[1.04] [@media(hover:hover)]:grayscale [@media(hover:hover)]:hover:grayscale-0"
                />
                <LaserCardGlow delay={d} />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-linear-to-t from-background/90 to-transparent px-4 py-3 font-mono text-[0.65rem] tracking-widest text-foreground/70 uppercase">
                  <span>{profile.name}</span>
                  <span className="text-primary">●</span>
                </div>
              </div>
              <Corner className="-top-2 -left-2 border-t-2 border-l-2" />
              <Corner className="-top-2 -right-2 border-t-2 border-r-2" />
              <Corner className="-bottom-2 -left-2 border-b-2 border-l-2" />
              <Corner className="-right-2 -bottom-2 border-r-2 border-b-2" />
            </Tilt>
          </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
