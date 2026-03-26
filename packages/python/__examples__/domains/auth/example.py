from resultsafe.core.fp.result import Ok, Err

def login(user):
    return Ok("token") if user == "alice" else Err("unauthorized")
