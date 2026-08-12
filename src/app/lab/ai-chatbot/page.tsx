"use client";

import Link from "next/link";
import { ArrowLeft, Bot, Sparkles, Code2, Database, ShieldCheck, Cpu, Layers, CheckCircle2 } from "lucide-react";
import { ChatInterface } from "@/components/lab/chat-interface";
import { SiteLogo } from "@/components/site-logo";
import { PageControls } from "@/components/page-controls";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { useLocale } from "@/lib/i18n/locale-context";

const CONTENT = {
  headerDesc: {
    id: "Integrasi langsung antara Next.js App Router, Google Gemini API, dan Supabase Database untuk menyediakan asisten interaktif yang dapat menjawab pertanyaan teknis seputar portfolio secara real-time.",
    en: "Direct integration between Next.js App Router, Google Gemini API, and Supabase Database to provide an interactive assistant answering technical & portfolio inquiries in real-time.",
    ar: "تكامل مباشر بين Next.js App Router و Google Gemini API و Supabase توفير مساعد تفاعلي يجيب على الاستفسارات التقنية وحافظة الأعمال مباشرة.",
    jv: "Integrasi langsung ing antarane Next.js App Router, Google Gemini API, lan Supabase Database kanggo nyedhiyakake asisten interaktif sing njawab pitakon teknis seputar portofolio secara real-time.",
  },
  problemTitle: {
    id: "Kebutuhan Pengunjung Mengetahui Profil Teknis Secara Cepat",
    en: "Visitors Need Fast Access to Technical Profiles",
    ar: "حاجة الزوار لمعرفة الملف التقني بسرعة",
    jv: "Kebutuhan Pengunjung Kanggo Weruh Profil Teknis Kanthi Cepat",
  },
  problemDesc: {
    id: "Pengunjung portfolio seringkali harus membaca banyak halaman untuk mengetahui keahlian teknis, riwayat teknologi yang dikuasai, atau detail eksperimen yang pernah dikerjakan.",
    en: "Portfolio visitors often need to navigate multiple pages to understand technical skills, tech stack history, or experimental project details.",
    ar: "غالبًا ما يتوجب على زوار حافظة الأعمال قراءة العديد من الصفحات لمعرفة المهارات التقنية والتفاصيل الفنية.",
    jv: "Pengunjung portofolio asring kudu moco akeh kaca kanggo ngerti keahlian teknis, histori teknologi, utawa rincian eksperimen.",
  },
  solutionTitle: {
    id: "Conversational AI Agent Berbasis System Prompt Context",
    en: "Conversational AI Agent Powered by System Prompt Context",
    ar: "وكيل ذكاء اصطناعي محادثي مدعوم بسياق النظام",
    jv: "Agen AI Konversasional adhedhasar System Prompt Context",
  },
  solutionDesc: {
    id: "Membangun AI Chatbot cerdas yang dibekali context profil Dimas Sandhika. Pengunjung dapat bertanya secara bebas dan mendapatkan jawaban spesifik berformat Markdown dalam hitungan detik.",
    en: "Building a smart AI Chatbot equipped with Dimas Sandhika's profile context. Visitors can ask freely and receive structured Markdown responses in seconds.",
    ar: "بناء روبوت محادثة محدد بسياق ملف Dimas Sandhika. يمكن للزوار السؤال بحرية والحصول على إجابات منسقة في ثوانٍ.",
    jv: "Nggawe AI Chatbot pinter sing dilengkapi konteks profil Dimas Sandhika. Pengunjung iso takon kanthi bebas lan entuk wangsulan Markdown ing itungan detik.",
  },
  challenge1: {
    id: "Keamanan Credentials: Gemini API Key tersimpan aman di server-side (.env.local & Vercel Env), tidak pernah di-expose ke client.",
    en: "Credentials Security: Gemini API Key is safely stored on the server-side (.env.local & Vercel Env), never exposed to the client.",
    ar: "أمان الاعتمادات: يتم حفظ مفتاح API بشكل آمن في جانب الخادم ولا يتم كشفه للعميل.",
    jv: "Keamanan Credentials: Gemini API Key disimpen aman ing server-side (.env.local & Vercel Env), ora tau di-expose menyang client.",
  },
  challenge2: {
    id: "Graceful Fallback: Jika database Supabase belum di-migrate, percakapan tetap berjalan normal via local session tanpa membuat aplikasi crash.",
    en: "Graceful Fallback: If Supabase tables are not migrated yet, chat conversations operate seamlessly via local session without crashing.",
    ar: "التراجع السلس: إذا لم يتم ترحيل قاعدة البيانات بعد، تعمل المحادثات بشكل طبيعي عبر الجلسة المحلية.",
    jv: "Graceful Fallback: Yen database Supabase durung di-migrate, obrolan tetep mlaku normal liwat local session tanpa gawe aplikasi crash.",
  },
  challenge3: {
    id: "Handling Missing API Key: UI menampilkan peringatan informatif yang ramah ketika API Key belum dipasang.",
    en: "Handling Missing API Key: The UI gracefully displays an informative alert when the API Key is missing.",
    ar: "معالجة عدم وجود المفتاح: تعرض الواجهة تنبيهًا معلوماتيًا عند عدم تثبيت مفتاح API.",
    jv: "Handling Missing API Key: Tampilan UI nuduhake pengetan sing ramah yen API Key durung dipasang.",
  },
};

