---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/04-refiners/05-refine-result/005-basic/example.ts`



## Code

```typescript
import { refineResult } from '@resultsafe/core-fp-result';

const variantMap = {
  created: { payload: ['id', 'meta'] },
  failed: { payload: 'reason' },
} as const;

const refineCreated = refineResult(variantMap)('created')({
  id: (value: unknown): value is string => typeof value === 'string',
  meta: (value: unknown): value is number => typeof value === 'number',
});

console.log(refineCreated({ type: 'created', id: '42', meta: 1 }));
console.log(refineCreated({ type: 'created', id: 42, meta: 1 }));
```

---

**Category:** examples | **Since:** unknown
