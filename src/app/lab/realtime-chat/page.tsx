"use client";

import Link from "next/link";
import { ArrowLeft, MessageSquareText, Sparkles, Code2, Database, ShieldCheck, Layers, CheckCircle2, Zap } from "lucide-react";
import { RealtimeChatInterface } from "@/components/lab/realtime-chat-interface";
import { SiteLogo } from "@/components/site-logo";
import { PageControls } from "@/components/page-controls";
import { FadeIn } from "@/components/motion/fade-in";
import { useLocale } from "@/lib/i18n/locale-context";

const CONTENT = {
  headerDesc: {
    id: "Aplikasi percakapan realtime multi-room tanpa server WebSocket terpisah dengan memanfaatkan Supabase Realtime Channels (Broadcast & Presence).",
    en: "Realtime multi-room messaging application without custom WebSocket servers leveraging native Supabase Realtime Channels (Broadcast & Presence).",
    ar: "تطبيق محادثة فورية متعدد الغرف دون خوادم WebSocket منفصلة باستخدام قنوات Supabase Realtime.",
    jv: "Aplikasi obrolan realtime multi-room tanpa server WebSocket terpisah nganggo Supabase Realtime Channels.",
  },
  problemTitle: {
    id: "Kompleksitas Mengelola Server WebSocket Terpisah",
    en: "Complexity of Managing Separate WebSocket Servers",
    ar: "تعقيد إدارة خوادم WebSocket المنفصلة",
    jv: "Kompleksitas Ngatur Server WebSocket Terpisah",
  },
  problemDesc: {
    id: "Membuat aplikasi realtime biasanya membutuhkan server Node.js terpisah (Socket.io/VPS) yang mahal, berisiko memory leak, dan sulit di-deploy di infrastruktur serverless Vercel.",
    en: "Building realtime apps traditionally requires a separate Node.js server (Socket.io/VPS) which is expensive, prone to memory leaks, and hard to maintain on Vercel.",
    ar: "تتطلب التطبيقات التفاعلية عادةً خادماً منفصلاً مكلفاً وصعب الصيانة على البنية السحابية.",
    jv: "Nggawe aplikasi realtime biasane kudu nggunakake server Node.js terpisah sing larang lan angel di-deploy ing Vercel.",
  },
  solutionTitle: {
    id: "Arsitektur Native Supabase Realtime (Broadcast & Presence)",
    en: "Native Supabase Realtime Architecture (Broadcast & Presence)",
    ar: "معمارية Supabase Realtime الأصلية (البث والتواجد)",
    jv: "Arsitektur Native Supabase Realtime (Broadcast & Presence)",
  },
  solutionDesc: {
    id: "Menggunakan Supabase Realtime Engine berbasis WebSockets yang terkelola. Client langsung berlangganan ke room channel untuk berkirim pesan & status online secara instan.",
    en: "Using managed Supabase Realtime Engine over WebSockets. Clients subscribe directly to room channels for instant message broadcasting and online presence tracking.",
    ar: "استخدام محرك Supabase Realtime المدار. يشترك العميل مباشرة في القناة للبث المباشر والتواجد.",
    jv: "Nggunakake Supabase Realtime Engine berbasis WebSockets. Client langsung berlangganan menyang channel room kanggo broadcast pesen instan.",
  },
  challenge1: {
    id: "Client-side Channel Subscription: Mengelola lifecycle channel Supabase secara otomatis saat pengguna berpindah room atau menutup halaman.",
    en: "Client-side Channel Subscription: Managing Supabase channel lifecycle automatically when users switch rooms or navigate away.",
    ar: "اشتراك القناة: إدارة دورة حياة القناة تلقائيًا عند التنقل.",
    jv: "Client-side Channel Subscription: Ngatur lifecycle channel Supabase kanthi otomatis pas pangguna pindah room.",
  },
  challenge2: {
    id: "Online Presence Tracking: Melacak jumlah & status pengguna aktif secara realtime tanpa polling ke database.",
    en: "Online Presence Tracking: Tracking active users count and online status in real-time without database polling.",
    ar: "تتبع التواجد: تتبع عدد المستخدمين النشطين في الوقت الفعلي دون الاستعلام عن قاعدة البيانات.",
    jv: "Online Presence Tracking: Nglacak jumlah & status pangguna aktif secara realtime tanpa polling database.",
  },
  challenge3: {
    id: "Simulated Guest Fallback: Menyediakan mode auto-reply simulasi agar pengguna bisa langsung merasakan sensasi realtime saat mencobanya sendirian.",
    en: "Simulated Guest Fallback: Providing a simulated auto-reply mode so single users can immediately experience realtime chat interactions.",
    ar: "نموذج الضيف المحاكى: توفير وضع الرد الآلي لتجربة المحادثة المباشرة فرديًا.",
    jv: "Simulated Guest Fallback: Menyediakan mode auto-reply simulasi ben pangguna iso langsung ngrasakake percakapan realtime.",
  },
};

