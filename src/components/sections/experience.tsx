import type { Experience as ExperienceItem } from "@/lib/types";
import { FadeIn } from "@/components/motion/fade-in";

function formatPeriod(start: string, end: string | null) {
  const format = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", { month: "short", year: "numeric" });
  return `${format(start)} — ${end ? format(end) : "Sekarang"}`;
}

export function Experience({ items }: { items: ExperienceItem[] }) {
  if (items.length === 0) return null;

  return (
    <section id="experience" className="mx-auto max-w-2xl px-6 py-24">
      <FadeIn>
        <h2 className="mb-10 text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          Experience
        </h2>
      </FadeIn>

      <div className="space-y-10">
        {items.map((item, i) => (
          <FadeIn key={item.id} delay={i * 0.05}>
            <div className="border-l-2 pl-6">
              <p className="text-xs text-muted-foreground">
                {formatPeriod(item.start_date, item.end_date)}
              </p>
              <h3 className="mt-1 text-lg font-semibold">{item.role}</h3>
              <p className="text-sm text-muted-foreground">
                {item.company}
                {item.location ? ` · ${item.location}` : ""}
              </p>
              {item.description && (
                <p className="mt-3 leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              )}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
