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
- Render a **Mapbox GL JS** map (satellite + streets style).
- Activate a **draw mode** via `@mapbox/mapbox-gl-draw` so the user can click-trace the polygon perimeter.
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
| 1 | Parse GeoJSON -> project-local XY plane | turf + proj4 |
| 2 | Query Mapbox Terrain-RGB tiles for elevation raster | Mapbox Raster Tiles API |
| 3 | Build base mesh, displace vertices with elevation Z-data | Three.js PlaneGeometry + vertex shader |
| 4 | Drape satellite imagery texture onto terrain mesh | Three.js TextureLoader + Mapbox Static API |
| 5 | Run Poisson Disk Sampling inside polygon boundary | fast-poisson-disk-sampling |
| 6 | For each sampled point: raycast -> terrain surface -> place tree | Three.js Raycaster |
| 7 | Load species GLTF/GLB model `/assets/models/{species_name}.glb` | @react-three/drei useGLTF |
| 8 | Instance tree models at all sampled positions | Three.js InstancedMesh |
| 9 | Attach time-slider -> Chapman-Richards growth curves -> scale instances | R3F useFrame animation |
| 10 | HUD overlay: carbon bar, credit counter update per year | React state / R3F Html |

**Growth Model (Chapman-Richards):**
```
H(t) = H_max * (1 - exp(-k * t))^m
```
Where H_max = species.max_height_m, k and m are species-specific constants
(defaults: k=0.3, m=1.5 for fast-growing species like Bamboo).

**Outputs back to parent dashboard:**
- Tree Positions JSON
- Animation State JSON (live)

---

## 3. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React via Vite | 18.x |
| 3D Rendering | Three.js + @react-three/fiber | r3f 8.x |
| 3D Helpers | @react-three/drei | latest |
| Map (Module 1) | Mapbox GL JS | 3.x |
| Draw Tool | @mapbox/mapbox-gl-draw | 1.x |
| Geospatial Math | @turf/turf | 7.x |
| Poisson Sampling | poisson-disk-sampling | 2.x |
| State Management | Redux Toolkit | 2.x |
| Styling | Vanilla CSS + CSS Variables | — |
| Build | Vite | 5.x |

