---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/03-methods/05-advanced/04-ok/004-basic/example.ts`



## Code

```typescript
import { Err, Ok, ok } from '@resultsafe/core-fp-result';

console.log(ok(Ok(1)));
console.log(ok(Err('x')));
```

---

**Category:** examples | **Since:** unknown
