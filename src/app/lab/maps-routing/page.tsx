"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, Sparkles, Code2, Database, ShieldCheck, Layers, CheckCircle2, Route } from "lucide-react";
import { MapsInterface } from "@/components/lab/maps-interface";
import { SiteLogo } from "@/components/site-logo";
import { PageControls } from "@/components/page-controls";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/section-heading";
import { useLocale } from "@/lib/i18n/locale-context";

export default function MapsRoutingPage() {
  const { t } = useLocale();

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
          <SectionHeading number="EXP-04">MAPS & INTERACTIVE ROUTING</SectionHeading>

          <div className="flex flex-wrap items-center gap-3">
            <div className="size-11 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              <MapPin className="size-6" />
            </div>
            <div>
              <span className="text-[0.65rem] font-mono font-semibold px-2.5 py-1 rounded-full uppercase border border-primary/40 bg-primary/10 text-primary">
                ● EXPERIMENT 04 — LIVE
              </span>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-2">
                Maps & Interactive Routing
              </h1>
            </div>
          </div>

          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-3xl">
            Perencana rute interaktif menggunakan **Leaflet**, **OpenStreetMap**, dan **OSRM API** untuk menghitung estimasi jarak, durasi perjalanan, serta menyimpan rute favorit ke Supabase.
          </p>

          <div className="flex flex-wrap gap-2 pt-2 font-mono text-xs">
            <span className="px-3 py-1 rounded-md border border-border bg-muted/40 text-foreground flex items-center gap-1.5 uppercase tracking-wider text-[0.65rem]">
              <MapPin className="size-3 text-primary" /> Leaflet & OSM
            </span>
            <span className="px-3 py-1 rounded-md border border-border bg-muted/40 text-foreground flex items-center gap-1.5 uppercase tracking-wider text-[0.65rem]">
              <Route className="size-3 text-primary" /> OSRM Driving API
            </span>
            <span className="px-3 py-1 rounded-md border border-border bg-muted/40 text-foreground flex items-center gap-1.5 uppercase tracking-wider text-[0.65rem]">
              <Database className="size-3 text-primary" /> Supabase Saved Routes
            </span>
          </div>
        </FadeIn>

        {/* SECTION 1: Live Interactive Demo */}
        <FadeIn className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              {t("lab.liveDemo")}
            </h2>
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Coba perhitungan rute jalan</span>
          </div>

          <MapsInterface />
        </FadeIn>

        {/* SECTION 2: Technical Breakdown & Architecture */}
        <FadeIn className="space-y-8 pt-8 border-t border-border">
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2.5">
              <Layers className="size-6 text-primary" />
              {t("lab.techOverview")}
            </h2>
            <p className="text-muted-foreground text-sm">
              Dokumentasi arsitektur dan aspek teknis pemetaan interaktif di Next.js App Router.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Problem */}
            <div className="p-6 rounded-xl bg-card text-card-foreground border border-border space-y-3">
              <div className="font-mono text-xs text-primary uppercase tracking-wider font-semibold">{t("lab.problem")}</div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                Integrasi Peta Interaktif Bebas Berbayar Tanpa Dependensi Proprietary API Key
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Membuat sistem rute lokasi tanpa ketergantungan Google Maps API yang berbayar dan memerlukan verifikasi billing khusus.
              </p>
            </div>

            {/* Solution */}
            <div className="p-6 rounded-xl bg-card text-card-foreground border border-border space-y-3">
              <div className="font-mono text-xs text-primary uppercase tracking-wider font-semibold">{t("lab.solution")}</div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                Kombinasi Leaflet, OpenStreetMap, OSRM API & Geocoding
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Memanfaatkan ekosistem OpenStreetMap (OSM) dan Open Source Routing Machine (OSRM) untuk kalkulasi geometri polyline dan geocoding lokasi secara instan dan bebas biaya.
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
              <pre>{`User / Visitor Input Location (Origin / Destination)
  │
  ├── 1. Geocoding via Nominatim OpenStreetMap API -> Get Lat/Lng
  │
  ▼
[ Next.js API Route /api/routing ]
  │
  ├── 2. Query OSRM Public Routing API (Driving Profile)
  │      https://router.project-osrm.org/route/v1/driving/...
  │
  ▼
[ OSRM API Response ] (Distance in Meters, Duration in Seconds, GeoJSON Geometry)
  │
  ├── 3. Convert GeoJSON [Lng, Lat] to Leaflet [Lat, Lng] Polyline
  ├── 4. (Optional) Save Route Details to Supabase (lab_saved_routes)
  │
  ▼
[ Client-side React Leaflet Container ]
  │
  └── Render Custom SVG Markers (A & B) + Auto-fit Map Bounds Polyline Line`}</pre>
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
                  <strong className="text-foreground">Next.js SSR Safety:</strong> Library Leaflet mengakses objek <code className="bg-muted px-1 py-0.5 rounded font-mono text-xs">window</code> yang tidak ada saat server-side rendering. Komponen peta diimpor secara dinamis dengan <code className="bg-muted px-1 py-0.5 rounded font-mono text-xs">{"dynamic(..., { ssr: false })"}</code> untuk mencegah hydration crash.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong className="text-foreground">Dynamic Map Bounds:</strong> Menggunakan hook custom `useMap()` di Leaflet untuk menghitung pembatas koordinat (bounds) secara otomatis dan langsung memfokuskan tampilan kamera peta ke rute terpilih.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong className="text-foreground">Custom SVG Marker Assets:</strong> Menghindari kendala file marker PNG bawaan Leaflet yang sering terputus di Next.js dengan membuat icon berbasis `L.divIcon` bercorak SVG modern.
                </span>
              </li>
            </ul>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
