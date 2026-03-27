---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/03-methods/02-chaining/02-or-else/001-basic-usage/example.ts`



## Code

```typescript
import { Err, Ok, orElse } from '@resultsafe/core-fp-result';

const fallback = orElse(Err('network'), () => Ok('cached-value'));

console.log(fallback);
```

---

**Category:** examples | **Since:** unknown
