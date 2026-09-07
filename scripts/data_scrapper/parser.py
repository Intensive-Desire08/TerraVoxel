from bs4 import BeautifulSoup


def parse_plant_page(html, plant_id, url):
    soup = BeautifulSoup(html, "lxml")

    result = {
        "ecocrop_id": plant_id,
        "url": url,
        "name": None,
        "fields": {},
        "notes_raw": None,
        "sources_raw": None
    }

    # --------------------------------------------------
    # Find plant name
    # --------------------------------------------------

    # Ecocrop pages use the first prominent heading/title.
    title = soup.find(["h1", "h2"])

    if title:
        result["name"] = title.get_text(" ", strip=True)

    # --------------------------------------------------
    # Extract table/key-value information
    # --------------------------------------------------

    for row in soup.find_all("tr"):
        cells = row.find_all(["th", "td"])

        if len(cells) >= 2:
            key = cells[0].get_text(" ", strip=True)
            value = cells[1].get_text(" ", strip=True)

            if key and value:
                result["fields"][key] = value

    # --------------------------------------------------
    # Extract Notes section
    # --------------------------------------------------

    notes_heading = None

    for element in soup.find_all(["h2", "h3", "h4", "div", "td"]):
        text = element.get_text(" ", strip=True).lower()

        if text == "notes":
            notes_heading = element
            break

    if notes_heading:
        # Get the next substantial text block
        current = notes_heading.find_next()

        collected = []

        while current:
            text = current.get_text(" ", strip=True)

            if text:
                collected.append(text)

            # Stop when Sources section is reached
            if "sources" in text.lower() and len(text) < 100:
                break

            current = current.find_next()

        if collected:
            result["notes_raw"] = " ".join(collected)

    # --------------------------------------------------
    # Extract Sources section
    # --------------------------------------------------

    sources_heading = None

    for element in soup.find_all(["h2", "h3", "h4", "div", "td"]):
        text = element.get_text(" ", strip=True).lower()

        if text == "sources":
            sources_heading = element
            break

    if sources_heading:
        current = sources_heading.find_next()

        collected = []

        while current:
            text = current.get_text(" ", strip=True)

            if text:
                collected.append(text)

            current = current.find_next()

            # Stop after a reasonable amount
            if len(collected) > 20:
                break

        if collected:
            result["sources_raw"] = " ".join(collected)

    return result