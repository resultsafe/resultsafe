---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/03-methods/05-advanced/01-match/001-basic-usage/example.ts`



## Code

```typescript
import { Err, Ok, match } from '@resultsafe/core-fp-result';

const a = match(
  Ok(5),
  (v) => `ok:${v}`,
  (e) => `err:${e}`,
);
const b = match(
  Err('boom'),
  (v) => `ok:${v}`,
  (e) => `err:${e}`,
);

console.log(a);
console.log(b);
```

---

**Category:** examples | **Since:** unknown
