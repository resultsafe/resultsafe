---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/02-guards/03-is-ok-and/001-basic-usage/example.ts`



## Code

```typescript
import { Ok, isOkAnd } from '@resultsafe/core-fp-result';

const result = Ok({ id: 'u-1', active: true });

const isActiveUser = isOkAnd(
  result,
  (value) => value.active === true && value.id.length > 0,
);

console.log('is active user:', isActiveUser);
```

---

**Category:** examples | **Since:** unknown