export default function AIChatbotPage() {
  const { locale, t } = useLocale();

  return (
    <main className="relative min-h-screen bg-background text-foreground py-20 px-6 sm:px-10">
      <SiteLogo />
      <PageControls />

      <div className="mx-auto max-w-5xl space-y-12">
        {/* Navigation back */}
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
          <SectionHeading number="01">AI CHATBOT</SectionHeading>

          <div className="flex flex-wrap items-center gap-3">
            <div className="size-11 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              <Bot className="size-6" />
            </div>
            <div>
              <span className="text-[0.65rem] font-mono font-semibold px-2.5 py-1 rounded-full uppercase border border-primary/40 bg-primary/10 text-primary">
                ● EXPERIMENT 01 — LIVE
              </span>
              <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-foreground mt-2">
                AI Chatbot
              </h1>
            </div>
          </div>

          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-3xl">
            {CONTENT.headerDesc[locale] || CONTENT.headerDesc.id}
          </p>

          <div className="flex flex-wrap gap-2 pt-2 font-mono text-xs">
            <span className="px-3 py-1 rounded-md border border-border bg-muted/40 text-foreground flex items-center gap-1.5 uppercase tracking-wider text-[0.65rem]">
              <Cpu className="size-3 text-primary" /> Gemini Flash
            </span>
            <span className="px-3 py-1 rounded-md border border-border bg-muted/40 text-foreground flex items-center gap-1.5 uppercase tracking-wider text-[0.65rem]">
              <Code2 className="size-3 text-primary" /> Next.js Route Handler
            </span>
            <span className="px-3 py-1 rounded-md border border-border bg-muted/40 text-foreground flex items-center gap-1.5 uppercase tracking-wider text-[0.65rem]">
              <Database className="size-3 text-primary" /> Supabase Postgres
            </span>
          </div>
        </FadeIn>

        {/* SECTION 1: Interactive Live Demo */}
        <FadeIn className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              {t("lab.liveDemo")}
            </h2>
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
              {locale === "en"
                ? "Test live AI Assistant"
                : locale === "ar"
                ? "اختبار المساعد المباشر"
                : locale === "jv"
                ? "Uji coba asisten AI"
                : "Uji coba langsung AI Assistant"}
            </span>
          </div>

          <ChatInterface />
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
                ? "System architecture documentation and technical challenges behind this experiment."
                : locale === "ar"
                ? "توثيق معمارية النظام والتحديات الفنية."
                : locale === "jv"
                ? "Dokumentasi arsitektur sistem lan tantangan teknis."
                : "Dokumentasi arsitektur dan aspek teknis dibalik pembuatan eksperimen ini."}
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
              <pre>{`User / Visitor
  │
  ▼
[ Next.js React UI ] ─── (State: Messages, Input, Loading)
  │
  ▼  POST /api/chat
[ Serverless Route Handler ]
  │
  ├─── 1. Inject System Prompt (Dimas Context)
  ├─── 2. Format Chat History (roles: 'user' | 'model')
  │
  ▼
[ Google Gemini API ] (Gemini Flash)
  │
  ▼  Return Structured Answer (Markdown)
[ Serverless Route Handler ]
  │
  ├─── (Async) Persist to Supabase: lab_conversations & lab_messages
  │
  ▼
[ Next.js React UI ] ─── Render Answer with Markdown & Copy Option`}</pre>
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
