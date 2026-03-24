"use client"

import * as React from "react"
import { MapContainer, TileLayer, Polygon, useMap } from "react-leaflet"
import L from "leaflet"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Location01Icon,
  Home01Icon,
  AnalyticsUpIcon,
} from "@hugeicons/core-free-icons"
import { type City, formatPrice, formatPopulation } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

// ─── Region preview map ───────────────────────────────────────────────────────

function CityFitBounds({
  boundary,
  center,
}: {
  boundary?: [number, number][]
  center: [number, number]
}) {
  const map = useMap()
  React.useEffect(() => {
    if (boundary && boundary.length > 2) {
      const bounds = L.latLngBounds(boundary)
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [12, 12], animate: false })
    } else {
      map.setView(center, 12, { animate: false })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boundary, center[0], center[1]])
  return null
}

function CityPreviewMap({
  city,
  mapKey,
}: {
  city: City
  mapKey: string
}) {
  const center: [number, number] = [city.latitude, city.longitude]

  const pathOptions = {
    color: "hsl(220, 71%, 45%)",
    fillColor: "hsl(220, 71%, 45%)",
    fillOpacity: 0.25,
    weight: 2.5,
    dashArray: "6 4",
  }

  return (
    <MapContainer
      key={mapKey}
      center={center}
      zoom={12}
      zoomControl={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      keyboard={false}
      attributionControl={false}
      className="h-32 w-full"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {city.boundary && city.boundary.length > 2 && (
        <Polygon
          key={mapKey}
          positions={city.boundary}
          pathOptions={pathOptions}
        />
      )}
      <CityFitBounds boundary={city.boundary} center={center} />
    </MapContainer>
  )
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export function CityModal({
  open,
  city,
  onClose,
}: {
  open: boolean
  city: City | null
  onClose: () => void
}) {
  if (!city) return null

  const stats = city.stats
  const previewKey = city.id

  // Trend calculation
  const priceTrend = stats.prixEvolution.length >= 2
    ? Math.round(
        ((stats.prixEvolution[stats.prixEvolution.length - 1].prix /
          stats.prixEvolution[stats.prixEvolution.length - 2].prix) -
          1) *
          100
      )
    : 0

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm p-0 gap-0 overflow-hidden rounded-2xl">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="px-4 pt-10 pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <DialogTitle className="text-base font-semibold leading-tight">
                  {city.name}
                </DialogTitle>
                <Badge
                  variant="secondary"
                  className="text-[10px] h-4 px-1.5"
                >
                  {city.departmentName}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                <HugeiconsIcon
                  icon={Location01Icon}
                  size={10}
                  strokeWidth={1.5}
                />
                {city.departmentCode} · {city.area_km2} km²
              </p>
            </div>

            <div className="text-right shrink-0">
              <p className="text-sm font-semibold">
                {formatPopulation(city.population)} hab.
              </p>
              <p className="text-[10px] text-muted-foreground">Population</p>
            </div>
          </div>

          {/* Key metrics */}
          <div className="flex gap-6 mt-3.5">
            <div>
              <p className="text-[10px] text-muted-foreground mb-0.5">
                Prix moyen m²
              </p>
              <p className="text-xs font-medium">
                {stats.prixMoyenM2.toLocaleString("fr-FR")} €
              </p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground mb-0.5">
                Nb. logements
              </p>
              <p className="text-xs font-medium">
                {stats.nbLogements.toLocaleString("fr-FR")}
              </p>
            </div>
          </div>

          {/* Price trend bar */}
          <div className="mt-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground">
                Évolution prix
              </span>
              <span className={cn(
                "text-xs font-medium",
                priceTrend >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
              )}>
                {priceTrend >= 0 ? "+" : ""}{priceTrend}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  priceTrend >= 0 ? "bg-emerald-500" : "bg-red-500"
                )}
                style={{ width: `${Math.min(100, Math.abs(priceTrend) * 10)}%` }}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* ── Zone preview ───────────────────────────────────────────────── */}
        <div className="overflow-hidden border-b border-border">
          <CityPreviewMap city={city} mapKey={previewKey} />
        </div>

        {/* ── Stats grid ─────────────────────────────────────────────── */}
        <div className="px-4 py-3 flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-muted/40 rounded-xl p-2.5 flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground">Propriétaires</span>
              <span className="text-base font-semibold">{stats.tauxProprietaires}%</span>
            </div>
            <div className="bg-muted/40 rounded-xl p-2.5 flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground">Locataires</span>
              <span className="text-base font-semibold">{stats.tauxLocataires}%</span>
            </div>
            <div className="bg-muted/40 rounded-xl p-2.5 flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground">Chômage</span>
              <span className="text-base font-semibold">{stats.tauxChomage}%</span>
            </div>
          </div>

          {/* Insight footer */}
          <div className="mt-1 rounded-xl bg-foreground px-3 py-2.5 flex gap-2.5">
            <div className="shrink-0 mt-0.5">
              <HugeiconsIcon
                icon={AnalyticsUpIcon}
                size={14}
                className="text-background/60"
              />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-background mb-1">
                Marché immobilier
              </p>
              <p className="text-[11px] text-background/70 leading-relaxed">
                {stats.prixMoyenM2 > 5000
                  ? `Marché tendu à ${city.name}. Prix élevés avec forte demande locative.`
                  : stats.prixMoyenM2 > 3000
                  ? `Marché dynamique à ${city.name}. Bon potentiel d'investissement.`
                  : `Marché accessible à ${city.name}. Opportunités pour primo-accédants.`}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
