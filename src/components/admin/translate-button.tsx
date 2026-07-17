"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { translateText } from "@/app/admin/translate-action";

const TARGETS = ["en", "ar", "jv"] as const;

// Tombol auto-translate. Membaca field sumber (Indonesia) di form yang sama,
// lalu mengisi field `${source}_en`, `${source}_ar`, `${source}_jv`.
// Field pakai konvensi nama itu di semua form admin.
export function TranslateButton({ sources }: { sources: string[] }) {
  const [loading, setLoading] = useState(false);

  async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const form = e.currentTarget.form;
    if (!form) return;

    setLoading(true);
    let failed = false;

    try {
      for (const source of sources) {
        const srcEl = form.elements.namedItem(source) as
          | HTMLInputElement
          | HTMLTextAreaElement
          | null;
        const value = srcEl?.value?.trim();
        if (!value) continue;

        await Promise.all(
          TARGETS.map(async (lang) => {
            const result = await translateText(value, lang);
            if (result.error) {
              failed = true;
              return;
            }
            const targetEl = form.elements.namedItem(`${source}_${lang}`) as
              | HTMLInputElement
              | HTMLTextAreaElement
              | null;
            if (targetEl && result.text !== undefined) {
              targetEl.value = result.text;
            }
          })
        );
      }

      if (failed) {
        toast.warning("Sebagian terjemahan gagal. Coba lagi atau isi manual.");
      } else {
        toast.success("Terjemahan terisi (draft). Cek & rapikan, terutama Jawa, lalu Simpan.");
      }
    } catch {
      toast.error("Gagal menerjemahkan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" disabled={loading} onClick={handleClick}>
      <Languages className="size-4" />
      {loading ? "Menerjemahkan…" : "Auto-translate ID → EN · AR · JW"}
    </Button>
  );
}
