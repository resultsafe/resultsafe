---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/01-constructors/02-err/001-basic-usage/example.ts`



## Code

```typescript
import { Err, Ok, type Result } from '@resultsafe/core-fp-result';

// ===== Example 1: Basic error value =====
const basicExample = () => {
  const error = Err('Something went wrong');
  console.log(error); // { ok: false, error: 'Something went wrong' }
  console.log(error.ok); // false
  if (error.ok === false) {
    console.log(error.error); // 'Something went wrong'
  }
};

// ===== Example 2: Error in function =====
const divide = (a: number, b: number): Result<number, string> => {
  if (b === 0) {
    return Err('Division by zero');
  }
  return Ok(a / b);
};

const functionExample = () => {
  const result = divide(10, 0);
  console.log(result); // { ok: false, error: 'Division by zero' }
};

// ===== Run if standalone =====
if (require.main === module) {
  basicExample();
  functionExample();
}
```

---

**Category:** examples | **Since:** unknown
