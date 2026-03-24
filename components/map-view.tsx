"use client"

import * as React from "react"
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ZoomInAreaIcon, ZoomOutAreaIcon, Navigation01Icon, Search01Icon, Home01Icon } from "@hugeicons/core-free-icons"
import { renderToString } from "react-dom/server"
import {
  getCities,
  getCityProperties,
  searchLocations,
  getCitiesByDepartment,
  DEPARTMENTS,
  type City,
  type Department,
  type Property,
} from "@/lib/mock-data"
import { CityModal } from "@/components/city-modal"
import { PropertyPopupCard } from "@/components/property-modal"
import { cn } from "@/lib/utils"

// Default center: France
const defaultCenter: [number, number] = [46.603354, 1.888334]
const defaultZoom = 6

// ─── Property pin icon ─────────────────────────────────────────────────────────

function createPropertyIcon(): L.DivIcon {
  const html = renderToString(
    <div style={{
      width: '28px', height: '28px',
      background: 'hsl(220, 85%, 50%)',
      border: '2px solid white',
      borderRadius: '50% 50% 50% 0',
      transform: 'rotate(-45deg)',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        transform: 'rotate(45deg)',
        color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <HugeiconsIcon icon={Home01Icon} size={18} />
      </div>
    </div>
  )

  return L.divIcon({
    html,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  })
}

const propertyIcon = createPropertyIcon()

// ─── Internal map components ───────────────────────────────────────────────────

function FlyToLocation({ target, boundary }: { target: [number, number] | null; boundary?: [number, number][] }) {
  const map = useMap()
  React.useEffect(() => {
    if (!target) return
    if (boundary && boundary.length > 2) {
      const bounds = L.latLngBounds(boundary)
      map.flyToBounds(bounds, { duration: 1.2, padding: [40, 40] })
    } else {
      map.flyTo(target, 13, { duration: 1.2 })
    }
  }, [target, boundary, map])
  return null
}

function MapReadyHandler({ onReady }: { onReady: () => void }) {
  useMapEvents({ load: onReady })
  const map = useMap()
  React.useEffect(() => {
    if (map && map.getPane("overlayPane")) onReady()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])
  return null
}

function MapResizeHandler() {
  const map = useMap()
  React.useEffect(() => {
    const container = map.getContainer()
    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(container)
    return () => observer.disconnect()
  }, [map])
  return null
}

function CustomZoomControl() {
  const map = useMap()
  const [locating, setLocating] = React.useState(false)

  function handleLocate() {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latlng: [number, number] = [pos.coords.latitude, pos.coords.longitude]
        map.flyTo(latlng, 13, { duration: 1.2 })
        setLocating(false)
      },
      () => setLocating(false),
      { enableHighAccuracy: true }
    )
  }

  return (
    <div className="absolute bottom-6 right-4 z-1000 flex flex-col gap-1">
      <Button
        size="icon"
        className="bg-card shadow-sm flex h-10 w-10 border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => map.zoomIn()}
        aria-label="Zoom in"
      >
        <HugeiconsIcon icon={ZoomInAreaIcon} size={20} strokeWidth={2} />
      </Button>
      <Button
        size="icon"
        className="bg-card shadow-sm flex h-10 w-10 border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => map.zoomOut()}
        aria-label="Zoom out"
      >
        <HugeiconsIcon icon={ZoomOutAreaIcon} size={20} strokeWidth={2} />
      </Button>
      <Button
        size="icon"
        className="bg-card shadow-sm flex h-10 w-10 border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        onClick={handleLocate}
        disabled={locating}
        aria-label="Ma position"
      >
        <HugeiconsIcon
          icon={Navigation01Icon}
          size={20}
          strokeWidth={2}
          className={locating ? "animate-pulse text-blue-500" : ""}
        />
      </Button>
    </div>
  )
}

// ─── Search bar ────────────────────────────────────────────────────────────────

