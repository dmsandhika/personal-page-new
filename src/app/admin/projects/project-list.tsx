"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { deleteProject } from "./actions";
import { ProjectFormDialog } from "./project-form-dialog";
import type { Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ProjectList({ items }: { items: Project[] }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    if (!confirm("Hapus project ini?")) return;
    startTransition(async () => {
      const result = await deleteProject(id);
      if (result?.error) toast.error(result.error);
      else toast.success("Project dihapus");
    });
  }

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Belum ada data project.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Judul</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead>Featured</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell className="flex flex-wrap gap-1">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </TableCell>
            <TableCell>{item.featured ? "Ya" : "-"}</TableCell>
            <TableCell className="flex justify-end gap-2">
              <ProjectFormDialog
                project={item}
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
