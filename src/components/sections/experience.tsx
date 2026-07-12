"use client";

import type { Experience as ExperienceItem } from "@/lib/types";
import { FadeIn } from "@/components/motion/fade-in";
import { useLocale } from "@/lib/i18n/locale-context";
import { pickLocalized, type Locale } from "@/lib/i18n/dictionaries";

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
    <section id="experience" className="mx-auto max-w-2xl px-6 py-24">
      <FadeIn>
        <h2 className="mb-10 text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          {t("section.experience")}
        </h2>
      </FadeIn>

      <div className="space-y-10">
        {items.map((item, i) => {
          const role = pickLocalized(locale, item.role, item.role_en);
          const description = pickLocalized(locale, item.description ?? "", item.description_en);

          return (
            <FadeIn key={item.id} delay={i * 0.05}>
              <div className="border-l-2 border-primary/30 pl-6">
                <p className="text-xs text-muted-foreground">
                  {formatPeriod(item.start_date, item.end_date, locale, t("experience.present"))}
                </p>
                <h3 className="mt-1 text-lg font-semibold">{role}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.company}
                  {item.location ? ` · ${item.location}` : ""}
                </p>
                {description && (
                  <p className="mt-3 leading-relaxed whitespace-pre-line">{description}</p>
                )}
              </div>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
