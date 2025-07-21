from database import SessionLocal, Receipt
from datetime import datetime
from sqlalchemy import desc, asc, and_, func
from sqlalchemy.orm import Session
from algorithms.aggregate import compute_aggregates


def save_to_db(data: dict):
    db = SessionLocal()
    receipt = Receipt(
        vendor=data["vendor"],
        date=datetime.strptime(data["date"], "%Y-%m-%d"),
        amount=data["amount"],
        category=data["category"]
    )
    db.add(receipt)
    db.commit()
    db.refresh(receipt)
    db.close()
    return receipt


def get_all_receipts(sort_by="date", order="asc", limit=10, offset=0, category=None):
    db: Session = SessionLocal()
    sort_field = getattr(Receipt, sort_by, Receipt.date)
    sort_func = asc if order == "asc" else desc

    query = db.query(Receipt)

    if category:
        query = query.filter(Receipt.category == category)

    total = query.count()  # total count before pagination
    results = query.order_by(sort_func(sort_field)).offset(offset).limit(limit).all()

    db.close()
    return {
        "items": results,
        "total": total
    }



def search_receipts(vendor=None, min_amount=None, max_amount=None, start_date=None, end_date=None, category=None):
    db = SessionLocal()
    query = db.query(Receipt)

    if vendor:
        query = query.filter(Receipt.vendor.ilike(f"%{vendor}%"))
    if min_amount is not None:
        query = query.filter(Receipt.amount >= min_amount)
    if max_amount is not None:
        query = query.filter(Receipt.amount <= max_amount)
    if start_date:
        query = query.filter(Receipt.date >= start_date)
    if end_date:
        query = query.filter(Receipt.date <= end_date)
    if category:
        query = query.filter(Receipt.category.ilike(f"%{category}%"))

    results = query.all()
    db.close()
    return results

def get_aggregates():
    db = SessionLocal()
    receipts = db.query(Receipt).all()
    db.close()
    return compute_aggregates(receipts)

def update_receipt_in_db(receipt_id, updated_data):
    db = SessionLocal()
    receipt = db.query(Receipt).get(receipt_id)
    if not receipt:
        raise Exception("Receipt not found")

    for key, value in updated_data.items():
        if hasattr(receipt, key):
            if key == "date" and isinstance(value, str):
                try:
                    value = datetime.strptime(value, "%Y-%m-%d")
                except ValueError:
                    raise Exception("Invalid date format. Expected YYYY-MM-DD.")
            setattr(receipt, key, value)

    db.commit()
    db.refresh(receipt)
    db.close()
    return receipt

