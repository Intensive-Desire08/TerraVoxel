CARBON_TO_CO2 = 44 / 12

CO2_PER_CREDIT = 1000

DAYS_PER_YEAR = 365


def calculate_single_tree_carbon(
    canopy_area,
    carbon_absorption_per_m2
):

    annual_carbon = (
        canopy_area
        * carbon_absorption_per_m2
    )

    annual_co2 = (
        annual_carbon
        * CARBON_TO_CO2
    )

    daily_co2 = (
        annual_co2
        / DAYS_PER_YEAR
    )

    return {
        "annual_carbon_kg":
            annual_carbon,

        "annual_co2_kg":
            annual_co2,

        "daily_co2_kg":
            daily_co2
    }


def calculate_total_carbon(
    single_tree_data,
    number_of_trees,
    years
):

    daily_co2 = (
        single_tree_data["daily_co2_kg"]
        * number_of_trees
    )

    annual_co2 = (
        daily_co2
        * DAYS_PER_YEAR
    )

    total_co2 = (
        annual_co2
        * years
    )

    total_carbon = (
        total_co2
        / CARBON_TO_CO2
    )

    carbon_credits = (
        total_co2
        / CO2_PER_CREDIT
    )

    return {
        "daily_co2_kg":
            daily_co2,

        "annual_co2_kg":
            annual_co2,

        "total_co2_kg":
            total_co2,

        "total_carbon_kg":
            total_carbon,

        "carbon_credits":
            carbon_credits
    }