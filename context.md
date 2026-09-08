# TerraVoxel — Agent Context File

> **Self-reference file for the AI agent.** Update this file continuously as features are added,
> removed, or changed. Use the TODO list below as the live execution checklist.

---

## 1. Project Overview

**TerraVoxel** is a carbon-credit decision-support platform. Users draw a land boundary on a map,
input constraints, and receive a fully-costed plantation blueprint with verified carbon-yield
projections and IRR calculations. This file covers **only the two frontend visualization modules**
assigned to this session.

---

## 2. Scope — Two Modules Being Built

### Module 1 · Geospatial Boundary Acquisition (Polygon Drawer)

**Purpose:** Let the user locate their parcel on an interactive map, manually trace its precise
boundary, and export a validated GeoJSON Polygon.

**Key Behaviours:**
- Receive `{ project_id, coordinate: [lng, lat] }` from the parent app -> fly map camera to that coordinate.
- Render a **Leaflet** map (satellite + streets style, preferably ESRI World Imagery).
- Activate a **draw mode** via `leaflet-draw` so the user can click-trace the polygon perimeter.
- Live side-panel shows: calculated area (ha / acres) via `@turf/area`, vertex count, validation status.
- User can **undo last vertex**, **clear polygon**, and **zoom-to-fit** the drawn shape.
- On "Generate 3D Scene" button click:
  - Validate polygon (>= 4 vertices, area > 0, no self-intersections via `@turf/kinks`).
  - Serialize to GeoJSON Feature `{ type:"Feature", geometry:{type:"Polygon",...}, properties:{project_id, area_ha, area_acres} }`.
  - Persist to `localStorage` (key: `tv_geojson_<project_id>`) and to Redux `mapSlice`.
  - Trigger page transition to Module 2.

**Input JSON:**
```json
{ "project_id": "proj_2024_001", "coordinate": [78.12345678, 28.456789] }
```

**Output GeoJSON:**
```json
{
  "type": "Feature",
  "geometry": { "type": "Polygon", "coordinates": [[[78.12,28.45]]] },
  "properties": { "project_id": "proj_2024_001", "area_ha": 12.4, "area_acres": 30.6 }
}
```

---

### Module 2 · Terrain Reconstruction & Plantation Simulation (3D Viewer)

**Purpose:** Ingest the GeoJSON + plantation blueprint -> generate a photorealistic 3D terrain with
Poisson-disk-sampled tree placement and a time-slider growth simulation.

**Three Data Inputs:**
1. **GeoJSON Polygon** from Module 1 (localStorage / Redux).
2. **Dashboard Metadata** `{ project_id, usable_area_sqm, total_area_sqm, time_horizon_years, tree_count, species_name }`.
3. **Backend Species Plan** `{ project_id, species:{name, scientific_name, count, min_spacing_m, max_height_m, canopy_radius_m}, time_horizon_years, carbon_credits_per_year:[] }`.

**Processing Pipeline:**

| Step | Action | Library |
|------|---------|---------|
| 1 | Parse GeoJSON | turf |
| 2 | Initialize MapLibre GL JS map with ESRI World Imagery and 3D terrain (via AWS Open Data or Mapzen Terrarium) | maplibre-gl |
| 3 | Run Poisson Disk Sampling inside polygon boundary to generate tree coordinates | fast-poisson-disk-sampling |
| 4 | Create a MapLibre `CustomLayerInterface` to render Three.js objects over the map | maplibre-gl + three |
| 5 | Instance Minecraft-style blocky models (currently placeholder Green Boxes) at all sampled positions using Three.js | Three.js InstancedMesh |
| 6 | Attach time-slider -> swap to the appropriate discrete growth stage model and update HUD metrics based on backend array | React state |
| 9 | Attach time-slider -> Chapman-Richards growth curves -> scale instances | R3F useFrame animation |
| 10 | HUD overlay: carbon bar, credit counter update per year | React state / R3F Html |

**Growth & Carbon Metrics:**
No heavy frontend calculation is needed. The HUD directly uses the `carbon_credits_per_year` array from the backend JSON.
Instead of continuously scaling a single model, the time slider swaps out discrete predefined 3D models for each growth stage (e.g., `bamboo_stage1.glb`, `bamboo_stage2.glb`).
Trees are modeled as low-poly, Minecraft-style objects (e.g., ~5 green boxes for leaves, ~3 brown boxes for the trunk). Currently, a single green box is used as a placeholder.

