"use client";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { useState } from "react";

interface Pin { lat: number; lng: number; label?: string; }

export function MapView({ center = { lat:18.5204, lng:73.8567 }, pins = [], height = "400px" }: {
  center?: { lat: number; lng: number }; pins?: Pin[]; height?: string;
}) {
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY! });
  const [selected, setSelected] = useState<Pin | null>(null);

  if (!isLoaded) return <div className="animate-pulse bg-border/30 rounded-xl" style={{ height }} />;

  return (
    <GoogleMap mapContainerStyle={{ width:"100%", height, borderRadius:"18px" }} center={center} zoom={12}>
      {pins.map((pin, i) => (
        <Marker key={i} position={pin} onClick={() => setSelected(pin)} />
      ))}
      {selected?.label && (
        <InfoWindow position={selected} onCloseClick={() => setSelected(null)}>
          <p className="text-sm font-medium">{selected.label}</p>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
