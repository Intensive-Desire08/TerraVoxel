import csv
import json
import time
from pathlib import Path

import requests

from parser import parse_plant_page


BASE_URL = "https://ecocrop.apps.fao.org/ecocrop/srv/en"

LIST_URL = (
    f"{BASE_URL}/cropList"
    "?name=a&relation=beginsWith"
)

DATA_DIR = Path(__file__).parent / "data"
LOG_DIR = Path(__file__).parent / "logs"

DATA_DIR.mkdir(exist_ok=True)
LOG_DIR.mkdir(exist_ok=True)


session = requests.Session()

session.headers.update({
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 Chrome/120 Safari/537.36"
    )
})


def download_page(url, retries=3):
    """
    Download a webpage with retries.
    """

    for attempt in range(1, retries + 1):

        try:
            response = session.get(
                url,
                timeout=20
            )

            response.raise_for_status()

            return response.text

        except requests.RequestException as e:

            print(
                f"Request failed "
                f"(attempt {attempt}/{retries}): {e}"
            )

            if attempt < retries:
                time.sleep(2)

    return None


def get_first_three_plants():
    """
    Get the first 3 plants from the Ecocrop crop list.
    """

    print("Downloading plant list...")

    html = download_page(LIST_URL)

    if html is None:
        raise RuntimeError("Could not download plant list.")

    from bs4 import BeautifulSoup
    import re

    soup = BeautifulSoup(html, "lxml")

    plants = []

    # Ecocrop's current list contains rows with:
    # Name | Code | Operation

    for row in soup.find_all("tr"):

        cells = row.find_all("td")

        if len(cells) < 2:
            continue

        name = cells[0].get_text(" ", strip=True)
        code = cells[1].get_text(" ", strip=True)

        # Code must be numeric
        if not code.isdigit():
            continue

        plant_id = int(code)

        plants.append({
            "ecocrop_id": plant_id,
            "name": name,
            "url": (
                f"https://ecocrop.apps.fao.org"
                f"/ecocrop/srv/en/cropView?id={plant_id}"
            )
        })

        if len(plants) == 3:
            break

    return plants


def save_csv(data):
    path = DATA_DIR / "plants_test.csv"

    if not data:
        return

    rows = []

    for plant in data:

        row = {
            "ecocrop_id": plant["ecocrop_id"],
            "name": plant["name"],
            "url": plant["url"],
            "notes_raw": plant["notes_raw"],
            "sources_raw": plant["sources_raw"]
        }

        # Add structured fields
        for key, value in plant["fields"].items():
            row[key] = value

        rows.append(row)

    fieldnames = set()

    for row in rows:
        fieldnames.update(row.keys())

    fieldnames = list(fieldnames)

    with open(
        path,
        "w",
        newline="",
        encoding="utf-8"
    ) as f:

        writer = csv.DictWriter(
            f,
            fieldnames=fieldnames,
            extrasaction="ignore"
        )

        writer.writeheader()
        writer.writerows(rows)

    print(f"Saved CSV → {path}")

def save_json(data):
    path = DATA_DIR / "plants_test.json"

    with open(path, "w", encoding="utf-8") as f:
        json.dump(
            data,
            f,
            indent=2,
            ensure_ascii=False
        )

    print(f"Saved JSON → {path}")


def main():

    print("=" * 60)
    print("TerraVoxel Ecocrop Scraper")
    print("=" * 60)

    # --------------------------------------------
    # TEST ONLY 3 PLANTS
    # --------------------------------------------

    plants = get_first_three_plants()

    print(f"\nFound {len(plants)} plants for testing.\n")

    results = []

    for index, plant in enumerate(plants, start=1):

        print(
            f"[{index}/{len(plants)}] "
            f"{plant['name']} "
            f"(ID: {plant['ecocrop_id']})"
        )

        html = download_page(plant["url"])

        if html is None:
            print("  FAILED")
            continue

        parsed = parse_plant_page(
            html,
            plant["ecocrop_id"],
            plant["url"]
        )

        # Make sure list name is preserved
        parsed["name"] = plant["name"]

        results.append(parsed)

        print("  SUCCESS")

        # Be polite to the server
        time.sleep(1)

    # --------------------------------------------
    # SAVE RESULTS
    # --------------------------------------------

    save_json(results)
    save_csv(results)

    print("\nDone.")
    print(f"Successfully scraped: {len(results)}")


if __name__ == "__main__":
    main()