**Outputs back to parent dashboard:**
- Tree Positions JSON
- Animation State JSON (live)

---

## 3. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React via Vite | 18.x |
| 3D Rendering | Three.js (via MapLibre CustomLayer) | latest |
| Map (Module 1 & 2) | MapLibre GL JS | latest |
| Geospatial Math | @turf/turf | 7.x |
| Poisson Sampling | poisson-disk-sampling | 2.x |
| Routing | React Router DOM | 6.x |
| State Management | Redux Toolkit | 2.x |
| Styling | Tailwind CSS + Glassmorphism components | — |
| Build | Vite | 5.x |

**Environment Variables:**
```
VITE_API_BASE_URL=http://localhost:8000
```

---

## 3.5 Design System — "Alabaster Voxel" Theme

### Mood Reference
Minecraft with shaders enabled — warm golden-hour sunlight washing over blocky terrain,
soft ambient occlusion in the shadows, lush greens with bright undertones, earthy terracottas.
NOT dark/moody/cyberpunk. The canvas is bright and light; accents are warm and saturated but
never harsh. High contrast is used only for legibility of financial data, never for decoration.

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-canvas` | `#F8FAFC` | Base page background (Alabaster White) |
| `--color-canvas-raised` | `#FFFFFF` | Card / panel surfaces |
| `--color-canvas-sunken` | `#F1F5F9` | Input fields, recessed areas |
| `--color-ink-primary` | `#0F172A` | Body text, coordinates, borders (Deep Slate) |
| `--color-ink-secondary` | `#475569` | Secondary labels, captions |
| `--color-ink-muted` | `#94A3B8` | Placeholder text, disabled states |
| `--color-accent-emerald` | `#10B981` | Positive yield, active states, primary CTA (Emerald Green) |
| `--color-accent-emerald-soft` | `#D1FAE5` | Emerald tint backgrounds, success chips |
| `--color-accent-terra` | `#D97706` | 3D terrain soil layer, warning states (Terracotta) |
| `--color-accent-terra-soft` | `#FEF3C7` | Terracotta tint backgrounds |
| `--color-accent-violet` | `#8B5CF6` | 3D terrain water/boundary layer (Muted Purple) |
| `--color-accent-violet-soft` | `#EDE9FE` | Violet tint backgrounds |
| `--color-border` | `rgba(15,23,42,0.10)` | Default borders |
| `--color-border-focus` | `#10B981` | Focus rings on inputs |
| `--color-glass-bg` | `rgba(255,255,255,0.70)` | Glassmorphism panel fill (frosted WHITE, not dark) |
| `--color-glass-border` | `rgba(255,255,255,0.90)` | Glassmorphism panel border highlight |
| `--color-grid-line` | `rgba(15,23,42,0.05)` | Background wireframe / grid motif lines |

> **Minecraft-shader principle:** Every surface should feel sun-drenched. If a color looks too grey
> or too dark in isolation, warm it up slightly toward amber/cream. Avoid pure greys.

