"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "@/lib/i18n/locale-context";
import type { DictionaryKey } from "@/lib/i18n/dictionaries";

const ITEMS: { id: string; key: DictionaryKey }[] = [
  { id: "about", key: "section.about" },
  { id: "education", key: "section.education" },
  { id: "experience", key: "section.experience" },
  { id: "projects", key: "section.projects" },
  { id: "contact", key: "section.contact" },
];

// Dock navigasi melayang di bawah: muncul setelah hero, menandai section aktif.
export function NavDock({ available }: { available: string[] }) {
  const { t } = useLocale();
  const [active, setActive] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const items = ITEMS.filter((i) => available.includes(i.id));

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [available.join(",")]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          aria-label={t("nav.aria")}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="fixed inset-x-0 bottom-5 z-50 mx-auto flex w-fit max-w-[calc(100vw-1.5rem)] items-center gap-0.5 overflow-x-auto rounded-full border border-border bg-background/70 p-1 shadow-2xl backdrop-blur-xl"
        >
          {items.map((i) => (
            <a
              key={i.id}
              href={`#${i.id}`}
              className="relative rounded-full px-3.5 py-2 font-mono text-[0.65rem] tracking-widest whitespace-nowrap uppercase transition-colors sm:px-4"
              style={{ color: active === i.id ? "var(--primary-foreground)" : undefined }}
            >
              {active === i.id && (
                <motion.span
                  layoutId="dock-pill"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{t(i.key)}</span>
            </a>
          ))}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
