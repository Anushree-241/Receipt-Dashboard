from fastapi import FastAPI,Query, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from parser.ocr import extract_text_from_file
from parser.extractor import extract_fields
from crud import save_to_db, search_receipts, get_all_receipts, get_aggregates
from algorithms.search import keyword_search, range_search, pattern_search
from algorithms.sort import sort_data
from fastapi import UploadFile, File, HTTPException
from typing import Optional
from fastapi.responses import JSONResponse
import shutil
import os
from fastapi.responses import StreamingResponse,JSONResponse
import csv
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
ALLOWED_FILE_TYPES = [
    "image/png",
    "image/jpeg",  
    "image/jpg",
    "application/pdf"
]

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR,exist_ok=True)

@app.post("/upload")
async def upload_receipt(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_FILE_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only PNG, JPG, JPEG, and PDF are allowed."
        )

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Handle both image and PDF parsing
        if file.content_type == "application/pdf":
            from parser.ocr import extract_text_from_pdf
            text = extract_text_from_pdf(file_path)
        else:
            text = extract_text_from_file(file_path)

        receipt_data = extract_fields(text)
        save_to_db(receipt_data)
        return receipt_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

def receipt_to_dict(receipt):
    return {
        "id": receipt.id,
        "vendor": receipt.vendor,
        "amount": receipt.amount,
        "date": receipt.date.isoformat() if receipt.date else None,
        "category": receipt.category
    }

@app.get("/receipts")
def list_receipts(
    sort_by: str = "date",
    order: str = "asc",
    limit: int = 10,
    offset: int = 0,
    category: Optional[str] = Query(None)
):
    data = get_all_receipts(sort_by, order, limit, offset, category)
    return JSONResponse(content={
        "items": [receipt_to_dict(receipt) for receipt in data["items"]],
        "total": data["total"]
    })



@app.get("/search")
def search_receipts_api(
    vendor: str = Query(None),
    min_amount: float = Query(None),
    max_amount: float = Query(None),
    start_date: str = Query(None),
    end_date: str = Query(None),
    category: str = Query(None),
):
    return search_receipts(vendor, min_amount, max_amount, start_date, end_date, category)

@app.get("/stats")
def get_stats():
    return get_aggregates()

@app.get("/algosearch")
def advanced_search(
    field: str = Query(..., example="vendor"),
    keyword: str = Query(None),
    min_val: float = Query(None),
    max_val: float = Query(None),
    pattern: str = Query(None)
):
    # Mock data, replace with actual db query or result set
    data = [receipt_to_dict(r) for r in get_all_receipts()["items"]]

    if keyword:
        return keyword_search(data, field, keyword)
    if min_val is not None and max_val is not None:
        return range_search(data, field, min_val, max_val)
    if pattern:
        return pattern_search(data, field, pattern)

    return {"error": "Provide valid search parameters"}

@app.get("/algosort")
def sort_receipts_api(field: str = Query(...), reverse: bool = False):
    data = [receipt_to_dict(r) for r in get_all_receipts()["items"]]
    sorted_data = sort_data(data, field, reverse)
    return sorted_data



@app.get("/export/summary/csv")
def export_summary_csv():
    data = get_aggregates()
    output = io.StringIO()
    writer = csv.writer(output)
    
    writer.writerow(["Metric", "Value"])
    writer.writerow(["Total", data.get("total_spent", 0)])
    writer.writerow(["Mean", data.get("average_spent", 0)])
    writer.writerow(["Median", data.get("median_spent", 0)])
    writer.writerow(["Mode", data.get("mode_spent", "N/A")])
    
    output.seek(0)
    return StreamingResponse(output, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=summary.csv"})


@app.get("/export/summary/json")
def export_summary_json():
    data = get_aggregates()
    return JSONResponse(content=data, media_type="application/json", headers={
        "Content-Disposition": "attachment; filename=summary.json"
    })

@app.put("/receipts/{receipt_id}")
def update_receipt(receipt_id: int, updated_data: dict):
    from crud import update_receipt_in_db

    try:
        result = update_receipt_in_db(receipt_id, updated_data)
        return {"success": True, "updated": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
