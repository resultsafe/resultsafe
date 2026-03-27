---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/01-api-reference/01-constructors/01-ok/003-real-world/example.ts`



## Code

```typescript
import { Err, Ok, type Result } from '@resultsafe/core-fp-result';

// ===== Example 1: API Response Pattern =====
interface User {
  id: string;
  name: string;
  email: string;
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

// ===== Example 2: Validation Pattern =====
interface ValidationError {
  field: string;
  message: string;
}

const validateEmail = (email: string): Result<string, ValidationError> => {
  if (!email.includes('@')) {
    return Err({ field: 'email', message: 'Invalid email format' });
  }
  return Ok(email);
};

// ===== Example 3: Factory Function =====
const createUser = (name: string, email: string) => {
  const emailResult = validateEmail(email);

  if (emailResult.ok === false) {
    return emailResult;
  }

  return Ok({ id: 'user-1', name, email: emailResult.value });
};

// ===== Run if standalone =====
if (require.main === module) {
  const user = createUser('John', 'john@example.com');
  console.log(user); // Ok({ id: 'user-1', name: 'John', email: 'john@example.com' })
}
```

---

**Category:** examples | **Since:** unknown
