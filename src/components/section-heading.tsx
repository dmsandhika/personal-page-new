"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

// Judul section besar: nomor mono + judul yang naik dari balik mask + garis
// yang "tergambar" saat masuk viewport.
export function SectionHeading({
  children,
  number,
  align = "left",
  className,
}: {
  children: React.ReactNode;
  number?: string;
  align?: "left" | "center";
  className?: string;
}) {
  const center = align === "center";
  return (
    <div
      className={cn(
        "mb-14 flex flex-col gap-4",
        center ? "items-center text-center" : "items-start",
        className
      )}
    >
      {number && (
        <span className="font-mono text-xs tracking-[0.3em] text-primary">
          {number} <span className="text-muted-foreground">/ 05</span>
        </span>
      )}
      <div className="overflow-hidden pb-2">
        <motion.h2
          initial={{ y: "110%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease }}
          className="font-display text-5xl leading-none font-bold tracking-tighter sm:text-7xl"
        >
          {children}
        </motion.h2>
      </div>
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2, ease }}
        className={cn(
          "h-px w-full bg-linear-to-r from-primary via-border to-transparent",
          center ? "max-w-xs origin-center" : "origin-left rtl:origin-right"
        )}
      />
    </div>
  );
}
