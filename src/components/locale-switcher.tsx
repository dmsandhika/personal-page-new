"use client";

import { useLocale } from "@/lib/i18n/locale-context";
import { Button } from "@/components/ui/button";

export function LocaleSwitcher() {
  const { locale, setLocale, t } = useLocale();
  const next = locale === "id" ? "en" : "id";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t("locale.switchAria")}
      onClick={() => setLocale(next)}
      className="text-xs font-semibold uppercase"
    >
      {locale}
    </Button>
  );
}
