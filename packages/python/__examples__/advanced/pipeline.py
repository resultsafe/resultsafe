from resultsafe.core.fp.result import Ok

def advanced():
    return Ok({"stages": ["auth", "billing", "notify"]})
