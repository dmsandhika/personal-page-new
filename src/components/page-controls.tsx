"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleSwitcher } from "@/components/locale-switcher";

export function PageControls() {
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-1 rounded-full border bg-background/80 p-1 shadow-sm backdrop-blur-sm">
      <LocaleSwitcher />
      <ThemeToggle />
    </div>
  );
}
