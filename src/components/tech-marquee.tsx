"use client";

// Marquee logo tech stack berjalan terus. Logo dari Devicon (SVG resmi,
// ringan). Logo yang aslinya hitam (Next.js, Three.js) di-invert saat tema
// gelap supaya tetap terbaca.
const TECH: { name: string; icon: string; invertOnDark?: boolean }[] = [
  { name: "TypeScript", icon: "typescript/typescript-original" },
  { name: "JavaScript", icon: "javascript/javascript-original" },
  { name: "React", icon: "react/react-original" },
  { name: "Next.js", icon: "nextjs/nextjs-original", invertOnDark: true },
  { name: "Tailwind", icon: "tailwindcss/tailwindcss-original" },
  { name: "Node.js", icon: "nodejs/nodejs-original" },
  { name: "PHP", icon: "php/php-original" },
  { name: "Laravel", icon: "laravel/laravel-original" },
  { name: "CodeIgniter", icon: "codeigniter/codeigniter-plain" },
  { name: "Composer", icon: "composer/composer-original", invertOnDark: true },
  { name: "Supabase", icon: "supabase/supabase-original" },
  { name: "PostgreSQL", icon: "postgresql/postgresql-original" },
  { name: "MySQL", icon: "mysql/mysql-original" },
  { name: "HTML5", icon: "html5/html5-original" },
  { name: "CSS3", icon: "css3/css3-original" },
  { name: "Git", icon: "git/git-original" },
  { name: "Figma", icon: "figma/figma-original" },
];

const CDN = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

function Chip({ name, icon, invertOnDark }: (typeof TECH)[number]) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 rounded-full border border-border bg-card/50 px-4 py-2 backdrop-blur-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${CDN}/${icon}.svg`}
        alt={name}
        width={22}
        height={22}
        loading="lazy"
        className={`size-5.5 ${invertOnDark ? "dark:brightness-0 dark:invert" : ""}`}
      />
      <span className="font-mono text-xs tracking-wider whitespace-nowrap uppercase">{name}</span>
    </div>
  );
}

export function TechMarquee() {
  return (
    <section aria-label="Tech stack" className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
      <p className="mb-6 font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
        <span className="text-primary">{"// "}</span>stack
      </p>
      <div className="group/marquee relative flex overflow-hidden border-y border-border/60 py-5">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-background to-transparent" />

        <div className="flex min-w-full shrink-0 items-center gap-3 pr-3 animate-marquee">
          {TECH.map((t) => (
            <Chip key={t.name} {...t} />
          ))}
        </div>
        <div
          className="flex min-w-full shrink-0 items-center gap-3 pr-3 animate-marquee"
          aria-hidden
        >
          {TECH.map((t) => (
            <Chip key={`${t.name}-dup`} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
