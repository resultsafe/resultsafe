---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/03-methods/05-advanced/02-flatten/002-basic/example.ts`



## Code

```typescript
import { Err, Ok, flatten } from '@resultsafe/core-fp-result';

console.log(flatten(Ok(Ok(10))));
console.log(flatten(Ok(Err('inner'))));
console.log(flatten(Err('outer')));
```

---

**Category:** examples | **Since:** unknown
