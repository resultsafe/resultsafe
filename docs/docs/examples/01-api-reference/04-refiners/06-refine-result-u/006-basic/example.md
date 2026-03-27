---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/04-refiners/06-refine-result-u/006-basic/example.ts`



## Code

```typescript
import { refineResultU } from '@resultsafe/core-fp-result';

const variantMap = {
  created: { payload: ['id', 'meta'] },
  failed: { payload: 'reason' },
} as const;

const refined = refineResultU(
  { type: 'created', id: '42', meta: 1 },
  'created',
  variantMap,
  {
    id: (value: unknown): value is string => typeof value === 'string',
    meta: (value: unknown): value is number => typeof value === 'number',
  },
);

console.log(refined);
```

---

**Category:** examples | **Since:** unknown
