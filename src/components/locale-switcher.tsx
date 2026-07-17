"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/locale-context";
import { locales, type Locale } from "@/lib/i18n/dictionaries";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SHORT: Record<Locale, string> = { id: "ID", en: "EN", ar: "ع", jv: "JW" };
const FULL: Record<Locale, string> = {
  id: "Indonesia",
  en: "English",
  ar: "العربية",
  jv: "Jawa",
};

export function LocaleSwitcher() {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        aria-label={t("locale.switchAria")}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="font-mono text-xs font-semibold uppercase"
      >
        {SHORT[locale]}
      </Button>

      {open && (
        <>
          {/* Klik di luar untuk menutup */}
          <button
            aria-hidden
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-e-0 z-50 mt-2 min-w-36 overflow-hidden rounded-lg border bg-popover p-1 shadow-md">
            {locales.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => {
                  setLocale(l);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-1.5 text-sm transition-colors hover:bg-muted",
                  l === locale ? "text-primary" : "text-foreground"
                )}
              >
                <span>{FULL[l]}</span>
                <span className="font-mono text-xs text-muted-foreground">{SHORT[l]}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
