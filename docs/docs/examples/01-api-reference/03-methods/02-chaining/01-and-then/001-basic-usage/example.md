---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/03-methods/02-chaining/01-and-then/001-basic-usage/example.ts`



## Code

```typescript
import { Err, Ok, andThen } from '@resultsafe/core-fp-result';

const parsePort = (raw: string) => {
  const port = Number(raw);
  return Number.isInteger(port) ? Ok(port) : Err('invalid-port');
};

const value = andThen(Ok('8080'), parsePort);
console.log(value);
```

---

**Category:** examples | **Since:** unknown
