---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/03-methods/04-side-effects/03-inspect/003-basic/example.ts`



## Code

```typescript
import { Ok, inspect } from '@resultsafe/core-fp-result';

const result = inspect(Ok({ id: 'u-1' }), (value) => {
  console.log('observed id:', value.id);
});

console.log(result);
```

---

**Category:** examples | **Since:** unknown
