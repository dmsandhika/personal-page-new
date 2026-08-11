"use server";

import { Resend } from "resend";
import { getProfile } from "@/lib/site";

const CATEGORY_LABELS = {
  feedback: "Masukan & Saran",
  collaboration: "Ajakan Kerja Sama",
  other: "Lainnya",
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendContactMessage(formData: FormData) {
  // Honeypot: field ini disembunyikan lewat CSS, hanya bot yang mengisinya.
  if (String(formData.get("company") ?? "")) {
    return { success: true };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { error: "Semua field wajib diisi." };
  }
  if (!EMAIL_RE.test(email)) {
    return { error: "Format email tidak valid." };
  }

  const profile = await getProfile();
  if (!profile?.email) {
    return { error: "Email tujuan belum diatur." };
  }
  if (!process.env.RESEND_API_KEY) {
    return { error: "Layanan email belum dikonfigurasi." };
  }

  const categoryLabel =
    CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] ?? CATEGORY_LABELS.other;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: `Formulir Kontak <${process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev"}>`,
    to: profile.email,
    replyTo: email,
    subject: `[${categoryLabel}] Pesan baru dari ${name}`,
    text: `Dari: ${name} <${email}>\nKategori: ${categoryLabel}\n\n${message}`,
  });

  if (error) {
    return { error: "Gagal mengirim pesan, coba lagi nanti." };
  }

  return { success: true };
}
