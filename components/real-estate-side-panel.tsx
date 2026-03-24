"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Cell,
  Pie,
  PieChart,
} from "recharts"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Location01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  ArrowLeft01Icon,
  Home01Icon,
} from "@hugeicons/core-free-icons"
import { type City, type Property, getCityProperties, formatPrice, formatPopulation } from "@/lib/mock-data"

// ─── Chart configs ─────────────────────────────────────────────────────────────

const priceChartConfig = {
  prix: { label: "Prix moyen €/m²", color: "var(--color-chart-1)" },
} satisfies ChartConfig

const repartitionChartConfig = {
  Appartement: { label: "Appartement", color: "#3b82f6" },
  Maison: { label: "Maison", color: "#22c55e" },
  Studio: { label: "Studio", color: "#f59e0b" },
  Loft: { label: "Loft", color: "#8b5cf6" },
} satisfies ChartConfig

// ─── Helpers ───────────────────────────────────────────────────────────────────

const ENERGY_COLORS: Record<string, string> = {
  A: "#22c55e",
  B: "#4ade80",
  C: "#a3e635",
  D: "#facc15",
  E: "#f97316",
  F: "#ef4444",
  G: "#dc2626",
}

const PIE_COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6"]

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  unit,
  trend,
}: {
  label: string
  value: string | number
  unit?: string
  trend?: { label: string; positive: boolean }
}) {
  return (
    <div className="bg-muted/40 rounded-xl p-3 flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="text-2xl font-semibold tracking-tight">
        {value}
        {unit && (
          <span className="text-sm font-normal text-muted-foreground ml-0.5">
            {unit}
          </span>
        )}
      </div>
      {trend && (
        <span
          className={cn(
            "text-[11px] flex items-center gap-0.5",
            trend.positive ? "text-emerald-500" : "text-red-400"
          )}
        >
          <HugeiconsIcon
            icon={trend.positive ? ArrowUp01Icon : ArrowDown01Icon}
            size={10}
          />
          {trend.label}
        </span>
      )}
    </div>
  )
}

