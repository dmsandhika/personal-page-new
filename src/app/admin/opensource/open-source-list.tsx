"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { deleteOpenSource, reorderOpenSource } from "./actions";
import { OpenSourceFormDialog } from "./open-source-form-dialog";
import type { OpenSource } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function registries(item: OpenSource) {
  return [
    item.npm_package && "npm",
    item.composer_package && "composer",
    item.docker_image && "docker",
  ]
    .filter(Boolean)
    .join(" · ");
}

function SortableRow({
  item,
  isPending,
  onDelete,
}: {
  item: OpenSource;
  isPending: boolean;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  return (
    <TableRow
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "relative z-10 bg-muted/50" : undefined}
    >
      <TableCell className="w-8">
        <button
          type="button"
          aria-label="Urutkan"
          className="touch-none text-muted-foreground active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4 cursor-grab" />
        </button>
      </TableCell>
      <TableCell className="font-medium">{item.name}</TableCell>
      <TableCell className="text-muted-foreground">{item.repo ?? "-"}</TableCell>
      <TableCell>{item.kind}</TableCell>
      <TableCell>{item.status === "ready" ? "Siap pakai" : "On progress"}</TableCell>
      <TableCell>{registries(item) || "-"}</TableCell>
      <TableCell>{item.featured ? "Ya" : "-"}</TableCell>
      <TableCell className="flex justify-end gap-2">
        <OpenSourceFormDialog
          item={item}
          trigger={
            <Button variant="ghost" size="icon">
              <Pencil className="size-4" />
            </Button>
          }
        />
        <Button variant="ghost" size="icon" disabled={isPending} onClick={() => onDelete(item.id)}>
          <Trash2 className="size-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export function OpenSourceList({ items: initialItems }: { items: OpenSource[] }) {
  const [items, setItems] = useState(initialItems);
  const [prevInitialItems, setPrevInitialItems] = useState(initialItems);
  const [isPending, startTransition] = useTransition();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (initialItems !== prevInitialItems) {
    setPrevInitialItems(initialItems);
    setItems(initialItems);
  }

  function handleDelete(id: string) {
    if (!confirm("Hapus repo ini dari daftar?")) return;
    startTransition(async () => {
      const result = await deleteOpenSource(id);
      if (result?.error) toast.error(result.error);
      else toast.success("Repo dihapus");
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);

    startTransition(async () => {
      const result = await reorderOpenSource(reordered.map((item) => item.id));
      if (result?.error) {
        toast.error(result.error);
        setItems(initialItems);
      }
    });
  }

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Belum ada repo open source.</p>;
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8" />
            <TableHead>Nama</TableHead>
            <TableHead>Repo</TableHead>
            <TableHead>Jenis</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Registry</TableHead>
            <TableHead>Unggulan</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
            {items.map((item) => (
              <SortableRow key={item.id} item={item} isPending={isPending} onDelete={handleDelete} />
            ))}
          </SortableContext>
        </TableBody>
      </Table>
    </DndContext>
  );
}
