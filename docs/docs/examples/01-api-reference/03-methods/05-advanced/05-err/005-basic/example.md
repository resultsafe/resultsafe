---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/03-methods/05-advanced/05-err/005-basic/example.ts`



## Code

```typescript
import { Err, Ok, err } from '@resultsafe/core-fp-result';

console.log(err(Err('x')));
console.log(err(Ok(1)));
```

---

**Category:** examples | **Since:** unknown
