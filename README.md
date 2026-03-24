# Grigiri UI

Agricultural monitoring dashboard built with Next.js, shadcn/ui, Leaflet and Recharts.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **Tailwind CSS v4** + **shadcn/ui**
- **HugeIcons** — icon library
- **next-themes** — light / dark mode
- **Leaflet + react-leaflet** — interactive map with OpenStreetMap tiles
- **Recharts** — charts via shadcn `ChartContainer`

## Prérequis

- Node.js ≥ 20
- npm ≥ 10

## Développement

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement (port 3000)
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Build de production

```bash
npm run build
npm run start
```

## Docker

Build et lancement avec Docker :

```bash
docker build -t grigiri-ui .
docker run -p 3000:3000 grigiri-ui
```

Ouvrir [http://localhost:3000](http://localhost:3000).

> L'image utilise un build multi-stage (deps → builder → runner) basé sur `node:22-alpine` avec `output: "standalone"` pour minimiser la taille finale.
