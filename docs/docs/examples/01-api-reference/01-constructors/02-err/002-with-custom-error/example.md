---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/01-constructors/02-err/002-with-custom-error/example.ts`



## Code

```typescript
import { Err, type Result } from '@resultsafe/core-fp-result';

interface ApiError {
  code: number;
  message: string;
}

const error: Result<never, ApiError> = Err({
  code: 500,
  message: 'Server error',
});

console.log(error); // { ok: false, error: { code: 500, message: 'Server error' } }
```

---

**Category:** examples | **Since:** unknown
