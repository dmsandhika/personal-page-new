"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";

function toMonthStart(value: string) {
  return /^\d{4}-\d{2}$/.test(value) ? `${value}-01` : value;
}

function experienceFromForm(formData: FormData) {
  const endDate = String(formData.get("end_date") ?? "");
  return {
    role: String(formData.get("role") ?? ""),
    role_en: String(formData.get("role_en") ?? "") || null,
    role_ar: String(formData.get("role_ar") ?? "") || null,
    role_jv: String(formData.get("role_jv") ?? "") || null,
    employment_type: String(formData.get("employment_type") ?? "work") || "work",
    company: String(formData.get("company") ?? ""),
    location: String(formData.get("location") ?? "") || null,
    start_date: toMonthStart(String(formData.get("start_date") ?? "")),
    end_date: endDate ? toMonthStart(endDate) : null,
    description: String(formData.get("description") ?? "") || null,
    description_en: String(formData.get("description_en") ?? "") || null,
    description_ar: String(formData.get("description_ar") ?? "") || null,
    description_jv: String(formData.get("description_jv") ?? "") || null,
  };
}

async function nextSortOrder() {
  const { data } = await supabaseAdmin
    .from("experience")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.sort_order ?? -1) + 1;
}

export async function createExperience(formData: FormData) {
  const { error } = await supabaseAdmin
    .from("experience")
    .insert({ ...experienceFromForm(formData), sort_order: await nextSortOrder() });

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

export async function reorderExperience(orderedIds: string[]) {
  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabaseAdmin.from("experience").update({ sort_order: index }).eq("id", id)
    )
  );
  const failed = results.find((result) => result.error);
  if (failed?.error) return { error: failed.error.message };
  revalidatePath("/");
  revalidatePath("/admin/experience");
  return { success: true };
}
