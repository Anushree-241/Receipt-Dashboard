import pytesseract
import pdfplumber
from PIL import Image
import os
from pdf2image import convert_from_path
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def extract_text_from_file(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()

    if ext in ['.jpg', '.jpeg', '.png']:
        return pytesseract.image_to_string(Image.open(file_path))
    elif ext == '.pdf':
        with pdfplumber.open(file_path) as pdf:
            return "\n".join(page.extract_text() or "" for page in pdf.pages)
    elif ext == '.txt':
        with open(file_path, 'r') as f:
            return f.read()
    else:
        raise ValueError("Unsupported file format.")


def extract_text_from_pdf(pdf_path):
    try:
        images = convert_from_path(pdf_path)
        full_text = ""
        for img in images:
            full_text += pytesseract.image_to_string(img)
        return full_text
    except Exception as e:
        raise RuntimeError(f"PDF OCR failed: {str(e)}")
