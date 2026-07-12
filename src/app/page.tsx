import { supabasePublic } from "@/lib/supabase/public";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Contact } from "@/components/sections/contact";
import { PageControls } from "@/components/page-controls";

export const revalidate = 0;

export default async function Home() {
  const [{ data: profile }, { data: experience }, { data: projects }] =
    await Promise.all([
      supabasePublic.from("profile").select("*").limit(1).single(),
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

  return (
    <main>
      <PageControls />
      <Hero profile={profile} />
      <About profile={profile} />
      <Experience items={experience ?? []} />
      <Projects items={projects ?? []} />
      <Contact profile={profile} />
    </main>
  );
}
