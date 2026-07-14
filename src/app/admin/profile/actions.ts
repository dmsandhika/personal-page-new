"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function updateProfile(formData: FormData) {
  const id = String(formData.get("id"));

  const { error } = await supabaseAdmin
    .from("profile")
    .update({
      name: String(formData.get("name") ?? ""),
      title: String(formData.get("title") ?? ""),
      title_en: String(formData.get("title_en") ?? "") || null,
      bio: String(formData.get("bio") ?? ""),
      bio_en: String(formData.get("bio_en") ?? "") || null,
      email: String(formData.get("email") ?? ""),
      location: String(formData.get("location") ?? "") || null,
      avatar_url: String(formData.get("avatar_url") ?? "") || null,
      card_back_url: String(formData.get("card_back_url") ?? "") || null,
      github_url: String(formData.get("github_url") ?? "") || null,
      linkedin_url: String(formData.get("linkedin_url") ?? "") || null,
      twitter_url: String(formData.get("twitter_url") ?? "") || null,
      website_url: String(formData.get("website_url") ?? "") || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/profile");
  return { success: true };
}
