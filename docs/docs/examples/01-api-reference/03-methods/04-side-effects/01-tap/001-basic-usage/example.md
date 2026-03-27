---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/03-methods/04-side-effects/01-tap/001-basic-usage/example.ts`



## Code

```typescript
import { Ok, tap } from '@resultsafe/core-fp-result';

const result = tap(Ok(10), (value) => {
  console.log('side effect with:', value);
});

console.log(result);
```

---

**Category:** examples | **Since:** unknown
