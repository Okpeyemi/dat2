# Grigri UI — Document d'architecture

> Tableau de bord agricole intelligent pour l'analyse en temps réel des données météo, cultures et risques climatiques par région.
> URL de production : **https://grigri.exkson.tech**

---

## 1. Vue d'ensemble

Grigri est une **Single-Page Application** construite avec Next.js (App Router). Elle offre une interface cartographique interactive permettant à un opérateur de :

- Visualiser les régions agricoles sur une carte interactive (Leaflet)
- Sélectionner une zone par clic ou géolocalisation
- Consulter les données météo temps réel (température, humidité, humidité du sol, pH)
- Analyser des indicateurs agricoles simulés (NDVI, irrigation, sécheresse…) dans un panneau latéral

L'application communique avec une **API externe** (`api.grigri.exkson.tech`) via des **Route Handlers Next.js** qui font office de proxy BFF (Backend For Frontend).

---

## 2. Stack technique

### Frontend

| Technologie | Version | Rôle |
|---|---|---|
| **Next.js** | 16.x | Framework React (App Router, RSC, Route Handlers) |
| **React** | 19.x | Bibliothèque UI |
| **TypeScript** | 5.x | Typage statique |
| **Tailwind CSS** | 4.x | Styles utilitaires |
| **shadcn/ui** | 3.x | Composants UI (Radix UI + Tailwind) |
| **Radix UI** | 1.x | Primitives accessibles |
| **Leaflet** | 1.9.x | Carte interactive |
| **react-leaflet** | 5.x | Bindings React pour Leaflet |
| **Recharts** | 2.x | Graphiques (Bar, Area, Radar) |
| **next-themes** | 0.4.x | Gestion thème clair/sombre |
| **HugeIcons** | 3.x | Bibliothèque d'icônes |
| **Geist / Outfit** | — | Typographies (Google Fonts via next/font) |
| **sonner** | 2.x | Notifications toast |
| **date-fns** | 4.x | Manipulation de dates |
| **clsx + tailwind-merge** | — | Utilitaires de classes CSS |

### Infrastructure & Outillage

| Outil | Usage |
|---|---|
| **Docker** (multi-stage) | Conteneurisation pour la production |
| **Node.js 22 Alpine** | Image de base légère |
| **ESLint** | Linting (config Next.js) |
| **npm** | Gestionnaire de paquets |

### APIs externes

| API | Usage | Cache |
|---|---|---|
| `api.grigri.exkson.tech` | Données agricoles (régions, météo) | ISR / no-store |
| `nominatim.openstreetmap.org` | Géocodage inverse (nom du lieu au clic) | force-cache |
| **OpenStreetMap** (tiles) | Fonds de carte | Navigateur |

---

## 3. Architecture des répertoires

```
grigiri-ui/
├── app/                        # App Router Next.js
│   ├── layout.tsx              # Layout racine (polices, thème, SEO metadata)
│   ├── page.tsx                # Page principale (shell de l'application)
│   ├── globals.css             # Variables CSS, reset global
│   └── api/                   # Route Handlers — Proxy BFF
│       ├── land/
│       │   ├── regions/
│       │   │   ├── route.ts              # GET /api/land/regions
│       │   │   ├── nearest/route.ts      # GET /api/land/regions/nearest
│       │   │   └── within-radius/route.ts# GET /api/land/regions/within-radius
│       │   └── weather/route.ts          # GET /api/land/weather
│       └── nominatim/
│           └── reverse/route.ts          # GET /api/nominatim/reverse
│
├── components/                 # Composants React
│   ├── map-view.tsx            # Carte Leaflet + contrôles (composant noyau)
│   ├── map-container.tsx       # Wrapper (dynamic import SSR:false pour Leaflet)
│   ├── farm-side-panel.tsx     # Panneau latéral droit — données & graphiques
│   ├── icon-sidebar.tsx        # Barre de navigation verticale gauche
│   ├── region-modal.tsx        # Modal d'aperçu rapide d'une région
│   ├── country-preview-modal.tsx # Modal de prévisualisation Nominatim
│   ├── theme-provider.tsx      # Provider next-themes
│   └── ui/                    # Composants génériques shadcn/ui
│       ├── button.tsx, card.tsx, badge.tsx, …
│       ├── chart.tsx           # Wrapper ChartContainer Recharts
│       ├── skeleton.tsx        # Squelettes de chargement
│       └── … (40+ composants)
│
├── lib/
│   ├── api.ts                  # Fonctions fetch typées + types partagés
│   ├── mock-dashboard.ts       # Données simulées pour le panneau (indicateurs)
│   └── utils.ts                # cn() helper
│
├── hooks/
│   └── use-mobile.ts           # Hook détection mobile
│
├── public/                     # Assets statiques
├── Dockerfile                  # Build multi-stage (deps → builder → runner)
├── next.config.ts              # output: "standalone"
├── tsconfig.json
├── eslint.config.mjs
└── components.json             # Config shadcn
```

---

## 4. Architecture applicative

### 4.1 Flux de données principal

```
Utilisateur
    │
    ▼
┌─────────────────────────────────────────────────────┐
│                     page.tsx                        │
│  État global : weather, selectedRegion, error…      │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │ IconSidebar  │  │ MapContainer │  │FarmSidePanel│ │
│  │  (nav)       │  │  + MapView   │  │ (données) │ │
│  └──────────────┘  └──────┬───────┘  └─────▲─────┘ │
│                           │  callbacks      │       │
│                           └─────────────────┘       │
└─────────────────────────────────────────────────────┘
    │
    ▼ fetch (via Route Handlers BFF)
┌─────────────┐       ┌────────────────────────┐
│  API BFF    │──────▶│ api.grigri.exkson.tech  │
│  (Next.js)  │       └────────────────────────┘
│             │──────▶│ nominatim.openstreetmap │
└─────────────┘       └────────────────────────┘
```

