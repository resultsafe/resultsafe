---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/00-quick-start/001-hello-world/example.ts`



## Code

```typescript
import { Err, Ok } from '@resultsafe/core-fp-result';

const success = Ok(42);
console.log('Success:', success);

const failure = Err('Something went wrong');
console.log('Failure:', failure);
```

---

**Category:** examples | **Since:** unknown
