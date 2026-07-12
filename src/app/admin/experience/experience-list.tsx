"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { deleteExperience } from "./actions";
import { ExperienceFormDialog } from "./experience-form-dialog";
import type { Experience } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ExperienceList({ items }: { items: Experience[] }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    if (!confirm("Hapus experience ini?")) return;
    startTransition(async () => {
      const result = await deleteExperience(id);
      if (result?.error) toast.error(result.error);
      else toast.success("Experience dihapus");
    });
  }

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Belum ada data experience.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Role</TableHead>
          <TableHead>Perusahaan</TableHead>
          <TableHead>Periode</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.role}</TableCell>
            <TableCell>{item.company}</TableCell>
            <TableCell>
              {item.start_date} – {item.end_date ?? "Sekarang"}
            </TableCell>
            <TableCell className="flex justify-end gap-2">
              <ExperienceFormDialog
                experience={item}
                trigger={
                  <Button variant="ghost" size="icon">
                    <Pencil className="size-4" />
                  </Button>
                }
              />
              <Button
                variant="ghost"
                size="icon"
                disabled={isPending}
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
