import { supabasePublic } from "@/lib/supabase/public";
import { ProjectFormDialog } from "./project-form-dialog";
import { ProjectList } from "./project-list";
import { Button } from "@/components/ui/button";

export default async function AdminProjectsPage() {
  const { data: items } = await supabasePublic
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <ProjectFormDialog trigger={<Button>Tambah Project</Button>} />
      </div>
      <ProjectList items={items ?? []} />
    </div>
  );
}
