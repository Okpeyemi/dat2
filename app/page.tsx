"use client"

import * as React from "react"
import { IconSidebar } from "@/components/icon-sidebar"
import { RealEstateSidePanel } from "@/components/real-estate-side-panel"
import { MapContainer } from "@/components/map-container"
import { type City, type Property } from "@/lib/mock-data"

export default function Page() {
  const [selectedCity, setSelectedCity] = React.useState<City | null>(null)
  const [selectedProperty, setSelectedProperty] = React.useState<Property | null>(null)

  return (
    <div className="flex h-screen overflow-hidden">
      <IconSidebar />
      <main className="flex-1 relative overflow-hidden">
        <MapContainer
          selectedProperty={selectedProperty}
          onCitySelect={(city) => {
            setSelectedCity(city)
            setSelectedProperty(null)
          }}
          onPropertySelect={(property) => {
            setSelectedProperty(property)
          }}
        />
      </main>
      <RealEstateSidePanel
        city={selectedCity}
        selectedProperty={selectedProperty}
        onPropertySelect={setSelectedProperty}
      />
    </div>
  )
}