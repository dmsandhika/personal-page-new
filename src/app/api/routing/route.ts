import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

interface LocationPoint {
  lat: number;
  lng: number;
  name: string;
}

export async function GET() {
  try {
    const { data: savedRoutes, error } = await supabaseAdmin
      .from("lab_saved_routes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.warn("Supabase fetch error:", error);
      return NextResponse.json({ routes: [] });
    }

    return NextResponse.json({ routes: savedRoutes || [] });
  } catch (err: unknown) {
    console.error("GET /api/routing error:", err);
    return NextResponse.json({ routes: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { origin, destination, save = false, title } = body as {
      origin: LocationPoint;
      destination: LocationPoint;
      save?: boolean;
      title?: string;
    };

    if (!origin?.lat || !origin?.lng || !destination?.lat || !destination?.lng) {
      return NextResponse.json(
        { error: "Koordinat titik asal dan tujuan tidak valid." },
        { status: 400 }
      );
    }

    // Call OSRM Public Driving Route API
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;

    const osrmRes = await fetch(osrmUrl, {
      headers: { "User-Agent": "DimasLab-Portfolio-Routing/1.0" },
    });

    if (!osrmRes.ok) {
      return NextResponse.json(
        { error: "Gagal menghitung rute dari OSRM API." },
        { status: 500 }
      );
    }

    const osrmData = await osrmRes.json();

    if (!osrmData.routes || osrmData.routes.length === 0) {
      return NextResponse.json(
        { error: "Rute tidak ditemukan antara dua titik tersebut." },
        { status: 404 }
      );
    }

    const primaryRoute = osrmData.routes[0];
    const distanceKm = Math.round((primaryRoute.distance / 1000) * 10) / 10; // 1 decimal point
    const durationMin = Math.round(primaryRoute.duration / 60);

    // OSRM returns coordinates in [lng, lat] format -> convert to Leaflet [lat, lng] format
    const routeCoordinates: [number, number][] = primaryRoute.geometry.coordinates.map(
      (coord: [number, number]) => [coord[1], coord[0]]
    );

    let savedItem = null;

    if (save) {
      try {
        const routeTitle = title || `${origin.name || "Titik Awal"} ➔ ${destination.name || "Tujuan"}`;
        const { data, error } = await supabaseAdmin
          .from("lab_saved_routes")
          .insert({
            title: routeTitle,
            origin_name: origin.name || "Titik Awal",
            origin_lat: origin.lat,
            origin_lng: origin.lng,
            dest_name: destination.name || "Tujuan",
            dest_lat: destination.lat,
            dest_lng: destination.lng,
            distance_km: distanceKm,
            duration_min: durationMin,
          })
          .select("*")
          .single();

        if (!error && data) {
          savedItem = data;
        }
      } catch (dbErr) {
        console.warn("Saving route skipped (DB issue):", dbErr);
      }
    }

    return NextResponse.json({
      distanceKm,
      durationMin,
      coordinates: routeCoordinates,
      savedItem,
    });
  } catch (error: unknown) {
    console.error("POST /api/routing error:", error);
    const errMessage = error instanceof Error ? error.message : "Terjadi kesalahan pada server.";
    return NextResponse.json(
      { error: "Gagal menghitung rute.", details: errMessage },
      { status: 500 }
    );
  }
}
