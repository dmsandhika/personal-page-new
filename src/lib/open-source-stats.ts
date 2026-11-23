import type { OpenSource } from "@/lib/types";

// Statistik live untuk section Open Source, diambil server-side dari API publik
// GitHub, npm, Packagist, dan Docker Hub. Hasil di-cache sejam (data cache Next),
// dan setiap sumber gagal-aman: kalau satu API error, kartu tetap tampil tanpa
// angka itu. GITHUB_TOKEN opsional (menaikkan batas 60 -> 5000 request/jam).

const REVALIDATE = 3600;

export type OpenSourceStats = {
  stars?: number;
  forks?: number;
  language?: string | null;
  license?: string | null;
  npm?: { version?: string; monthly?: number };
  composer?: { version?: string; monthly?: number; total?: number };
  docker?: { pulls?: number; stars?: number };
};

async function getJson<T>(url: string, headers: Record<string, string> = {}): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "portfolio-site", ...headers },
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function github(repo: string) {
  const token = process.env.GITHUB_TOKEN;
  const data = await getJson<{
    stargazers_count?: number;
    forks_count?: number;
    language?: string | null;
    license?: { spdx_id?: string | null } | null;
  }>(`https://api.github.com/repos/${repo}`, {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });
  if (!data) return {};
  const spdx = data.license?.spdx_id;
  return {
    stars: data.stargazers_count,
    forks: data.forks_count,
    language: data.language ?? null,
    license: spdx && spdx !== "NOASSERTION" ? spdx : null,
  };
}

async function npm(pkg: string) {
  const [meta, dl] = await Promise.all([
    getJson<{ version?: string }>(`https://registry.npmjs.org/${encodeURIComponent(pkg)}/latest`),
    getJson<{ downloads?: number }>(`https://api.npmjs.org/downloads/point/last-month/${pkg}`),
  ]);
  return { version: meta?.version, monthly: dl?.downloads };
}

async function composer(pkg: string) {
  const [meta, info] = await Promise.all([
    getJson<{ packages?: Record<string, { version?: string }[]> }>(
      `https://repo.packagist.org/p2/${pkg}.json`
    ),
    getJson<{ package?: { downloads?: { total?: number; monthly?: number } } }>(
      `https://packagist.org/packages/${pkg}.json`
    ),
  ]);
  return {
    version: meta?.packages?.[pkg]?.[0]?.version?.replace(/^v/, ""),
    monthly: info?.package?.downloads?.monthly,
    total: info?.package?.downloads?.total,
  };
}

async function docker(image: string) {
  // Image resmi (mis. "nginx") hidup di namespace "library".
  const path = image.includes("/") ? image : `library/${image}`;
  const data = await getJson<{ pull_count?: number; star_count?: number }>(
    `https://hub.docker.com/v2/repositories/${path}/`
  );
  return { pulls: data?.pull_count, stars: data?.star_count };
}

export async function getOpenSourceStats(item: OpenSource): Promise<OpenSourceStats> {
  const [gh, n, c, d] = await Promise.all([
    item.repo ? github(item.repo) : Promise.resolve({}),
    item.npm_package ? npm(item.npm_package) : Promise.resolve(undefined),
    item.composer_package ? composer(item.composer_package) : Promise.resolve(undefined),
    item.docker_image ? docker(item.docker_image) : Promise.resolve(undefined),
  ]);
  return { ...gh, npm: n, composer: c, docker: d };
}
