"use server";

import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";

const BUCKET = "images";
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function uploadImage(formData: FormData) {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Tidak ada file yang dipilih" };
  }

  if (!file.type.startsWith("image/")) {
    return { error: "File harus berupa gambar" };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return { error: "Ukuran gambar maksimal 5MB" };
  }

  const ext = file.name.includes(".") ? file.name.split(".").pop() : undefined;
  const path = `${randomUUID()}${ext ? `.${ext}` : ""}`;

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type });

  if (error) {
    return { error: error.message };
  }

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}

export async function deleteImage(url: string) {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) {
    return { success: true };
  }

  const path = url.slice(index + marker.length);
  const { error } = await supabaseAdmin.storage.from(BUCKET).remove([path]);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
