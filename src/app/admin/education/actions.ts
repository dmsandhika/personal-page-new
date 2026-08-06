"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";

function toMonthStart(value: string) {
  return /^\d{4}-\d{2}$/.test(value) ? `${value}-01` : value;
}

function educationFromForm(formData: FormData) {
  const endDate = String(formData.get("end_date") ?? "");
  return {
    institution: String(formData.get("institution") ?? ""),
    institution_en: String(formData.get("institution_en") ?? "") || null,
    institution_ar: String(formData.get("institution_ar") ?? "") || null,
    institution_jv: String(formData.get("institution_jv") ?? "") || null,
    institution_logo_url: String(formData.get("institution_logo_url") ?? "") || null,
    degree: String(formData.get("degree") ?? "S1") || "S1",
    gpa: String(formData.get("gpa") ?? "") || null,
    field_of_study: String(formData.get("field_of_study") ?? ""),
    field_of_study_en: String(formData.get("field_of_study_en") ?? "") || null,
    field_of_study_ar: String(formData.get("field_of_study_ar") ?? "") || null,
    field_of_study_jv: String(formData.get("field_of_study_jv") ?? "") || null,
    location: String(formData.get("location") ?? "") || null,
    location_en: String(formData.get("location_en") ?? "") || null,
    location_ar: String(formData.get("location_ar") ?? "") || null,
    location_jv: String(formData.get("location_jv") ?? "") || null,
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
    .from("education")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.sort_order ?? -1) + 1;
}

export async function createEducation(formData: FormData) {
  const { error } = await supabaseAdmin
    .from("education")
    .insert({ ...educationFromForm(formData), sort_order: await nextSortOrder() });

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/education");
  return { success: true };
}

export async function updateEducation(formData: FormData) {
  const id = String(formData.get("id"));
  const { error } = await supabaseAdmin
    .from("education")
    .update(educationFromForm(formData))
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/education");
  return { success: true };
}

export async function deleteEducation(id: string) {
  const { error } = await supabaseAdmin.from("education").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/education");
  return { success: true };
}

export async function reorderEducation(orderedIds: string[]) {
  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabaseAdmin.from("education").update({ sort_order: index }).eq("id", id)
    )
  );
  const failed = results.find((result) => result.error);
  if (failed?.error) return { error: failed.error.message };
  revalidatePath("/");
  revalidatePath("/admin/education");
  return { success: true };
}