### Shadows (warm-tinted, not neutral grey)

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-xs` | `0 1px 2px rgba(15,23,42,0.06)` | Subtle lift |
| `--shadow-sm` | `0 2px 6px rgba(15,23,42,0.08)` | Cards |
| `--shadow-md` | `0 4px 16px rgba(15,23,42,0.10)` | Dropdowns, panels |
| `--shadow-lg` | `0 8px 32px rgba(15,23,42,0.12)` | Modals |
| `--shadow-emerald` | `0 4px 20px rgba(16,185,129,0.18)` | CTA button glow |
| `--shadow-glass` | `0 8px 32px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.9)` | Glass panels |

### Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Primary / Brand | **Paprika** (Google Fonts) | 400 | Headers, nav labels, UI buttons, narrative text |
| Data / Math | **JetBrains Mono** | 400 / 500 | Coordinates, financial numbers, API loading states, ROI metrics, carbon credit totals |
| Body | Paprika fallback to `serif` | 400 | Paragraph text in sidebars |

> **Why Paprika?** Its slightly rough, hand-cut letterforms echo the organic, agricultural
> character of the land. Paired with the clinical precision of JetBrains Mono for numbers,
> the contrast mirrors the platform's dual nature: land + finance.

**Scale (CSS vars to define):**
```
--text-xs   : 0.75rem
--text-sm   : 0.875rem
--text-base : 1rem
--text-lg   : 1.125rem
--text-xl   : 1.25rem
--text-2xl  : 1.5rem
--text-3xl  : 1.875rem
--text-4xl  : 2.25rem
```

### Border Radius — Sharp Voxel Geometry

```
--radius-none : 0px
--radius-sm   : 2px    ← default for most elements
--radius-md   : 4px    ← buttons, inputs, cards
--radius-lg   : 6px    ← modals, large panels
--radius-full : 999px  ← ONLY for pill badges/tags
```

> No heavy rounding. Sharp corners reinforce the blocky, isometric voxel aesthetic.
> A `4px` card corner feels precise; `12px+` would feel like a generic SaaS UI.

### Glassmorphism Rules (Frosted WHITE panels)

- Background: `rgba(255,255,255,0.70)` — NOT dark-tinted
- Border: `1px solid rgba(255,255,255,0.90)` — bright highlight edge
- Backdrop filter: `blur(12px) saturate(160%)` — saturate pulls in warm terrain colors behind
- Box shadow: `--shadow-glass`
- Usage: coordinate receipt panel, HUD overlay, draw-controls sidebar, dropdowns

> The saturation boost on `backdrop-filter` is the Minecraft-shader trick — it makes the map
> and 3D terrain colors gently bloom through the frosted glass, creating that warm, luminous
> depth without any explicit glow effects.

### Background Grid / Wireframe Motif

- 1px lines at `rgba(15,23,42,0.05)` on `#F8FAFC` canvas
- Grid cell: `40px × 40px` (communicates mathematical land division)
- Applied to: empty states, loading screens, the sidebar background
- CSS: `background-image: linear-gradient(var(--color-grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-grid-line) 1px, transparent 1px); background-size: 40px 40px;`

### 3D Scene Lighting Palette (Minecraft Shader Reference)

| Light | Color | Intensity | Notes |
|-------|-------|-----------|-------|
| Directional (sun) | `#FFF5C8` warm cream | 2.2 | Low angle (45°) for long soft shadows |
| Ambient | `#C8E6FF` sky blue | 0.6 | Cool fill from above to simulate open sky |
| Hemisphere sky | `#87CEEB` | 0.8 | Sky color |
| Hemisphere ground | `#8B7355` sandy brown | 0.4 | Warm bounce from soil |

> Result: trees lit warm gold on top, cool blue-grey in shadow, warm bounce on undersides.
> Classic Minecraft BSL/Sildur shader look.

### HUD Color Assignments

| Element | Color Token |
|---------|-------------|
| Carbon sequestered bar fill | `--color-accent-emerald` |
| Carbon bar track | `--color-accent-emerald-soft` |
| Credit counter number | JetBrains Mono, `--color-ink-primary` |
| Year indicator | JetBrains Mono, `--color-accent-terra` |
| Avg height metric | JetBrains Mono, `--color-accent-violet` |
| HUD panel background | `--color-glass-bg` with `backdrop-blur` |

---

## 4. Asset Naming Convention

Tree models live in `/public/assets/models/` named by exact species name:
```
/public/assets/models/Bamboo.glb
/public/assets/models/Teak.glb
/public/assets/models/Neem.glb
/public/assets/models/Acacia.glb
```

---

## 5. Data Flow

```
[Parent App]
    | { project_id, coordinate }
    v
[Module 1: PolygonDrawerPage]
    | User traces polygon on Leaflet map
    | Validates, computes area
    v Clicks "Generate 3D Scene"
[localStorage + Redux mapSlice]
    | GeoJSON Feature stored
    v
[Module 2: Scene3DPage]
    | Reads GeoJSON + backend payload + dashboard metadata
    | Terrain generation -> Poisson sampling -> Tree placement
    | Time slider -> growth animation -> HUD updates
    v
[Parent Dashboard]
    +- tree_positions JSON (logging/export)
    +- animation_state JSON (live HUD)
```

