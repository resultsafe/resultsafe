---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/03-methods/05-advanced/03-transpose/003-basic/example.ts`



## Code

```typescript
import { Err, Ok, transpose } from '@resultsafe/core-fp-result';

console.log(transpose(Ok({ some: true, value: 5 })));
console.log(transpose(Ok({ some: false })));
console.log(transpose(Err('boom')));
```

---

**Category:** examples | **Since:** unknown
