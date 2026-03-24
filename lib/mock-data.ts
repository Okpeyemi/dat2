/**
 * lib/mock-data.ts
 *
 * Données fictives pour l'application immobilière.
 * Départements, villes françaises et logements mockés.
 * PRNG déterministe pour des données stables par ville.
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

export type Department = {
  id: string
  code: string
  name: string
  centerLat: number
  centerLng: number
  boundary?: [number, number][]
}

export type City = {
  id: string
  name: string
  departmentCode: string
  departmentName: string
  latitude: number
  longitude: number
  population: number
  area_km2: number
  boundary?: [number, number][]
  stats: CityStats
}

export type CityStats = {
  prixMoyenM2: number
  nbLogements: number
  tauxProprietaires: number
  tauxLocataires: number
  logementsMaison: number
  logementsAppartement: number
  prixEvolution: PricePoint[]
  repartitionTypes: TypeRepartition[]
  revenuMedian: number
  densite: number
  tauxChomage: number
}

export type PricePoint = { year: string; prix: number }

export type TypeRepartition = { type: string; count: number; pct: number }

export type PropertyType = "appartement" | "maison" | "studio" | "loft" | "duplex"

export type Property = {
  id: string
  cityId: string
  title: string
  type: PropertyType
  price: number
  surface: number
  rooms: number
  bedrooms: number
  bathrooms: number
  floor?: number
  totalFloors?: number
  yearBuilt: number
  latitude: number
  longitude: number
  address: string
  description: string
  features: string[]
  energyClass: "A" | "B" | "C" | "D" | "E" | "F" | "G"
  imageUrl: string
}

// ─── PRNG ──────────────────────────────────────────────────────────────────────

function hashString(str: string): number {
  let h = 5381
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i)
  }
  return h >>> 0
}

function makePrng(seed: number): () => number {
  let s = seed >>> 0 || 1
  return (): number => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return (s >>> 0) / 4294967295
  }
}

function r(rng: () => number, min: number, max: number): number {
  return Math.round(min + rng() * (max - min))
}

function rf(rng: () => number, min: number, max: number, decimals = 2): number {
  return parseFloat((min + rng() * (max - min)).toFixed(decimals))
}

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)]
}

// ─── Départements français (sélection avec coordonnées) ────────────────────────

export const DEPARTMENTS: Department[] = [
  { id: "dep-75", code: "75", name: "Paris", centerLat: 48.8566, centerLng: 2.3522 },
  { id: "dep-13", code: "13", name: "Bouches-du-Rhône", centerLat: 43.5283, centerLng: 5.4497 },
  { id: "dep-69", code: "69", name: "Rhône", centerLat: 45.7578, centerLng: 4.8320 },
  { id: "dep-31", code: "31", name: "Haute-Garonne", centerLat: 43.6047, centerLng: 1.4442 },
  { id: "dep-33", code: "33", name: "Gironde", centerLat: 44.8378, centerLng: -0.5792 },
  { id: "dep-59", code: "59", name: "Nord", centerLat: 50.6292, centerLng: 3.0573 },
  { id: "dep-44", code: "44", name: "Loire-Atlantique", centerLat: 47.2184, centerLng: -1.5536 },
  { id: "dep-67", code: "67", name: "Bas-Rhin", centerLat: 48.5734, centerLng: 7.7521 },
  { id: "dep-06", code: "06", name: "Alpes-Maritimes", centerLat: 43.7102, centerLng: 7.2620 },
  { id: "dep-34", code: "34", name: "Hérault", centerLat: 43.6108, centerLng: 3.8767 },
  { id: "dep-35", code: "35", name: "Ille-et-Vilaine", centerLat: 48.1147, centerLng: -1.6794 },
  { id: "dep-76", code: "76", name: "Seine-Maritime", centerLat: 49.4432, centerLng: 1.0993 },
  { id: "dep-92", code: "92", name: "Hauts-de-Seine", centerLat: 48.8283, centerLng: 2.2183 },
  { id: "dep-93", code: "93", name: "Seine-Saint-Denis", centerLat: 48.9100, centerLng: 2.4800 },
  { id: "dep-94", code: "94", name: "Val-de-Marne", centerLat: 48.7800, centerLng: 2.4700 },
  { id: "dep-78", code: "78", name: "Yvelines", centerLat: 48.8000, centerLng: 1.9600 },
  { id: "dep-91", code: "91", name: "Essonne", centerLat: 48.5300, centerLng: 2.2400 },
  { id: "dep-95", code: "95", name: "Val-d'Oise", centerLat: 49.0500, centerLng: 2.1700 },
  { id: "dep-77", code: "77", name: "Seine-et-Marne", centerLat: 48.6200, centerLng: 2.9800 },
  { id: "dep-57", code: "57", name: "Moselle", centerLat: 49.1193, centerLng: 6.1757 },
  { id: "dep-38", code: "38", name: "Isère", centerLat: 45.1885, centerLng: 5.7245 },
  { id: "dep-42", code: "42", name: "Loire", centerLat: 45.4340, centerLng: 4.3900 },
  { id: "dep-29", code: "29", name: "Finistère", centerLat: 48.4000, centerLng: -4.4900 },
  { id: "dep-56", code: "56", name: "Morbihan", centerLat: 47.7500, centerLng: -2.7600 },
  { id: "dep-21", code: "21", name: "Côte-d'Or", centerLat: 47.3220, centerLng: 5.0415 },
  { id: "dep-54", code: "54", name: "Meurthe-et-Moselle", centerLat: 48.6921, centerLng: 6.1844 },
  { id: "dep-83", code: "83", name: "Var", centerLat: 43.4667, centerLng: 6.2167 },
  { id: "dep-37", code: "37", name: "Indre-et-Loire", centerLat: 47.3941, centerLng: 0.6848 },
  { id: "dep-49", code: "49", name: "Maine-et-Loire", centerLat: 47.4784, centerLng: -0.5632 },
  { id: "dep-63", code: "63", name: "Puy-de-Dôme", centerLat: 45.7772, centerLng: 3.0870 },
]

// ─── Villes françaises ─────────────────────────────────────────────────────────

function generateCityBoundary(lat: number, lng: number, rng: () => number, sizeKm: number = 5): [number, number][] {
  const points: [number, number][] = []
  const numPoints = 24
  const baseLat = sizeKm / 111
  const baseLng = sizeKm / (111 * Math.cos(lat * Math.PI / 180))
  for (let i = 0; i < numPoints; i++) {
    const angle = (2 * Math.PI * i) / numPoints
    const jitter = 0.7 + rng() * 0.6
    const pLat = lat + Math.cos(angle) * baseLat * jitter
    const pLng = lng + Math.sin(angle) * baseLng * jitter
    points.push([pLat, pLng])
  }
  points.push(points[0])
  return points
}

type CityDef = {
  name: string
  depCode: string
  depName: string
  lat: number
  lng: number
  pop: number
  area: number
}

const CITY_DEFS: CityDef[] = [
  { name: "Paris", depCode: "75", depName: "Paris", lat: 48.8566, lng: 2.3522, pop: 2161000, area: 105.4 },
  { name: "Marseille", depCode: "13", depName: "Bouches-du-Rhône", lat: 43.2965, lng: 5.3698, pop: 870731, area: 240.6 },
  { name: "Lyon", depCode: "69", depName: "Rhône", lat: 45.7640, lng: 4.8357, pop: 522969, area: 47.9 },
  { name: "Toulouse", depCode: "31", depName: "Haute-Garonne", lat: 43.6047, lng: 1.4442, pop: 498003, area: 118.3 },
  { name: "Nice", depCode: "06", depName: "Alpes-Maritimes", lat: 43.7102, lng: 7.2620, pop: 342669, area: 71.9 },
  { name: "Nantes", depCode: "44", depName: "Loire-Atlantique", lat: 47.2184, lng: -1.5536, pop: 318808, area: 65.2 },
  { name: "Montpellier", depCode: "34", depName: "Hérault", lat: 43.6108, lng: 3.8767, pop: 295542, area: 56.9 },
  { name: "Strasbourg", depCode: "67", depName: "Bas-Rhin", lat: 48.5734, lng: 7.7521, pop: 284677, area: 78.3 },
  { name: "Bordeaux", depCode: "33", depName: "Gironde", lat: 44.8378, lng: -0.5792, pop: 260958, area: 49.4 },
  { name: "Lille", depCode: "59", depName: "Nord", lat: 50.6292, lng: 3.0573, pop: 236234, area: 34.8 },
  { name: "Rennes", depCode: "35", depName: "Ille-et-Vilaine", lat: 48.1173, lng: -1.6778, pop: 222485, area: 50.4 },
  { name: "Reims", depCode: "51", depName: "Marne", lat: 49.2583, lng: 4.0317, pop: 182211, area: 46.9 },
  { name: "Saint-Étienne", depCode: "42", depName: "Loire", lat: 45.4397, lng: 4.3872, pop: 174082, area: 79.9 },
  { name: "Le Havre", depCode: "76", depName: "Seine-Maritime", lat: 49.4932, lng: 0.1079, pop: 170147, area: 46.9 },
  { name: "Toulon", depCode: "83", depName: "Var", lat: 43.1242, lng: 5.9280, pop: 171953, area: 42.8 },
  { name: "Grenoble", depCode: "38", depName: "Isère", lat: 45.1885, lng: 5.7245, pop: 158454, area: 18.1 },
  { name: "Dijon", depCode: "21", depName: "Côte-d'Or", lat: 47.3220, lng: 5.0415, pop: 159346, area: 40.4 },
  { name: "Angers", depCode: "49", depName: "Maine-et-Loire", lat: 47.4784, lng: -0.5632, pop: 155850, area: 42.7 },
  { name: "Nîmes", depCode: "30", depName: "Gard", lat: 43.8367, lng: 4.3601, pop: 151001, area: 161.8 },
  { name: "Clermont-Ferrand", depCode: "63", depName: "Puy-de-Dôme", lat: 45.7772, lng: 3.0870, pop: 147284, area: 42.7 },
  { name: "Aix-en-Provence", depCode: "13", depName: "Bouches-du-Rhône", lat: 43.5297, lng: 5.4474, pop: 145721, area: 186.1 },
  { name: "Brest", depCode: "29", depName: "Finistère", lat: 48.3904, lng: -4.4861, pop: 139386, area: 49.5 },
  { name: "Tours", depCode: "37", depName: "Indre-et-Loire", lat: 47.3941, lng: 0.6848, pop: 137658, area: 34.4 },
  { name: "Limoges", depCode: "87", depName: "Haute-Vienne", lat: 45.8336, lng: 1.2611, pop: 132175, area: 77.5 },
  { name: "Amiens", depCode: "80", depName: "Somme", lat: 49.8941, lng: 2.2958, pop: 134706, area: 49.5 },
  { name: "Perpignan", depCode: "66", depName: "Pyrénées-Orientales", lat: 42.6887, lng: 2.8948, pop: 121875, area: 68.1 },
  { name: "Metz", depCode: "57", depName: "Moselle", lat: 49.1193, lng: 6.1757, pop: 120205, area: 41.9 },
  { name: "Besançon", depCode: "25", depName: "Doubs", lat: 47.2378, lng: 6.0241, pop: 118836, area: 64.9 },
  { name: "Orléans", depCode: "45", depName: "Loiret", lat: 47.9029, lng: 1.9093, pop: 116238, area: 27.5 },
  { name: "Rouen", depCode: "76", depName: "Seine-Maritime", lat: 49.4432, lng: 1.0993, pop: 114007, area: 21.4 },
  { name: "Nancy", depCode: "54", depName: "Meurthe-et-Moselle", lat: 48.6921, lng: 6.1844, pop: 104072, area: 15.0 },
  { name: "Caen", depCode: "14", depName: "Calvados", lat: 49.1829, lng: -0.3707, pop: 106230, area: 25.7 },
  { name: "Argenteuil", depCode: "95", depName: "Val-d'Oise", lat: 48.9472, lng: 2.2467, pop: 113512, area: 17.2 },
  { name: "Montreuil", depCode: "93", depName: "Seine-Saint-Denis", lat: 48.8638, lng: 2.4483, pop: 111480, area: 8.9 },
  { name: "Saint-Denis", depCode: "93", depName: "Seine-Saint-Denis", lat: 48.9362, lng: 2.3574, pop: 113492, area: 12.4 },
  { name: "Versailles", depCode: "78", depName: "Yvelines", lat: 48.8014, lng: 2.1301, pop: 85205, area: 26.2 },
  { name: "Nanterre", depCode: "92", depName: "Hauts-de-Seine", lat: 48.8924, lng: 2.2071, pop: 96877, area: 12.2 },
  { name: "Créteil", depCode: "94", depName: "Val-de-Marne", lat: 48.7901, lng: 2.4555, pop: 92861, area: 11.5 },
  { name: "Avignon", depCode: "84", depName: "Vaucluse", lat: 43.9493, lng: 4.8055, pop: 93671, area: 64.8 },
  { name: "Poitiers", depCode: "86", depName: "Vienne", lat: 46.5802, lng: 0.3404, pop: 89212, area: 42.1 },
  { name: "La Rochelle", depCode: "17", depName: "Charente-Maritime", lat: 46.1603, lng: -1.1511, pop: 79344, area: 28.4 },
  { name: "Vannes", depCode: "56", depName: "Morbihan", lat: 47.6586, lng: -2.7600, pop: 55383, area: 32.3 },
  { name: "Pau", depCode: "64", depName: "Pyrénées-Atlantiques", lat: 43.2951, lng: -0.3708, pop: 77251, area: 31.5 },
  { name: "Bayonne", depCode: "64", depName: "Pyrénées-Atlantiques", lat: 43.4929, lng: -1.4748, pop: 52006, area: 21.7 },
  { name: "Cannes", depCode: "06", depName: "Alpes-Maritimes", lat: 43.5528, lng: 7.0174, pop: 74545, area: 19.6 },
]

function buildCities(): City[] {
  return CITY_DEFS.map((def) => {
    const rng = makePrng(hashString(def.name))
    const boundary = generateCityBoundary(def.lat, def.lng, rng, Math.sqrt(def.area) * 0.8)
    return {
      id: `city-${def.depCode}-${def.name.toLowerCase().replace(/[^a-z]/g, "")}`,
      name: def.name,
      departmentCode: def.depCode,
      departmentName: def.depName,
      latitude: def.lat,
      longitude: def.lng,
      population: def.pop,
      area_km2: def.area,
      boundary,
      stats: buildCityStats(def, rng),
    }
  })
}

function buildCityStats(def: CityDef, rng: () => number): CityStats {
  const isBigCity = def.pop > 200000
  const isParisRegion = ["75", "92", "93", "94", "78", "91", "95", "77"].includes(def.depCode)
  const isCoteDAzur = ["06", "83"].includes(def.depCode)

  let basePrix = r(rng, 2000, 4000)
  if (isParisRegion) basePrix = r(rng, 7000, 12000)
  else if (isCoteDAzur) basePrix = r(rng, 4500, 7500)
  else if (isBigCity) basePrix = r(rng, 3000, 5500)

  const nbLogements = r(rng, Math.floor(def.pop * 0.4), Math.floor(def.pop * 0.55))
  const tauxProp = r(rng, 25, 65)
  const maisons = r(rng, isParisRegion ? 5 : 25, isParisRegion ? 15 : 60)
  const apparts = 100 - maisons

  const prixEvolution: PricePoint[] = []
  let p = basePrix * rf(rng, 0.65, 0.75)
  for (let y = 2018; y <= 2025; y++) {
    p = Math.round(p * rf(rng, 1.01, 1.08))
    prixEvolution.push({ year: String(y), prix: p })
  }

  return {
    prixMoyenM2: basePrix,
    nbLogements,
    tauxProprietaires: tauxProp,
    tauxLocataires: 100 - tauxProp,
    logementsMaison: maisons,
    logementsAppartement: apparts,
    prixEvolution,
    repartitionTypes: [
      { type: "Appartement", count: Math.round(nbLogements * apparts / 100), pct: apparts },
      { type: "Maison", count: Math.round(nbLogements * maisons / 100), pct: maisons },
      { type: "Studio", count: r(rng, 500, 5000), pct: r(rng, 5, 15) },
      { type: "Loft", count: r(rng, 50, 500), pct: r(rng, 1, 3) },
    ],
    revenuMedian: r(rng, 18000, isParisRegion ? 45000 : 32000),
    densite: Math.round(def.pop / def.area),
    tauxChomage: rf(rng, 5.5, 12.5, 1),
  }
}

// ─── Logements (Properties) ────────────────────────────────────────────────────

const PROPERTY_TYPES: PropertyType[] = ["appartement", "maison", "studio", "loft", "duplex"]

const STREET_NAMES = [
  "Rue de la République", "Avenue Victor Hugo", "Boulevard Saint-Michel",
  "Rue des Lilas", "Place de la Liberté", "Rue Jean Jaurès",
  "Avenue Foch", "Rue Pasteur", "Boulevard Gambetta",
  "Rue du Commerce", "Avenue de la Gare", "Rue Voltaire",
  "Impasse des Roses", "Allée des Tilleuls", "Chemin du Moulin",
  "Rue de Rivoli", "Cours Mirabeau", "Place Bellecour",
  "Rue Saint-Catherine", "Avenue des Champs",
]

const FEATURES_POOL = [
  "Balcon", "Terrasse", "Parking", "Cave", "Ascenseur",
  "Gardien", "Digicode", "Interphone", "Chauffage central",
  "Double vitrage", "Parquet", "Cuisine équipée",
  "Piscine", "Jardin", "Garage", "Cellier",
  "Climatisation", "Cheminée", "Dressing", "Buanderie",
  "Fibre optique", "Vue dégagée", "Lumineux", "Calme",
]

const ENERGY_CLASSES: Property["energyClass"][] = ["A", "B", "C", "D", "E", "F", "G"]

function buildProperties(city: City): Property[] {
  const rng = makePrng(hashString(`properties-${city.id}`))
  const count = r(rng, 8, 18)
  const properties: Property[] = []

  for (let i = 0; i < count; i++) {
    const type = pick(rng, PROPERTY_TYPES)
    const isHouse = type === "maison"
    const surface = isHouse ? r(rng, 80, 250) : type === "studio" ? r(rng, 15, 35) : r(rng, 25, 130)
    const prixM2 = city.stats.prixMoyenM2 * rf(rng, 0.7, 1.4)
    const price = Math.round(surface * prixM2 / 1000) * 1000
    const rooms = type === "studio" ? 1 : isHouse ? r(rng, 3, 8) : r(rng, 2, 5)
    const bedrooms = Math.max(1, rooms - 1)
    const bathrooms = isHouse ? r(rng, 1, 3) : r(rng, 1, 2)
    const yearBuilt = r(rng, 1850, 2024)
    const energyIdx = yearBuilt > 2010 ? r(rng, 0, 2) : yearBuilt > 1980 ? r(rng, 2, 4) : r(rng, 3, 6)

    // Position légèrement aléatoire autour du centre
    const latOffset = (rng() - 0.5) * 0.04
    const lngOffset = (rng() - 0.5) * 0.04

    const numFeatures = r(rng, 3, 8)
    const features: string[] = []
    const shuffled = [...FEATURES_POOL].sort(() => rng() - 0.5)
    for (let f = 0; f < numFeatures && f < shuffled.length; f++) {
      features.push(shuffled[f])
    }

    const streetNum = r(rng, 1, 120)
    const street = pick(rng, STREET_NAMES)

    let imageUrl = "/properties/prop_modern_apt.png"
    if (isHouse) imageUrl = "/properties/prop_house.png"
    else if (type === "studio") imageUrl = "/properties/prop_studio.png"
    else if (type === "loft") imageUrl = "/properties/prop_loft.png"
    else if (yearBuilt < 1920) imageUrl = "/properties/prop_haussmann.png"

    properties.push({
      id: `prop-${city.id}-${i}`,
      cityId: city.id,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} ${rooms} pièces — ${city.name}`,
      type,
      price,
      surface,
      rooms,
      bedrooms,
      bathrooms,
      floor: isHouse ? undefined : r(rng, 0, 8),
      totalFloors: isHouse ? undefined : r(rng, 3, 12),
      yearBuilt,
      latitude: city.latitude + latOffset,
      longitude: city.longitude + lngOffset,
      address: `${streetNum} ${street}, ${city.name}`,
      description: generateDescription(type, rooms, surface, city.name, features, rng),
      features,
      energyClass: ENERGY_CLASSES[energyIdx],
      imageUrl,
    })
  }

  return properties
}

function generateDescription(
  type: PropertyType,
  rooms: number,
  surface: number,
  city: string,
  features: string[],
  rng: () => number
): string {
  const intros = [
    `Magnifique ${type} de ${rooms} pièces situé(e) en plein cœur de ${city}.`,
    `Charmant(e) ${type} de ${surface}m² idéalement placé(e) à ${city}.`,
    `Superbe ${type} ${rooms} pièces dans un quartier prisé de ${city}.`,
    `Bel(le) ${type} de ${surface}m², lumineux(se) et calme, à ${city}.`,
  ]
  const middles = [
    `Comprend ${rooms} pièces principales avec de belles prestations.`,
    `Entièrement rénové(e) avec des matériaux de qualité.`,
    `À proximité des commerces, écoles et transports en commun.`,
    `Idéal pour investissement locatif ou résidence principale.`,
  ]
  const featStr = features.length > 0 ? ` Équipements : ${features.slice(0, 4).join(", ")}.` : ""
  return `${pick(rng, intros)} ${pick(rng, middles)}${featStr}`
}

// ─── Cache & API publique ──────────────────────────────────────────────────────

let _cities: City[] | null = null
const _propertiesCache: Map<string, Property[]> = new Map()

export function getCities(): City[] {
  if (!_cities) _cities = buildCities()
  return _cities
}

export function getCity(cityId: string): City | undefined {
  return getCities().find((c) => c.id === cityId)
}

export function getCityByName(name: string): City | undefined {
  return getCities().find((c) => c.name.toLowerCase() === name.toLowerCase())
}

export function getCityProperties(cityId: string): Property[] {
  if (_propertiesCache.has(cityId)) return _propertiesCache.get(cityId)!
  const city = getCity(cityId)
  if (!city) return []
  const props = buildProperties(city)
  _propertiesCache.set(cityId, props)
  return props
}

export function getProperty(propertyId: string): Property | undefined {
  // Extract cityId from property id format "prop-{cityId}-{index}"
  const match = propertyId.match(/^prop-(city-[^-]+-[^-]+)-\d+$/)
  if (!match) return undefined
  const cityId = match[1]
  const props = getCityProperties(cityId)
  return props.find((p) => p.id === propertyId)
}

export function searchLocations(query: string): { departments: Department[]; cities: City[] } {
  const q = query.toLowerCase().trim()
  if (!q) return { departments: [], cities: [] }

  const departments = DEPARTMENTS.filter(
    (d) => d.name.toLowerCase().includes(q) || d.code.includes(q)
  ).slice(0, 5)

  const cities = getCities()
    .filter((c) => c.name.toLowerCase().includes(q) || c.departmentCode.includes(q))
    .slice(0, 10)

  return { departments, cities }
}

export function getDepartment(depId: string): Department | undefined {
  return DEPARTMENTS.find((d) => d.id === depId)
}

export function getCitiesByDepartment(depCode: string): City[] {
  return getCities().filter((c) => c.departmentCode === depCode)
}

// ─── Formatters ────────────────────────────────────────────────────────────────

export function formatPrice(price: number): string {
  if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)} M€`
  if (price >= 1_000) return `${Math.round(price / 1_000)} K€`
  return `${price} €`
}

export function formatPopulation(pop: number): string {
  if (pop >= 1_000_000) return `${(pop / 1_000_000).toFixed(1)} M`
  if (pop >= 1_000) return `${(pop / 1_000).toFixed(0)} K`
  return pop.toLocaleString("fr-FR")
}
