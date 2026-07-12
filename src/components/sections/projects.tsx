import { ExternalLink, Github } from "lucide-react";
import type { Project } from "@/lib/types";
import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Projects({ items }: { items: Project[] }) {
  if (items.length === 0) return null;

  return (
    <section id="projects" className="mx-auto max-w-2xl px-6 py-24">
      <FadeIn>
        <h2 className="mb-10 text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          Projects
        </h2>
      </FadeIn>

      <div className="space-y-6">
        {items.map((project, i) => (
          <FadeIn key={project.id} delay={i * 0.05}>
            <Card className="overflow-hidden py-0">
              {project.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="aspect-video w-full object-cover"
                />
              )}
              <CardHeader className="pt-6">
                <div className="flex items-center justify-between gap-4">
                  <CardTitle>{project.title}</CardTitle>
                  <div className="flex shrink-0 gap-3">
                    {project.repo_url && (
                      <a
                        href={project.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Repository"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Github className="size-4" />
                      </a>
                    )}
                    {project.project_url && (
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Live site"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
                {project.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
