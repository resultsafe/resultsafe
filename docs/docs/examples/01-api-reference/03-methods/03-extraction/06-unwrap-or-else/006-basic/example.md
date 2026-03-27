---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/03-methods/03-extraction/06-unwrap-or-else/006-basic/example.ts`



## Code

```typescript
import { Err, Ok, unwrapOrElse } from '@resultsafe/core-fp-result';

console.log(unwrapOrElse(Ok(7), () => 0));
console.log(unwrapOrElse(Err('boom'), (e) => e.length));
```

---

**Category:** examples | **Since:** unknown
