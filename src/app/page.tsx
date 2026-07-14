import type { Metadata } from "next";
import { supabasePublic } from "@/lib/supabase/public";
import { getProfile, siteUrl } from "@/lib/site";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Contact } from "@/components/sections/contact";
import { PageControls } from "@/components/page-controls";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  if (!profile) return {};

  const title = profile.title ? `${profile.name} — ${profile.title}` : profile.name;
  const description = profile.bio || `${profile.name} · ${profile.title}`;
  const image = profile.avatar_url ?? undefined;

  return {
    title,
    description,
    authors: [{ name: profile.name }],
    alternates: { canonical: "/" },
    openGraph: {
      type: "profile",
      title,
      description,
      url: siteUrl,
      siteName: profile.name,
      locale: "id_ID",
      images: image ? [{ url: image, alt: profile.name }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function Home() {
  const [profile, { data: experience }, { data: projects }] =
    await Promise.all([
      getProfile(),
      supabasePublic
        .from("experience")
        .select("*")
        .order("sort_order", { ascending: true }),
      supabasePublic
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true }),
    ]);

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-center text-muted-foreground">
        Belum ada data. Jalankan migration di <code className="mx-1">supabase/migrations/</code>
        lalu isi lewat halaman /admin.
      </main>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title || undefined,
    description: profile.bio || undefined,
    image: profile.avatar_url || undefined,
    email: profile.email ? `mailto:${profile.email}` : undefined,
    address: profile.location || undefined,
    url: siteUrl,
    sameAs: [
      profile.github_url,
      profile.linkedin_url,
      profile.twitter_url,
      profile.website_url,
    ].filter(Boolean),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageControls />
      <Hero profile={profile} />
      <About profile={profile} />
      <Experience items={experience ?? []} />
      <Projects items={projects ?? []} />
      <Contact profile={profile} />
    </main>
  );
}