---

## 6. Error Codes

| Code | Meaning |
|------|---------|
| GEO_003 | Insufficient area for requested tree count |

---

## 7. Directory Structure

> Legend: ✅ = implemented  ·  📄 = stub (comment-only placeholder)  ·  🎨 = design reference

├── frontend/
│   ├── public/
│   │   ├── index.html                         ✅
│   │   └── assets/models/                     (GLBs go here: Bamboo.glb, Teak.glb, etc.)
│   │
│   ├── src/
│   │   ├── main.jsx                           ✅  React entrypoint, Provider + globals.css
│   │   ├── AppRoutes.jsx                      ✅  BrowserRouter, /map/:id, /scene/:id
│   │   ├── App.jsx                            📄  (unused — main.jsx imports AppRoutes directly)
│   │   │
│   │   ├── modules/
│   │   │   ├── map/                           ← MODULE 1: Polygon Drawer
│   │   │   │   ├── components/
│   │   │   │   │   ├── MapContainer.jsx        📄
│   │   │   │   │   ├── PolygonDrawer.jsx       📄
│   │   │   │   │   ├── DrawControls.jsx        📄
│   │   │   │   │   ├── AreaDisplay.jsx         📄
│   │   │   │   │   └── MapControls.jsx         📄
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useMapboxDraw.js        📄
│   │   │   │   │   └── usePolygonValidation.js 📄
│   │   │   │   ├── services/
│   │   │   │   │   └── geojsonSerializer.js    📄
│   │   │   │   ├── styles/
│   │   │   │   │   └── map.css                📄
│   │   │   │   └── index.js                   📄
│   │   │   │
│   │   │   └── visualization/                 ← MODULE 2: 3D Scene
│   │   │       ├── components/
│   │   │       │   ├── Scene3D.jsx             📄
│   │   │       │   ├── TerrainMesh.jsx         📄
│   │   │       │   ├── TreeInstances.jsx       📄
│   │   │       │   ├── SceneCamera.jsx         📄
│   │   │       │   ├── SceneLighting.jsx       📄
│   │   │       │   └── HUDOverlay.jsx          📄
│   │   │       ├── controls/
│   │   │       │   ├── TimeSlider.jsx          📄
│   │   │       │   └── SceneToolbar.jsx        📄
│   │   │       ├── hooks/
│   │   │       │   ├── useTerrainData.js       📄
│   │   │       │   ├── usePoissonSampling.js   📄
│   │   │       │   ├── useGrowthAnimation.js   📄
│   │   │       │   └── useCarbonMetrics.js     📄
│   │   │       ├── engine/
│   │   │       │   ├── terrainBuilder.js       📄
│   │   │       │   ├── poissonSampler.js       📄
│   │   │       │   ├── growthCurves.js         📄
│   │   │       │   └── carbonAccounting.js     📄
│   │   │       ├── services/
│   │   │       │   ├── elevationAPI.js         📄
│   │   │       │   └── treePositionExporter.js 📄
│   │   │       ├── styles/
│   │   │       │   └── scene.css              📄
│   │   │       └── index.js                   📄
│   │   │
│   │   ├── pages/
│   │   │   ├── PolygonDrawerPage.jsx           📄
│   │   │   └── Scene3DPage.jsx                 📄
│   │   │
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── LoadingSpinner.jsx          📄
│   │   │   │   └── ErrorBoundary.jsx           📄
│   │   │   ├── hooks/
│   │   │   │   └── useLocalStorage.js          ✅  localStorage bridge between modules
│   │   │   ├── store/
│   │   │   │   ├── store.js                   ✅  configureStore({map, scene})
│   │   │   │   ├── mapSlice.js                ✅  polygon, projectId, isDrawing
│   │   │   │   ├── sceneSlice.js              ✅  treePositions, currentYear, carbonMetrics
│   │   │   │   └── slices/                    📄  (old stubs — superseded by files above)
│   │   │   ├── utils/
│   │   │   │   ├── constants.js               📄
│   │   │   │   └── formatters.js              📄
│   │   │   └── styles/
│   │   │       ├── theme.css                  ✅  Alabaster Voxel design tokens
│   │   │       └── globals.css                ✅  CSS reset + grid motif + .glass-panel
│   │   │
│   │   └── routes/
│   │       └── AppRoutes.jsx                  📄  (old stub — superseded by src/AppRoutes.jsx)
│   │
│   ├── prototypes/                            🎨  Design reference prototypes (HTML/CSS/PNG)
│   │   ├── page1.html / screen1.png           🎨  Landing / geo-spatial page
│   │   ├── page2.html / screen2.png           🎨  Parameter terminal
│   │   └── page3.html / screen3.png           🎨  Polygon drawer UI
│   │
│   ├── .env.example                           ✅
│   ├── vite.config.js                         ✅
│   ├── package.json                           ✅
│   └── README.md                              📄
│
├── docs/
│   ├── archives/                              📦  ZIP archives of prototypes
│   │   ├── page 1.zip
│   │   ├── page 2.zip
│   │   └── stitch_terravoxel_polygon_drawer.zip
│   ├── json_config.md                         ✅  I/O JSON specs
│   └── TerraVoxel.docx                        ✅  Original project documentation
│
├── backend/                                   📄  Backend stub
├── DESIGN1.md / DESIGN2.md                    🎨  Material Design token spec
└── context.md                                 ✅  This file

