"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateProfile } from "./actions";
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

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Profile berhasil disimpan");
      }
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

            <TabsContent value="id" className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">Jabatan / Tagline</Label>
                <Input id="title" name="title" defaultValue={profile.title} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" name="bio" rows={5} defaultValue={profile.bio} />
              </div>
            </TabsContent>

            <TabsContent value="en" className="space-y-4">
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
            <Label htmlFor="avatar_url">URL Foto Profil</Label>
            <Input
              id="avatar_url"
              name="avatar_url"
              defaultValue={profile.avatar_url ?? ""}
              placeholder="https://..."
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
