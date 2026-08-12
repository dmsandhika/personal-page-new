"use client";

import Link from "next/link";
import { Bot, CreditCard, MapPin, MessageSquareText, ArrowRight } from "lucide-react";
import { SiteLogo } from "@/components/site-logo";
import { PageControls } from "@/components/page-controls";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { useLocale } from "@/lib/i18n/locale-context";

const EXPERIMENTS = [
  {
    id: "ai-chatbot",
    title: {
      id: "AI Chatbot Assistant",
      en: "AI Chatbot Assistant",
      ar: "مساعد روبوت المحادثة بالذكاء الاصطناعي",
      jv: "Asisten Chatbot AI",
    },
    description: {
      id: "Mini AI assistant interaktif yang terintegrasi dengan Google Gemini API & Supabase untuk menjawab pertanyaan seputar keahlian teknis dan portfolio.",
      en: "Interactive mini AI assistant integrated with Google Gemini API & Supabase to answer technical & portfolio inquiries.",
      ar: "مساعد ذكاء اصطناعي تفاعلي مصغر متكامل مع Gemini API و Supabase للإجابة على الاستفسارات التقنية.",
      jv: "Asisten AI interaktif sing terintegrasi karo Gemini API & Supabase kanggo mangsuli pitakon teknis lan portofolio.",
    },
    status: "LIVE",
    tags: ["Gemini AI", "Next.js Route Handler", "Supabase DB"],
    icon: Bot,
    href: "/lab/ai-chatbot",
  },
  {
    id: "payment-playground",
    title: {
      id: "Payment Playground",
      en: "Payment Playground",
      ar: "منصة تجربة الدفع الإلكتروني",
      jv: "Playground Pembayaran",
    },
    description: {
      id: "Simulasi transaction lifecycle pembayaran lengkap dengan integrasi Payment Gateway, Webhook verification, dan Idempotency log.",
      en: "Complete payment transaction lifecycle simulation with Payment Gateway integration, Webhook verification & Idempotency audit.",
      ar: "محاكاة كاملة لدورة حياة معاملات الدفع مع تكامل بوابات الدفع والتحقق من الويب هوك.",
      jv: "Simulasi alur transaksi pembayaran lengkap nganggo Payment Gateway, verifikasi Webhook, lan Log Idempotency.",
    },
    status: "PLANNED",
    tags: ["Xendit / BayarCash", "Webhooks", "Signature Verification"],
    icon: CreditCard,
    href: "#",
  },
  {
    id: "maps-routing",
    title: {
      id: "Maps & Interactive Routing",
      en: "Maps & Interactive Routing",
      ar: "الخرائط والتوجيه التفاعلي",
      jv: "Peta & Rute Interaktif",
    },
    description: {
      id: "Interactive route planner dan pencari jalur alternatif menggunakan Leaflet, OpenStreetMap, dan OSRM API.",
      en: "Interactive route planner and pathfinder utilizing Leaflet, OpenStreetMap, and OSRM API.",
      ar: "مخطط مسار تفاعلي ومحدد الطرق باستخدام Leaflet و OpenStreetMap و OSRM API.",
      jv: "Perencana rute lan panggolek dalan interaktif nganggo Leaflet, OpenStreetMap, lan OSRM API.",
    },
    status: "LIVE",
    tags: ["Leaflet", "OpenStreetMap", "OSRM API"],
    icon: MapPin,
    href: "/lab/maps-routing",
  },
  {
    id: "realtime-chat",
    title: {
      id: "Realtime Multi-room Chat",
      en: "Realtime Multi-room Chat",
      ar: "محادثة فورية متعددة الغرف",
      jv: "Chat Realtime Multi-room",
    },
    description: {
      id: "Aplikasi percakapan realtime tanpa server WebSocket terpisah dengan memanfaatkan Supabase Realtime broadcast & presence.",
      en: "Realtime messaging application without custom WebSocket servers leveraging Supabase Realtime broadcast & presence.",
      ar: "تطبيق محادثة فورية دون الحاجة لخادم خادمي خاص عن طريق الاستفادة من Supabase Realtime.",
      jv: "Aplikasi obrolan realtime tanpa server WebSocket terpisah nganggo Supabase Realtime.",
    },
    status: "PLANNED",
    tags: ["Supabase Realtime", "Presence", "Postgres Listener"],
    icon: MessageSquareText,
    href: "#",
  },
];

export default function LabHubPage() {
  const { locale, t } = useLocale();

  return (
    <main className="relative min-h-screen bg-background text-foreground py-20 px-6 sm:px-10">
      <SiteLogo />
      <PageControls />

      <div className="mx-auto max-w-5xl space-y-12">
        {/* Header Hero */}
        <FadeIn className="space-y-4 max-w-3xl">
          <SectionHeading number="LAB">{t("lab.title")}</SectionHeading>

          <h1 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] font-bold tracking-tight text-foreground leading-[1.05]">
            {t("lab.subtitle")}
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            {t("lab.intro")}
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
            const expTitle = exp.title[locale] || exp.title.id;
            const expDesc = exp.description[locale] || exp.description.id;

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
                        ● {isLive ? "LIVE" : t("lab.upcoming")}
                      </span>
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="font-display text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                        {expTitle}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {expDesc}
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
                        <span>{t("lab.openDemo")}</span>
                        <ArrowRight className="size-3.5" />
                      </Link>
                    ) : (
                      <span className="font-mono text-[0.65rem] text-muted-foreground/60 uppercase tracking-widest">
                        {t("lab.upcoming")}
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
