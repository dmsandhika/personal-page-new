"use client";

import { ExternalLink } from "lucide-react";
import type { Project } from "@/lib/types";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GithubIcon } from "@/components/icons/social-icons";
import { useLocale } from "@/lib/i18n/locale-context";
import { pickLocalized } from "@/lib/i18n/dictionaries";

export function Projects({ items }: { items: Project[] }) {
  const { locale, t } = useLocale();

  if (items.length === 0) return null;

  return (
    <section id="projects" className="mx-auto max-w-3xl px-6 py-28 sm:px-10">
      <FadeIn>
        <SectionHeading number="03">{t("section.projects")}</SectionHeading>
      </FadeIn>

      <div className="space-y-8">
        {items.map((project, i) => {
          const title = pickLocalized(locale, project.title, project.title_en);
          const description = pickLocalized(locale, project.description, project.description_en);

          return (
            <FadeIn key={project.id} delay={i * 0.05}>
              <Card className="group overflow-hidden rounded-lg py-0 ring-foreground/10 transition-all duration-500 hover:-translate-y-1 hover:ring-primary/40 hover:shadow-[0_28px_60px_-32px_rgba(0,0,0,0.45)]">
                {project.image_url && (
                  <div className="overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.image_url}
                      alt={title}
                      className="aspect-video w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                )}
                <CardHeader className="pt-7">
                  <div className="flex items-center justify-between gap-4">
                    <CardTitle className="min-w-0 font-display text-2xl font-semibold tracking-tight wrap-break-word">
                      {title}
                    </CardTitle>
                    <div className="flex shrink-0 gap-3">
                      {project.repo_url && (
                        <a
                          href={project.repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Repository"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <GithubIcon className="size-4" />
                        </a>
                      )}
                      {project.project_url && (
                        <a
                          href={project.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Live site"
                          className="text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="size-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-7">
                  <p className="leading-relaxed text-foreground/75">{description}</p>
                  {project.tags.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="rounded-full border-border bg-transparent px-3 py-0.5 text-[0.7rem] font-medium tracking-wider text-muted-foreground uppercase"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
