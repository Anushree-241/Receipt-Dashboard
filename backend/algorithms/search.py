import re

def keyword_search(data, field, keyword):
    return [item for item in data if keyword.lower() in str(item.get(field, '')).lower()]

def range_search(data, field, min_val, max_val):
    return [item for item in data if min_val <= item.get(field, 0) <= max_val]

def pattern_search(data, field, pattern):
    regex = re.compile(pattern)
    return [item for item in data if regex.search(str(item.get(field, '')))]
