"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy, ExternalLink, GitFork, Star } from "lucide-react";
import type { OpenSource, OpenSourceKind } from "@/lib/types";
import type { OpenSourceStats } from "@/lib/open-source-stats";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/motion/fade-in";
import { CountUp } from "@/components/motion/count-up";
import { SectionHeading } from "@/components/section-heading";
import { GithubIcon } from "@/components/icons/social-icons";
import { useLocale } from "@/lib/i18n/locale-context";
import { pickByLocale, type DictionaryKey } from "@/lib/i18n/dictionaries";

export type OpenSourceItem = OpenSource & { stats: OpenSourceStats };

type Registry = "npm" | "composer" | "docker";

const REGISTRY = {
  npm: {
    cmd: (p: string) => `npm i ${p}`,
    url: (p: string) => `https://www.npmjs.com/package/${p}`,
  },
  composer: {
    cmd: (p: string) => `composer require ${p}`,
    url: (p: string) => `https://packagist.org/packages/${p}`,
  },
  docker: {
    cmd: (p: string) => `docker pull ${p}`,
    url: (p: string) => {
      const name = p.replace(/^library\//, "");
      return name.includes("/") ? `https://hub.docker.com/r/${name}` : `https://hub.docker.com/_/${name}`;
    },
  },
} satisfies Record<Registry, { cmd: (p: string) => string; url: (p: string) => string }>;

const KIND_KEY: Record<OpenSourceKind, DictionaryKey> = {
  library: "oss.library",
  tool: "oss.tool",
  app: "oss.app",
  image: "oss.image",
};

const LANG_COLOR: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  PHP: "#8892bf",
  Go: "#00add8",
  Python: "#3572a5",
  Rust: "#dea584",
  Dockerfile: "#2496ed",
  Shell: "#89e051",
  Vue: "#41b883",
  Blade: "#f7523f",
};

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const fmt = (n: number) => compact.format(n);

function packageOf(item: OpenSourceItem, reg: Registry) {
  return reg === "npm" ? item.npm_package : reg === "composer" ? item.composer_package : item.docker_image;
}

