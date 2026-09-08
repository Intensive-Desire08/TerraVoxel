# TerraVoxel 🌾 Cube-by-Cube Farm Simulation & Financial Yield Modeling

TerraVoxel is an interactive geospatial acquisition and 3D voxel-based agricultural simulation platform. Built with a high-fidelity **"Alabaster Voxel"** design language, it seamlessly pairs precision quantitative land delineation with block-by-block three-dimensional terrain elevation and yield visualization.

---

## 🚀 Key Features & Modules

### 🗺️ Module 1: Geospatial Boundary Acquisition (Polygon Drawer)
- **Interactive Boundary Delineation**: Search geographic coordinates and trace precise cultivable land perimeters using Mapbox GL JS.
- **Arable Land Filtering**: Manually omit non-arable terrain features (infrastructure, water bodies, rocky outcrops).
- **Geometric Analytics**: Real-time calculation of enclosed land surface area (hectares/acres) and boundary perimeter length.
- **Topographic Contour Preview**: Generates high-resolution topographic heightmaps and isometric contour previews prior to 3D voxel rendering.

### 🧊 Module 2: Interactive 3D Voxel Land Simulation
- **Voxel Mesh Generation**: Transforms boundary coordinates into discrete, height-adjusted 3D voxel blocks using Three.js / React Three Fiber.
- **Dynamic Crop & Yield Layers**: Interactive voxel selection for soil moisture, crop health, slope gradient, and financial yield projection.
- **Environment & Sun Control**: Realistic time-of-day lighting and Minecraft-inspired shader shadows on a crisp alabaster canvas.

---

## 🎨 Design Theme: "Alabaster Voxel"

TerraVoxel uses a clean, quantitative design system tailored for agricultural fintech:
- **Base Canvas**: `#F8FAFC` (Alabaster White — anti-glare, professional base)
- **Primary Accent**: `#10B981` (Emerald Green — financial yields & positive actions)
- **Data Ink**: `#0F172A` (Deep Slate — high-contrast typography)
- **Typography**: `Paprika` (Header/Brand identity), `JetBrains Mono` (Coordinates & metric telemetry)

---

## 📂 Project Architecture

```
TerraVoxel/
├── frontend/                 # React 18 + Vite Web Application
│   ├── src/
│   │   ├── components/       # UI Components (Map, Sidebar, Controls)
│   │   ├── store/            # Redux Toolkit state slices
│   │   └── styles/           # Tailwind CSS & custom design tokens
│   ├── prototypes/           # HTML/CSS UI reference prototypes
│   └── package.json
├── docs/                     # Project documentation & reference specs
│   ├── archives/             # Backup archives of initial prototypes
│   └── TerraVoxel.docx       # Requirements specification
├── context.md                # Living project architecture & technical specification
├── .gitignore
└── README.md
```

---

## 🛠️ Tech Stack

- **Frontend Core**: React 18, Vite, JavaScript (ESNext)
- **Mapping & GIS**: Mapbox GL JS, Turf.js
- **3D Graphics & Voxels**: Three.js, React Three Fiber, `@react-three/drei`
- **State Management**: Redux Toolkit (`@reduxjs/toolkit`)
- **Styling**: TailwindCSS, Lucide Icons, Google Fonts (`Paprika`, `JetBrains Mono`)

---

## ⚡ Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- `npm` or `yarn`

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd TerraVoxel
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
