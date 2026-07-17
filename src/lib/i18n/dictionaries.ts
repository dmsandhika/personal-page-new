export type Locale = "id" | "en" | "ar" | "jv";

export const locales: Locale[] = ["id", "en", "ar", "jv"];

export const dictionaries = {
  id: {
    "section.about": "Tentang",
    "section.experience": "Pengalaman",
    "section.projects": "Proyek",
    "section.contact": "Kontak",
    "hero.scrollAria": "Scroll ke bawah",
    "hero.basedIn": "Berbasis di",
    "hero.available": "Terbuka untuk kerja",
    "experience.present": "Sekarang",
    "experience.intern": "Magang",
    "experience.work": "Kerja",
    "contact.subtitle": "Terbuka untuk peluang kerja sama atau sekadar ngobrol.",
    "locale.switchAria": "Ganti bahasa",
  },
  en: {
    "section.about": "About",
    "section.experience": "Experience",
    "section.projects": "Projects",
    "section.contact": "Contact",
    "hero.scrollAria": "Scroll down",
    "hero.basedIn": "Based in",
    "hero.available": "Available for work",
    "experience.present": "Present",
    "experience.intern": "Internship",
    "experience.work": "Work",
    "contact.subtitle": "Open to work opportunities or just a chat.",
    "locale.switchAria": "Switch language",
  },
  ar: {
    "section.about": "نبذة",
    "section.experience": "الخبرة",
    "section.projects": "المشاريع",
    "section.contact": "تواصل",
    "hero.scrollAria": "مرّر لأسفل",
    "hero.basedIn": "مقيم في",
    "hero.available": "متاح للعمل",
    "experience.present": "حتى الآن",
    "experience.intern": "تدريب",
    "experience.work": "عمل",
    "contact.subtitle": "منفتح لفرص العمل أو مجرد دردشة.",
    "locale.switchAria": "تغيير اللغة",
  },
  // Jawa ngoko (santai)
  jv: {
    "section.about": "Ngenani",
    "section.experience": "Pengalaman",
    "section.projects": "Proyek",
    "section.contact": "Kontak",
    "hero.scrollAria": "Gulung mudhun",
    "hero.basedIn": "Manggon ing",
    "hero.available": "Siap kerja",
    "experience.present": "Saiki",
    "experience.intern": "Magang",
    "experience.work": "Kerja",
    "contact.subtitle": "Iso diajak kerja bareng utawa mung arep ngobrol wae.",
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
