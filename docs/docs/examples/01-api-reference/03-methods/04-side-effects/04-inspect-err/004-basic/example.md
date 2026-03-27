---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/03-methods/04-side-effects/04-inspect-err/004-basic/example.ts`



## Code

```typescript
import { Err, inspectErr } from '@resultsafe/core-fp-result';

const result = inspectErr(Err({ code: 'E_AUTH' }), (error) => {
  console.log('observed error:', error.code);
});

console.log(result);
```

---

**Category:** examples | **Since:** unknown
