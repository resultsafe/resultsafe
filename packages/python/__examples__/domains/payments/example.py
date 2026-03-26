from resultsafe.core.fp.result import Ok, Err

def charge(amount):
    return Ok("charged") if amount > 0 else Err("invalid amount")
