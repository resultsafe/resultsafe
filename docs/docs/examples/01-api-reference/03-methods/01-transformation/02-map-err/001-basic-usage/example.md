---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/03-methods/01-transformation/02-map-err/001-basic-usage/example.ts`



## Code

```typescript
import { Err, mapErr } from '@resultsafe/core-fp-result';

const source = Err({ code: 'E_IO' });
const normalized = mapErr(source, (error) => `code:${error.code}`);

console.log(normalized);
```

---

**Category:** examples | **Since:** unknown