function PropertyCard({
  property,
  onClick,
  isActive,
}: {
  property: Property
  onClick: (p: Property) => void
  isActive?: boolean
}) {
  return (
    <button
      onClick={() => onClick(property)}
      className={cn(
        "w-full text-left rounded-xl border transition-all cursor-pointer",
        "bg-muted/30 hover:bg-muted/60",
        isActive ? "border-primary ring-1 ring-primary/20" : "border-border"
      )}
    >
      {/* Image */}
      <div className="h-28 rounded-t-xl overflow-hidden relative">
        <img src={property.imageUrl} alt={property.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-3 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold leading-tight line-clamp-1">
            {property.title}
          </p>
          <Badge
            variant="secondary"
            className="text-[10px] h-4 px-1.5 capitalize shrink-0"
            style={{ backgroundColor: ENERGY_COLORS[property.energyClass] + "20", color: ENERGY_COLORS[property.energyClass] }}
          >
            DPE {property.energyClass}
          </Badge>
        </div>
        <p className="text-lg font-bold text-primary">
          {formatPrice(property.price)}
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{property.surface} m²</span>
          <span>•</span>
          <span>{property.rooms} pièce{property.rooms > 1 ? "s" : ""}</span>
          <span>•</span>
          <span>{property.bedrooms} ch.</span>
        </div>
        <p className="text-[11px] text-muted-foreground flex items-center gap-1 line-clamp-1">
          <HugeiconsIcon icon={Location01Icon} size={10} />
          {property.address}
        </p>
      </div>
    </button>
  )
}

function PropertyDetail({
  property,
  onBack,
}: {
  property: Property
  onBack: () => void
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
        Retour aux logements
      </button>

      {/* Image */}
      <div className="h-40 rounded-xl overflow-hidden relative">
        <img src={property.imageUrl} alt={property.title} className="w-full h-full object-cover shadow-sm" />
      </div>

      {/* Title + Price */}
      <div>
        <h3 className="text-base font-semibold">{property.title}</h3>
        <p className="text-2xl font-bold text-primary mt-1">{formatPrice(property.price)}</p>
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          <HugeiconsIcon icon={Location01Icon} size={10} />
          {property.address}
        </p>
      </div>

      <Separator />

      {/* Key stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-muted/40 rounded-lg p-2.5 text-center">
          <p className="text-lg font-semibold">{property.surface}</p>
          <p className="text-[10px] text-muted-foreground">m²</p>
        </div>
        <div className="bg-muted/40 rounded-lg p-2.5 text-center">
          <p className="text-lg font-semibold">{property.rooms}</p>
          <p className="text-[10px] text-muted-foreground">pièce{property.rooms > 1 ? "s" : ""}</p>
        </div>
        <div className="bg-muted/40 rounded-lg p-2.5 text-center">
          <p className="text-lg font-semibold">{property.bedrooms}</p>
          <p className="text-[10px] text-muted-foreground">chambre{property.bedrooms > 1 ? "s" : ""}</p>
        </div>
        <div className="bg-muted/40 rounded-lg p-2.5 text-center">
          <p className="text-lg font-semibold">{property.bathrooms}</p>
          <p className="text-[10px] text-muted-foreground">sdb</p>
        </div>
        {property.floor != null && (
          <div className="bg-muted/40 rounded-lg p-2.5 text-center">
            <p className="text-lg font-semibold">{property.floor === 0 ? "RDC" : property.floor}</p>
            <p className="text-[10px] text-muted-foreground">{property.floor === 0 ? "" : "étage"}</p>
          </div>
        )}
        <div className="bg-muted/40 rounded-lg p-2.5 text-center">
          <p className="text-lg font-semibold">{property.yearBuilt}</p>
          <p className="text-[10px] text-muted-foreground">année</p>
        </div>
      </div>

      <Separator />

      {/* DPE */}
      <div>
        <span className="text-xs text-muted-foreground">Diagnostic énergétique</span>
        <div className="flex gap-1 mt-2">
          {(["A", "B", "C", "D", "E", "F", "G"] as const).map((c) => (
            <div
              key={c}
              className={cn(
                "flex-1 h-6 rounded-md flex items-center justify-center text-[10px] font-bold transition-all",
                c === property.energyClass
                  ? "ring-2 ring-offset-1 ring-foreground/20 scale-110"
                  : "opacity-40"
              )}
              style={{ backgroundColor: ENERGY_COLORS[c], color: "#fff" }}
            >
              {c}
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Prix au m² */}
      <div className="flex items-center justify-between bg-muted/40 rounded-lg px-3 py-2.5">
        <span className="text-xs text-muted-foreground">Prix au m²</span>
        <span className="text-sm font-semibold">
          {Math.round(property.price / property.surface).toLocaleString("fr-FR")} €/m²
        </span>
      </div>

      <Separator />

      {/* Description */}
      <div>
        <span className="text-xs text-muted-foreground">Description</span>
        <p className="text-sm mt-1.5 leading-relaxed text-foreground/80">{property.description}</p>
      </div>

      <Separator />

      {/* Features */}
      <div>
        <span className="text-xs text-muted-foreground">Équipements</span>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {property.features.map((f) => (
            <Badge
              key={f}
              variant="secondary"
              className="text-[10px] px-2 py-0.5"
            >
              {f}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export function RealEstateSidePanel({
  city,
  selectedProperty,
  onPropertySelect,
}: {
  city?: City | null
  selectedProperty?: Property | null
  onPropertySelect?: (property: Property | null) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<string>("caracteristiques")

  React.useEffect(() => {
    if (city) setOpen(true)
  }, [city])

  // When a property is selected externally (from map pin click), switch to logements tab
  React.useEffect(() => {
    if (selectedProperty) {
      setActiveTab("logements")
      setOpen(true)
    }
  }, [selectedProperty])

  const properties = React.useMemo(
    () => (city ? getCityProperties(city.id) : []),
    [city]
  )

  const stats = city?.stats

  return (
    <div className="relative flex">
      {/* Toggle button */}
      <Button
        size="icon"
        onClick={() => setOpen((v) => !v)}
        className="absolute cursor-pointer -left-12 top-2 z-10 flex h-10 w-10 items-center justify-center bg-card shadow-sm border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        aria-label={open ? "Réduire le panneau" : "Ouvrir le panneau"}
      >
        <HugeiconsIcon
          icon={open ? PanelLeftCloseIcon : PanelLeftOpenIcon}
          size={20}
          strokeWidth={2}
        />
      </Button>

      {/* Panel body */}
      <div
        className={cn(
          "flex flex-col border-l bg-card transition-all duration-300 ease-in-out overflow-hidden",
          open ? "w-120 opacity-100" : "w-0 opacity-0"
        )}
      >
        <ScrollArea className="h-screen">
          <div className="p-4 flex flex-col gap-4 min-w-120">

            {/* ── Header ── */}
            <div className="flex flex-col gap-1">
              <div className="flex items-start justify-between mt-1">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h2 className="text-lg font-semibold">{city?.name ?? "—"}</h2>
                    <HugeiconsIcon
                      icon={Location01Icon}
                      size={14}
                      strokeWidth={1.5}
                      className="text-muted-foreground mt-0.5"
                    />
                    {city && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                        {city.departmentName} ({city.departmentCode})
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {city
                      ? `${city.population.toLocaleString("fr-FR")} hab. · ${city.area_km2} km²`
                      : "Aucune ville sélectionnée"}
                  </p>
                </div>
                <div className="text-right">
                  {stats && (
                    <>
                      <p className="text-base font-semibold">
                        {stats.prixMoyenM2.toLocaleString("fr-FR")} €/m²
                      </p>
                      <p className="text-xs text-muted-foreground">Prix moyen</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* ── Tabs ── */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="caracteristiques" className="text-xs flex-1 cursor-pointer">
                  Caractéristiques
                </TabsTrigger>
                <TabsTrigger value="logements" className="text-xs flex-1 cursor-pointer">
                  Logements
                  {properties.length > 0 && (
                    <Badge variant="secondary" className="ml-1.5 text-[10px] h-4 px-1.5">
                      {properties.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* ════ Tab : Caractéristiques ════ */}
              <TabsContent value="caracteristiques" className="flex flex-col gap-4 mt-4">
                {stats ? (
                  <>
                    {/* Key stats grid */}
                    <div className="grid grid-cols-2 gap-2">
                      <StatCard
                        label="Population"
                        value={formatPopulation(city!.population)}
                        trend={{ label: `Densité : ${stats.densite} hab/km²`, positive: true }}
                      />
                      <StatCard
                        label="Prix moyen m²"
                        value={stats.prixMoyenM2.toLocaleString("fr-FR")}
                        unit=" €"
                        trend={{
                          label: stats.prixEvolution.length >= 2
                            ? `${Math.round(((stats.prixEvolution[stats.prixEvolution.length - 1].prix / stats.prixEvolution[stats.prixEvolution.length - 2].prix) - 1) * 100)}% vs 2024`
                            : "",
                          positive: stats.prixEvolution.length >= 2
                            ? stats.prixEvolution[stats.prixEvolution.length - 1].prix >= stats.prixEvolution[stats.prixEvolution.length - 2].prix
                            : true
                        }}
                      />
                      <StatCard
                        label="Nombre de logements"
                        value={stats.nbLogements.toLocaleString("fr-FR")}
                      />
                      <StatCard
                        label="Revenu médian"
                        value={stats.revenuMedian.toLocaleString("fr-FR")}
                        unit=" €/an"
                      />
                    </div>

                    <Separator />

                    {/* Taux propriétaires / locataires */}
                    <div className="flex flex-col gap-3">
                      <span className="text-sm font-medium">Propriétaires vs Locataires</span>
                      <div className="grid grid-cols-2 gap-2">
                        <StatCard
                          label="Propriétaires"
                          value={`${stats.tauxProprietaires}%`}
                        />
                        <StatCard
                          label="Locataires"
                          value={`${stats.tauxLocataires}%`}
                        />
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden flex">
                        <div
                          className="h-full bg-emerald-500 transition-all"
                          style={{ width: `${stats.tauxProprietaires}%` }}
                        />
                        <div
                          className="h-full bg-blue-500 transition-all"
                          style={{ width: `${stats.tauxLocataires}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="size-2 rounded-sm bg-emerald-500 inline-block" />
                          Propriétaires
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="size-2 rounded-sm bg-blue-500 inline-block" />
                          Locataires
                        </span>
                      </div>
                    </div>

                    <Separator />

                    {/* Évolution des prix */}
                    <div className="flex flex-col gap-3">
                      <span className="text-sm font-medium">Évolution des prix (€/m²)</span>
                      <ChartContainer config={priceChartConfig} className="h-36 w-full aspect-auto">
                        <AreaChart data={stats.prixEvolution}>
                          <defs>
                            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--color-prix)" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="var(--color-prix)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="year"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10 }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10 }}
                            width={40}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Area
                            type="monotone"
                            dataKey="prix"
                            stroke="var(--color-prix)"
                            strokeWidth={2}
                            fill="url(#priceGradient)"
                            dot={{ fill: "var(--color-prix)", r: 3, strokeWidth: 0 }}
                          />
                        </AreaChart>
                      </ChartContainer>
                    </div>

                    <Separator />

                    {/* Répartition des logements */}
                    <div className="flex flex-col gap-3">
                      <span className="text-sm font-medium">Répartition des logements</span>
                      <ChartContainer config={repartitionChartConfig} className="h-44 w-full aspect-auto">
                        <PieChart>
                          <Pie
                            data={stats.repartitionTypes}
                            dataKey="pct"
                            nameKey="type"
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            paddingAngle={2}
                          >
                            {stats.repartitionTypes.map((_, i) => (
                              <Cell key={`cell-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ChartContainer>
                      <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground justify-center">
                        {stats.repartitionTypes.map((t, i) => (
                          <span key={t.type} className="flex items-center gap-1">
                            <span
                              className="size-2 rounded-sm inline-block"
                              style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                            />
                            {t.type} ({t.pct}%)
                          </span>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Additional stats */}
                    <div className="grid grid-cols-2 gap-2">
                      <StatCard
                        label="Taux de chômage"
                        value={`${stats.tauxChomage}%`}
                      />
                      <StatCard
                        label="Maisons"
                        value={`${stats.logementsMaison}%`}
                        trend={{ label: `${stats.logementsAppartement}% appartements`, positive: true }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <HugeiconsIcon icon={Location01Icon} size={32} className="mb-3 opacity-40" />
                    <p className="text-sm">Sélectionnez une ville pour voir ses caractéristiques</p>
                  </div>
                )}
              </TabsContent>

              {/* ════ Tab : Logements ════ */}
              <TabsContent value="logements" className="flex flex-col gap-4 mt-4">
                {selectedProperty ? (
                  <PropertyDetail
                    property={selectedProperty}
                    onBack={() => onPropertySelect?.(null)}
                  />
                ) : properties.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {properties.length} logement{properties.length > 1 ? "s" : ""} disponible{properties.length > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {properties.map((p) => (
                        <PropertyCard
                          key={p.id}
                          property={p}
                          onClick={(prop) => onPropertySelect?.(prop)}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <HugeiconsIcon icon={Home01Icon} size={32} className="mb-3 opacity-40" />
                    <p className="text-sm">Sélectionnez une ville pour voir les logements</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* bottom spacing */}
            <div className="h-2" />
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
