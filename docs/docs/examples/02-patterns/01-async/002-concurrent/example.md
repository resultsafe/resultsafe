---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/02-patterns/01-async/002-concurrent/example.ts`



## Code

```typescript
import { Err, Ok, type Result } from '@resultsafe/core-fp-result';

// ===== Pattern 1: Promise.all with Result =====

const fetchAll = async <T>(
  promises: Array<Promise<Result<T, string>>>,
): Promise<Result<T[], string>> => {
  const results = await Promise.all(promises);

  for (const result of results) {
    if (result.ok === false) {
      return result;
    }
  }

  return Ok(
    results
      .map((r) => (r.ok ? r.value : undefined))
      .filter((v): v is T => v !== undefined),
  );
};

// ===== Pattern 2: Promise.allSettled =====

const fetchAllSettled = async <T, E>(
  promises: Array<Promise<Result<T, E>>>,
): Promise<Result<T[], E[]>> => {
  const settled = await Promise.allSettled(promises);
  const values: T[] = [];
  const errors: E[] = [];

  for (const result of settled) {
    if (result.status === 'fulfilled') {
      const res = result.value;
      if (res.ok) {
        values.push(res.value);
      } else {
        errors.push(res.error);
      }
    } else {
      errors.push(result.reason as E);
    }
  }

  if (errors.length > 0) {
    return Err(errors);
  }

  return Ok(values);
};

// ===== Pattern 3: Race with timeout =====

const raceWithTimeout = async <T, E>(
  operations: Array<Promise<Result<T, E>>>,
  timeoutMs: number,
): Promise<Result<T, E | { type: 'timeout'; ms: number }>> => {
  const timeout = new Promise<Result<T, E | { type: 'timeout'; ms: number }>>(
    (resolve) =>
      setTimeout(
        () => resolve(Err({ type: 'timeout', ms: timeoutMs })),
        timeoutMs,
      ),
  );

  return Promise.race([...operations, timeout]);
};

// ===== Example usage =====

const runExample = async () => {
  const fetchUser = async (id: number) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return Ok({ id, name: `User ${id}` });
  };

  // Example 1: Fetch all
  const allResult = await fetchAll([fetchUser(1), fetchUser(2)]);
  console.log('Fetch all:', allResult);

  // Example 2: Race with timeout
  const raceResult = await raceWithTimeout([fetchUser(1), fetchUser(2)], 200);
  console.log('Race result:', raceResult);
};

if (require.main === module) {
  runExample().catch(console.error);
}
```

---

**Category:** examples | **Since:** unknown
