---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/03-methods/01-transformation/01-map/001-basic-usage/example.ts`



## Code

```typescript
import { Ok, map } from '@resultsafe/core-fp-result';

const source = Ok(21);
const doubled = map(source, (value) => value * 2);

console.log(doubled);
```

---

**Category:** examples | **Since:** unknown
