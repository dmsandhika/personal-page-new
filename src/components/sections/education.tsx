"use client";

import type { Education as EducationItem } from "@/lib/types";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/section-heading";
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

function resolveEducation(item: EducationItem, locale: Locale) {
  return {
    institution: pickByLocale(locale, {
      id: item.institution,
      en: item.institution_en,
      ar: item.institution_ar,
      jv: item.institution_jv,
    }),
    fieldOfStudy: pickByLocale(locale, {
      id: item.field_of_study,
      en: item.field_of_study_en,
      ar: item.field_of_study_ar,
      jv: item.field_of_study_jv,
    }),
    description: pickByLocale(locale, {
      id: item.description ?? "",
      en: item.description_en,
      ar: item.description_ar,
      jv: item.description_jv,
    }),
    location: item.location
      ? pickByLocale(locale, {
          id: item.location,
          en: item.location_en,
          ar: item.location_ar,
          jv: item.location_jv,
        })
      : null,
  };
}

export function Education({ items }: { items: EducationItem[] }) {
  const { locale, t } = useLocale();

  if (items.length === 0) return null;

  return (
    <section id="education" className="mx-auto max-w-3xl px-6 py-28 sm:px-10">
      <FadeIn>
        <SectionHeading number="02">{t("section.education")}</SectionHeading>
      </FadeIn>

      {items.length === 1 ? (
        <SingleEducationCard item={items[0]} locale={locale} presentLabel={t("experience.present")} />
      ) : (
        <div className="relative space-y-12">
          <div className="absolute inset-y-0 inset-s-0 w-px bg-border" aria-hidden="true" />
          {items.map((item, i) => {
            const { institution, fieldOfStudy, description, location } = resolveEducation(item, locale);

            return (
              <FadeIn key={item.id} delay={i * 0.05}>
                <div className="group relative ps-8">
                  <span className="absolute -inset-s-1.25 top-2 size-2.5 rounded-full bg-border ring-4 ring-background transition-colors group-hover:bg-primary" />
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <p className="font-mono text-xs tracking-wider text-muted-foreground">
                      {formatPeriod(item.start_date, item.end_date, locale, t("experience.present"))}
                    </p>
                    <span className="rounded-full border border-primary/40 px-2 py-0.5 font-mono text-[0.6rem] tracking-wider text-primary uppercase">
                      {item.degree}
                    </span>
                  </div>
                  <div className="mt-2 flex items-start gap-3">
                    {item.institution_logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.institution_logo_url}
                        alt={institution}
                        className="mt-0.5 size-10 shrink-0 rounded-lg border border-border bg-background object-contain p-1"
                      />
                    ) : null}
                    <div>
                      <h3 className="font-display text-xl font-semibold tracking-tight">{fieldOfStudy}</h3>
                      <p className="mt-0.5 text-sm text-primary">
                        {institution}
                        {location ? <span className="text-muted-foreground"> · {location}</span> : null}
                      </p>
                      {item.gpa && (
                        <p className="mt-0.5 text-sm text-muted-foreground">IPK {item.gpa}</p>
                      )}
                    </div>
                  </div>
                  {description && (
                    <p className="mt-4 leading-relaxed whitespace-pre-line text-foreground/80">
                      {description}
                    </p>
                  )}
                </div>
              </FadeIn>
            );
          })}
        </div>
      )}
    </section>
  );
}

function SingleEducationCard({
  item,
  locale,
  presentLabel,
}: {
  item: EducationItem;
  locale: Locale;
  presentLabel: string;
}) {
  const { institution, fieldOfStudy, description, location } = resolveEducation(item, locale);

  return (
    <FadeIn>
      <div className="flex flex-col items-center gap-4 text-center">
        {item.institution_logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.institution_logo_url}
            alt={institution}
            className="size-20 rounded-2xl border border-border bg-background object-contain p-2"
          />
        ) : null}

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5">
          <p className="font-mono text-xs tracking-wider text-muted-foreground">
            {formatPeriod(item.start_date, item.end_date, locale, presentLabel)}
          </p>
          <span className="rounded-full border border-primary/40 px-2 py-0.5 font-mono text-[0.6rem] tracking-wider text-primary uppercase">
            {item.degree}
          </span>
        </div>

        <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {fieldOfStudy}
        </h3>
        <p className="text-primary">
          {institution}
          {location ? <span className="text-muted-foreground"> · {location}</span> : null}
        </p>
        {item.gpa && <p className="text-sm text-muted-foreground">IPK {item.gpa}</p>}

        {description && (
          <p className="max-w-xl leading-relaxed whitespace-pre-line text-foreground/80">
            {description}
          </p>
        )}
      </div>
    </FadeIn>
  );
}