### 4.2 Composant `MapView` (cœur de la carte)

`map-view.tsx` orchestre :

- **`MapContainer` / `TileLayer`** : fond OSM
- **`GeoJSON` / `Polygon` / `Circle`** : affichage des frontières et zones de rayon
- **`FlyToLocation`** : animation de zoom vers la région sélectionnée
- **`CustomZoomControl`** : boutons zoom + + géolocalisation GPS
- **Sélecteur de rayon** : 10 / 50 / 100 / 250 / 500 km
- **Sélecteur de type de région** : country / state / city / district / champ / parcelle
- Lors d'un **clic sur la carte** : appel `fetchLandRegionsNearest` → fetch météo → mise à jour du panneau
- Lors du **chargement initial** : appel `fetchLandRegions` pour pré-charger les régions

> Leaflet ne supporte pas le SSR ; `MapContainer` est importé en `dynamic()` avec `ssr: false`.

### 4.3 Panneau `FarmSidePanel`

Panneau droit collapsible organisé en **3 onglets** :

| Onglet | Contenu |
|---|---|
| **Météo** | Température, humidité, humidité du sol, pH (données réelles API) |
| **Cultures** | NDVI, détection maladies, surface cultivée (données simulées mock) |
| **Analyses** | Rendements, risque sécheresse, indice climatique — graphiques Recharts |

Chaque section affiche des **Skeleton** pendant le chargement et gère les états d'erreur.

### 4.4 Route Handlers (BFF Proxy)

Les routes API Next.js jouent le rôle de **proxy** pour :

1. **Masquer les URLs de l'API externe** au client
2. **Gérer le cache** côté serveur (ISR pour les régions, no-store pour la météo)
3. **Normaliser les erreurs** (format JSON cohérent)
4. **Contourner les restrictions CORS** éventuelles

| Route | Cache | Description |
|---|---|---|
| `GET /api/land/regions` | `revalidate: 300` (5 min) | Liste des régions |
| `GET /api/land/regions/nearest` | `revalidate: 60` (1 min) | Région la plus proche |
| `GET /api/land/regions/within-radius` | `revalidate: 60` | Régions dans un rayon |
| `GET /api/land/weather` | `no-store` | Données météo temps réel |
| `GET /api/nominatim/reverse` | `force-cache` | Géocodage inverse |

---

## 5. Modèle de données

### `WeatherData`

```typescript
{
  temperature:   { min: string; max: string; current: string }
  humidity:      { min: string; max: string; current: string }
  soil_moisture: { min: string; max: string; current: string }
  ph_level:      { min: string; max: string; current: string }
}
```

### `Region`

```typescript
{
  id:        string
  name:      string
  latitude:  number
  longitude: number
  kind?:     "country" | "state" | "city" | "district" | "field" | "parcel"
  area_m2?:  number
  boundary?: [number, number][]  // [lat, lng][] — converti depuis GeoJSON [lng, lat]
}
```

---

## 6. Indicateurs agricoles (roadmap implémentation)

Définis dans `implementation.md`, ces indicateurs seront intégrés au panneau une fois les données réelles disponibles :

| Indicateur | Format | Source |
|---|---|---|
| NDVI (santé cultures) | Heatmap + série temporelle | Satellite Sentinel/Landsat |
| Humidité des sols | Carte + gauge | Capteurs IoT / satellite |
| Qualité des sols | Carte choroplèthe | Analyses terrain |
| Détection maladies végétales | Carte + bar chart | Images drone + CV |
| Rendement estimé | Bar chart + projection | ML |
| Taux d'irrigation | Gauge + trend line | IoT |
| Indice climatique agricole | Radar chart | API météo |
| Surface cultivée active | Carte + KPI | Imagerie satellite |
| Indice de risque sécheresse | Heatmap | Données climat |
| Productivité par hectare | Bar chart comparatif | Données production |

---

## 7. Déploiement

### Build Docker (multi-stage)

```
Stage 1 — deps     : npm ci (installation des dépendances)
Stage 2 — builder  : npm run build (Next.js standalone)
Stage 3 — runner   : image allégée, user non-root (nextjs:nodejs)
                     PORT 3000, HOSTNAME 0.0.0.0
```

Le mode `output: "standalone"` de Next.js génère un bundle autonome sans besoin de `node_modules` en production.

### Variables d'environnement

| Variable | Valeur | Contexte |
|---|---|---|
| `NODE_ENV` | `production` | Runtime |
| `NEXT_TELEMETRY_DISABLED` | `1` | Build & Runtime |
| `PORT` | `3000` | Runtime |
| `HOSTNAME` | `0.0.0.0` | Runtime |

---

## 8. SEO & Metadata

Configurés dans `app/layout.tsx` :

- **Open Graph** : title, description, image `/og-image.png` (1200×630)
- **Twitter Card** : `summary_large_image`
- **Viewport** : `themeColor` adaptatif clair/sombre
- **Robots** : indexé, suivi, Google Bot max-image-preview large
- **Locale** : `fr_FR`

---

## 9. Conventions de code

- **`"use client"`** explicite sur tous les composants interactifs
- **Imports absolus** via alias `@/` (configuré dans `tsconfig.json`)
- **`cn()`** (clsx + tailwind-merge) pour la composition de classes
- **Types partagés** centralisés dans `lib/api.ts`
- Composants UI génériques dans `components/ui/` (shadcn — ne pas modifier manuellement)
- Données de démonstration dans `lib/mock-dashboard.ts` (à remplacer par des appels API réels)
