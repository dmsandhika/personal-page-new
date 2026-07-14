"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { ArrowDown } from "lucide-react";
import type { Profile } from "@/lib/types";
import { useLocale } from "@/lib/i18n/locale-context";
import { pickLocalized } from "@/lib/i18n/dictionaries";
import Lanyard from "@/components/three/lanyard";

export function Hero({ profile }: { profile: Profile }) {
  const { locale, t } = useLocale();
  const { resolvedTheme } = useTheme();
  const title = pickLocalized(locale, profile.title, profile.title_en);
  const bandColor = resolvedTheme === "dark" ? "#ffffff" : "#111111";

  return (
    <section className="flex min-h-[90vh] flex-col items-center justify-center gap-8 px-6 py-16 lg:flex-row lg:justify-center lg:gap-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left"
      >
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

      <motion.div
        className="h-95 w-full max-w-xl sm:h-115 lg:h-140 lg:max-w-2xl lg:flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Lanyard
          position={[0, 0, 20]}
          gravity={[0, -40, 0]}
          frontImage={profile.avatar_url}
          backImage={profile.card_back_url}
          imageFit="cover"
          bandColor={bandColor}
        />
      </motion.div>
    </section>
  );
}
