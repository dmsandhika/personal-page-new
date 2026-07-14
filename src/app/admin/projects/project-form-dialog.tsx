"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { createProject, updateProject } from "./actions";
import { deleteImage, uploadImage } from "../upload-action";
import type { Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [imagePreview, setImagePreview] = useState(project?.image_url ?? "");
  const [imageUrl, setImageUrl] = useState(project?.image_url ?? "");
  const imageFileRef = useRef<HTMLInputElement>(null);
  const isEdit = Boolean(project);

  function handleRemoveImage() {
    setImagePreview("");
    setImageUrl("");
    if (imageFileRef.current) imageFileRef.current.value = "";
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const previousUrl = project?.image_url ?? "";
      let finalUrl = imageUrl;

      const file = formData.get("image_file");
      if (file instanceof File && file.size > 0) {
        const uploadForm = new FormData();
        uploadForm.set("file", file);
        const uploadResult = await uploadImage(uploadForm);
        if (uploadResult.error) {
          toast.error(uploadResult.error);
          return;
        }
        finalUrl = uploadResult.url!;
      }
      formData.set("image_url", finalUrl);

      const action = isEdit ? updateProject : createProject;
      const result = await action(formData);
      if (result?.error) {
        toast.error(result.error);
        return;
      }

      if (previousUrl && previousUrl !== finalUrl) {
        deleteImage(previousUrl);
      }
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

          <Tabs defaultValue="id">
            <TabsList>
              <TabsTrigger value="id">Indonesia</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
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
          </Tabs>

          <div className="space-y-1.5">
            <Label htmlFor="image_file">Gambar Project</Label>
            {imagePreview && (
              <div className="space-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Preview gambar project"
                  className="h-32 w-full rounded-lg object-cover"
                />
                <Button type="button" variant="outline" size="sm" onClick={handleRemoveImage}>
                  Hapus Gambar
                </Button>
              </div>
            )}
            <input type="hidden" name="image_url" value={imageUrl} readOnly />
            <Input
              ref={imageFileRef}
              id="image_file"
              name="image_file"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImagePreview(URL.createObjectURL(file));
              }}
            />
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
