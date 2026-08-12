"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  origin: { lat: number; lng: number; name: string } | null;
  destination: { lat: number; lng: number; name: string } | null;
  routeCoordinates: [number, number][];
}

// Custom DivIcon for Leaflet markers using SVG to avoid missing icon PNG assets in Next.js
const originIcon = L.divIcon({
  className: "custom-leaflet-marker",
  html: `<div style="background-color: #10b981; width: 28px; height: 28px; rounded-radius: 50%; border: 3px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-weight: bold; color: white; font-size: 11px;">A</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const destinationIcon = L.divIcon({
  className: "custom-leaflet-marker",
  html: `<div style="background-color: #06b6d4; width: 28px; height: 28px; border: 3px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-weight: bold; color: white; font-size: 11px;">B</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

// Helper component to auto-fit map bounds when route or markers change
function MapAutoBounds({
  origin,
  destination,
  routeCoordinates,
}: MapProps) {
  const map = useMap();

  useEffect(() => {
    if (routeCoordinates.length > 0) {
      const bounds = L.latLngBounds(routeCoordinates);
      map.fitBounds(bounds, { padding: [40, 40] });
    } else if (origin && destination) {
      const bounds = L.latLngBounds([
        [origin.lat, origin.lng],
        [destination.lat, destination.lng],
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (origin) {
      map.setView([origin.lat, origin.lng], 13);
    } else if (destination) {
      map.setView([destination.lat, destination.lng], 13);
    }
  }, [map, origin, destination, routeCoordinates]);

  return null;
}

export default function MapComponent({
  origin,
  destination,
  routeCoordinates,
}: MapProps) {
  // Default center: Indonesia (Jakarta)
  const defaultCenter: [number, number] = origin
    ? [origin.lat, origin.lng]
    : [-6.2088, 106.8456];

  return (
    <div className="relative size-full overflow-hidden rounded-xl border border-border bg-card">
      <MapContainer
        center={defaultCenter}
        zoom={11}
        scrollWheelZoom={true}
        className="size-full z-10"
        style={{ height: "100%", width: "100%", minHeight: "450px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapAutoBounds
          origin={origin}
          destination={destination}
          routeCoordinates={routeCoordinates}
        />

        {origin && (
          <Marker position={[origin.lat, origin.lng]} icon={originIcon}>
            <Popup>
              <div className="font-sans text-xs">
                <strong>Titik Asal (A)</strong>
                <p>{origin.name}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {destination && (
          <Marker position={[destination.lat, destination.lng]} icon={destinationIcon}>
            <Popup>
              <div className="font-sans text-xs">
                <strong>Titik Tujuan (B)</strong>
                <p>{destination.name}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {routeCoordinates.length > 0 && (
          <Polyline
            positions={routeCoordinates}
            pathOptions={{
              color: "#06b6d4",
              weight: 5,
              opacity: 0.85,
              lineJoin: "round",
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
