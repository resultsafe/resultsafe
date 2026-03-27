---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/03-methods/04-side-effects/02-tap-err/002-basic/example.ts`



## Code

```typescript
import { Err, tapErr } from '@resultsafe/core-fp-result';

const result = tapErr(Err('fatal'), (error) => {
  console.log('side effect for error:', error);
});

console.log(result);
```

---

**Category:** examples | **Since:** unknown