function SearchBar({
  initialQuery = "",
  onCitySelect,
  onDepartmentSelect,
}: {
  initialQuery?: string
  onCitySelect: (city: City) => void
  onDepartmentSelect: (dep: Department) => void
}) {
  const [query, setQuery] = React.useState(initialQuery)
  const [open, setOpen] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  const results = React.useMemo(() => {
    if (!query.trim()) return { departments: [], cities: [] }
    return searchLocations(query)
  }, [query])

  const hasResults = results.departments.length > 0 || results.cities.length > 0

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-1000 w-80">
      <div className="relative">
        <div className="flex bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center px-3 text-muted-foreground">
            <HugeiconsIcon icon={Search01Icon} size={16} strokeWidth={2} />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Rechercher une ville ou un département…"
            className="flex-1 h-10 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none pr-3"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
          />
        </div>

        {/* Dropdown results */}
        {open && hasResults && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden max-h-72 overflow-y-auto">
            {results.departments.length > 0 && (
              <>
                <p className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50">
                  Départements
                </p>
                {results.departments.map((dep) => (
                  <button
                    key={dep.id}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2 cursor-pointer"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onDepartmentSelect(dep)
                      setQuery(dep.name)
                      setOpen(false)
                    }}
                  >
                    <span className="text-xs text-muted-foreground font-mono w-6">{dep.code}</span>
                    <span>{dep.name}</span>
                  </button>
                ))}
              </>
            )}
            {results.cities.length > 0 && (
              <>
                <p className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50">
                  Villes
                </p>
                {results.cities.map((city) => (
                  <button
                    key={city.id}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors flex items-center justify-between cursor-pointer"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onCitySelect(city)
                      setQuery(city.name)
                      setOpen(false)
                    }}
                  >
                    <span>{city.name}</span>
                    <span className="text-xs text-muted-foreground">{city.departmentName}</span>
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Map click handler ─────────────────────────────────────────────────────────

function MapClickHandler({
  suppressRef,
  cities,
  onCityClick,
}: {
  suppressRef: React.RefObject<boolean>
  cities: City[]
  onCityClick: (city: City) => void
}) {
  useMapEvents({
    click(e) {
      if (suppressRef.current) {
        suppressRef.current = false
        return
      }
      // Check if click is inside any city boundary
      const clickLatLng = e.latlng
      for (const city of cities) {
        if (city.boundary && city.boundary.length > 2) {
          const polygon = L.polygon(city.boundary)
          if (polygon.getBounds().contains(clickLatLng)) {
            // More precise check using ray casting
            const point = L.point(clickLatLng.lat, clickLatLng.lng)
            const bounds = city.boundary
            let inside = false
            for (let i = 0, j = bounds.length - 1; i < bounds.length; j = i++) {
              const xi = bounds[i][0], yi = bounds[i][1]
              const xj = bounds[j][0], yj = bounds[j][1]
              const intersect = ((yi > point.y) !== (yj > point.y))
                && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi)
              if (intersect) inside = !inside
            }
            if (inside) {
              onCityClick(city)
              return
            }
          }
        }
      }
    },
  })
  return null
}

// ─── Main export ───────────────────────────────────────────────────────────────

export default function MapView({
  selectedCity: initialSelectedCity,
  selectedProperty,
  onCitySelect,
  onPropertySelect,
}: {
  selectedCity?: City | null
  selectedProperty?: Property | null
  onCitySelect?: (city: City) => void
  onPropertySelect?: (property: Property) => void
}) {
  const [cities] = React.useState<City[]>(() => getCities())
  const [selectedCity, setSelectedCity] = React.useState<City | null>(null)
  const [selectedDepartment, setSelectedDepartment] = React.useState<Department | null>(null)
  const [departmentCities, setDepartmentCities] = React.useState<City[]>([])
  const [target, setTarget] = React.useState<[number, number] | null>(null)
  const [boundary, setBoundary] = React.useState<[number, number][] | undefined>(undefined)
  const [properties, setProperties] = React.useState<Property[]>([])
  const [mapReady, setMapReady] = React.useState(false)
  const [modalOpen, setModalOpen] = React.useState(false)
  const suppressMapClickRef = React.useRef(false)
  const markerRefs = React.useRef<{ [key: string]: L.Marker | null }>({})

  // Sélection initiale au montage (ex: Paris)
  React.useEffect(() => {
    if (initialSelectedCity) {
      handleCitySelect(initialSelectedCity)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Ouvrir le popup programmatic quand une property est sélectionnée via le side panel
  React.useEffect(() => {
    if (selectedProperty && markerRefs.current[selectedProperty.id]) {
      markerRefs.current[selectedProperty.id]?.openPopup()
    }
  }, [selectedProperty])

  function handleCitySelect(city: City, openModal = false) {
    setSelectedCity(city)
    setSelectedDepartment(null)
    setTarget([city.latitude, city.longitude])
    setBoundary(city.boundary)
    setProperties(getCityProperties(city.id))
    onCitySelect?.(city)
    if (openModal) setModalOpen(true)
  }

  function handleDepartmentSelect(dep: Department) {
    setSelectedDepartment(dep)
    setSelectedCity(null)
    setProperties([])
    setTarget([dep.centerLat, dep.centerLng])
    // Get cities in this department to show boundaries
    const depCities = getCitiesByDepartment(dep.code)
    setDepartmentCities(depCities)
    setBoundary(undefined) // Department boundaries not detailed, just fly to center
    onCitySelect?.(null as unknown as City) // Clear city selection
  }

  function handlePropertyClick(property: Property) {
    suppressMapClickRef.current = true
    onPropertySelect?.(property)
  }

  return (
    <div className="relative h-full w-full">
      <SearchBar
        initialQuery={selectedCity?.name || ""}
        onCitySelect={(city) => handleCitySelect(city)}
        onDepartmentSelect={handleDepartmentSelect}
      />

      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="h-full w-full z-0"
        zoomControl={false}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapReadyHandler onReady={() => setMapReady(true)} />
        <MapClickHandler
          suppressRef={suppressMapClickRef}
          cities={cities}
          onCityClick={(city) => handleCitySelect(city, true)}
        />

        {/* Show all city boundaries in department view */}
        {mapReady && selectedDepartment && departmentCities.map((city) => (
          city.boundary && city.boundary.length > 0 && (
            <Polygon
              key={`dep-city-${city.id}`}
              positions={city.boundary}
              pathOptions={{
                color: "hsl(220, 70%, 50%)",
                fillColor: "hsl(220, 70%, 50%)",
                fillOpacity: 0.15,
                weight: 2,
                dashArray: "4 6",
              }}
              eventHandlers={{
                click: () => {
                  suppressMapClickRef.current = true
                  handleCitySelect(city, true)
                },
              }}
            />
          )
        ))}

        {/* Selected city boundary */}
        {mapReady && selectedCity?.boundary && selectedCity.boundary.length > 0 && (
          <Polygon
            positions={selectedCity.boundary}
            pathOptions={{
              color: "hsl(220, 71%, 45%)",
              fillColor: "hsl(220, 71%, 45%)",
              fillOpacity: 0.2,
              weight: 3,
            }}
            eventHandlers={{
              click: () => {
                suppressMapClickRef.current = true
                setModalOpen(true)
              },
            }}
          />
        )}

        {/* Property markers */}
        {mapReady && properties.map((prop) => (
          <Marker
            key={prop.id}
            ref={(r) => { markerRefs.current[prop.id] = r }}
            position={[prop.latitude, prop.longitude]}
            icon={propertyIcon}
            eventHandlers={{
              click: () => handlePropertyClick(prop),
            }}
          >
            <Popup className="custom-popup" closeButton={false}>
              <PropertyPopupCard property={prop} />
            </Popup>
          </Marker>
        ))}

        <FlyToLocation target={target} boundary={boundary} />
        <MapResizeHandler />
        <CustomZoomControl />
      </MapContainer>

      {/* City detail modal */}
      <CityModal
        open={modalOpen}
        city={selectedCity}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}
