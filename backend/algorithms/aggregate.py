from collections import Counter
from datetime import datetime

from statistics import median, mode, StatisticsError

def compute_aggregates(receipts):
    amounts = [r.amount for r in receipts]
    total = sum(amounts)
    avg = round(total / len(amounts), 2) if amounts else 0

    try:
        med = median(amounts)
    except StatisticsError:
        med = None

    try:
        mod = mode(amounts)
    except StatisticsError:
        mod = None  # no unique mode

    vendor_counts = Counter(r.vendor for r in receipts)
    top_vendors = vendor_counts.most_common(5)

    # Monthly aggregation
    monthly = {}
    for r in receipts:
        key = r.date.strftime("%Y-%m")
        monthly[key] = monthly.get(key, 0) + r.amount
    top_months = sorted(monthly.items(), key=lambda x: x[1], reverse=True)[:3]

    return {
        "total_spent": round(total, 2),
        "average_spent": avg,
        "median_spent": round(med, 2) if med else None,
        "mode_spent": round(mod, 2) if mod else None,
        "vendor_frequency": vendor_counts,
        "top_vendors": top_vendors,
        "monthly_spend": monthly,
        "top_months": top_months
    }
