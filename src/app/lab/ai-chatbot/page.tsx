"use client";

import Link from "next/link";
import { ArrowLeft, Bot, Sparkles, Code2, Database, ShieldCheck, Cpu, Layers, CheckCircle2 } from "lucide-react";
import { ChatInterface } from "@/components/lab/chat-interface";
import { SiteLogo } from "@/components/site-logo";
import { PageControls } from "@/components/page-controls";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { useLocale } from "@/lib/i18n/locale-context";

export default function AIChatbotPage() {
  const { t } = useLocale();

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
          <SectionHeading number="EXP-01">AI CHATBOT ASSISTANT</SectionHeading>

          <div className="flex flex-wrap items-center gap-3">
            <div className="size-11 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              <Bot className="size-6" />
            </div>
            <div>
              <span className="text-[0.65rem] font-mono font-semibold px-2.5 py-1 rounded-full uppercase border border-primary/40 bg-primary/10 text-primary">
                ● EXPERIMENT 01 — LIVE
              </span>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-2">
                AI Chatbot Assistant
              </h1>
            </div>
          </div>

          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-3xl">
            Integrasi langsung antara Next.js App Router, Google Gemini API, dan Supabase Database untuk menyediakan asisten interaktif yang dapat menjawab pertanyaan teknis seputar portfolio secara real-time.
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
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              {t("lab.liveDemo")}
            </h2>
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Uji coba langsung AI Assistant</span>
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
              Dokumentasi arsitektur dan aspek teknis dibalik pembuatan eksperimen ini.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Problem */}
            <div className="p-6 rounded-xl bg-card text-card-foreground border border-border space-y-3">
              <div className="font-mono text-xs text-primary uppercase tracking-wider font-semibold">{t("lab.problem")}</div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                Kebutuhan Pengunjung Mengetahui Profil Teknis Secara Cepat
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Pengunjung portfolio seringkali harus membaca banyak halaman untuk mengetahui keahlian teknis, riwayat teknologi yang dikuasai, atau detail eksperimen yang pernah dikerjakan.
              </p>
            </div>

            {/* Solution */}
            <div className="p-6 rounded-xl bg-card text-card-foreground border border-border space-y-3">
              <div className="font-mono text-xs text-primary uppercase tracking-wider font-semibold">{t("lab.solution")}</div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                Conversational AI Agent Berbasis System Prompt Context
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Membangun AI Chatbot cerdas yang dibekali context profil Dimas Sandhika. Pengunjung dapat bertanya secara bebas dan mendapatkan jawaban spesifik berformat Markdown dalam hitungan detik.
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
                  <strong className="text-foreground">Keamanan Credentials:</strong> Gemini API Key tersimpan aman di server-side (`.env.local` & Vercel Env), tidak pernah di-expose ke client.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong className="text-foreground">Graceful Fallback:</strong> Jika database Supabase belum di-migrate, percakapan tetap berjalan normal via local session tanpa membuat aplikasi crash.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong className="text-foreground">Handling Missing API Key:</strong> UI menampilkan peringatan informatif yang ramah ketika API Key belum dipasang.
                </span>
              </li>
            </ul>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
