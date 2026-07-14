"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { updateProfile } from "./actions";
import { deleteImage, uploadImage } from "../upload-action";
import type { Profile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [isPending, startTransition] = useTransition();
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar_url ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? "");
  const avatarFileRef = useRef<HTMLInputElement>(null);
  const [backPreview, setBackPreview] = useState(profile.card_back_url ?? "");
  const [backUrl, setBackUrl] = useState(profile.card_back_url ?? "");
  const backFileRef = useRef<HTMLInputElement>(null);

  function handleRemoveAvatar() {
    setAvatarPreview("");
    setAvatarUrl("");
    if (avatarFileRef.current) avatarFileRef.current.value = "";
  }

  function handleRemoveBack() {
    setBackPreview("");
    setBackUrl("");
    if (backFileRef.current) backFileRef.current.value = "";
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
      const prevAvatar = profile.avatar_url ?? "";
      const prevBack = profile.card_back_url ?? "";

      const finalAvatar = await resolveImageUrl(formData.get("avatar_file"), avatarUrl);
      if (finalAvatar === undefined) return;
      const finalBack = await resolveImageUrl(formData.get("card_back_file"), backUrl);
      if (finalBack === undefined) return;

      formData.set("avatar_url", finalAvatar);
      formData.set("card_back_url", finalBack);

      const result = await updateProfile(formData);
      if (result?.error) {
        toast.error(result.error);
        return;
      }

      // Sync local state to what was just saved so a subsequent edit (e.g.
      // changing only the name) doesn't submit a stale/empty image URL.
      setAvatarUrl(finalAvatar);
      setAvatarPreview(finalAvatar);
      if (avatarFileRef.current) avatarFileRef.current.value = "";
      setBackUrl(finalBack);
      setBackPreview(finalBack);
      if (backFileRef.current) backFileRef.current.value = "";

      if (prevAvatar && prevAvatar !== finalAvatar) deleteImage(prevAvatar);
      if (prevBack && prevBack !== finalBack) deleteImage(prevBack);
      toast.success("Profile berhasil disimpan");
    });
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
          </Tabs>

          <div className="space-y-1.5">
            <Label htmlFor="avatar_file">Foto Profil</Label>
            {avatarPreview && (
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarPreview}
                  alt="Preview foto profil"
                  className="h-20 w-20 rounded-full object-cover"
                />
                <Button type="button" variant="outline" size="sm" onClick={handleRemoveAvatar}>
                  Hapus Foto
                </Button>
              </div>
            )}
            <input type="hidden" name="avatar_url" value={avatarUrl} readOnly />
            <Input
              ref={avatarFileRef}
              id="avatar_file"
              name="avatar_file"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setAvatarPreview(URL.createObjectURL(file));
              }}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="card_back_file">Foto Belakang Kartu Lanyard</Label>
            <p className="text-sm text-muted-foreground">
              Gambar di sisi belakang kartu 3D. Kosongkan untuk memakai warna kartu polos.
            </p>
            {backPreview && (
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={backPreview}
                  alt="Preview foto belakang kartu"
                  className="h-20 w-20 rounded-lg object-cover"
                />
                <Button type="button" variant="outline" size="sm" onClick={handleRemoveBack}>
                  Hapus Foto
                </Button>
              </div>
            )}
            <input type="hidden" name="card_back_url" value={backUrl} readOnly />
            <Input
              ref={backFileRef}
              id="card_back_file"
              name="card_back_file"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setBackPreview(URL.createObjectURL(file));
              }}
            />
          </div>
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
