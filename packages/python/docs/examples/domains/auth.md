---
id: PYTHON-EXAMPLES-DOMAIN-AUTH
uuid: 11ed6f91-ea5e-4a5a-9f32-20d5b3fe4fd1
title: Auth Example
status: canonical
layer: authored
lang: en
sidebar_position: 1
created: 2026-03-23
updated: 2026-03-23
---

# Auth Domain Example

```py
from resultsafe.core.fp.result import Ok, Err

def authenticate(username: str) -> Result[str, str]:
    if username == "alice":
        return Ok("session-token")
    return Err("invalid credentials")
```
