"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  MapPin,
  Navigation,
  Search,
  Route as RouteIcon,
  Clock,
  Bookmark,
  RefreshCw,
  AlertCircle,
  Check,
  Compass,
} from "lucide-react";

// Dynamically import Leaflet Map component without SSR to prevent window/document undefined hydration errors
const MapComponent = dynamic(() => import("@/components/lab/map-component"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[450px] w-full items-center justify-center rounded-xl border border-border bg-muted/40 font-mono text-xs text-muted-foreground">
      <RefreshCw className="mr-2 size-4 animate-spin text-primary" />
      <span>Memuat Peta Leaflet...</span>
    </div>
  ),
});

interface LocationPoint {
  lat: number;
  lng: number;
  name: string;
}

interface SavedRoute {
  id: string;
  title: string;
  origin_name: string;
  origin_lat: number;
  origin_lng: number;
  dest_name: string;
  dest_lat: number;
  dest_lng: number;
  distance_km: number;
  duration_min: number;
  created_at: string;
}

const PRESET_ROUTES = [
  {
    title: "Jakarta ➔ Bandung",
    origin: { lat: -6.1754, lng: 106.8272, name: "Monas, Jakarta" },
    dest: { lat: -6.9025, lng: 107.6188, name: "Gedung Sate, Bandung" },
  },
  {
    title: "Yogyakarta ➔ Prambanan",
    origin: { lat: -7.7926, lng: 110.3658, name: "Malioboro, Yogyakarta" },
    dest: { lat: -7.752, lng: 110.4914, name: "Candi Prambanan" },
  },
  {
    title: "Surabaya ➔ Malang",
    origin: { lat: -7.2575, lng: 112.7521, name: "Tugu Pahlawan, Surabaya" },
    dest: { lat: -7.9839, lng: 112.6214, name: "Alun-Alun Malang" },
  },
];

