---
id: PYTHON-EXAMPLES-DOMAIN-VALIDATION
uuid: 3c9de0a4-0eac-41da-9c39-0dbafef744b7
title: Validation Example
status: canonical
layer: authored
lang: en
sidebar_position: 3
created: 2026-03-23
updated: 2026-03-23
---

# Validation Domain Example

```py
from resultsafe.core.fp.option import Some, None

def validate_email(email: str) -> Option[str]:
    return Some(email) if "@" in email else None
```
