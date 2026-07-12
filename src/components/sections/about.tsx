"use client";

import type { Profile } from "@/lib/types";
import { FadeIn } from "@/components/motion/fade-in";
import { useLocale } from "@/lib/i18n/locale-context";
import { pickLocalized } from "@/lib/i18n/dictionaries";

export function About({ profile }: { profile: Profile }) {
  const { locale, t } = useLocale();
  const bio = pickLocalized(locale, profile.bio, profile.bio_en);

  return (
    <section id="about" className="mx-auto max-w-2xl px-6 py-24">
      <FadeIn>
        <h2 className="mb-6 text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          {t("section.about")}
        </h2>
        <p className="text-lg leading-relaxed whitespace-pre-line">{bio}</p>
        {profile.location && (
          <p className="mt-4 text-sm text-muted-foreground">📍 {profile.location}</p>
        )}
      </FadeIn>
    </section>
  );
}
