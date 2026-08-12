"use client";

import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleSwitcher } from "@/components/locale-switcher";

export function PageControls() {
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-1.5 rounded-full border border-border bg-background/80 p-1 shadow-sm backdrop-blur-sm">
      <Link
        href="/lab"
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 rounded-full transition-all shadow-sm"
        title="Dimas Lab — Playground & Experiments"
      >
        <FlaskConical className="w-3.5 h-3.5" />
        <span className="font-semibold tracking-wider">LAB</span>
      </Link>
      <div className="w-px h-4 bg-border/60 mx-0.5" />
      <LocaleSwitcher />
      <ThemeToggle />
    </div>
  );
}
