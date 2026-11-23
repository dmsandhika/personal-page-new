import { supabasePublic } from "@/lib/supabase/public";
import { OpenSourceFormDialog } from "./open-source-form-dialog";
import { OpenSourceList } from "./open-source-list";
import { Button } from "@/components/ui/button";

export default async function AdminOpenSourcePage() {
  const { data: items } = await supabasePublic
    .from("open_source")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Open Source</h1>
        <OpenSourceFormDialog trigger={<Button>Tambah Repo</Button>} />
      </div>
      <p className="text-sm text-muted-foreground">
        Stars, forks, versi, dan unduhan diambil otomatis dari GitHub, npm, Packagist, dan Docker
        Hub (cache 1 jam). Di sini cukup isi nama repo/paketnya.
      </p>
      <OpenSourceList items={items ?? []} />
    </div>
  );
}
