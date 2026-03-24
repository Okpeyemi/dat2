"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { HugeiconsIcon } from "@hugeicons/react"
import { Location01Icon } from "@hugeicons/core-free-icons"
import { type Property, formatPrice } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const ENERGY_COLORS: Record<string, string> = {
  A: "#22c55e",
  B: "#4ade80",
  C: "#a3e635",
  D: "#facc15",
  E: "#f97316",
  F: "#ef4444",
  G: "#dc2626",
}

export function PropertyPopupCard({ property }: { property: Property }) {
  return (
    <div className="flex flex-col w-full text-foreground bg-card text-left">
      {/* ── Image Header ─────────────────────────────────────────────── */}
      <div className="relative h-44 w-full bg-muted">
        <img
          src={property.imageUrl}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div>
            <Badge variant="secondary" className="mb-1.5 bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border-none capitalize text-[10px] px-2 py-0">
              {property.type}
            </Badge>
            <h2 className="text-[15px] font-bold leading-tight line-clamp-2 drop-shadow-sm">
              {property.title}
            </h2>
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="p-3 flex flex-col gap-3">
        
        {/* Main Info */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xl font-extrabold text-primary">
              {formatPrice(property.price)}
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5 font-medium">
              <HugeiconsIcon icon={Location01Icon} size={12} className="opacity-70" />
              {property.address}
            </p>
          </div>
          <div className="text-right">
            <Badge
              className="text-[10px] px-1.5 py-0.5 mb-1 shadow-sm"
              style={{ backgroundColor: ENERGY_COLORS[property.energyClass], color: "#fff" }}
            >
              DPE {property.energyClass}
            </Badge>
          </div>
        </div>

        <Separator className="bg-border/60" />

        {/* Key characteristics grid */}
        <div className="grid grid-cols-4 gap-1.5">
          <div className="bg-muted/40 rounded-lg py-1.5 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-bold text-foreground">{property.surface}</span>
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider">m²</span>
          </div>
          <div className="bg-muted/40 rounded-lg py-1.5 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-bold text-foreground">{property.rooms}</span>
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Pièces</span>
          </div>
          <div className="bg-muted/40 rounded-lg py-1.5 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-bold text-foreground">{property.bedrooms}</span>
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Ch.</span>
          </div>
          <div className="bg-muted/40 rounded-lg py-1.5 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-bold text-foreground">{property.bathrooms}</span>
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider">SDB</span>
          </div>
        </div>

        <Separator className="bg-border/60" />

        {/* Features */}
        {property.features && property.features.length > 0 && (
          <div>
            <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Prestations</h4>
            <div className="flex flex-wrap gap-1">
              {property.features.slice(0, 5).map((f) => (
                <Badge key={f} variant="secondary" className="bg-muted/60 text-foreground/80 font-medium border-none px-1.5 py-0 text-[9px]">
                  {f}
                </Badge>
              ))}
              {property.features.length > 5 && (
                <span className="text-[9px] text-muted-foreground italic ml-1 self-center">...+{property.features.length - 5}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
