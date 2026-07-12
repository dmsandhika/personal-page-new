"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";

function experienceFromForm(formData: FormData) {
  return {
    role: String(formData.get("role") ?? ""),
    company: String(formData.get("company") ?? ""),
    location: String(formData.get("location") ?? "") || null,
    start_date: String(formData.get("start_date") ?? ""),
    end_date: String(formData.get("end_date") ?? "") || null,
    description: String(formData.get("description") ?? "") || null,
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
