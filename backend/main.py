from flask import Flask, request, jsonify

from models.predictor import TreePredictor

from services.tree_data import TreeData

from services.carbon import (
    calculate_single_tree_carbon,
    calculate_total_carbon
)

from services.financial import (
    calculate_tree_capacity,
    calculate_budget_capacity,
    calculate_financials
)


app = Flask(__name__)


@app.after_request
def add_cors_headers(response):

    response.headers[
        "Access-Control-Allow-Origin"
    ] = "*"

    response.headers[
        "Access-Control-Allow-Headers"
    ] = "Content-Type"

    response.headers[
        "Access-Control-Allow-Methods"
    ] = "GET,POST,OPTIONS"

    return response


predictor = TreePredictor(
    "datas.csv"
)

tree_data = TreeData(
    "tree_data.csv"
)


@app.route(
    "/predict",
    methods=["POST"]
)
def predict():

    data = request.json


    rainfall = float(
        data["rainfall"]
    )

    temperature = float(
        data["temperature"]
    )

    soil_type = data[
        "soil_type"
    ]

    soil_ph = float(
        data["soil_ph"]
    )

    water_availability = data[
        "water_availability"
    ]

    land_status = data[
        "land_status"
    ]

    available_acres = float(
        data["available_acres"]
    )

    total_budget = float(
        data["total_budget"]
    )

    years = int(
        data["years"]
    )

    credit_price = float(
        data["carbon_credit_price"]
    )


    tree = predictor.predict(
        rainfall,
        temperature,
        soil_type,
        soil_ph,
        water_availability,
        land_status
    )


    selected_tree = tree_data.get_tree(
        tree
    )


    if selected_tree is None:

        return jsonify({
            "error":
            "Tree not found in tree_data.csv"
        }), 400


    canopy_area = float(
        selected_tree[
            "canopy_area_m2"
        ]
    )

    cost_per_tree = float(
        selected_tree[
            "cost_per_tree"
        ]
    )

    annual_maintenance = float(
        selected_tree[
            "annual_maintenance_per_tree"
        ]
    )

    carbon_absorption_per_m2 = float(
        selected_tree[
            "carbon_absorption_kg_per_m2"
        ]
    )


    land_capacity = calculate_tree_capacity(
        canopy_area,
        available_acres
    )


    trees_by_land = land_capacity[
        "trees_by_land"
    ]


    trees_by_budget = calculate_budget_capacity(
        total_budget,
        cost_per_tree,
        annual_maintenance,
        years
    )


    number_of_trees = min(
        trees_by_land,
        trees_by_budget
    )


    if number_of_trees <= 0:

        return jsonify({
            "error":
            "The given budget is not enough to plant one tree."
        }), 400


    land_used_m2 = (
        number_of_trees
        * canopy_area
    )


    land_used_acres = (
        land_used_m2
        / 4046.86
    )


    single_tree_carbon = (
        calculate_single_tree_carbon(
            canopy_area,
            carbon_absorption_per_m2
        )
    )


    total_carbon = (
        calculate_total_carbon(
            single_tree_carbon,
            number_of_trees,
            years
        )
    )


    financials = calculate_financials(
        number_of_trees,
        cost_per_tree,
        annual_maintenance,
        years,
        total_carbon[
            "carbon_credits"
        ],
        credit_price
    )


    budget_remaining = (
        total_budget
        - financials[
            "total_investment"
        ]
    )


    return jsonify({

        "recommended_tree":
            tree,

        "years":
            years,


        "available_acres":
            available_acres,

        "land_used_acres":
            land_used_acres,

        "remaining_acres":
            available_acres
            - land_used_acres,


        "canopy_area_m2":
            canopy_area,

        "trees_possible_from_land":
            trees_by_land,

        "trees_possible_from_budget":
            trees_by_budget,

        "final_number_of_trees":
            number_of_trees,


        "cost_per_tree":
            cost_per_tree,

        "annual_maintenance_per_tree":
            annual_maintenance,

        "planting_cost":
            financials[
                "planting_cost"
            ],

        "maintenance_cost":
            financials[
                "maintenance_cost"
            ],

        "total_investment":
            financials[
                "total_investment"
            ],

        "budget_remaining":
            budget_remaining,


        "single_tree_daily_co2_kg":
            single_tree_carbon[
                "daily_co2_kg"
            ],

        "single_tree_annual_co2_kg":
            single_tree_carbon[
                "annual_co2_kg"
            ],

        "single_tree_annual_carbon_kg":
            single_tree_carbon[
                "annual_carbon_kg"
            ],


        "total_daily_co2_kg":
            total_carbon[
                "daily_co2_kg"
            ],

        "total_annual_co2_kg":
            total_carbon[
                "annual_co2_kg"
            ],

        "total_co2_absorbed_kg":
            total_carbon[
                "total_co2_kg"
            ],

        "total_carbon_absorbed_kg":
            total_carbon[
                "total_carbon_kg"
            ],


        "estimated_carbon_credits":
            total_carbon[
                "carbon_credits"
            ],

        "carbon_credit_price":
            credit_price,

        "estimated_carbon_revenue":
            financials[
                "carbon_revenue"
            ],

        "estimated_profit":
            financials[
                "profit"
            ],

        "estimated_roi_percentage":
            financials[
                "roi_percentage"
            ]

    })


if __name__ == "__main__":

    app.run(
        debug=True
    )