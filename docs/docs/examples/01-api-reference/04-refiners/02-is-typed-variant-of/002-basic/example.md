---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/04-refiners/02-is-typed-variant-of/002-basic/example.ts`



## Code

```typescript
import { isTypedVariantOf } from '@resultsafe/core-fp-result';

const isCreatedWithId = isTypedVariantOf<'created', { id: unknown }>('created');

console.log(isCreatedWithId({ type: 'created', id: '1' }));
console.log(isCreatedWithId({ type: 'created' }));
```

---

**Category:** examples | **Since:** unknown
