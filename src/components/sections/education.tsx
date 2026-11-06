"use client";

import type { Education as EducationItem } from "@/lib/types";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { Timeline, TimelineItem } from "@/components/timeline";
import { useLocale } from "@/lib/i18n/locale-context";
import { pickByLocale, type Locale } from "@/lib/i18n/dictionaries";

function formatPeriod(start: string, end: string | null, locale: Locale, presentLabel: string) {
  const format = (d: string) =>
    new Date(d).toLocaleDateString(locale === "en" ? "en-US" : "id-ID", {
      month: "short",
      year: "numeric",
    });
  return `${format(start)} — ${end ? format(end) : presentLabel}`;
}

export function Education({ items }: { items: EducationItem[] }) {
  const { locale, t } = useLocale();

  if (items.length === 0) return null;

  return (
    <section id="education" className="mx-auto max-w-4xl px-6 py-28 sm:px-10">
      <FadeIn>
        <SectionHeading number="02">{t("section.education")}</SectionHeading>
      </FadeIn>

      <Timeline>
        {items.map((item, i) => {
          const location = item.location
            ? pickByLocale(locale, {
                id: item.location,
                en: item.location_en,
                ar: item.location_ar,
                jv: item.location_jv,
              })
            : null;
          const institution = pickByLocale(locale, {
            id: item.institution,
            en: item.institution_en,
            ar: item.institution_ar,
            jv: item.institution_jv,
          });
          return (
            <TimelineItem
              key={item.id}
              delay={i * 0.05}
              logo={item.institution_logo_url}
              period={formatPeriod(item.start_date, item.end_date, locale, t("experience.present"))}
              badge={item.degree}
              title={pickByLocale(locale, {
                id: item.field_of_study,
                en: item.field_of_study_en,
                ar: item.field_of_study_ar,
                jv: item.field_of_study_jv,
              })}
              subtitle={institution}
              meta={[location, item.gpa ? `IPK ${item.gpa}` : null].filter(Boolean).join(" · ")}
              description={pickByLocale(locale, {
                id: item.description ?? "",
                en: item.description_en,
                ar: item.description_ar,
                jv: item.description_jv,
              })}
            />
          );
        })}
      </Timeline>
    </section>
  );
}
