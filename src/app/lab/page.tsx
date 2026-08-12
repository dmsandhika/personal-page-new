import type { Metadata } from "next";
import Link from "next/link";
import { Bot, CreditCard, MapPin, MessageSquareText, ArrowRight, Sparkles, Terminal, Code2, Cpu } from "lucide-react";
import { SiteLogo } from "@/components/site-logo";
import { PageControls } from "@/components/page-controls";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Dimas Lab — Technical Playground & Experiments",
  description:
    "Eksplorasi teknologi, proof of concept, integrasi AI, payment gateway, realtime, dan arsitektur web modern oleh Dimas Sandhika.",
};

const EXPERIMENTS = [
  {
    id: "ai-chatbot",
    title: "AI Chatbot Assistant",
    description:
      "Mini AI assistant interaktif yang terintegrasi dengan Google Gemini API & Supabase untuk menjawab pertanyaan seputar keahlian teknis dan portfolio.",
    status: "LIVE",
    tags: ["Gemini AI", "Next.js Route Handler", "Supabase DB"],
    icon: Bot,
    href: "/lab/ai-chatbot",
  },
  {
    id: "payment-playground",
    title: "Payment Playground",
    description:
      "Simulasi transaction lifecycle pembayaran lengkap dengan integrasi Payment Gateway, Webhook verification, dan Idempotency log.",
    status: "PLANNED",
    tags: ["Xendit / BayarCash", "Webhooks", "Signature Verification"],
    icon: CreditCard,
    href: "#",
  },
  {
    id: "maps-routing",
    title: "Maps & Interactive Routing",
    description:
      "Interactive route planner dan pencari jalur alternatif menggunakan Leaflet, OpenStreetMap, dan OSRM API.",
    status: "LIVE",
    tags: ["Leaflet", "OpenStreetMap", "OSRM API"],
    icon: MapPin,
    href: "/lab/maps-routing",
  },
  {
    id: "realtime-chat",
    title: "Realtime Multi-room Chat",
    description:
      "Aplikasi percakapan realtime tanpa server WebSocket terpisah dengan memanfaatkan Supabase Realtime broadcast & presence.",
    status: "PLANNED",
    tags: ["Supabase Realtime", "Presence", "Postgres Listener"],
    icon: MessageSquareText,
    href: "#",
  },
];

export default function LabHubPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground py-20 px-6 sm:px-10">
      <SiteLogo />
      <PageControls />

      <div className="mx-auto max-w-5xl space-y-12">
        {/* Header Hero */}
        <FadeIn className="space-y-4 max-w-3xl">
          <SectionHeading number="LAB">DIMAS LAB</SectionHeading>

          <h1 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] font-bold tracking-tight text-foreground leading-[1.05]">
            Technical Playground & Experiments
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Halaman khusus tempat saya mengeksplorasi teknologi baru, menguji integrasi third-party API, sistem realtime, dan membagikan tantangan teknis serta solusinya.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-muted-foreground font-mono">
            <span className="flex items-center gap-2">
              <span className="text-primary font-bold">//</span> Next.js App Router
            </span>
            <span className="flex items-center gap-2">
              <span className="text-primary font-bold">//</span> Vercel Serverless
            </span>
            <span className="flex items-center gap-2">
              <span className="text-primary font-bold">//</span> Supabase Backend
            </span>
          </div>
        </FadeIn>

        {/* Experiment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {EXPERIMENTS.map((exp, i) => {
            const Icon = exp.icon;
            const isLive = exp.status === "LIVE";

            return (
              <FadeIn key={exp.id} delay={i * 0.08}>
                <div
                  className="group relative flex flex-col justify-between p-6 bg-card text-card-foreground border border-border hover:border-primary/50 rounded-xl transition-all duration-300 shadow-xs h-full"
                >
                  <div className="space-y-4">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex size-11 items-center justify-center rounded-lg border border-border bg-muted/60 text-foreground transition-colors group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary">
                        <Icon className="size-5" />
                      </div>
                      <span
                        className={`text-[0.65rem] font-mono tracking-wider font-semibold px-2.5 py-1 rounded-full uppercase border ${
                          isLive
                            ? "border-primary/40 bg-primary/10 text-primary"
                            : "border-border bg-muted/40 text-muted-foreground"
                        }`}
                      >
                        ● {exp.status}
                      </span>
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="font-display text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                        {exp.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-border/60 flex items-center justify-between">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {exp.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[0.65rem] font-mono px-2 py-0.5 rounded border border-border bg-muted/40 text-muted-foreground uppercase tracking-wider"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action */}
                    {isLive ? (
                      <Link
                        href={exp.href}
                        className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wider text-foreground hover:text-primary transition-all group-hover:translate-x-0.5"
                      >
                        <span>DEMO</span>
                        <ArrowRight className="size-3.5" />
                      </Link>
                    ) : (
                      <span className="font-mono text-[0.65rem] text-muted-foreground/60 uppercase tracking-widest">
                        UPCOMING
                      </span>
                    )}
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </main>
  );
}
