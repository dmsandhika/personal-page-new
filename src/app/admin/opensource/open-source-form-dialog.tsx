"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createOpenSource, updateOpenSource } from "./actions";
import type { OpenSource } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TranslateButton } from "@/components/admin/translate-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const KINDS = [
  { value: "library", label: "Library" },
  { value: "tool", label: "Tool" },
  { value: "app", label: "Aplikasi" },
  { value: "image", label: "Docker image" },
];

export function OpenSourceFormDialog({
  item,
  trigger,
}: {
  item?: OpenSource;
  trigger: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isEdit = Boolean(item);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const action = isEdit ? updateOpenSource : createOpenSource;
      const result = await action(formData);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(isEdit ? "Repo diperbarui" : "Repo ditambahkan");
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Repo" : "Tambah Repo"}</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          {isEdit && <input type="hidden" name="id" value={item!.id} />}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nama</Label>
              <Input id="name" name="name" defaultValue={item?.name} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="kind">Jenis</Label>
              <Select name="kind" defaultValue={item?.kind ?? "library"}>
                <SelectTrigger id="kind" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {KINDS.map((k) => (
                    <SelectItem key={k.value} value={k.value}>
                      {k.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={item?.status ?? "ready"}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ready">Siap pakai</SelectItem>
                <SelectItem value="in_progress">On progress</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="repo">Repo GitHub</Label>
            <Input
              id="repo"
              name="repo"
              placeholder="owner/nama-repo (atau URL GitHub)"
              defaultValue={item?.repo ?? ""}
            />
          </div>

          <div className="space-y-3 rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">
              Registry (opsional, isi yang ada saja). Dipakai untuk perintah install, versi, dan
              unduhan.
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="npm_package">npm</Label>
              <Input
                id="npm_package"
                name="npm_package"
                placeholder="nama-paket atau @scope/paket"
                defaultValue={item?.npm_package ?? ""}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="composer_package">Composer (Packagist)</Label>
              <Input
                id="composer_package"
                name="composer_package"
                placeholder="vendor/paket"
                defaultValue={item?.composer_package ?? ""}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="docker_image">Docker Hub</Label>
              <Input
                id="docker_image"
                name="docker_image"
                placeholder="user/image"
                defaultValue={item?.docker_image ?? ""}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="homepage_url">Website / Docs (opsional)</Label>
            <Input
              id="homepage_url"
              name="homepage_url"
              type="url"
              placeholder="https://"
              defaultValue={item?.homepage_url ?? ""}
            />
          </div>

          <div className="flex justify-end">
            <TranslateButton sources={["description"]} />
          </div>

          <Tabs defaultValue="id">
            <TabsList>
              <TabsTrigger value="id">Indonesia</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ar">العربية</TabsTrigger>
              <TabsTrigger value="jv">Jawa</TabsTrigger>
            </TabsList>
            <TabsContent value="id" keepMounted className="space-y-1.5">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea id="description" name="description" rows={4} defaultValue={item?.description ?? ""} />
            </TabsContent>
            <TabsContent value="en" keepMounted className="space-y-1.5">
              <Label htmlFor="description_en">Description (English)</Label>
              <Textarea id="description_en" name="description_en" rows={4} defaultValue={item?.description_en ?? ""} />
            </TabsContent>
            <TabsContent value="ar" keepMounted className="space-y-1.5">
              <Label htmlFor="description_ar">Description (Arab)</Label>
              <Textarea
                id="description_ar"
                name="description_ar"
                rows={4}
                dir="rtl"
                lang="ar"
                defaultValue={item?.description_ar ?? ""}
              />
            </TabsContent>
            <TabsContent value="jv" keepMounted className="space-y-1.5">
              <Label htmlFor="description_jv">Description (Jawa)</Label>
              <Textarea id="description_jv" name="description_jv" rows={4} defaultValue={item?.description_jv ?? ""} />
            </TabsContent>
          </Tabs>

          <div className="flex items-center gap-3">
            <Switch id="featured" name="featured" defaultChecked={item?.featured} />
            <Label htmlFor="featured" className="cursor-pointer">
              Tampilkan sebagai unggulan (card lebih lebar)
            </Label>
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
