"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { updateProfile } from "./actions";
import { deleteImage, uploadImage } from "../upload-action";
import type { Profile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Semua field gambar yang dikelola form (foto hero per bahasa + belakang kartu).
type ImgKey =
  | "avatar_url"
  | "avatar_url_en"
  | "avatar_url_ar"
  | "avatar_url_jv"
  | "card_back_url";

const AVATAR_FIELDS: { key: ImgKey; file: string; label: string }[] = [
  { key: "avatar_url", file: "avatar_file", label: "Default (Indonesia)" },
  { key: "avatar_url_en", file: "avatar_en_file", label: "English" },
  { key: "avatar_url_ar", file: "avatar_ar_file", label: "العربية (Arab)" },
  { key: "avatar_url_jv", file: "avatar_jv_file", label: "Jawa" },
];

const ALL_IMG: { key: ImgKey; file: string }[] = [
  ...AVATAR_FIELDS.map(({ key, file }) => ({ key, file })),
  { key: "card_back_url", file: "card_back_file" },
];

export function ProfileForm({ profile }: { profile: Profile }) {
  const [isPending, startTransition] = useTransition();

  const initial: Record<ImgKey, string> = {
    avatar_url: profile.avatar_url ?? "",
    avatar_url_en: profile.avatar_url_en ?? "",
    avatar_url_ar: profile.avatar_url_ar ?? "",
    avatar_url_jv: profile.avatar_url_jv ?? "",
    card_back_url: profile.card_back_url ?? "",
  };
  const [urls, setUrls] = useState<Record<ImgKey, string>>(initial);
  const [previews, setPreviews] = useState<Record<ImgKey, string>>(initial);
  const fileRefs = useRef<Partial<Record<ImgKey, HTMLInputElement | null>>>({});

  function removeImage(key: ImgKey) {
    setUrls((u) => ({ ...u, [key]: "" }));
    setPreviews((p) => ({ ...p, [key]: "" }));
    const ref = fileRefs.current[key];
    if (ref) ref.value = "";
  }

  // Upload a pending file (if any) for one image field, returning the URL to
  // persist. Returns undefined on upload error (caller should abort).
  async function resolveImageUrl(
    fileInput: FormDataEntryValue | null,
    currentUrl: string
  ): Promise<string | undefined> {
    if (fileInput instanceof File && fileInput.size > 0) {
      const uploadForm = new FormData();
      uploadForm.set("file", fileInput);
      const result = await uploadImage(uploadForm);
      if (result.error) {
        toast.error(result.error);
        return undefined;
      }
      return result.url!;
    }
    return currentUrl;
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      // Upload semua gambar yang pending, isi URL final ke formData.
      const finals: Record<string, string> = {};
      for (const f of ALL_IMG) {
        const finalUrl = await resolveImageUrl(formData.get(f.file), urls[f.key]);
        if (finalUrl === undefined) return;
        formData.set(f.key, finalUrl);
        finals[f.key] = finalUrl;
      }

      const result = await updateProfile(formData);
      if (result?.error) {
        toast.error(result.error);
        return;
      }

      // Sinkronkan state lokal + bersihkan gambar lama yang tergantikan.
      setUrls(finals as Record<ImgKey, string>);
      setPreviews(finals as Record<ImgKey, string>);
      for (const f of ALL_IMG) {
        const ref = fileRefs.current[f.key];
        if (ref) ref.value = "";
        const prev = initial[f.key];
        if (prev && prev !== finals[f.key]) deleteImage(prev);
      }
      toast.success("Profile berhasil disimpan");
    });
  }

  // Field upload gambar tunggal. Fungsi render (bukan komponen) agar input
  // tidak remount / kehilangan state tiap render.
  function renderImageField({
    fieldKey,
    file,
    label,
    hint,
    round,
  }: {
    fieldKey: ImgKey;
    file: string;
    label: string;
    hint?: string;
    round?: boolean;
  }) {
    const preview = previews[fieldKey];
    return (
      <div key={fieldKey} className="space-y-1.5">
        <Label htmlFor={file}>{label}</Label>
        {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
        {preview && (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt={`Preview ${label}`}
              className={cn("h-20 w-20 object-cover", round ? "rounded-full" : "rounded-lg")}
            />
            <Button type="button" variant="outline" size="sm" onClick={() => removeImage(fieldKey)}>
              Hapus Foto
            </Button>
          </div>
        )}
        <input type="hidden" name={fieldKey} value={urls[fieldKey]} readOnly />
        <Input
          ref={(el) => {
            fileRefs.current[fieldKey] = el;
          }}
          id={file}
          name={file}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setPreviews((p) => ({ ...p, [fieldKey]: URL.createObjectURL(f) }));
          }}
        />
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <input type="hidden" name="id" value={profile.id} />

      <Card>
        <CardHeader>
          <CardTitle>Hero &amp; About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nama</Label>
            <Input id="name" name="name" defaultValue={profile.name} required />
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
                <Label htmlFor="title">Jabatan / Tagline</Label>
                <Input id="title" name="title" defaultValue={profile.title} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" name="bio" rows={5} defaultValue={profile.bio} />
              </div>
            </TabsContent>

            <TabsContent value="en" keepMounted className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title_en">Title / Tagline (English)</Label>
                <Input id="title_en" name="title_en" defaultValue={profile.title_en ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bio_en">Bio (English)</Label>
                <Textarea id="bio_en" name="bio_en" rows={5} defaultValue={profile.bio_en ?? ""} />
              </div>
            </TabsContent>

            <TabsContent value="ar" keepMounted className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title_ar">Jabatan / Tagline (Arab)</Label>
                <Input
                  id="title_ar"
                  name="title_ar"
                  dir="rtl"
                  lang="ar"
                  defaultValue={profile.title_ar ?? ""}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bio_ar">Bio (Arab)</Label>
                <Textarea
                  id="bio_ar"
                  name="bio_ar"
                  rows={5}
                  dir="rtl"
                  lang="ar"
                  defaultValue={profile.bio_ar ?? ""}
                />
              </div>
            </TabsContent>

            <TabsContent value="jv" keepMounted className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title_jv">Jabatan / Tagline (Jawa)</Label>
                <Input id="title_jv" name="title_jv" defaultValue={profile.title_jv ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bio_jv">Bio (Jawa)</Label>
                <Textarea id="bio_jv" name="bio_jv" rows={5} defaultValue={profile.bio_jv ?? ""} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Foto Hero per Bahasa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-sm text-muted-foreground">
            Foto berbeda untuk tiap bahasa. Kosongkan untuk memakai foto Default (Indonesia).
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {AVATAR_FIELDS.map((f) =>
              renderImageField({ fieldKey: f.key, file: f.file, label: f.label, round: true })
            )}
          </div>

          {renderImageField({
            fieldKey: "card_back_url",
            file: "card_back_file",
            label: "Foto Belakang Kartu (opsional)",
            hint: "Gambar tambahan opsional. Kosongkan bila tidak dipakai.",
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kontak &amp; Sosial Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={profile.email} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location">Lokasi</Label>
              <Input id="location" name="location" defaultValue={profile.location ?? ""} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input id="github_url" name="github_url" defaultValue={profile.github_url ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input id="linkedin_url" name="linkedin_url" defaultValue={profile.linkedin_url ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="twitter_url">Twitter / X URL</Label>
              <Input id="twitter_url" name="twitter_url" defaultValue={profile.twitter_url ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="website_url">Website URL</Label>
              <Input id="website_url" name="website_url" defaultValue={profile.website_url ?? ""} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Menyimpan..." : "Simpan Perubahan"}
      </Button>
    </form>
  );
}
