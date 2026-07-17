"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createExperience, updateExperience } from "./actions";
import type { Experience } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TranslateButton } from "@/components/admin/translate-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ExperienceFormDialog({
  experience,
  trigger,
}: {
  experience?: Experience;
  trigger: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isEdit = Boolean(experience);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const action = isEdit ? updateExperience : createExperience;
      const result = await action(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(isEdit ? "Experience diperbarui" : "Experience ditambahkan");
        setOpen(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Experience" : "Tambah Experience"}</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          {isEdit && <input type="hidden" name="id" value={experience!.id} />}

          <div className="space-y-1.5">
            <Label htmlFor="company">Perusahaan</Label>
            <Input id="company" name="company" defaultValue={experience?.company} required />
          </div>

          <div className="flex justify-end">
            <TranslateButton sources={["role", "description"]} />
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
                <Label htmlFor="role">Role / Jabatan</Label>
                <Input id="role" name="role" defaultValue={experience?.role} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea id="description" name="description" rows={4} defaultValue={experience?.description ?? ""} />
              </div>
            </TabsContent>

            <TabsContent value="en" keepMounted className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="role_en">Role (English)</Label>
                <Input id="role_en" name="role_en" defaultValue={experience?.role_en ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description_en">Description (English)</Label>
                <Textarea id="description_en" name="description_en" rows={4} defaultValue={experience?.description_en ?? ""} />
              </div>
            </TabsContent>

            <TabsContent value="ar" keepMounted className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="role_ar">Role (Arab)</Label>
                <Input id="role_ar" name="role_ar" dir="rtl" lang="ar" defaultValue={experience?.role_ar ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description_ar">Description (Arab)</Label>
                <Textarea id="description_ar" name="description_ar" rows={4} dir="rtl" lang="ar" defaultValue={experience?.description_ar ?? ""} />
              </div>
            </TabsContent>

            <TabsContent value="jv" keepMounted className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="role_jv">Role (Jawa)</Label>
                <Input id="role_jv" name="role_jv" defaultValue={experience?.role_jv ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description_jv">Description (Jawa)</Label>
                <Textarea id="description_jv" name="description_jv" rows={4} defaultValue={experience?.description_jv ?? ""} />
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-1.5">
            <Label htmlFor="location">Lokasi</Label>
            <Input id="location" name="location" defaultValue={experience?.location ?? ""} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="start_date">Mulai</Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                defaultValue={experience?.start_date}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="end_date">Selesai (kosongkan jika masih berjalan)</Label>
              <Input id="end_date" name="end_date" type="date" defaultValue={experience?.end_date ?? ""} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sort_order">Urutan (angka lebih kecil tampil duluan)</Label>
            <Input
              id="sort_order"
              name="sort_order"
              type="number"
              defaultValue={experience?.sort_order ?? 0}
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
