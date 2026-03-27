---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/04-refiners/08-refine-async-result-u/008-basic/example.ts`



## Code

```typescript
import { refineAsyncResultU } from '@resultsafe/core-fp-result';

const variantMap = {
  created: { payload: ['id', 'meta'] },
  failed: { payload: 'reason' },
} as const;

async function main(): Promise<void> {
  const refined = await refineAsyncResultU(
    { type: 'created', id: '42', meta: 1 },
    'created',
    variantMap,
    {
      id: async (value: unknown) => typeof value === 'string',
      meta: async (value: unknown) => typeof value === 'number',
    },
  );

  console.log(refined);
}

await main();
```

---

**Category:** examples | **Since:** unknown
