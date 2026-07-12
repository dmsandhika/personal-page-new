import { supabasePublic } from "@/lib/supabase/public";
import { ExperienceFormDialog } from "./experience-form-dialog";
import { ExperienceList } from "./experience-list";
import { Button } from "@/components/ui/button";

export default async function AdminExperiencePage() {
  const { data: items } = await supabasePublic
    .from("experience")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Experience</h1>
        <ExperienceFormDialog trigger={<Button>Tambah Experience</Button>} />
      </div>
      <ExperienceList items={items ?? []} />
    </div>
  );
}