### Design Reference Files (pre-existing)

These files were created before the React scaffold and serve as **visual reference only**.
They use Tailwind CSS via CDN and different font stacks (Epilogue, Plus Jakarta Sans, Public Sans).
The React build uses the Alabaster Voxel theme (§3.5) with Paprika + JetBrains Mono instead.

| File | Purpose | Notes |
|------|---------|-------|
| `frontend/prototypes/page1.html` | Landing / geo-spatial page with 3D globe | Uses Three.js r128 CDN, cream/emerald palette |
| `frontend/prototypes/page2.html` | Parameter Terminal form (coords, soil, climate) | Split-pane: dark map left, white form right |
| `frontend/prototypes/page3.html` | Polygon Drawer UI | Leaflet tracer interface |
| `DESIGN1.md` / `DESIGN2.md` | Material Design token spec | Identical files. Use as mood reference for component shapes. |
| `frontend/prototypes/screen*.png` | Screenshots of the above prototypes | Visual-only reference |
| `docs/archives/*.zip` | Original source archives | Backup |

---

## 8. TODO List (Execution Checklist)

### Phase 0 — Scaffold ✅
- [x] Manual Vite project setup (package.json + vite.config.js)
- [x] Install all npm dependencies (Vite 5.x resolved, then audit-fixed to 8.x)
- [x] Set up Vite config (alias @ -> src/, GLB asset handling)
- [x] Create all directories and placeholder stub files
- [x] Create .env.example

### Phase 1 — Design System & State ✅
- [x] theme.css — Alabaster Voxel design tokens (light canvas, Paprika + JetBrains Mono)
- [x] globals.css — CSS reset, base typography, grid motif, .glass-panel utility
- [x] store.js + mapSlice.js + sceneSlice.js (Redux store)
- [x] useLocalStorage.js hook (state bridge between modules)
- [x] main.jsx (React entrypoint with Provider + globals.css)
- [x] AppRoutes.jsx (placeholder routes for /map/:id and /scene/:id)

### Phase 2 — Module 1: Polygon Drawer
- [ ] MapContainer.jsx — Leaflet init, fly-to coordinate
- [ ] PolygonDrawer.jsx — integrate leaflet-draw
- [ ] DrawControls.jsx — Undo vertex, Clear, Zoom-to-fit buttons
- [ ] AreaDisplay.jsx — live area in ha / acres via @turf/area
- [ ] useLeafletDraw.js — hook encapsulating draw events
- [ ] usePolygonValidation.js — kinks check, min vertex count
- [ ] geojsonSerializer.js — build output Feature with properties
- [ ] MapControls.jsx — zoom in/out, compass reset
- [ ] map.css — Leaflet container + sidebar styling
- [ ] PolygonDrawerPage.jsx — assemble all components, sidebar
- [ ] Generate 3D Scene button -> validate -> persist -> navigate

