import { cn } from "@/lib/utils";

// Judul section dark-tech: nomor mono + label grotesque tebal + garis hairline.
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
  if (align === "center") {
    return (
      <div className={cn("mb-10 flex flex-col items-center gap-3", className)}>
        {number && (
          <span className="font-mono text-xs tracking-[0.3em] text-primary">{number}</span>
        )}
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{children}</h2>
        <span className="h-px w-12 bg-primary/60" />
      </div>
    );
  }

  return (
    <div className={cn("mb-12 flex items-center gap-4", className)}>
      {number && (
        <span className="font-mono text-xs tracking-[0.3em] text-primary">{number}</span>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight whitespace-nowrap sm:text-4xl">
        {children}
      </h2>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
