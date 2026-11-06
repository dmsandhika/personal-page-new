"use client";

import type { Experience as ExperienceItem } from "@/lib/types";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { Timeline, TimelineItem } from "@/components/timeline";
import { useLocale } from "@/lib/i18n/locale-context";
import { pickByLocale, type Locale } from "@/lib/i18n/dictionaries";

const EMPLOYMENT_TYPE_KEYS = {
  work: "experience.work",
  intern: "experience.intern",
  campus: "experience.campus",
  freelance: "experience.freelance",
} as const;

function formatPeriod(start: string, end: string | null, locale: Locale, presentLabel: string) {
  const format = (d: string) =>
    new Date(d).toLocaleDateString(locale === "en" ? "en-US" : "id-ID", {
      month: "short",
      year: "numeric",
    });
  return `${format(start)} — ${end ? format(end) : presentLabel}`;
}

export function Experience({ items }: { items: ExperienceItem[] }) {
  const { locale, t } = useLocale();

  if (items.length === 0) return null;

  return (
    <section id="experience" className="mx-auto max-w-4xl px-6 py-28 sm:px-10">
      <FadeIn>
        <SectionHeading number="03">{t("section.experience")}</SectionHeading>
      </FadeIn>

      <Timeline>
        {items.map((item, i) => (
          <TimelineItem
            key={item.id}
            delay={i * 0.05}
            period={formatPeriod(item.start_date, item.end_date, locale, t("experience.present"))}
            badge={t(
              EMPLOYMENT_TYPE_KEYS[item.employment_type as keyof typeof EMPLOYMENT_TYPE_KEYS] ??
                EMPLOYMENT_TYPE_KEYS.work
            )}
            title={pickByLocale(locale, {
              id: item.role,
              en: item.role_en,
              ar: item.role_ar,
              jv: item.role_jv,
            })}
            subtitle={item.company}
            meta={
              item.location
                ? pickByLocale(locale, {
                    id: item.location,
                    en: item.location_en,
                    ar: item.location_ar,
                    jv: item.location_jv,
                  })
                : null
            }
            description={pickByLocale(locale, {
              id: item.description ?? "",
              en: item.description_en,
              ar: item.description_ar,
              jv: item.description_jv,
            })}
          />
        ))}
      </Timeline>
    </section>
  );
}
