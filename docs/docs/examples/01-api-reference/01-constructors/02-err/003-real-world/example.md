---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/01-constructors/02-err/003-real-world/example.ts`



## Code

```typescript
import { Err, Ok, type Result } from '@resultsafe/core-fp-result';

interface User {
  id: string;
  name: string;
}

interface ApiError {
  status: number;
  message: string;
}

type UserResult = Result<User, ApiError>;

const fetchUser = async (id: string): Promise<UserResult> => {
  try {
    const response = await fetch(`/api/users/${id}`);

    if (!response.ok) {
      return Err({
        status: response.status,
        message: response.statusText,
      });
    }

    const data = (await response.json()) as User;
    return Ok(data);
  } catch (error) {
    return Err({
      status: 0,
      message: error instanceof Error ? error.message : 'Network error',
    });
  }
};

if (require.main === module) {
  fetchUser('user-1').then(console.log);
}
```

---

**Category:** examples | **Since:** unknown
