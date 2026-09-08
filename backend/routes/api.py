from flask import Blueprint, request, jsonify
from database import projects_db
from models.predictor import TreePredictor
from services.tree_data import TreeData
from services.carbon import calculate_single_tree_carbon, calculate_total_carbon
from services.financial import calculate_tree_capacity, calculate_budget_capacity, calculate_financials
import uuid

api_bp = Blueprint('api_bp', __name__)

predictor = TreePredictor("datas.csv")
tree_data = TreeData("tree_data.csv")

@api_bp.route("/api/v1/projects/predict", methods=["POST"])
def predict_and_create_project():
    data = request.json
    try:
        rainfall = float(data["rainfall"])
        temperature = float(data["temperature"])
        soil_type = data["soil_type"]
        soil_ph = float(data["soil_ph"])
        water_availability = data["water_availability"]
        land_status = data["land_status"]
        available_acres = float(data["available_acres"])
        total_budget = float(data["total_budget"])
        years = int(data["years"])
        credit_price = float(data.get("carbon_credit_price", 20.0))
    except (KeyError, ValueError) as e:
        return jsonify({"error": f"Invalid input: {str(e)}"}), 400

    tree = predictor.predict(
        rainfall, temperature, soil_type, soil_ph, water_availability, land_status
    )
    selected_tree = tree_data.get_tree(tree)

    if selected_tree is None:
        return jsonify({"error": f"Tree '{tree}' not found in tree_data.csv"}), 400

    canopy_area = float(selected_tree["canopy_area_m2"])
    cost_per_tree = float(selected_tree["cost_per_tree"])
    annual_maintenance = float(selected_tree["annual_maintenance_per_tree"])
    carbon_absorption_per_m2 = float(selected_tree["carbon_absorption_kg_per_m2"])

    land_capacity = calculate_tree_capacity(canopy_area, available_acres)
    trees_by_land = land_capacity["trees_by_land"]

    trees_by_budget = calculate_budget_capacity(
        total_budget, cost_per_tree, annual_maintenance, years
    )

    number_of_trees = min(trees_by_land, trees_by_budget)

    if number_of_trees <= 0:
        return jsonify({"error": "The given budget is not enough to plant one tree."}), 400

    land_used_m2 = number_of_trees * canopy_area
    land_used_acres = land_used_m2 / 4046.86

    single_tree_carbon = calculate_single_tree_carbon(canopy_area, carbon_absorption_per_m2)
    total_carbon = calculate_total_carbon(single_tree_carbon, number_of_trees, years)

    financials = calculate_financials(
        number_of_trees, cost_per_tree, annual_maintenance, years,
        total_carbon["carbon_credits"], credit_price
    )
    budget_remaining = total_budget - financials["total_investment"]

    # Generate Project ID and save to DB
    project_id = f"proj_{uuid.uuid4().hex[:8]}"
    
    projects_db[project_id] = {
        "metadata": {
            "usable_area_sqm": land_used_m2,
            "total_area_sqm": available_acres * 4046.86,
            "time_horizon_years": years,
            "tree_count": number_of_trees,
            "species_name": tree
        },
        "species_plan": {
            "species": {
                "name": tree,
                "scientific_name": f"{tree} scientific",
                "count": number_of_trees,
                "min_spacing_m": canopy_area,
                "max_height_m": 12.0,
                "canopy_radius_m": canopy_area / 2
            },
            "time_horizon_years": years,
            # Mocking carbon credits projection for each year
            "carbon_credits_per_year": [int(total_carbon["carbon_credits"] * (i/years)) for i in range(1, years+1)]
        },
        "tree_positions": [],
        "prediction_results": {
            "project_id": project_id,
            "recommended_tree": tree,
            "years": years,
            "available_acres": available_acres,
            "land_used_acres": land_used_acres,
            "remaining_acres": available_acres - land_used_acres,
            "canopy_area_m2": canopy_area,
            "trees_possible_from_land": trees_by_land,
            "trees_possible_from_budget": trees_by_budget,
            "final_number_of_trees": number_of_trees,
            "cost_per_tree": cost_per_tree,
            "annual_maintenance_per_tree": annual_maintenance,
            "planting_cost": financials["planting_cost"],
            "maintenance_cost": financials["maintenance_cost"],
            "total_investment": financials["total_investment"],
            "budget_remaining": budget_remaining,
            "single_tree_daily_co2_kg": single_tree_carbon["daily_co2_kg"],
            "single_tree_annual_co2_kg": single_tree_carbon["annual_co2_kg"],
            "single_tree_annual_carbon_kg": single_tree_carbon["annual_carbon_kg"],
            "total_daily_co2_kg": total_carbon["daily_co2_kg"],
            "total_annual_co2_kg": total_carbon["annual_co2_kg"],
            "total_co2_absorbed_kg": total_carbon["total_co2_kg"],
            "total_carbon_absorbed_kg": total_carbon["total_carbon_kg"],
            "estimated_carbon_credits": total_carbon["carbon_credits"],
            "carbon_credit_price": credit_price,
            "estimated_carbon_revenue": financials["carbon_revenue"],
            "estimated_profit": financials["profit"],
            "estimated_roi_percentage": financials["roi_percentage"]
        }
    }

    return jsonify(projects_db[project_id]["prediction_results"])

@api_bp.route("/api/v1/projects/<project_id>/metadata", methods=["GET"])
def get_metadata(project_id):
    project = projects_db.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404
    
    return jsonify({
        "project_id": project_id,
        **project["metadata"]
    })

@api_bp.route("/api/v1/projects/<project_id>/species-plan", methods=["GET"])
def get_species_plan(project_id):
    project = projects_db.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404
    
    return jsonify({
        "project_id": project_id,
        **project["species_plan"]
    })

@api_bp.route("/api/v1/projects/<project_id>/tree-positions", methods=["POST"])
def save_tree_positions(project_id):
    project = projects_db.get(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404
    
    data = request.json
    project["tree_positions"] = data.get("tree_positions", [])
    
    return jsonify({
        "project_id": project_id,
        "total_trees_placed": len(project["tree_positions"]),
        "message": "Tree positions saved successfully."
    })
