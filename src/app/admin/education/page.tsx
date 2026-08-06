import { supabasePublic } from "@/lib/supabase/public";
import { EducationFormDialog } from "./education-form-dialog";
import { EducationList } from "./education-list";
import { Button } from "@/components/ui/button";

export default async function AdminEducationPage() {
  const { data: items } = await supabasePublic
    .from("education")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pendidikan</h1>
        <EducationFormDialog trigger={<Button>Tambah Pendidikan</Button>} />
      </div>
      <EducationList items={items ?? []} />
    </div>
  );
}
