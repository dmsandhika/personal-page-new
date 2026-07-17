"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";

function projectFromForm(formData: FormData) {
  const tagsRaw = String(formData.get("tags") ?? "");
  return {
    title: String(formData.get("title") ?? ""),
    title_en: String(formData.get("title_en") ?? "") || null,
    title_ar: String(formData.get("title_ar") ?? "") || null,
    title_jv: String(formData.get("title_jv") ?? "") || null,
    description: String(formData.get("description") ?? ""),
    description_en: String(formData.get("description_en") ?? "") || null,
    description_ar: String(formData.get("description_ar") ?? "") || null,
    description_jv: String(formData.get("description_jv") ?? "") || null,
    image_url: String(formData.get("image_url") ?? "") || null,
    tags: tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    project_url: String(formData.get("project_url") ?? "") || null,
    repo_url: String(formData.get("repo_url") ?? "") || null,
    featured: formData.get("featured") === "on",
    sort_order: Number(formData.get("sort_order") ?? 0),
  };
}

export async function createProject(formData: FormData) {
  const { error } = await supabaseAdmin.from("projects").insert(projectFromForm(formData));
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function updateProject(formData: FormData) {
  const id = String(formData.get("id"));
  const { error } = await supabaseAdmin
    .from("projects")
    .update(projectFromForm(formData))
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function deleteProject(id: string) {
  const { error } = await supabaseAdmin.from("projects").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { success: true };
}
