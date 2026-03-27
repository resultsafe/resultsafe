---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/03-methods/03-extraction/03-expect/003-basic/example.ts`



## Code

```typescript
import { Ok, expect } from '@resultsafe/core-fp-result';

const value = expect(Ok('ready'), 'must be ok');
console.log(value);
```

---

**Category:** examples | **Since:** unknown
