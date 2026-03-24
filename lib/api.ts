/**
 * lib/api.ts
 *
 * Types simplifiés pour la carte immobilière.
 * Plus aucune liaison API backend — tout est local via mock-data.ts.
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

/** Région affichable sur la carte (ville ou département) */
export type Region = {
  id: string
  name: string
  latitude: number
  longitude: number
  kind?: "city" | "department"
  area_km2?: number
  /** Contour en [lat, lng][] pour Leaflet Polygon */
  boundary?: [number, number][]
}
