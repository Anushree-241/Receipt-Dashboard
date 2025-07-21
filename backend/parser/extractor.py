import re
from datetime import datetime

def extract_fields(text: str) -> dict:
    vendor = parse_vendor(text)
    amount = parse_amount(text)
    date = parse_date(text)
    category = categorize_vendor(vendor)

    return {
        "vendor": vendor,
        "amount": amount,
        "date": date,
        "category": category
    }

def parse_vendor(text: str) -> str:
    # Naive: return first uppercase line
    for line in text.splitlines():
        if line.strip().isalpha() and line.strip().istitle():
            return line.strip()
    return "Unknown"

def parse_amount(text: str) -> float:
    matches = re.findall(r'[\$₹]?[\d,]+\.\d{2}', text)
    if matches:
        clean = matches[-1].replace(",", "").replace("$", "").replace("₹", "")
        return float(clean)
    return 0.0

def parse_date(text: str) -> str:
    patterns = [r'\d{2}/\d{2}/\d{4}', r'\d{4}-\d{2}-\d{2}']
    for p in patterns:
        match = re.search(p, text)
        if match:
            try:
                return str(datetime.strptime(match.group(), "%Y-%m-%d").date())
            except:
                try:
                    return str(datetime.strptime(match.group(), "%d/%m/%Y").date())
                except:
                    pass
    return str(datetime.today().date())

def categorize_vendor(vendor: str) -> str:
    known = {
        "Amazon": "Retail",
        "Walmart": "Groceries",
        "Verizon": "Internet",
        "PG&E": "Electricity"
    }
    return known.get(vendor, "Misc")
