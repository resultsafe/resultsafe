---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/02-guards/04-is-err-and/001-basic-usage/example.ts`



## Code

```typescript
import { Err, isErrAnd } from '@resultsafe/core-fp-result';

const result = Err({ code: 503, message: 'Service unavailable' });

const isRetryable = isErrAnd(result, (error) => error.code >= 500);

console.log('retryable:', isRetryable);
```

---

**Category:** examples | **Since:** unknown