export function MapsInterface() {
  const [originQuery, setOriginQuery] = useState("Monas, Jakarta");
  const [destQuery, setDestQuery] = useState("Gedung Sate, Bandung");

  const [originPoint, setOriginPoint] = useState<LocationPoint | null>(PRESET_ROUTES[0].origin);
  const [destPoint, setDestPoint] = useState<LocationPoint | null>(PRESET_ROUTES[0].dest);

  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [durationMin, setDurationMin] = useState<number | null>(null);

  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);

  // Fetch saved routes from Supabase API
  const fetchSavedRoutes = async () => {
    setIsLoadingSaved(true);
    try {
      const res = await fetch("/api/routing");
      const data = await res.json();
      if (data.routes) {
        setSavedRoutes(data.routes);
      }
    } catch (err) {
      console.warn("Failed to fetch saved routes:", err);
    } finally {
      setIsLoadingSaved(false);
    }
  };

  useEffect(() => {
    fetchSavedRoutes();
  }, []);

  // Geocode location string using Nominatim OpenStreetMap API
  const geocodeLocation = async (query: string): Promise<LocationPoint | null> => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=1`;
      const res = await fetch(url, {
        headers: { "User-Agent": "DimasLab-Routing/1.0" },
      });
      const data = await res.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          name: data[0].display_name.split(",")[0] || query,
        };
      }
      return null;
    } catch (err) {
      console.warn("Geocoding error:", err);
      return null;
    }
  };

  // Calculate route between Origin & Destination
  const handleCalculateRoute = async (
    customOrigin?: LocationPoint,
    customDest?: LocationPoint,
    shouldSave = false
  ) => {
    setErrorNotice(null);
    setIsCalculating(true);
    setSavedSuccess(false);

    try {
      let orig = customOrigin || originPoint;
      let dest = customDest || destPoint;

      // Geocode if point is missing or user changed text
      if (!orig && originQuery) {
        orig = await geocodeLocation(originQuery);
        if (orig) setOriginPoint(orig);
      }
      if (!dest && destQuery) {
        dest = await geocodeLocation(destQuery);
        if (dest) setDestPoint(dest);
      }

      if (!orig || !dest) {
        setErrorNotice(
          "Lokasi titik asal atau tujuan tidak dapat ditemukan. Coba ketik lokasi yang lebih spesifik."
        );
        setIsCalculating(false);
        return;
      }

      const res = await fetch("/api/routing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: orig,
          destination: dest,
          save: shouldSave,
          title: `${orig.name} ➔ ${dest.name}`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorNotice(data.error || "Gagal menghitung rute.");
        setIsCalculating(false);
        return;
      }

      setDistanceKm(data.distanceKm);
      setDurationMin(data.durationMin);
      setRouteCoordinates(data.coordinates || []);

      if (shouldSave && data.savedItem) {
        setSavedSuccess(true);
        fetchSavedRoutes();
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
      setErrorNotice("Terjadi kesalahan jaringan saat menghitung rute.");
    } finally {
      setIsCalculating(false);
      setIsSaving(false);
    }
  };

  // Handle preset selection
  const handleSelectPreset = (preset: typeof PRESET_ROUTES[0]) => {
    setOriginQuery(preset.origin.name);
    setDestQuery(preset.dest.name);
    setOriginPoint(preset.origin);
    setDestPoint(preset.dest);
    handleCalculateRoute(preset.origin, preset.dest, false);
  };

  // Handle saved route reload
  const handleLoadSavedRoute = (saved: SavedRoute) => {
    const orig = { lat: saved.origin_lat, lng: saved.origin_lng, name: saved.origin_name };
    const dest = { lat: saved.dest_lat, lng: saved.dest_lng, name: saved.dest_name };
    setOriginQuery(saved.origin_name);
    setDestQuery(saved.dest_name);
    setOriginPoint(orig);
    setDestPoint(dest);
    handleCalculateRoute(orig, dest, false);
  };

  return (
    <div className="space-y-6">
      {/* Top Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-muted-foreground flex items-center gap-1.5 uppercase tracking-wider">
          <Compass className="size-3.5 text-primary" /> Rute Populer:
        </span>
        {PRESET_ROUTES.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectPreset(preset)}
            className="text-xs font-mono bg-muted/60 hover:bg-muted text-foreground px-3 py-1.5 rounded-lg border border-border transition-all"
          >
            {preset.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Controls & Metrics */}
        <div className="space-y-5 lg:col-span-1">
          {/* Inputs Card */}
          <div className="p-5 bg-card text-card-foreground border border-border rounded-xl shadow-xs space-y-4">
            <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2">
              <Navigation className="size-4 text-primary" />
              Perencanaan Rute
            </h3>

            {/* Origin Input */}
            <div className="space-y-1.5">
              <label className="font-mono text-[0.65rem] uppercase tracking-wider text-emerald-500 flex items-center gap-1 font-semibold">
                <MapPin className="size-3" /> Titik Asal (A)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={originQuery}
                  onChange={(e) => {
                    setOriginQuery(e.target.value);
                    setOriginPoint(null);
                  }}
                  placeholder="Ketik lokasi asal (mis. Monas Jakarta)..."
                  className="w-full bg-background border border-border focus:border-primary/50 rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none transition-all"
                />
              </div>
            </div>

            {/* Destination Input */}
            <div className="space-y-1.5">
              <label className="font-mono text-[0.65rem] uppercase tracking-wider text-cyan-500 flex items-center gap-1 font-semibold">
                <MapPin className="size-3" /> Titik Tujuan (B)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={destQuery}
                  onChange={(e) => {
                    setDestQuery(e.target.value);
                    setDestPoint(null);
                  }}
                  placeholder="Ketik lokasi tujuan (mis. Gedung Sate)..."
                  className="w-full bg-background border border-border focus:border-primary/50 rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none transition-all"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleCalculateRoute(undefined, undefined, false)}
                disabled={isCalculating}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 px-3 rounded-lg font-mono text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isCalculating ? (
                  <RefreshCw className="size-3.5 animate-spin" />
                ) : (
                  <Search className="size-3.5" />
                )}
                <span>Hitung Rute</span>
              </button>

              <button
                onClick={() => {
                  setIsSaving(true);
                  handleCalculateRoute(undefined, undefined, true);
                }}
                disabled={isCalculating || isSaving}
                className="bg-muted hover:bg-muted/80 text-foreground border border-border py-2.5 px-3 rounded-lg font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                title="Simpan Rute ke Supabase"
              >
                {savedSuccess ? (
                  <Check className="size-3.5 text-primary" />
                ) : (
                  <Bookmark className="size-3.5" />
                )}
                <span className="hidden sm:inline">Simpan</span>
              </button>
            </div>

            {errorNotice && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorNotice}</span>
              </div>
            )}
          </div>

          {/* Metrics Card */}
          {distanceKm !== null && durationMin !== null && (
            <div className="p-5 bg-card text-card-foreground border border-border rounded-xl shadow-xs space-y-3">
              <h4 className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 font-semibold">
                <RouteIcon className="size-3.5 text-primary" /> Hasil Kalkulasi OSRM
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/40 border border-border text-center space-y-0.5">
                  <span className="font-mono text-[0.65rem] text-muted-foreground uppercase">Jarak Tempuh</span>
                  <p className="font-display font-extrabold text-xl text-primary">{distanceKm} KM</p>
                </div>

                <div className="p-3 rounded-lg bg-muted/40 border border-border text-center space-y-0.5">
                  <span className="font-mono text-[0.65rem] text-muted-foreground uppercase">Estimasi Waktu</span>
                  <p className="font-display font-extrabold text-xl text-foreground flex items-center justify-center gap-1">
                    <Clock className="size-4 text-cyan-500" />
                    {durationMin >= 60
                      ? `${Math.floor(durationMin / 60)}j ${durationMin % 60}m`
                      : `${durationMin} Mins`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Saved Routes List */}
          <div className="p-5 bg-card text-card-foreground border border-border rounded-xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-mono text-xs uppercase tracking-wider text-foreground font-semibold flex items-center gap-1.5">
                <Bookmark className="size-3.5 text-primary" /> Rute Tersimpan (Supabase)
              </h4>
              <button
                onClick={fetchSavedRoutes}
                className="text-muted-foreground hover:text-foreground"
                title="Refresh"
              >
                <RefreshCw className={`size-3 ${isLoadingSaved ? "animate-spin" : ""}`} />
              </button>
            </div>

            {savedRoutes.length === 0 ? (
              <p className="text-xs font-mono text-muted-foreground text-center py-3">
                Belum ada rute tersimpan.
              </p>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {savedRoutes.map((saved) => (
                  <button
                    key={saved.id}
                    onClick={() => handleLoadSavedRoute(saved)}
                    className="w-full text-left p-2.5 rounded-lg bg-muted/40 hover:bg-muted/80 border border-border transition-all space-y-1"
                  >
                    <p className="font-display text-xs font-semibold text-foreground truncate">
                      {saved.title}
                    </p>
                    <div className="flex items-center justify-between font-mono text-[0.65rem] text-muted-foreground">
                      <span>{saved.distance_km} KM</span>
                      <span>{saved.duration_min} Menit</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Leaflet Map */}
        <div className="lg:col-span-2 h-[550px]">
          <MapComponent
            origin={originPoint}
            destination={destPoint}
            routeCoordinates={routeCoordinates}
          />
        </div>
      </div>
    </div>
  );
}
