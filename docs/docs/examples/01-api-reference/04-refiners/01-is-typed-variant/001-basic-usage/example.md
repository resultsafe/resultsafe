---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/04-refiners/01-is-typed-variant/001-basic-usage/example.ts`



## Code

```typescript
import { isTypedVariant } from '@resultsafe/core-fp-result';

const isCreated = isTypedVariant('created');

console.log(isCreated({ type: 'created', id: '1' }));
console.log(isCreated({ type: 'deleted', id: '1' }));
```

---

**Category:** examples | **Since:** unknown
