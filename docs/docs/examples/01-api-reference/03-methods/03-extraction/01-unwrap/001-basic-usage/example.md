---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/03-methods/03-extraction/01-unwrap/001-basic-usage/example.ts`



## Code

```typescript
import { Ok, unwrap } from '@resultsafe/core-fp-result';

const value = unwrap(Ok(99));
console.log(value);
```

---

**Category:** examples | **Since:** unknown
