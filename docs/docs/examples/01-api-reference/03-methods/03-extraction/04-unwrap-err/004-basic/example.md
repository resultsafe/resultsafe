---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/03-methods/03-extraction/04-unwrap-err/004-basic/example.ts`



## Code

```typescript
import { Err, unwrapErr } from '@resultsafe/core-fp-result';

const error = unwrapErr(Err({ code: 'E_DB' }));
console.log(error.code);
```

---

**Category:** examples | **Since:** unknown
