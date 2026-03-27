/**
 * @module 001-basics
 * @title Async Operations with Result
 * @description Learn to use Result with async/await patterns. Covers async functions returning Result, parallel operations, and sequential chaining.
 * @example
 * import { Ok, Err, match } from '@resultsafe/core-fp-result';
 * const fetchJson = async (url) => {
 *   try { return Ok(await fetch(url).then(r => r.json())); }
 *   catch (e) { return Err(e.message); }
 * };
 * @example
 * import { Ok, Err, match } from '@resultsafe/core-fp-result';
 * const result = await fetchJson('https://api.example.com/data');
 * match(result, data => console.log(data), err => console.error(err));
 * @tags async,promise,await,functional,pattern,intermediate
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Intermediate
 * @time 15min
 * @category patterns
 * @see {@link 002-concurrent} @see {@link 003-streams} @see {@link ../../01-api-reference/03-methods/02-chaining/01-and-then}
 * @ai {"purpose":"Teach async/await patterns with Result","prerequisites":["Result type","Async/await"],"objectives":["Async Result functions","Error handling"],"rag":{"queries":["Result async await example","Result promise pattern"],"intents":["learning","practical"],"expectedAnswer":"Use async functions returning Promise<Result<T,E>>","confidence":0.95},"embedding":{"semanticKeywords":["async","promise","await","result","functional"],"conceptualTags":["async-programming","error-handling"],"useCases":["api-calls","file-io"]},"codeSearch":{"patterns":["async () => Promise<Result","await fetchJson()"],"imports":["import { Ok, Err, match } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["002-concurrent","003-streams"]},"chunking":{"type":"self-contained","section":"patterns","subsection":"async","tokenCount":350,"relatedChunks":["002-concurrent","003-streams"]}}
 */

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
