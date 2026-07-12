"use client";

import { ExternalLink } from "lucide-react";
import type { Project } from "@/lib/types";
import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GithubIcon } from "@/components/icons/social-icons";
import { useLocale } from "@/lib/i18n/locale-context";
import { pickLocalized } from "@/lib/i18n/dictionaries";

export function Projects({ items }: { items: Project[] }) {
  const { locale, t } = useLocale();

  if (items.length === 0) return null;

  return (
    <section id="projects" className="mx-auto max-w-2xl px-6 py-24">
      <FadeIn>
        <h2 className="mb-10 text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          {t("section.projects")}
        </h2>
      </FadeIn>

      <div className="space-y-6">
        {items.map((project, i) => {
          const title = pickLocalized(locale, project.title, project.title_en);
          const description = pickLocalized(locale, project.description, project.description_en);

          return (
            <FadeIn key={project.id} delay={i * 0.05}>
              <Card className="overflow-hidden py-0">
                {project.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.image_url}
                    alt={title}
                    className="aspect-video w-full object-cover"
                  />
                )}
                <CardHeader className="pt-6">
                  <div className="flex items-center justify-between gap-4">
                    <CardTitle className="min-w-0 wrap-break-word">{title}</CardTitle>
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
                <CardContent className="pb-6">
                  <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                  {project.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-primary/10 text-primary hover:bg-primary/15"
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
