"use client"

import dynamic from "next/dynamic"
import { type City, type Property } from "@/lib/mock-data"
import { Spinner } from "@/components/ui/spinner"

const MapView = dynamic(() => import("@/components/map-view"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-muted/20 text-muted-foreground text-sm h-full w-full">
      <Spinner className="size-6 text-muted-foreground/60" />
      <span>Chargement de la carte…</span>
    </div>
  ),
})

export function MapContainer({
  selectedProperty,
  onCitySelect,
  onPropertySelect,
}: {
  selectedProperty?: Property | null
  onCitySelect?: (city: City) => void
  onPropertySelect?: (property: Property) => void
}) {
  return (
    <MapView
      selectedProperty={selectedProperty}
      onCitySelect={onCitySelect}
      onPropertySelect={onPropertySelect}
    />
  )
}
