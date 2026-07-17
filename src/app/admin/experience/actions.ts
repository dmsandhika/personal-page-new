"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";

function experienceFromForm(formData: FormData) {
  return {
    role: String(formData.get("role") ?? ""),
    role_en: String(formData.get("role_en") ?? "") || null,
    role_ar: String(formData.get("role_ar") ?? "") || null,
    role_jv: String(formData.get("role_jv") ?? "") || null,
    company: String(formData.get("company") ?? ""),
    location: String(formData.get("location") ?? "") || null,
    start_date: String(formData.get("start_date") ?? ""),
    end_date: String(formData.get("end_date") ?? "") || null,
    description: String(formData.get("description") ?? "") || null,
    description_en: String(formData.get("description_en") ?? "") || null,
    description_ar: String(formData.get("description_ar") ?? "") || null,
    description_jv: String(formData.get("description_jv") ?? "") || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
  };
}

export async function createExperience(formData: FormData) {
  const { error } = await supabaseAdmin
    .from("experience")
    .insert(experienceFromForm(formData));

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/experience");
  return { success: true };
}

export async function updateExperience(formData: FormData) {
  const id = String(formData.get("id"));
  const { error } = await supabaseAdmin
    .from("experience")
    .update(experienceFromForm(formData))
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/experience");
  return { success: true };
}

export async function deleteExperience(id: string) {
  const { error } = await supabaseAdmin.from("experience").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/experience");
  return { success: true };
}
