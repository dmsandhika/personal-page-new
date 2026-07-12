"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import type { Profile } from "@/lib/types";
import { useLocale } from "@/lib/i18n/locale-context";
import { pickLocalized } from "@/lib/i18n/dictionaries";

export function Hero({ profile }: { profile: Profile }) {
  const { locale, t } = useLocale();
  const title = pickLocalized(locale, profile.title, profile.title_en);

  return (
    <section className="flex min-h-[90vh] flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        {profile.avatar_url && (
          <motion.img
            src={profile.avatar_url}
            alt={profile.name}
            className="size-28 rounded-full border object-cover shadow-sm"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
        )}

        <div className="space-y-3">
          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-6xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {profile.name}
          </motion.h1>
          <motion.p
            className="text-lg text-muted-foreground sm:text-xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {title}
          </motion.p>
        </div>

        <motion.a
          href="#about"
          className="mt-4 inline-flex size-10 items-center justify-center rounded-full border text-muted-foreground hover:border-primary hover:text-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          aria-label={t("hero.scrollAria")}
        >
          <ArrowDown className="size-4" />
        </motion.a>
      </motion.div>
    </section>
  );
}
