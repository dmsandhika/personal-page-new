"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Star, X } from "lucide-react";
import { createProject, updateProject } from "./actions";
import { deleteImage, uploadImage } from "../upload-action";
import { compressImage } from "@/lib/compress-image";
import type { Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TranslateButton } from "@/components/admin/translate-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ProjectFormDialog({
  project,
  trigger,
}: {
  project?: Project;
  trigger: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isEdit = Boolean(project);

  // Daftar gambar galeri: bisa berupa URL yang sudah tersimpan atau File baru.
  const keyCounter = useRef(0);
  const initialImages =
    project?.image_urls && project.image_urls.length > 0
      ? project.image_urls
      : project?.image_url
        ? [project.image_url]
        : [];
  const [items, setItems] = useState<
    { key: string; url?: string; file?: File; preview: string }[]
  >(() => initialImages.map((u, idx) => ({ key: `init-${idx}-${u}`, url: u, preview: u })));
  const fileInputRef = useRef<HTMLInputElement>(null);

  function addFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const added = Array.from(files).map((file) => ({
      key: `i${keyCounter.current++}`,
      file,
      preview: URL.createObjectURL(file),
    }));
    setItems((prev) => [...prev, ...added]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeItem(key: string) {
    setItems((prev) => prev.filter((it) => it.key !== key));
  }

  // Pindahkan gambar ke posisi pertama (jadi sampul).
  function makeCover(key: string) {
    setItems((prev) => {
      const idx = prev.findIndex((it) => it.key === key);
      if (idx <= 0) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(idx, 1);
      copy.unshift(moved);
      return copy;
    });
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      // Upload semua file baru, susun URL final sesuai urutan.
      const finalUrls: string[] = [];
      for (const it of items) {
        if (it.url) {
          finalUrls.push(it.url);
          continue;
        }
        if (it.file) {
          const compressed = await compressImage(it.file);
          const uploadForm = new FormData();
          uploadForm.set("file", compressed);
          const uploadResult = await uploadImage(uploadForm);
          if (uploadResult.error) {
            toast.error(uploadResult.error);
            return;
          }
          finalUrls.push(uploadResult.url!);
        }
      }
      formData.set("image_urls", JSON.stringify(finalUrls));

      const action = isEdit ? updateProject : createProject;
      const result = await action(formData);
      if (result?.error) {
        toast.error(result.error);
        return;
      }

      // Hapus gambar lama yang sudah tidak dipakai lagi.
      const prevUrls =
        project?.image_urls && project.image_urls.length > 0
          ? project.image_urls
          : project?.image_url
            ? [project.image_url]
            : [];
      for (const old of prevUrls) {
        if (old && !finalUrls.includes(old)) deleteImage(old);
      }

      // Sinkronkan state ke hasil tersimpan.
      setItems(finalUrls.map((u) => ({ key: `i${keyCounter.current++}`, url: u, preview: u })));
      toast.success(isEdit ? "Project diperbarui" : "Project ditambahkan");
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Project" : "Tambah Project"}</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          {isEdit && <input type="hidden" name="id" value={project!.id} />}

          <div className="flex justify-end">
            <TranslateButton sources={["title", "description"]} />
          </div>

          <Tabs defaultValue="id">
            <TabsList>
              <TabsTrigger value="id">Indonesia</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ar">العربية</TabsTrigger>
              <TabsTrigger value="jv">Jawa</TabsTrigger>
            </TabsList>

            <TabsContent value="id" keepMounted className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">Judul</Label>
                <Input id="title" name="title" defaultValue={project?.title} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea id="description" name="description" rows={4} defaultValue={project?.description} />
              </div>
            </TabsContent>

            <TabsContent value="en" keepMounted className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title_en">Title (English)</Label>
                <Input id="title_en" name="title_en" defaultValue={project?.title_en ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description_en">Description (English)</Label>
                <Textarea id="description_en" name="description_en" rows={4} defaultValue={project?.description_en ?? ""} />
              </div>
            </TabsContent>

            <TabsContent value="ar" keepMounted className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title_ar">Title (Arab)</Label>
                <Input id="title_ar" name="title_ar" dir="rtl" lang="ar" defaultValue={project?.title_ar ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description_ar">Description (Arab)</Label>
                <Textarea id="description_ar" name="description_ar" rows={4} dir="rtl" lang="ar" defaultValue={project?.description_ar ?? ""} />
              </div>
            </TabsContent>

            <TabsContent value="jv" keepMounted className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title_jv">Title (Jawa)</Label>
                <Input id="title_jv" name="title_jv" defaultValue={project?.title_jv ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description_jv">Description (Jawa)</Label>
                <Textarea id="description_jv" name="description_jv" rows={4} defaultValue={project?.description_jv ?? ""} />
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="image_file">Gambar Project (bisa lebih dari satu)</Label>
            {items.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {items.map((it, i) => (
                  <div
                    key={it.key}
                    className="group/img relative aspect-video overflow-hidden rounded-lg border border-border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.preview} alt="" className="h-full w-full object-cover" />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 rounded bg-primary px-1.5 py-0.5 text-[0.6rem] font-medium text-primary-foreground">
                        Sampul
                      </span>
                    )}
                    <div className="absolute inset-x-1 bottom-1 flex justify-end gap-1 opacity-0 transition-opacity group-hover/img:opacity-100">
                      {i !== 0 && (
                        <Button
                          type="button"
                          size="icon-xs"
                          variant="secondary"
                          aria-label="Jadikan sampul"
                          onClick={() => makeCover(it.key)}
                        >
                          <Star />
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="icon-xs"
                        variant="destructive"
                        aria-label="Hapus gambar"
                        onClick={() => removeItem(it.key)}
                      >
                        <X />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Input
              ref={fileInputRef}
              id="image_file"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => addFiles(e.target.files)}
            />
            <p className="text-xs text-muted-foreground">
              Bisa pilih beberapa sekaligus. Gambar pertama jadi sampul (klik ★ untuk mengubah).
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tags">Tags (pisahkan dengan koma)</Label>
            <Input
              id="tags"
              name="tags"
              defaultValue={project?.tags?.join(", ") ?? ""}
              placeholder="Next.js, Supabase, TypeScript"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="project_url">Live URL</Label>
              <Input id="project_url" name="project_url" defaultValue={project?.project_url ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="repo_url">Repo URL</Label>
              <Input id="repo_url" name="repo_url" defaultValue={project?.repo_url ?? ""} />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label htmlFor="featured" className="cursor-pointer">
              Tampilkan sebagai Featured
            </Label>
            <Switch id="featured" name="featured" defaultChecked={project?.featured} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sort_order">Urutan (angka lebih kecil tampil duluan)</Label>
            <Input id="sort_order" name="sort_order" type="number" defaultValue={project?.sort_order ?? 0} />
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
