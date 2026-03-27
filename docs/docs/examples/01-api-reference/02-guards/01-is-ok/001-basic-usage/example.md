---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/02-guards/01-is-ok/001-basic-usage/example.ts`



## Code

```typescript
import { Err, Ok, isOk } from '@resultsafe/core-fp-result';

const a = Ok(42);
const b = Err('boom');

console.log('a is ok:', isOk(a));
console.log('b is ok:', isOk(b));
```

---

**Category:** examples | **Since:** unknown
