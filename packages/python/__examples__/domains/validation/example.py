from resultsafe.core.fp.option import Some, None

def validate(code):
    return Some(code) if code.startswith("VAL") else None
