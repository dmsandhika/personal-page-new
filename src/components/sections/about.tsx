"use client";

import type { Profile } from "@/lib/types";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { useLocale } from "@/lib/i18n/locale-context";
import { pickByLocale } from "@/lib/i18n/dictionaries";

export function About({ profile }: { profile: Profile }) {
  const { locale, t } = useLocale();
  const bio = pickByLocale(locale, {
    id: profile.bio,
    en: profile.bio_en,
    ar: profile.bio_ar,
    jv: profile.bio_jv,
  });

  return (
    <section id="about" className="mx-auto max-w-3xl px-6 py-28 sm:px-10">
      <FadeIn>
        <SectionHeading number="01">{t("section.about")}</SectionHeading>
        <p className="max-w-2xl text-lg leading-[1.8] whitespace-pre-line text-foreground/90 sm:text-xl">
          {bio}
        </p>
        {profile.location && (
          <p className="mt-8 flex items-center gap-3 text-xs font-medium tracking-[0.25em] text-muted-foreground uppercase">
            <span className="h-px w-6 bg-primary" />
            {profile.location}
          </p>
        )}
      </FadeIn>
    </section>
  );
}
