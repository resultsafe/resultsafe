from resultsafe.core.fp.result import Ok, Err

def run():
    success = Ok("ready")
    failure = Err("blocked")
    return success, failure
