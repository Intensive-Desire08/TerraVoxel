# In-memory database for prototype persistence

# Structure of projects_db:
# {
#   "proj_id_123": {
#       "metadata": {
#           "usable_area_sqm": 72000,
#           "total_area_sqm": 100000,
#           "time_horizon_years": 10,
#           "tree_count": 8000,
#           "species_name": "Bamboo"
#       },
#       "species_plan": {
#           "species": {
#               "name": "Bamboo",
#               "scientific_name": "Dendrocalamus strictus",
#               "count": 8000,
#               "min_spacing_m": 1.8,
#               "max_height_m": 12.0,
#               "canopy_radius_m": 1.5
#           },
#           "time_horizon_years": 10,
#           "carbon_credits_per_year": [0, 0, 150, 320, 510, 680, 820, 935, 1010, 1050]
#       },
#       "tree_positions": [] # To be populated by POST /tree-positions
#   }
# }

projects_db = {}
