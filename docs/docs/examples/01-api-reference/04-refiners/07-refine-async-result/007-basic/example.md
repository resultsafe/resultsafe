---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/04-refiners/07-refine-async-result/007-basic/example.ts`



## Code

```typescript
import { refineAsyncResult } from '@resultsafe/core-fp-result';

const variantMap = {
  created: { payload: ['id', 'meta'] },
  failed: { payload: 'reason' },
} as const;

async function main(): Promise<void> {
  const refineCreated = refineAsyncResult(variantMap)('created')({
    id: async (value: unknown) => typeof value === 'string',
    meta: async (value: unknown) => typeof value === 'number',
  });

  console.log(await refineCreated({ type: 'created', id: '42', meta: 1 }));
  console.log(await refineCreated({ type: 'created', id: 42, meta: 1 }));
}

await main();
```

---

**Category:** examples | **Since:** unknown
