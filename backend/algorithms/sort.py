def sort_data(data, field, reverse=False):
    try:
        return sorted(data, key=lambda x: x.get(field, ''), reverse=reverse)
    except TypeError:
        # In case of mixed types (e.g., None and str), fallback to str
        return sorted(data, key=lambda x: str(x.get(field, '')), reverse=reverse)