export default function RealtimeChatPage() {
  const { locale, t } = useLocale();

  return (
    <main className="relative min-h-screen bg-background text-foreground py-20 px-6 sm:px-10">
      <SiteLogo />
      <PageControls />

      <div className="mx-auto max-w-5xl space-y-12">
        {/* Navigation Back */}
        <FadeIn>
          <Link
            href="/lab"
            className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="size-4" />
            <span>{t("lab.backHub")}</span>
          </Link>
        </FadeIn>

        {/* Experiment Header */}
        <FadeIn className="space-y-4 border-b border-border pb-8">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
              <MessageSquareText className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-primary">EXP-05</span>
                <span className="text-[0.65rem] font-mono font-semibold px-2 py-0.5 rounded-full uppercase border border-primary/40 bg-primary/10 text-primary">
                  ● LIVE
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
                Realtime Multi-room Chat
              </h1>
            </div>
          </div>

          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-3xl">
            {CONTENT.headerDesc[locale] || CONTENT.headerDesc.id}
          </p>

          <div className="flex flex-wrap gap-2 pt-2 font-mono text-xs">
            <span className="px-3 py-1 rounded-md border border-border bg-muted/40 text-foreground flex items-center gap-1.5 uppercase tracking-wider text-[0.65rem]">
              <Zap className="size-3 text-primary" /> Supabase Broadcast
            </span>
            <span className="px-3 py-1 rounded-md border border-border bg-muted/40 text-foreground flex items-center gap-1.5 uppercase tracking-wider text-[0.65rem]">
              <Code2 className="size-3 text-primary" /> Presence & Typing State
            </span>
            <span className="px-3 py-1 rounded-md border border-border bg-muted/40 text-foreground flex items-center gap-1.5 uppercase tracking-wider text-[0.65rem]">
              <Database className="size-3 text-primary" /> Postgres Persistence
            </span>
          </div>
        </FadeIn>

        {/* SECTION 1: Live Interactive Demo */}
        <FadeIn className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              {t("lab.liveDemo")}
            </h2>
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
              {locale === "en"
                ? "Test realtime messaging"
                : locale === "ar"
                ? "اختبار المحادثة الفورية"
                : locale === "jv"
                ? "Uji coba obrolan realtime"
                : "Uji coba obrolan realtime"}
            </span>
          </div>

          <RealtimeChatInterface />
        </FadeIn>

        {/* SECTION 2: Technical Breakdown & Architecture */}
        <FadeIn className="space-y-8 pt-8 border-t border-border">
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2.5">
              <Layers className="size-6 text-primary" />
              {t("lab.techOverview")}
            </h2>
            <p className="text-muted-foreground text-sm">
              {locale === "en"
                ? "System architecture documentation and Supabase Realtime channels handling."
                : locale === "ar"
                ? "توثيق المعمارية وتفاصيل القنوات."
                : locale === "jv"
                ? "Dokumentasi arsitektur lan rincian channel Supabase."
                : "Dokumentasi arsitektur dan aspek teknis pengiriman pesan realtime di Next.js App Router."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Problem */}
            <div className="p-6 rounded-xl bg-card text-card-foreground border border-border space-y-3">
              <div className="font-mono text-xs text-primary uppercase tracking-wider font-semibold">{t("lab.problem")}</div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                {CONTENT.problemTitle[locale] || CONTENT.problemTitle.id}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {CONTENT.problemDesc[locale] || CONTENT.problemDesc.id}
              </p>
            </div>

            {/* Solution */}
            <div className="p-6 rounded-xl bg-card text-card-foreground border border-border space-y-3">
              <div className="font-mono text-xs text-primary uppercase tracking-wider font-semibold">{t("lab.solution")}</div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                {CONTENT.solutionTitle[locale] || CONTENT.solutionTitle.id}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {CONTENT.solutionDesc[locale] || CONTENT.solutionDesc.id}
              </p>
            </div>
          </div>

          {/* Architecture Diagram */}
          <div className="p-6 rounded-xl bg-card text-card-foreground border border-border space-y-4">
            <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
              <Code2 className="size-5 text-primary" />
              {t("lab.dataFlow")}
            </h3>

            <div className="bg-muted/60 p-6 rounded-lg border border-border font-mono text-xs text-foreground leading-relaxed overflow-x-auto">
              <pre>{`User A (Device 1 / Tab 1)                           User B (Device 2 / Tab 2 / Simulated Guest)
       │                                                                   │
       ▼                                                                   ▼
[ Next.js React UI ]                                             [ Next.js React UI ]
  │                                                                       │
  ├── 1. Join Room Channel (room:id)                                      ├── 1. Join Room Channel (room:id)
  ├── 2. Broadcast Presence State (Online)                                ├── 2. Broadcast Presence State (Online)
  │                                                                       │
  └────────────────────── Supabase Realtime Server ───────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │ Realtime Event Distribution │
                    │ - Instant Messages          │
                    │ - Typing Indicators         │
                    │ - Online Users Counter      │
                    └──────────────┬──────────────┘
                                   │
                   ┌───────────────┴───────────────┐
                   │  Supabase Postgres Database   │ (lab_chat_rooms & lab_realtime_messages)
                   └───────────────────────────────┘`}</pre>
            </div>
          </div>

          {/* Technical Challenges */}
          <div className="p-6 rounded-xl bg-card text-card-foreground border border-border space-y-4">
            <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              {t("lab.challenges")}
            </h3>

            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                <span>
                  {CONTENT.challenge1[locale] || CONTENT.challenge1.id}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                <span>
                  {CONTENT.challenge2[locale] || CONTENT.challenge2.id}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                <span>
                  {CONTENT.challenge3[locale] || CONTENT.challenge3.id}
                </span>
              </li>
            </ul>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