function Card({ item }: { item: OpenSourceItem }) {
  const { locale, t } = useLocale();
  const registries = (["npm", "composer", "docker"] as const).filter((r) => packageOf(item, r));
  const [reg, setReg] = useState<Registry | undefined>(registries[0]);
  const [copied, setCopied] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const description = pickByLocale(locale, {
    id: item.description,
    en: item.description_en,
    ar: item.description_ar,
    jv: item.description_jv,
  });
  const repoUrl = item.repo ? `https://github.com/${item.repo}` : null;
  const pkg = reg ? packageOf(item, reg) : null;
  const regUrl = reg && pkg ? REGISTRY[reg].url(pkg) : null;
  const mainUrl = repoUrl ?? regUrl ?? item.homepage_url;
  const s = item.stats;
  const lang = s.language;

  // statistik registry yang sedang dipilih
  let version: string | undefined;
  let downloads: string | undefined;
  if (reg === "npm") {
    version = s.npm?.version;
    if (s.npm?.monthly != null) downloads = `${fmt(s.npm.monthly)}${t("oss.perMonth")}`;
  } else if (reg === "composer") {
    version = s.composer?.version;
    const n = s.composer?.monthly ?? s.composer?.total;
    if (n != null) downloads = `${fmt(n)}${s.composer?.monthly != null ? t("oss.perMonth") : ""}`;
  } else if (reg === "docker" && s.docker?.pulls != null) {
    downloads = `${fmt(s.docker.pulls)} ${t("oss.pulls")}`;
  }

  async function copy() {
    if (!reg || !pkg) return;
    try {
      await navigator.clipboard.writeText(REGISTRY[reg].cmd(pkg));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard bisa diblokir; abaikan */
    }
  }

  return (
    <div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-sm transition-colors duration-300 hover:border-primary/50",
        item.featured && "lg:col-span-2"
      )}
    >
      {/* sorot yang mengikuti kursor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(260px circle at ${pos.x}px ${pos.y}px, color-mix(in oklch, var(--primary) 14%, transparent), transparent 70%)`,
        }}
      />
      {item.featured && (
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary to-transparent"
        />
      )}

      <div className="relative flex items-center justify-between gap-3 font-mono text-[0.65rem] tracking-wider uppercase">
        <span className="flex items-center gap-2 text-muted-foreground">
          {item.featured && <span className="text-primary">★ {t("oss.featured")}</span>}
          {item.featured && <span aria-hidden>·</span>}
          {t(KIND_KEY[item.kind])}
          <span aria-hidden>·</span>
          <span
            className={cn(
              "flex items-center gap-1.5",
              item.status === "ready" ? "text-primary" : "text-amber-500 dark:text-amber-400"
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full bg-current",
                item.status === "in_progress" && "animate-pulse"
              )}
            />
            {item.status === "ready" ? t("oss.status.ready") : t("oss.status.progress")}
          </span>
        </span>
        {lang && (
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span
              className="size-2 rounded-full"
              style={{ background: LANG_COLOR[lang] ?? "var(--primary)" }}
            />
            {lang}
          </span>
        )}
      </div>

      <h3
        className={cn(
          "relative mt-3 font-mono font-semibold tracking-tight",
          item.featured ? "text-2xl" : "text-lg"
        )}
      >
        {mainUrl ? (
          <a
            href={mainUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t("oss.openRepo")}: ${item.name}`}
            className="inline-flex items-center gap-1.5 after:absolute after:inset-0 after:content-[''] hover:text-primary focus-visible:outline-none"
          >
            {item.name}
            <ArrowUpRight className="size-4 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
          </a>
        ) : (
          item.name
        )}
      </h3>

      {description && (
        <p
          className={cn(
            "relative mt-2 text-sm leading-relaxed text-muted-foreground",
            item.featured ? "line-clamp-4" : "line-clamp-3"
          )}
        >
          {description}
        </p>
      )}

      {reg && pkg && (
        <div className="relative z-10 mt-4">
          {registries.length > 1 && (
            <div className="mb-1.5 flex gap-1">
              {registries.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReg(r)}
                  className={cn(
                    "cursor-pointer rounded-md px-2 py-0.5 font-mono text-[0.6rem] tracking-wider uppercase transition-colors",
                    r === reg
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background/60 py-1.5 ps-3 pe-1.5 font-mono text-xs">
            <span className="text-primary">$</span>
            <code className="min-w-0 flex-1 truncate">{REGISTRY[reg].cmd(pkg)}</code>
            <button
              type="button"
              onClick={copy}
              aria-label={copied ? t("oss.copied") : t("oss.copy")}
              className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
            </button>
          </div>
        </div>
      )}

      <div className="relative mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-4 font-mono text-[0.68rem] text-muted-foreground">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {s.stars != null && (
            <span className="flex items-center gap-1">
              <Star className="size-3" /> {fmt(s.stars)}
            </span>
          )}
          {s.forks != null && (
            <span className="flex items-center gap-1">
              <GitFork className="size-3" /> {fmt(s.forks)}
            </span>
          )}
          {version && <span>v{version}</span>}
          {downloads && <span>{downloads}</span>}
          {s.license && <span>{s.license}</span>}
        </div>
        <div className="relative z-10 flex items-center gap-1">
          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex size-8 items-center justify-center rounded-full border border-border transition-colors hover:border-primary hover:text-primary"
            >
              <GithubIcon className="size-4" />
            </a>
          )}
          {regUrl && (
            <a
              href={regUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={reg}
              className="flex size-8 items-center justify-center rounded-full border border-border transition-colors hover:border-primary hover:text-primary"
            >
              <ExternalLink className="size-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function OpenSourceSection({
  items,
  githubUrl,
}: {
  items: OpenSourceItem[];
  githubUrl: string | null;
}) {
  const { t } = useLocale();
  const [filter, setFilter] = useState<OpenSourceKind | "all">("all");

  if (items.length === 0) return null;

  const kinds = Array.from(new Set(items.map((i) => i.kind)));
  const visible = items
    .filter((i) => filter === "all" || i.kind === filter)
    .sort((a, b) => Number(b.featured) - Number(a.featured));

  const stars = items.reduce((n, i) => n + (i.stats.stars ?? 0), 0);
  const monthly = items.reduce(
    (n, i) => n + (i.stats.npm?.monthly ?? 0) + (i.stats.composer?.monthly ?? 0),
    0
  );
  const handle = githubUrl?.replace(/\/+$/, "").split("/").pop();

  const stat = (n: number, label: string, format?: (n: number) => string) => (
    <div className="px-4 py-5 text-center">
      <p className="font-display text-2xl font-bold text-primary tabular-nums sm:text-4xl">
        <CountUp to={n} format={format} />
      </p>
      <p className="mt-1.5 font-mono text-[0.6rem] tracking-[0.2em] text-muted-foreground uppercase">
        {label}
      </p>
    </div>
  );

  return (
    <section id="opensource" className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
      <FadeIn>
        <SectionHeading number="05">{t("section.opensource")}</SectionHeading>
      </FadeIn>

      <FadeIn>
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <div className="grid flex-1 grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-card/40 backdrop-blur-sm rtl:divide-x-reverse">
            {stat(items.length, t("oss.stat.repos"))}
            {stat(stars, t("oss.stat.stars"), (n) => fmt(Math.round(n)))}
            {stat(monthly, t("oss.stat.downloads"), (n) => fmt(Math.round(n)))}
          </div>
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2.5 rounded-2xl border border-border bg-card/40 px-6 py-4 font-mono text-xs backdrop-blur-sm transition-colors hover:border-primary hover:text-primary"
            >
              <GithubIcon className="size-5" />
              {handle ? `@${handle}` : "GitHub"}
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          )}
        </div>
      </FadeIn>

      {kinds.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {(["all", ...kinds] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(k)}
              className={cn(
                "cursor-pointer rounded-full border px-3.5 py-1 font-mono text-[0.65rem] tracking-wider uppercase transition-colors",
                filter === k
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              )}
            >
              {k === "all" ? t("oss.all") : t(KIND_KEY[k])}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item, i) => (
          <FadeIn key={item.id} delay={(i % 3) * 0.06} className={cn("h-full", item.featured && "lg:col-span-2")}>
            <Card item={item} />
          </FadeIn>
        ))}
      </div>

      {githubUrl && (
        <FadeIn>
          <div className="mt-8 flex justify-center">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-5 py-2.5 font-mono text-xs tracking-wider uppercase backdrop-blur-sm transition-colors hover:border-primary hover:text-primary"
            >
              <GithubIcon className="size-4" />
              {t("oss.viewAll")}
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </FadeIn>
      )}
    </section>
  );
}