**Environment Variables:**
```
VITE_MAPBOX_TOKEN=pk.ey...
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
    | User traces polygon on Mapbox map
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

```
frontend/
+-- public/
|   +-- index.html
|   +-- assets/
|       +-- models/
|           +-- Bamboo.glb
|           +-- Teak.glb
|           +-- Neem.glb
|           +-- Acacia.glb
+-- src/
|   +-- modules/
|   |   +-- map/                    <- MODULE 1
|   |   |   +-- components/
|   |   |   |   +-- MapContainer.jsx
|   |   |   |   +-- PolygonDrawer.jsx
|   |   |   |   +-- DrawControls.jsx
|   |   |   |   +-- AreaDisplay.jsx
|   |   |   |   +-- MapControls.jsx
|   |   |   +-- hooks/
|   |   |   |   +-- useMapboxDraw.js
|   |   |   |   +-- usePolygonValidation.js
|   |   |   +-- services/
|   |   |   |   +-- geojsonSerializer.js
|   |   |   +-- styles/
|   |   |   |   +-- map.css
|   |   |   +-- index.js
|   |   |
|   |   +-- visualization/          <- MODULE 2
|   |       +-- components/
|   |       |   +-- Scene3D.jsx
|   |       |   +-- TerrainMesh.jsx
|   |       |   +-- TreeInstances.jsx
|   |       |   +-- SceneCamera.jsx
|   |       |   +-- SceneLighting.jsx
|   |       |   +-- HUDOverlay.jsx
|   |       +-- controls/
|   |       |   +-- TimeSlider.jsx
|   |       |   +-- SceneToolbar.jsx
|   |       +-- hooks/
|   |       |   +-- useTerrainData.js
|   |       |   +-- usePoissonSampling.js
|   |       |   +-- useGrowthAnimation.js
|   |       |   +-- useCarbonMetrics.js
|   |       +-- engine/
|   |       |   +-- terrainBuilder.js
|   |       |   +-- poissonSampler.js
|   |       |   +-- growthCurves.js
|   |       |   +-- carbonAccounting.js
|   |       +-- services/
|   |       |   +-- elevationAPI.js
|   |       |   +-- treePositionExporter.js
|   |       +-- styles/
|   |       |   +-- scene.css
|   |       +-- index.js
|   |
|   +-- pages/
|   |   +-- PolygonDrawerPage.jsx
|   |   +-- Scene3DPage.jsx
|   |
|   +-- shared/
|   |   +-- components/
|   |   |   +-- LoadingSpinner.jsx
|   |   |   +-- ErrorBoundary.jsx
|   |   +-- hooks/
|   |   |   +-- useLocalStorage.js
|   |   +-- store/
|   |   |   +-- slices/
|   |   |   |   +-- mapSlice.js
|   |   |   |   +-- sceneSlice.js
|   |   |   +-- store.js
|   |   +-- utils/
|   |   |   +-- constants.js
|   |   |   +-- formatters.js
|   |   +-- styles/
|   |       +-- globals.css
|   |       +-- theme.css
|   |
|   +-- routes/
|   |   +-- AppRoutes.jsx
|   +-- App.jsx
|   +-- main.jsx
|
+-- .env.example
+-- vite.config.js
+-- package.json
+-- README.md
```

---

## 8. TODO List (Execution Checklist)

### Phase 0 — Scaffold
- [ ] npm create vite@latest frontend -- --template react
- [ ] Install all npm dependencies
- [ ] Set up Vite config (alias @ -> src/, GLB asset handling)
- [ ] Create all directories and placeholder index.js files
- [ ] Create .env.example

### Phase 1 — Module 1: Polygon Drawer
- [ ] globals.css + theme.css (design tokens, dark theme)
- [ ] store.js + mapSlice.js (Redux: geojson, drawingState, area)
- [ ] MapContainer.jsx — Mapbox GL JS init, fly-to coordinate
- [ ] PolygonDrawer.jsx — integrate @mapbox/mapbox-gl-draw
- [ ] DrawControls.jsx — Undo vertex, Clear, Zoom-to-fit buttons
- [ ] AreaDisplay.jsx — live area in ha / acres via @turf/area
- [ ] useMapboxDraw.js — hook encapsulating draw events
- [ ] usePolygonValidation.js — kinks check, min vertex count
- [ ] geojsonSerializer.js — build output Feature with properties
- [ ] MapControls.jsx — zoom in/out, compass reset
- [ ] PolygonDrawerPage.jsx — assemble all components, sidebar
- [ ] Generate 3D Scene button -> validate -> persist -> navigate

### Phase 2 — Module 2: 3D Visualization
- [ ] sceneSlice.js (Redux: treePositions, currentYear, carbonMetrics)
- [ ] elevationAPI.js — fetch Mapbox Terrain-RGB tiles, decode elevation
- [ ] terrainBuilder.js — PlaneGeometry + vertex displacement from elevation raster
- [ ] TerrainMesh.jsx — R3F mesh with satellite texture + elevation
- [ ] SceneCamera.jsx — OrbitControls via drei, initial camera position
- [ ] SceneLighting.jsx — directional sun + ambient + hemisphere lights
- [ ] poissonSampler.js — fast-poisson-disk-sampling within GeoJSON polygon bounds
- [ ] usePoissonSampling.js — hook that runs sampler, memoizes result
- [ ] TreeInstances.jsx — InstancedMesh per species GLB; ray-cast to terrain for Y
- [ ] growthCurves.js — Chapman-Richards H(t); scale factor per year
- [ ] useGrowthAnimation.js — animate InstancedMesh matrices per currentYear
- [ ] carbonAccounting.js — compute biomass, CO2e, credits per year
- [ ] useCarbonMetrics.js — hook exposing per-year carbon state
- [ ] TimeSlider.jsx — range input 1->N years, updates Redux currentYear
- [ ] SceneToolbar.jsx — toggle wireframe, reset camera, screenshot
- [ ] HUDOverlay.jsx — carbon bar, credit counter, avg height
- [ ] treePositionExporter.js — XY + elevation -> lat/lon output JSON
- [ ] Scene3DPage.jsx — assemble all components

### Phase 3 — Routing & Integration
- [ ] AppRoutes.jsx — React Router /map/:project_id and /scene/:project_id
- [ ] Pass Module 2 output state to parent via Redux

### Phase 4 — Polish
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
| InstancedMesh for trees | Handles 8000+ tree instances at 60fps |
| Poisson Disk Sampling | Enforces min_spacing_m biological constraint |
| localStorage bridge | Simple cross-reload state between modules |
| Mapbox Terrain-RGB tiles | Returns 256x256 PNG tiles encoding elevation in RGB channels |
| Chapman-Richards growth | IPCC-compatible; documented in TerraVoxel spec Section 5.2 |
| Satellite texture via Mapbox Static API | Single call per scene; avoids tile stitching |

---

## 10. Backend API Stubs (stubbed during dev)

```
GET  /api/v1/projects/{project_id}/species-plan  -> Input 3 JSON
GET  /api/v1/projects/{project_id}/metadata      -> Input 2 JSON
POST /api/v1/projects/{project_id}/tree-positions <- Output 1 JSON
```

---

## 11. Change Log

| Date | Change |
|------|--------|
| 2026-09-07 | Initial context file created. Directory structure planned. |
| 2026-09-07 | **Alabaster Voxel** theme spec added. Replaced dark emerald palette with light alabaster canvas + warm Minecraft-shader lighting. Corrected Poisson sampling package name. |
