export type Locale = "id" | "en";

export const locales: Locale[] = ["id", "en"];

export const dictionaries = {
  id: {
    "section.about": "Tentang",
    "section.experience": "Pengalaman",
    "section.projects": "Proyek",
    "section.contact": "Kontak",
    "hero.scrollAria": "Scroll ke bawah",
    "experience.present": "Sekarang",
    "contact.subtitle": "Terbuka untuk peluang kerja sama atau sekadar ngobrol.",
    "locale.switchAria": "Ganti bahasa",
  },
  en: {
    "section.about": "About",
    "section.experience": "Experience",
    "section.projects": "Projects",
    "section.contact": "Contact",
    "hero.scrollAria": "Scroll down",
    "experience.present": "Present",
    "contact.subtitle": "Open to work opportunities or just a chat.",
    "locale.switchAria": "Switch language",
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type DictionaryKey = keyof (typeof dictionaries)["id"];

export function translate(locale: Locale, key: DictionaryKey) {
  return dictionaries[locale][key];
}

export function pickLocalized(
  locale: Locale,
  base: string,
  translated: string | null | undefined
) {
  if (locale === "en" && translated) return translated;
  return base;
}
