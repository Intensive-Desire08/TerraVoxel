This will be the json input output format for the Polygon Drawer module and 3D modelling module in the frontend.

Module 1: Polygon Drawer Module
Input
json

{
  "project_id": "proj_2024_001"
  "coordinate": [78.12345678, 28.456789]
}

Output (GeoJSON)
json

{
  "type": "Feature",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [78.123456, 28.456789],
        [78.124567, 28.457890],
        [78.125678, 28.456123],
        [78.124234, 28.455012],
        [78.123456, 28.456789]
      ]
    ]
  },
  "properties": {
    "project_id": "proj_2024_001",
    "area_ha": 12.4,
    "area_acres": 30.6
  }
}

Module 2: 3D Visualization Module
Input 1: GeoJSON Polygon (from Module 1)
json

{
  "type": "Feature",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [78.123456, 28.456789],
        [78.124567, 28.457890],
        [78.125678, 28.456123],
        [78.124234, 28.455012],
        [78.123456, 28.456789]
      ]
    ]
  },
  "properties": {
    "project_id": "proj_2024_001",
    "area_ha": 12.4,
    "area_acres": 30.6
  }
}

Input 2: Usable Area & Metadata (from Dashboard)
json

{
  "project_id": "proj_2024_001",
  "usable_area_sqm": 72000,
  "total_area_sqm": 100000,
  "time_horizon_years": 10,
  "tree_count": 8000,
  "species_name": "Bamboo"
}

Input 3: Tree Species Plan (from Backend)
json

{
  "project_id": "proj_2024_001",
  "species": {
    "name": "Bamboo",
    "scientific_name": "Dendrocalamus strictus",
    "count": 8000,
    "min_spacing_m": 1.8,
    "max_height_m": 12.0,
    "canopy_radius_m": 1.5
  },
  "time_horizon_years": 10,
  "carbon_credits_per_year": [
    0, 0, 150, 320, 510, 680, 820, 935, 1010, 1050
  ]
}

Output 1: Tree Positions (to Dashboard)
json

{
  "project_id": "proj_2024_001",
  "total_trees_placed": 8000,
  "tree_positions": [
    {
      "tree_id": "tree_0001",
      "species_name": "Bamboo",
      "latitude": 78.123456,
      "longitude": 28.456789,
      "elevation_m": 215.4
    },
    {
      "tree_id": "tree_0002",
      "species_name": "Bamboo",
      "latitude": 78.123789,
      "longitude": 28.456123,
      "elevation_m": 216.1
    }
  ]
}

Output 2: Animation State (Real-time Dashboard Updates)
json

{
  "project_id": "proj_2024_001",
  "current_year": 5,
  "scene_state": {
    "avg_tree_height_m": 9.0,
    "total_biomass_kg": 18500,
    "co2e_sequestered_tons": 510,
    "cumulative_co2e_tons": 1480,
    "saleable_credits_generated": 1332
  }
}

Error Response
json

{
  "error": {
    "code": "GEO_003",
    "message": "Insufficient area for tree count",
    "details": {
      "species_name": "Bamboo",
      "required_count": 8000,
      "available_area_sqm": 42000,
      "min_spacing_m": 1.8,
      "max_capacity": 7000
    },
    "timestamp": "2024-11-15T14:50:12Z"
  }
}

File Naming Convention

Tree model files must be stored in /assets/models/ and named exactly as the species name:
text

/assets/models/Bamboo.glb
/assets/models/Teak.glb
/assets/models/Neem.glb
/assets/models/Acacia.glb

Your module loads the model by constructing the path: /assets/models/{species_name}.glb
Summary of JSON Flow
text

[Module 1: Polygon Drawer]
    Input:  { project_id }
    Output: GeoJSON Polygon

[User clicks "Generate 3D Scene"] → Page Reload

[Module 2: 3D Visualization]
    Input 1: GeoJSON Polygon (from Module 1)
    Input 2: { usable_area_sqm, tree_count, species_name } (from Dashboard)
    Input 3: { species, carbon_credits_per_year } (from Backend)

    Process:
        1. Generate terrain from Mapbox Elevation API
        2. Run Poisson Disk Sampling for tree placement
        3. Place tree models at computed positions
        4. Setup time slider

    Output 1: Tree Positions (to Dashboard for logging)
    Output 2: Animation State (real-time HUD updates)