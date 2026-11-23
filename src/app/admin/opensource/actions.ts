"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";

const KINDS = ["library", "tool", "app", "image"];

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

// "https://github.com/owner/name(.git)" atau "owner/name" -> "owner/name"
function normalizeRepo(value: string) {
  return value
    .replace(/^https?:\/\/github\.com\//i, "")
    .replace(/\.git$/i, "")
    .replace(/\/+$/, "");
}

function itemFromForm(formData: FormData) {
  const kind = str(formData, "kind");
  return {
    name: str(formData, "name"),
    repo: normalizeRepo(str(formData, "repo")) || null,
    kind: KINDS.includes(kind) ? kind : "library",
    npm_package: str(formData, "npm_package") || null,
    composer_package: str(formData, "composer_package") || null,
    docker_image: str(formData, "docker_image") || null,
    homepage_url: str(formData, "homepage_url") || null,
    description: str(formData, "description"),
    description_en: str(formData, "description_en") || null,
    description_ar: str(formData, "description_ar") || null,
    description_jv: str(formData, "description_jv") || null,
    featured: formData.get("featured") === "on",
  };
}

async function nextSortOrder() {
  const { data } = await supabaseAdmin
    .from("open_source")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.sort_order ?? -1) + 1;
}

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin/opensource");
}

export async function createOpenSource(formData: FormData) {
  const { error } = await supabaseAdmin
    .from("open_source")
    .insert({ ...itemFromForm(formData), sort_order: await nextSortOrder() });
  if (error) return { error: error.message };
  refresh();
  return { success: true };
}

export async function updateOpenSource(formData: FormData) {
  const id = String(formData.get("id"));
  const { error } = await supabaseAdmin
    .from("open_source")
    .update(itemFromForm(formData))
    .eq("id", id);
  if (error) return { error: error.message };
  refresh();
  return { success: true };
}

export async function deleteOpenSource(id: string) {
  const { error } = await supabaseAdmin.from("open_source").delete().eq("id", id);
  if (error) return { error: error.message };
  refresh();
  return { success: true };
}

export async function reorderOpenSource(orderedIds: string[]) {
  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabaseAdmin.from("open_source").update({ sort_order: index }).eq("id", id)
    )
  );
  const failed = results.find((result) => result.error);
  if (failed?.error) return { error: failed.error.message };
  refresh();
  return { success: true };
}
