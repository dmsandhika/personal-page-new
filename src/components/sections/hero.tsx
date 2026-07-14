"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { ArrowDown } from "lucide-react";
import type { Profile } from "@/lib/types";
import { useLocale } from "@/lib/i18n/locale-context";
import { pickLocalized } from "@/lib/i18n/dictionaries";

// Code-split the heavy 3D lanyard (three.js + rapier) into its own chunk so it
// is only downloaded on desktop, where it actually renders. ssr:false + the
// isDesktop gate below mean it never loads during hydration or on mobile.
const Lanyard = dynamic(() => import("@/components/three/lanyard"), { ssr: false });

export function Hero({ profile }: { profile: Profile }) {
  const { locale, t } = useLocale();
  const { resolvedTheme } = useTheme();
  const title = pickLocalized(locale, profile.title, profile.title_en);
  const bandColor = resolvedTheme === "dark" ? "#ffffff" : "#111111";

  // Only mount the (heavy) 3D lanyard on desktop; mobile gets a lightweight
  // avatar image instead so the WebGL/physics bundle never loads there.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section className="flex min-h-[90vh] flex-col items-center justify-center px-6 py-16">
      <div className="relative flex w-full flex-col items-center gap-6 lg:max-w-6xl lg:min-h-140 lg:flex-row lg:justify-center lg:gap-8 lg:overflow-hidden lg:rounded-3xl lg:border lg:border-border lg:bg-muted/20 lg:p-10 lg:shadow-[inset_0_2px_28px_rgba(0,0,0,0.18)] dark:lg:shadow-[inset_0_2px_28px_rgba(0,0,0,0.55)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="order-last flex flex-col items-center gap-6 text-center lg:pointer-events-none lg:relative lg:z-10 lg:order-0 lg:flex-1 lg:items-start lg:text-left"
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
          className="pointer-events-auto mt-4 inline-flex size-10 items-center justify-center rounded-full border text-muted-foreground hover:border-primary hover:text-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          aria-label={t("hero.scrollAria")}
        >
          <ArrowDown className="size-4" />
        </motion.a>
      </motion.div>

      {isDesktop && (
        <motion.div
          className="lg:absolute lg:inset-0 lg:z-0"
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
            anchorX={5}
          />
        </motion.div>
      )}
      </div>
    </section>
  );
}
