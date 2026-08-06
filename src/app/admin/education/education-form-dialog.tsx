"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createEducation, updateEducation } from "./actions";
import { deleteImage, uploadImage } from "../upload-action";
import { compressImage } from "@/lib/compress-image";
import type { Education } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const DEGREES = ["SMA/SMK", "D3", "D4", "S1", "S2", "S3"];

export function EducationFormDialog({
  education,
  trigger,
}: {
  education?: Education;
  trigger: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isEdit = Boolean(education);

  const [logoUrl, setLogoUrl] = useState(education?.institution_logo_url ?? "");
  const [logoPreview, setLogoPreview] = useState(education?.institution_logo_url ?? "");

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const logoFile = formData.get("institution_logo_file");
      let finalLogoUrl = logoUrl;

      if (logoFile instanceof File && logoFile.size > 0) {
        const compressed = await compressImage(logoFile);
        const uploadForm = new FormData();
        uploadForm.set("file", compressed);
        const result = await uploadImage(uploadForm);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        finalLogoUrl = result.url!;
      }
      formData.set("institution_logo_url", finalLogoUrl);

      const action = isEdit ? updateEducation : createEducation;
      const result = await action(formData);
      if (result?.error) {
        toast.error(result.error);
        return;
      }

      if (education?.institution_logo_url && education.institution_logo_url !== finalLogoUrl) {
        deleteImage(education.institution_logo_url);
      }
      setLogoUrl(finalLogoUrl);
      toast.success(isEdit ? "Pendidikan diperbarui" : "Pendidikan ditambahkan");
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Pendidikan" : "Tambah Pendidikan"}</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          {isEdit && <input type="hidden" name="id" value={education!.id} />}
          <input type="hidden" name="institution_logo_url" value={logoUrl} readOnly />

          <div className="space-y-1.5">
            <Label htmlFor="institution_logo_file">Logo Institusi</Label>
            {logoPreview && (
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoPreview}
                  alt="Preview logo"
                  className="size-16 rounded-lg border object-contain"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setLogoUrl("");
                    setLogoPreview("");
                  }}
                >
                  Hapus Logo
                </Button>
              </div>
            )}
            <Input
              id="institution_logo_file"
              name="institution_logo_file"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setLogoPreview(URL.createObjectURL(f));
              }}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="degree">Jenjang</Label>
              <Select name="degree" defaultValue={education?.degree ?? "S1"}>
                <SelectTrigger id="degree" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEGREES.map((degree) => (
                    <SelectItem key={degree} value={degree}>
                      {degree}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gpa">IPK (opsional)</Label>
              <Input id="gpa" name="gpa" placeholder="3.85/4.00" defaultValue={education?.gpa ?? ""} />
            </div>
          </div>

          <div className="flex justify-end">
            <TranslateButton sources={["institution", "field_of_study", "location", "description"]} />
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
                <Label htmlFor="institution">Institusi</Label>
                <Input id="institution" name="institution" defaultValue={education?.institution} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="field_of_study">Jurusan</Label>
                <Input
                  id="field_of_study"
                  name="field_of_study"
                  defaultValue={education?.field_of_study}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="location">Lokasi</Label>
                <Input id="location" name="location" defaultValue={education?.location ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea id="description" name="description" rows={4} defaultValue={education?.description ?? ""} />
              </div>
            </TabsContent>

            <TabsContent value="en" keepMounted className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="institution_en">Institution (English)</Label>
                <Input id="institution_en" name="institution_en" defaultValue={education?.institution_en ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="field_of_study_en">Field of Study (English)</Label>
                <Input
                  id="field_of_study_en"
                  name="field_of_study_en"
                  defaultValue={education?.field_of_study_en ?? ""}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="location_en">Location (English)</Label>
                <Input id="location_en" name="location_en" defaultValue={education?.location_en ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description_en">Description (English)</Label>
                <Textarea id="description_en" name="description_en" rows={4} defaultValue={education?.description_en ?? ""} />
              </div>
            </TabsContent>

            <TabsContent value="ar" keepMounted className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="institution_ar">Institusi (Arab)</Label>
                <Input
                  id="institution_ar"
                  name="institution_ar"
                  dir="rtl"
                  lang="ar"
                  defaultValue={education?.institution_ar ?? ""}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="field_of_study_ar">Jurusan (Arab)</Label>
                <Input
                  id="field_of_study_ar"
                  name="field_of_study_ar"
                  dir="rtl"
                  lang="ar"
                  defaultValue={education?.field_of_study_ar ?? ""}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="location_ar">Lokasi (Arab)</Label>
                <Input
                  id="location_ar"
                  name="location_ar"
                  dir="rtl"
                  lang="ar"
                  defaultValue={education?.location_ar ?? ""}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description_ar">Description (Arab)</Label>
                <Textarea
                  id="description_ar"
                  name="description_ar"
                  rows={4}
                  dir="rtl"
                  lang="ar"
                  defaultValue={education?.description_ar ?? ""}
                />
              </div>
            </TabsContent>

            <TabsContent value="jv" keepMounted className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="institution_jv">Institusi (Jawa)</Label>
                <Input id="institution_jv" name="institution_jv" defaultValue={education?.institution_jv ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="field_of_study_jv">Jurusan (Jawa)</Label>
                <Input
                  id="field_of_study_jv"
                  name="field_of_study_jv"
                  defaultValue={education?.field_of_study_jv ?? ""}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="location_jv">Lokasi (Jawa)</Label>
                <Input id="location_jv" name="location_jv" defaultValue={education?.location_jv ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description_jv">Description (Jawa)</Label>
                <Textarea id="description_jv" name="description_jv" rows={4} defaultValue={education?.description_jv ?? ""} />
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="start_date">Mulai</Label>
              <Input
                id="start_date"
                name="start_date"
                type="month"
                defaultValue={education?.start_date?.slice(0, 7)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="end_date">Selesai (kosongkan jika masih berjalan)</Label>
              <Input
                id="end_date"
                name="end_date"
                type="month"
                defaultValue={education?.end_date?.slice(0, 7) ?? ""}
              />
            </div>
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
