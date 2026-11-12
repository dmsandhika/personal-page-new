"use client";

import { useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";
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

// Semua gambar sebuah project (fallback ke image_url lama bila array kosong).
function projectImages(project: Project): string[] {
  if (project.image_urls && project.image_urls.length > 0) return project.image_urls;
  return project.image_url ? [project.image_url] : [];
}

// Sampul kartu: gambar pertama, atau placeholder pola grid bila tak ada gambar.
function Thumbnail({ cover, title }: { cover?: string; title: string }) {
  if (cover) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={cover}
        alt={title}
        loading="lazy"
        className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
      />
    );
  }
  return (
    <div className="tech-grid absolute inset-0 flex items-center justify-center bg-muted/40">
      <span className="font-mono text-3xl text-muted-foreground/60">{"{ }"}</span>
    </div>
  );
}

// Warna tiap kartu (hue oklch): emerald, teal, hijau, biru, tosca, lime.
const HUES = [163, 200, 145, 235, 185, 110];
const STACK_OFFSET = 56; // px: tinggi strip header kartu yang tetap terlihat
const MAX_DEPTH = 5; // kartu ke-6 dst menumpuk di posisi yang sama

type StackCardProps = {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
  title: string;
  description: string;
  onOpen: () => void;
};

// Kartu menempel (sticky) di atas; kartu berikutnya naik menimpa dan menyisakan
// strip header. Kartu yang tertimpa mengecil sedikit mengikuti progres scroll.
function StackCard({ project, index, total, progress, title, description, onOpen }: StackCardProps) {
  const reduce = useReducedMotion();
  const covered = Math.min(total - 1 - index, 6);
  const scale = useTransform(progress, [index / total, 1], [1, reduce ? 1 : 1 - covered * 0.035]);
  const images = projectImages(project);
  const hue = HUES[index % HUES.length];
  const depth = Math.min(index, MAX_DEPTH);
  const label = project.tags[0] ?? "Project";
  const counter = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  return (
    <div
      className="sticky mb-10 last:mb-0 sm:mb-16"
      style={{ top: `calc(5rem + ${depth * STACK_OFFSET}px)`, zIndex: index + 1 }}
    >
      <motion.article
        style={{
          scale,
          transformOrigin: "top center",
          ...({
            "--sc-bg": `oklch(0.92 0.045 ${hue})`,
            "--sc-border": `oklch(0.8 0.06 ${hue})`,
            "--sc-fg": `oklch(0.2 0.03 ${hue})`,
            "--sc-d-bg": `oklch(0.28 0.055 ${hue})`,
            "--sc-d-border": `oklch(0.4 0.08 ${hue})`,
            "--sc-d-fg": `oklch(0.96 0.01 ${hue})`,
          } as React.CSSProperties),
        }}
        className="stack-card flex h-[34rem] flex-col overflow-hidden rounded-[2rem] sm:h-[29rem]"
      >
        <div className="flex h-[52px] shrink-0 items-center justify-between px-5 sm:px-8">
          <span className="rounded-full border border-current/20 bg-black/10 px-3 py-1 font-mono text-[0.7rem] tracking-wider uppercase dark:bg-white/10">
            {label}
          </span>
          <span className="font-mono text-xs tracking-widest opacity-60">{counter}</span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 px-5 pb-5 sm:grid sm:grid-cols-[1.1fr_1fr] sm:gap-8 sm:px-8 sm:pb-8">
          <button
            type="button"
            onClick={onOpen}
            aria-label={title}
            className="group relative h-36 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-current/15 sm:order-2 sm:h-auto"
          >
            <Thumbnail cover={images[0]} title={title} />
            <span className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-black/80 text-white opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:opacity-100 dark:bg-white dark:text-black">
              <ArrowUpRight className="size-4" />
            </span>
          </button>

          <div className="flex min-h-0 flex-1 flex-col justify-end sm:order-1">
            <h3 className="font-display text-2xl leading-[1.05] font-bold tracking-tight sm:text-4xl">
              {title}
            </h3>
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed opacity-75 sm:text-base">
              {description}
            </p>
            {project.tags.length > 1 && (
              <p className="mt-3 truncate font-mono text-[0.65rem] tracking-wider uppercase opacity-60">
                {project.tags.slice(1, 5).join(" · ")}
              </p>
            )}
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={onOpen}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-black/85 px-4 py-2 font-mono text-[0.7rem] tracking-wider text-white uppercase transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-black"
              >
                Detail <ArrowUpRight className="size-3.5" />
              </button>
              {project.project_url && (
                <a
                  href={project.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Live"
                  className="flex size-9 items-center justify-center rounded-full border border-current/25 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
                >
                  <ExternalLink className="size-4" />
                </a>
              )}
              {project.repo_url && (
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Repository"
                  className="flex size-9 items-center justify-center rounded-full border border-current/25 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
                >
                  <GithubIcon className="size-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export function Projects({ items }: { items: Project[] }) {
  const { locale, t } = useLocale();
  const [selected, setSelected] = useState<Project | null>(null);
  const [imgIndex, setImgIndex] = useState(0);
  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ["start start", "end end"] });

  if (items.length === 0) return null;

  const selectedImages = selected ? projectImages(selected) : [];

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
        <SectionHeading number="04">{t("section.projects")}</SectionHeading>
      </FadeIn>

      {/* Stack card: menempel di atas, kartu berikutnya menimpa dengan strip header tersisa */}
      <div ref={stackRef}>
        {items.map((project, i) => (
          <StackCard
            key={project.id}
            project={project}
            index={i}
            total={items.length}
            progress={scrollYProgress}
            title={pickByLocale(locale, {
              id: project.title,
              en: project.title_en,
              ar: project.title_ar,
              jv: project.title_jv,
            })}
            description={pickByLocale(locale, {
              id: project.description,
              en: project.description_en,
              ar: project.description_ar,
              jv: project.description_jv,
            })}
            onOpen={() => {
              setSelected(project);
              setImgIndex(0);
            }}
          />
        ))}
      </div>

      {/* Dialog detail project */}
      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[90dvh] gap-0 overflow-y-auto p-0 sm:max-w-xl">
          {selected && (
            <>
              {selectedImages.length > 0 && (
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedImages[imgIndex] ?? selectedImages[0]}
                    alt={selectedTitle}
                    className="aspect-video w-full object-cover"
                  />
                  {selectedImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto px-6 pt-3">
                      {selectedImages.map((img, idx) => (
                        <button
                          key={img + idx}
                          type="button"
                          onClick={() => setImgIndex(idx)}
                          aria-label={`Gambar ${idx + 1}`}
                          className={cn(
                            "aspect-video h-12 shrink-0 overflow-hidden rounded-md border transition-all",
                            idx === imgIndex
                              ? "border-primary opacity-100"
                              : "border-border opacity-60 hover:opacity-100"
                          )}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img} alt="" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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
