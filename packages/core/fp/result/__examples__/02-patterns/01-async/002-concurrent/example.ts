/**
 * @module 002-concurrent
 * @title Concurrent Async Operations
 * @description Running multiple async operations in parallel with Result error handling. Demonstrates Promise.all, allSettled, and race patterns.
 * @example
 * // Fetch all with Promise.all
 * import { Ok, Err } from '@resultsafe/core-fp-result';
 * const fetchAll = async (promises) => {
 *   const results = await Promise.all(promises);
 *   for (const result of results) {
 *     if (result.ok === false) return result;
 *   }
 *   return Ok(results.map(r => r.value));
 * };
 * @tags async,concurrent,promise,parallel,intermediate
 * @since 0.1.0
 * @difficulty Intermediate
 * @time 15min
 * @category patterns
 * @see {@link 001-basics} @see {@link 003-streams}
 * @ai {"purpose":"Teach concurrent async operations with Result","prerequisites":["async/await","Promise.all","Result type"],"objectives":["Promise.all with Result","Error handling in parallel"],"rag":{"queries":["concurrent async operations Result","Promise.all Result TypeScript"],"intents":["learning","practical"],"expectedAnswer":"Use Promise.all with Result to fetch multiple resources","confidence":0.95},"embedding":{"semanticKeywords":["async","concurrent","promise","parallel","fetch"],"conceptualTags":["async-patterns","error-handling","concurrency"],"useCases":["api-calls","batch-operations"]},"codeSearch":{"patterns":["Promise.all(promises)","fetchAll(resources)"],"imports":["import { Ok, Err } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["003-streams","06-workers"]},"chunking":{"type":"self-contained","section":"patterns","subsection":"async","tokenCount":450,"relatedChunks":["001-basics","003-streams"]}}
 */

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
