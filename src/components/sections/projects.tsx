"use client";

import { useState } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import type { Project } from "@/lib/types";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GithubIcon } from "@/components/icons/social-icons";
import { useLocale } from "@/lib/i18n/locale-context";
import { pickByLocale } from "@/lib/i18n/dictionaries";

// Placeholder untuk project tanpa gambar: pola grid + simbol mono
function Thumbnail({ project, title }: { project: Project; title: string }) {
  if (project.image_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={project.image_url}
        alt={title}
        loading="lazy"
        className="aspect-video w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
      />
    );
  }
  return (
    <div className="tech-grid flex aspect-video w-full items-center justify-center bg-muted/40">
      <span className="font-mono text-2xl text-muted-foreground/60">{"{ }"}</span>
    </div>
  );
}

export function Projects({ items }: { items: Project[] }) {
  const { locale, t } = useLocale();
  const [selected, setSelected] = useState<Project | null>(null);

  if (items.length === 0) return null;

  const selectedTitle = selected
    ? pickByLocale(locale, {
        id: selected.title,
        en: selected.title_en,
        ar: selected.title_ar,
        jv: selected.title_jv,
      })
    : "";
  const selectedDescription = selected
    ? pickByLocale(locale, {
        id: selected.description,
        en: selected.description_en,
        ar: selected.description_ar,
        jv: selected.description_jv,
      })
    : "";

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-28 sm:px-10">
      <FadeIn>
        <SectionHeading number="03">{t("section.projects")}</SectionHeading>
      </FadeIn>

      {/* Galeri grid: kartu ringkas, klik untuk detail */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((project, i) => {
          const title = pickByLocale(locale, {
            id: project.title,
            en: project.title_en,
            ar: project.title_ar,
            jv: project.title_jv,
          });

          return (
            <FadeIn key={project.id} delay={(i % 3) * 0.06}>
              <button
                type="button"
                onClick={() => setSelected(project)}
                className="group w-full cursor-pointer overflow-hidden rounded-lg border border-border bg-card text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <div className="relative overflow-hidden">
                  <Thumbnail project={project} title={title} />
                  <span className="absolute top-3 right-3 flex size-7 items-center justify-center rounded-full border border-border bg-background/70 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                    <ArrowUpRight className="size-3.5" />
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-display font-semibold tracking-tight">{title}</h3>
                  {project.tags.length > 0 && (
                    <p className="mt-1.5 truncate font-mono text-[0.65rem] tracking-wider text-muted-foreground uppercase">
                      {project.tags.slice(0, 3).join(" · ")}
                      {project.tags.length > 3 ? ` +${project.tags.length - 3}` : ""}
                    </p>
                  )}
                </div>
              </button>
            </FadeIn>
          );
        })}
      </div>

      {/* Dialog detail project */}
      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[90dvh] gap-0 overflow-y-auto p-0 sm:max-w-xl">
          {selected && (
            <>
              {selected.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selected.image_url}
                  alt={selectedTitle}
                  className="aspect-video w-full object-cover"
                />
              )}
              <div className="flex flex-col gap-4 p-6">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl font-semibold tracking-tight">
                    {selectedTitle}
                  </DialogTitle>
                  <DialogDescription className="text-sm leading-relaxed whitespace-pre-line">
                    {selectedDescription}
                  </DialogDescription>
                </DialogHeader>

                {selected.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selected.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="rounded-full border-border bg-transparent px-3 py-0.5 font-mono text-[0.65rem] tracking-wider text-muted-foreground uppercase"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {(selected.project_url || selected.repo_url) && (
                  <div className="flex flex-wrap gap-3 pt-1">
                    {selected.project_url && (
                      <Button
                        nativeButton={false}
                        render={
                          <a
                            href={selected.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          />
                        }
                      >
                        <ExternalLink className="size-3.5" />
                        Live
                      </Button>
                    )}
                    {selected.repo_url && (
                      <Button
                        variant="outline"
                        nativeButton={false}
                        render={
                          <a
                            href={selected.repo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          />
                        }
                      >
                        <GithubIcon className="size-3.5" />
                        Repository
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
