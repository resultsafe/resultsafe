---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/01-constructors/01-ok/002-with-generics/example.ts`



## Code

```typescript
import { Ok, type Result } from '@resultsafe/core-fp-result';

// ===== Example 1: Explicit type parameters =====
const explicitTypes = () => {
  const numberResult: Result<number, string> = Ok<number, string>(42);
  console.log(numberResult); // { ok: true, value: 42 }

  const stringResult: Result<string, Error> = Ok<string, Error>('success');
  console.log(stringResult); // { ok: true, value: 'success' }
};

// ===== Example 2: Complex types =====
interface User {
  id: string;
  name: string;
}

type ApiError = { code: number; message: string };

const complexTypes = () => {
  const userResult: Result<User, ApiError> = Ok<User, ApiError>({
    id: 'user-1',
    name: 'John',
  });

  if (userResult.ok) {
    console.log('Value:', userResult.value.name); // 'John'
  }
};

// ===== Run if standalone =====
if (require.main === module) {
  explicitTypes();
  complexTypes();
}
```

---

**Category:** examples | **Since:** unknown
