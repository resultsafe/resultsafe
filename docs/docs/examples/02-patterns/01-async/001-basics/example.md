---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/02-patterns/01-async/001-basics/example.ts`



## Code

```typescript
import { Err, match, Ok, type Result } from '@resultsafe/core-fp-result';

// ===== Async function returning Result =====

const fetchJson = async (url: string): Promise<Result<unknown, string>> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return Err(`HTTP ${response.status}: ${response.statusText}`);
    }
    return Ok(await response.json());
  } catch (error) {
    return Err(error instanceof Error ? error.message : 'Network error');
  }
};

// ===== Using async/await with Result =====

const getUserData = async (userId: string) => {
  const result = await fetchJson(`https://api.example.com/users/${userId}`);

  return match(
    result,
    (data) => Ok({ userId, data, fetchedAt: new Date().toISOString() }),
    (error) => Err({ type: 'fetch' as const, error }),
  );
};

// ===== Parallel async operations =====

const fetchWithTimeout = async (
  url: string,
  timeoutMs: number,
): Promise<Result<unknown, string>> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return Err(`HTTP ${response.status}`);
    }
    return Ok(await response.json());
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      return Err(`Timeout after ${timeoutMs}ms`);
    }
    return Err(error instanceof Error ? error.message : 'Request failed');
  }
};

// ===== Sequential async operations with chaining =====

interface User {
  id: string;
  name: string;
  email: string;
}

interface Post {
  id: string;
  userId: string;
  title: string;
  body: string;
}

const fetchUser = async (id: string): Promise<Result<User, string>> => {
  // Simulated API call
  await new Promise((resolve) => setTimeout(resolve, 100));
  return Ok({ id, name: 'John Doe', email: 'john@example.com' });
};

const fetchUserPosts = async (
  userId: string,
): Promise<Result<Post[], string>> => {
  // Simulated API call
  await new Promise((resolve) => setTimeout(resolve, 100));
  return Ok([
    { id: '1', userId, title: 'First Post', body: 'Content 1' },
    { id: '2', userId, title: 'Second Post', body: 'Content 2' },
  ]);
};

const getUserPostCount = async (
  userId: string,
): Promise<Result<number, string>> => {
  const userResult = await fetchUser(userId);
  if (userResult.ok === false) return userResult;

  const postsResult = await fetchUserPosts(userId);
  if (postsResult.ok === false) return postsResult;

  return Ok(postsResult.value.length);
};

// ===== Example usage =====

const runExample = async () => {
  console.log('=== Async Operations Example ===\n');

  // Example 1: Simple async Result
  const result1 = await fetchWithTimeout('https://api.example.com/data', 5000);
  console.log('Fetch result:', result1);

  // Example 2: getUserData
  const result2 = await getUserData('user-123');
  console.log('User data:', result2);

  // Example 3: Sequential operations
  const postCount = await getUserPostCount('user-123');
  console.log('Post count:', postCount); // Ok(2)
};

// Uncomment to run:
// runExample().catch(console.error);
```

---

**Category:** examples | **Since:** unknown
