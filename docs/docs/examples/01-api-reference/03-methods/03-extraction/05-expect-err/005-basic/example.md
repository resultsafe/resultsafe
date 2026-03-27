---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/03-methods/03-extraction/05-expect-err/005-basic/example.ts`



## Code

```typescript
import { Err, expectErr } from '@resultsafe/core-fp-result';

const error = expectErr(Err('fatal'), 'must be err');
console.log(error);
```

---

**Category:** examples | **Since:** unknown
