"use client";

import type { Profile } from "@/lib/types";
import { FadeIn } from "@/components/motion/fade-in";
import { RevealText } from "@/components/motion/reveal-text";
import { CountUp } from "@/components/motion/count-up";
import { SectionHeading } from "@/components/section-heading";
import { useLocale } from "@/lib/i18n/locale-context";
import { pickByLocale } from "@/lib/i18n/dictionaries";

export function About({
  profile,
  stats,
}: {
  profile: Profile;
  stats: { projects: number; experience: number; education: number };
}) {
  const { locale, t } = useLocale();
  const bio = pickByLocale(locale, {
    id: profile.bio,
    en: profile.bio_en,
    ar: profile.bio_ar,
    jv: profile.bio_jv,
  });

  const items = [
    { n: stats.projects, label: t("stats.projects") },
    { n: stats.experience, label: t("stats.experience") },
    { n: stats.education, label: t("stats.education") },
  ].filter((s) => s.n > 0);

  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-28 sm:px-10">
      <SectionHeading number="01">{t("section.about")}</SectionHeading>

      <RevealText
        text={bio}
        className="font-display text-2xl leading-[1.4] font-medium tracking-tight sm:text-4xl sm:leading-[1.35]"
      />

      {items.length > 0 && (
        <FadeIn>
          <div className="mt-16 grid grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-card/40 backdrop-blur-sm rtl:divide-x-reverse">
            {items.map((s) => (
              <div key={s.label} className="px-4 py-6 text-center sm:py-8">
                <p className="font-display text-4xl font-bold text-primary tabular-nums sm:text-6xl">
                  <CountUp to={s.n} />
                  <span className="text-muted-foreground">+</span>
                </p>
                <p className="mt-2 font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      )}
    </section>
  );
}
