import math


ACRE_TO_M2 = 4046.86

LAND_UTILIZATION = 0.90


def calculate_tree_capacity(
    canopy_area,
    available_acres
):

    total_land_m2 = (
        available_acres
        * ACRE_TO_M2
    )

    usable_land_m2 = (
        total_land_m2
        * LAND_UTILIZATION
    )

    trees_by_land = math.floor(
        usable_land_m2
        / canopy_area
    )

    return {
        "total_land_m2":
            total_land_m2,

        "usable_land_m2":
            usable_land_m2,

        "trees_by_land":
            trees_by_land
    }


def calculate_budget_capacity(
    budget,
    cost_per_tree,
    annual_maintenance,
    years
):

    maintenance_cost = (
        annual_maintenance
        * years
    )

    total_cost_per_tree = (
        cost_per_tree
        + maintenance_cost
    )

    if total_cost_per_tree <= 0:

        return 0

    trees_by_budget = math.floor(
        budget
        / total_cost_per_tree
    )

    return trees_by_budget


def calculate_financials(
    number_of_trees,
    cost_per_tree,
    annual_maintenance,
    years,
    carbon_credits,
    credit_price
):

    planting_cost = (
        number_of_trees
        * cost_per_tree
    )

    maintenance_cost = (
        number_of_trees
        * annual_maintenance
        * years
    )

    total_investment = (
        planting_cost
        + maintenance_cost
    )

    carbon_revenue = (
        carbon_credits
        * credit_price
    )

    profit = (
        carbon_revenue
        - total_investment
    )

    roi = 0

    if total_investment > 0:

        roi = (
            profit
            / total_investment
        ) * 100

    return {
        "planting_cost":
            planting_cost,

        "maintenance_cost":
            maintenance_cost,

        "total_investment":
            total_investment,

        "carbon_revenue":
            carbon_revenue,

        "profit":
            profit,

        "roi_percentage":
            roi
    }