export type Locale = "id" | "en" | "ar" | "jv";

export const locales: Locale[] = ["id", "en", "ar", "jv"];

export const dictionaries = {
  id: {
    "section.about": "Tentang",
    "section.education": "Pendidikan",
    "section.experience": "Pengalaman",
    "section.projects": "Proyek",
    "section.contact": "Kontak",
    "hero.scrollAria": "Scroll ke bawah",
    "hero.basedIn": "Berbasis di",
    "hero.available": "Terbuka untuk kerja",
    "experience.present": "Sekarang",
    "experience.intern": "Magang",
    "experience.work": "Kerja",
    "experience.campus": "Program Kampus",
    "experience.freelance": "Freelance",
    "contact.subtitle": "Terbuka untuk peluang kerja sama atau sekadar ngobrol.",
    "contact.form.divider": "Atau kirim langsung lewat form ini",
    "contact.form.name": "Nama",
    "contact.form.email": "Email",
    "contact.form.category": "Kategori",
    "contact.form.category.feedback": "Masukan & Saran",
    "contact.form.category.collaboration": "Ajakan Kerja Sama",
    "contact.form.category.other": "Lainnya",
    "contact.form.message": "Pesan",
    "contact.form.messagePlaceholder": "Tulis masukan, saran, atau ajakan kerja sama kamu…",
    "contact.form.submit": "Kirim Pesan",
    "contact.form.submitting": "Mengirim…",
    "contact.form.success": "Pesan terkirim! Terima kasih 🙌",
    "contact.form.error": "Gagal mengirim pesan, coba lagi nanti.",
    "locale.switchAria": "Ganti bahasa",
  },
  en: {
    "section.about": "About",
    "section.education": "Education",
    "section.experience": "Experience",
    "section.projects": "Projects",
    "section.contact": "Contact",
    "hero.scrollAria": "Scroll down",
    "hero.basedIn": "Based in",
    "hero.available": "Available for work",
    "experience.present": "Present",
    "experience.intern": "Internship",
    "experience.work": "Work",
    "experience.campus": "Campus Program",
    "experience.freelance": "Freelance",
    "contact.subtitle": "Open to work opportunities or just a chat.",
    "contact.form.divider": "Or send it directly via this form",
    "contact.form.name": "Name",
    "contact.form.email": "Email",
    "contact.form.category": "Category",
    "contact.form.category.feedback": "Feedback & Suggestions",
    "contact.form.category.collaboration": "Collaboration",
    "contact.form.category.other": "Other",
    "contact.form.message": "Message",
    "contact.form.messagePlaceholder": "Share your feedback, suggestion, or collaboration idea…",
    "contact.form.submit": "Send Message",
    "contact.form.submitting": "Sending…",
    "contact.form.success": "Message sent! Thanks 🙌",
    "contact.form.error": "Failed to send, please try again later.",
    "locale.switchAria": "Switch language",
  },
  ar: {
    "section.about": "نبذة",
    "section.education": "التعليم",
    "section.experience": "الخبرة",
    "section.projects": "المشاريع",
    "section.contact": "تواصل",
    "hero.scrollAria": "مرّر لأسفل",
    "hero.basedIn": "مقيم في",
    "hero.available": "متاح للعمل",
    "experience.present": "حتى الآن",
    "experience.intern": "تدريب",
    "experience.work": "عمل",
    "experience.campus": "برنامج الحرم الجامعي",
    "experience.freelance": "عمل حر",
    "contact.subtitle": "منفتح لفرص العمل أو مجرد دردشة.",
    "contact.form.divider": "أو أرسل مباشرة عبر هذا النموذج",
    "contact.form.name": "الاسم",
    "contact.form.email": "البريد الإلكتروني",
    "contact.form.category": "التصنيف",
    "contact.form.category.feedback": "ملاحظات واقتراحات",
    "contact.form.category.collaboration": "طلب تعاون",
    "contact.form.category.other": "أخرى",
    "contact.form.message": "الرسالة",
    "contact.form.messagePlaceholder": "اكتب ملاحظاتك، اقتراحك، أو فكرة التعاون…",
    "contact.form.submit": "إرسال الرسالة",
    "contact.form.submitting": "جارٍ الإرسال…",
    "contact.form.success": "تم إرسال الرسالة! شكرًا 🙌",
    "contact.form.error": "فشل إرسال الرسالة، حاول مرة أخرى لاحقًا.",
    "locale.switchAria": "تغيير اللغة",
  },
  // Jawa ngoko (santai)
  jv: {
    "section.about": "Ngenani",
    "section.education": "Pendhidhikan",
    "section.experience": "Pengalaman",
    "section.projects": "Proyek",
    "section.contact": "Kontak",
    "hero.scrollAria": "Gulung mudhun",
    "hero.basedIn": "Manggon ing",
    "hero.available": "Siap kerja",
    "experience.present": "Saiki",
    "experience.intern": "Magang",
    "experience.work": "Kerja",
    "experience.campus": "Program Kampus",
    "experience.freelance": "Freelance",
    "contact.subtitle": "Iso diajak kerja bareng utawa mung arep ngobrol wae.",
    "contact.form.divider": "Utawa kirim langsung liwat formulir iki",
    "contact.form.name": "Jeneng",
    "contact.form.email": "Email",
    "contact.form.category": "Kategori",
    "contact.form.category.feedback": "Masukan & Usul",
    "contact.form.category.collaboration": "Ajakan Kerja Bareng",
    "contact.form.category.other": "Liyane",
    "contact.form.message": "Pesen",
    "contact.form.messagePlaceholder": "Tulis masukan, usul, utawa ajakan kerja bareng sampeyan…",
    "contact.form.submit": "Kirim Pesen",
    "contact.form.submitting": "Ngirim…",
    "contact.form.success": "Pesen wis kekirim! Matur nuwun 🙌",
    "contact.form.error": "Gagal ngirim pesen, coba maneh sesuk.",
    "locale.switchAria": "Ganti basa",
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type DictionaryKey = keyof (typeof dictionaries)["id"];

export function translate(locale: Locale, key: DictionaryKey) {
  return dictionaries[locale][key];
}

// Konten dengan hanya terjemahan Inggris (experience/projects). Selain "en",
// jatuh ke teks dasar (Indonesia).
export function pickLocalized(
  locale: Locale,
  base: string,
  translated: string | null | undefined
) {
  if (locale === "en" && translated) return translated;
  return base;
}

// Konten profil yang punya terjemahan tiap locale. Jatuh ke Indonesia (id)
// kalau terjemahan untuk locale terpilih kosong.
export function pickByLocale(
  locale: Locale,
  values: {
    id: string;
    en?: string | null;
    ar?: string | null;
    jv?: string | null;
  }
) {
  const value = values[locale];
  return value && value.trim() ? value : values.id;
}
