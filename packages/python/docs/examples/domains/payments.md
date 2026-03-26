---
id: PYTHON-EXAMPLES-DOMAIN-PAYMENTS
uuid: 29d0ea3d-7cb4-4088-8d5a-926a5b0efe36
title: Payments Example
status: canonical
layer: authored
lang: en
sidebar_position: 2
created: 2026-03-23
updated: 2026-03-23
---

# Payments Domain Example

```py
from resultsafe.core.fp.result import Err, Ok

def process_payment(amount: float) -> Result[str, str]:
    if amount <= 0:
        return Err("invalid amount")
    return Ok("payment-id-123")
```