### Phase 3 — Module 2: 3D Visualization
- [ ] elevationAPI.js — fetch AWS Open Data or Mapzen Terrarium tiles, decode elevation
- [ ] terrainBuilder.js — PlaneGeometry + vertex displacement from elevation raster
- [ ] TerrainMesh.jsx — R3F mesh with satellite texture + elevation
- [ ] SceneCamera.jsx — OrbitControls via drei, initial camera position
- [ ] SceneLighting.jsx — directional sun + ambient + hemisphere lights (§3.5 lighting table)
- [ ] poissonSampler.js — poisson-disk-sampling within GeoJSON polygon bounds
- [ ] usePoissonSampling.js — hook that runs sampler, memoizes result
- [ ] TreeInstances.jsx — InstancedMesh per species GLB; ray-cast to terrain for Y
- [ ] growthCurves.js — Chapman-Richards H(t); scale factor per year
- [ ] useGrowthAnimation.js — animate InstancedMesh matrices per currentYear
- [ ] carbonAccounting.js — compute biomass, CO2e, credits per year
- [ ] useCarbonMetrics.js — hook exposing per-year carbon state
- [ ] TimeSlider.jsx — range input 1->N years, updates Redux currentYear
- [ ] SceneToolbar.jsx — toggle wireframe, reset camera, screenshot
- [ ] HUDOverlay.jsx — carbon bar, credit counter, avg height (§3.5 HUD color table)
- [ ] treePositionExporter.js — XY + elevation -> lat/lon output JSON
- [ ] Scene3DPage.jsx — assemble all components

### Phase 4 — Routing & Integration
- [x] AppRoutes.jsx — React Router /map/:project_id and /scene/:project_id (basic)
- [ ] Wire PolygonDrawerPage into /map route
- [ ] Wire Scene3DPage into /scene route
- [ ] Pass Module 2 output state to parent via Redux

### Phase 5 — Polish
- [ ] Loading states (terrain fetch, model load)
- [ ] Error boundaries + user-facing error messages
- [ ] Responsive layout for desktop/tablet
- [ ] Performance: LOD for distant trees, frustum culling
- [ ] README.md

---

## 9. Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Vite not CRA | Faster dev server, native ESM, simpler GLB asset handling |
| InstancedMesh for trees | Handles 8000+ tree instances at 60fps (rendered as Green Boxes for now) |
| Poisson Disk Sampling | Enforces min_spacing_m biological constraint |
| localStorage bridge | Simple cross-reload state between modules |
| MapLibre GL JS | Open-source map renderer supporting native 3D terrain and custom WebGL layers |
| No frontend Carbon Math | We rely on the backend provided arrays to reduce logic duplication |

---

## 10. Backend API Contract

```text
POST /api/v1/projects/predict               -> Generates prediction & project_id from Parameter Terminal
GET  /api/v1/projects/{project_id}/species-plan  -> Input 3 JSON (for 3D Scene)
GET  /api/v1/projects/{project_id}/metadata      -> Input 2 JSON (for 3D Scene)
POST /api/v1/projects/{project_id}/tree-positions <- Output 1 JSON (from 3D Scene)
```

*Note: The backend currently uses an in-memory dictionary to store `project_id` state across requests. This avoids heavy DB dependencies during the prototype phase.*

---

## 11. Change Log

| Date | Change |
|------|--------|
| 2026-09-07 | Initial context file created. Directory structure planned. |
| 2026-09-07 | **Alabaster Voxel** theme spec added (§3.5). Replaced dark emerald palette with light canvas + Minecraft-shader lighting. Corrected `poisson-disk-sampling` package name. |
| 2026-09-07 | Phase 0 & 1 complete. `theme.css` rewritten to Alabaster Voxel. `globals.css`, Redux store, `useLocalStorage`, `main.jsx`, `AppRoutes.jsx` all implemented. Directory tree reformatted with ✅/📄 status markers. Documented pre-existing design reference files (`page1.html`, `page2.html`, `DESIGN*.md`, screenshots). Renumbered phases: Phase 2 = Polygon Drawer, Phase 3 = 3D Viz. |
| 2026-09-08 | Backend APIs aligned with frontend requirements. Added `POST /api/v1/projects/predict` and in-memory persistence layer. |
