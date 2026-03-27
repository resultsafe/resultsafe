---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/03-methods/03-extraction/02-unwrap-or/002-basic/example.ts`



## Code

```typescript
import { Err, Ok, unwrapOr } from '@resultsafe/core-fp-result';

console.log(unwrapOr(Ok(7), 0));
console.log(unwrapOr(Err('boom'), 0));
```

---

**Category:** examples | **Since:** unknown
