"use client";

import type { Experience as ExperienceItem } from "@/lib/types";
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

export function Experience({ items }: { items: ExperienceItem[] }) {
  const { locale, t } = useLocale();

  if (items.length === 0) return null;

  return (
    <section id="experience" className="mx-auto max-w-3xl px-6 py-28 sm:px-10">
      <FadeIn>
        <SectionHeading number="02">{t("section.experience")}</SectionHeading>
      </FadeIn>

      <div className="space-y-12">
        {items.map((item, i) => {
          const role = pickByLocale(locale, {
            id: item.role,
            en: item.role_en,
            ar: item.role_ar,
            jv: item.role_jv,
          });
          const description = pickByLocale(locale, {
            id: item.description ?? "",
            en: item.description_en,
            ar: item.description_ar,
            jv: item.description_jv,
          });

          return (
            <FadeIn key={item.id} delay={i * 0.05}>
              <div className="group relative border-s border-border ps-8 transition-colors hover:border-primary/60">
                <span className="absolute -inset-s-1.25 top-2 size-2.5 rounded-full bg-border ring-4 ring-background transition-colors group-hover:bg-primary" />
                <p className="font-mono text-xs tracking-wider text-muted-foreground">
                  {formatPeriod(item.start_date, item.end_date, locale, t("experience.present"))}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold tracking-tight">{role}</h3>
                <p className="mt-0.5 text-sm text-primary">
                  {item.company}
                  {item.location ? (
                    <span className="text-muted-foreground"> · {item.location}</span>
                  ) : null}
                </p>
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
    </section>
  );
}
