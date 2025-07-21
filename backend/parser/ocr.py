import pytesseract
import os
import re
from PIL import Image
from pdf2image import convert_from_path
from datetime import datetime

# Set your Tesseract path
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def extract_text_from_pdf(pdf_path):
    try:
        images = convert_from_path(pdf_path)
        full_text = ""
        for img in images:
            full_text += pytesseract.image_to_string(img)
        return full_text
    except Exception as e:
        raise RuntimeError(f"PDF OCR failed: {str(e)}")
    
def extract_text_from_file(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()
    if ext in ['.jpg', '.jpeg', '.png']:
        return pytesseract.image_to_string(Image.open(file_path))
    elif ext == '.pdf':
        return extract_text_from_pdf(file_path)
    else:
        raise ValueError("Unsupported file format.")

def extract_fields(text: str) -> dict:
    # Extract vendor
    vendor_match = re.search(r'([A-Z][A-Z\s&]{3,})', text)
    vendor = vendor_match.group(1).strip().title() if vendor_match else "Unknown"

    # Extract date
    date_match = re.search(r'(\d{2}[/-]\d{2}[/-]\d{2,4})', text)
    if date_match:
        try:
            raw_date = date_match.group(1).replace("-", "/")
            parsed_date = datetime.strptime(raw_date, "%d/%m/%Y").date()
        except:
            try:
                parsed_date = datetime.strptime(raw_date, "%d/%m/%y").date()
            except:
                parsed_date = datetime.today().date()
    else:
        parsed_date = datetime.today().date()

    # Extract amount
    total_match = re.search(r'(Grand\s+Total|Total)[:\s₹]*([\d,.]+)', text, re.IGNORECASE)
    if total_match:
        amount_str = total_match.group(2).replace(",", "")
        try:
            amount = float(amount_str)
        except:
            amount = 0.0
    else:
        amount = 0.0

    # Simple category logic
    category = "Food" if any(word in text.lower() for word in ["restaurant", "dosa", "bar", "veg", "hotel", "cafe"]) else "Misc"

    return {
        "vendor": vendor,
        "amount": amount,
        "date": str(parsed_date),
        "category": category
    }

# For testing this file directly
# if __name__ == "__main__":
#     file_path = "../uploads/3.jpg"  # Replace with your test file
#     text = extract_text_from_file(file_path)
#     fields = extract_fields(text)

#     print(f"{'Vendor':<20} {'Date':<12} {'Amount (₹)':<10} {'Category':<10}")
#     print(f"{fields['vendor']:<20} {fields['date']:<12} ₹{fields['amount']:<10} {fields['category']:<10}")
