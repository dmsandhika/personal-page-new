"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import type { Profile } from "@/lib/types";
import { useLocale } from "@/lib/i18n/locale-context";
import { pickByLocale } from "@/lib/i18n/dictionaries";

const ease = [0.22, 1, 0.36, 1] as const;

// Sudut siku dekoratif ala viewfinder di tiap pojok potret
function Corner({ className }: { className: string }) {
  return <span className={`absolute size-4 border-primary ${className}`} />;
}

export function Hero({ profile }: { profile: Profile }) {
  const { locale, t } = useLocale();
  const title = pickByLocale(locale, {
    id: profile.title,
    en: profile.title_en,
    ar: profile.title_ar,
    jv: profile.title_jv,
  });
  // Foto hero berganti per bahasa; jatuh ke foto default (id) kalau kosong.
  const avatarByLocale: Record<string, string | null> = {
    id: profile.avatar_url,
    en: profile.avatar_url_en,
    ar: profile.avatar_url_ar,
    jv: profile.avatar_url_jv,
  };
  const avatarUrl = avatarByLocale[locale] || profile.avatar_url;

  return (
    <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-24 sm:px-10 sm:py-28">
      <div className="grid items-center gap-10 sm:gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
        {/* Kolom teks — tampil duluan (nama dulu) di mobile & desktop */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-7 flex items-center gap-2.5 font-mono text-xs tracking-[0.25em] text-muted-foreground uppercase"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            {profile.location ? `${t("hero.basedIn")} ${profile.location}` : t("hero.available")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease }}
            className="font-display text-[clamp(2.75rem,10vw,7rem)] leading-[0.9] font-bold wrap-break-word hyphens-auto"
          >
            {profile.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
            className="mt-6 flex items-center gap-3 text-lg text-muted-foreground sm:text-xl"
          >
            <span className="font-mono text-primary">{"//"}</span>
            {title}
          </motion.p>

          <motion.a
            href="#about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4, ease }}
            className="group mt-12 inline-flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-foreground uppercase transition-colors hover:text-primary"
            aria-label={t("hero.scrollAria")}
          >
            <span className="flex size-9 items-center justify-center rounded-full border border-border transition-colors group-hover:border-primary group-hover:bg-primary/10">
              <ArrowDown className="size-3.5 transition-transform group-hover:translate-y-0.5" />
            </span>
            {t("hero.scrollAria")}
          </motion.a>
        </div>

        {/* Potret grayscale → warna saat hover, dengan corner ticks & caption mono */}
        {avatarUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="group relative mx-auto w-full max-w-xs lg:mx-0 lg:justify-self-end"
          >
            <div className="relative overflow-hidden rounded-lg border border-border">
              <motion.img
                key={avatarUrl}
                src={avatarUrl}
                alt={profile.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45, ease }}
                className="aspect-4/5 w-full object-cover grayscale transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-linear-to-t from-background/90 to-transparent px-4 py-3 font-mono text-[0.65rem] tracking-widest text-foreground/70 uppercase">
                <span>{profile.name}</span>
                <span className="text-primary">●</span>
              </div>
            </div>
            <Corner className="-top-1.5 -left-1.5 border-t-2 border-l-2" />
            <Corner className="-top-1.5 -right-1.5 border-t-2 border-r-2" />
            <Corner className="-bottom-1.5 -left-1.5 border-b-2 border-l-2" />
            <Corner className="-right-1.5 -bottom-1.5 border-r-2 border-b-2" />
          </motion.div>
        )}
      </div>
    </section>
  );
}
