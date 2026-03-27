/**
 * @module 003-streams
 * @title Async Stream Processing
 * @description Processing async iterables and streams with Result error handling. Demonstrates generators, backpressure, and batch processing.
 *
 * @example
 * // Process async stream with generators
 * import { Ok, Err } from '@resultsafe/core-fp-result';
 *
 * async function* processStream(stream) {
 *   for await (const item of stream) {
 *     const result = await processItem(item);
 *     yield result.ok ? Ok(result.value) : Err(result.error);
 *   }
 * }
 *
 * @example
 * // Batch processing with backpressure
 * import { processInBatches, Ok } from '@resultsafe/core-fp-result';
 * const items = [1, 2, 3, 4, 5];
 * const result = await processInBatches(items, async (n) => Ok(n * 2), 2);
 * console.log(result); // Ok([2, 4, 6, 8, 10])
 *
 * @tags async,streams,generators,backpressure,advanced
 * @since 0.1.0
 * @difficulty Advanced
 * @time 20min
 * @category patterns
 * @see {@link 002-concurrent} @see {@link 06-workers}
 * @ai {"purpose":"Teach async stream processing with Result","prerequisites":["async/await","generators","iterables"],"objectives":["Async generators","Stream processing","Backpressure"],"rag":{"queries":["async stream processing Result","async generators TypeScript"],"intents":["learning","advanced"],"expectedAnswer":"Use async generators with Result for stream processing","confidence":0.95},"embedding":{"semanticKeywords":["async","streams","generators","backpressure","processing"],"conceptualTags":["async-patterns","streaming","backpressure"],"useCases":["data-processing","real-time","pipelines"]},"codeSearch":{"patterns":["async function*","for await (const item of stream)"],"imports":["import { Ok, Err } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["06-workers"]},"chunking":{"type":"self-contained","section":"patterns","subsection":"async","tokenCount":500,"relatedChunks":["002-concurrent","06-workers"]}}
 */

import { Err, match, Ok, type Result } from '@resultsafe/core-fp-result';

// ===== Pattern 1: Async Generator with Result =====

async function* asyncResultGenerator<T, E>(
  items: T[],
  processor: (item: T) => Promise<Result<unknown, E>>,
): AsyncGenerator<Result<unknown, E>, void, unknown> {
  for (const item of items) {
    const result = await processor(item);
    yield result;
  }
}

// ===== Pattern 2: Stream processing =====

interface StreamConfig<T, E> {
  onError?: 'stop' | 'continue' | 'collect';
  maxErrors?: number;
}

const processStream = async <T, U, E>(
  stream: AsyncIterable<T>,
  processor: (item: T) => Promise<Result<U, E>>,
  config: StreamConfig<T, E> = {},
): Promise<Result<U[], E[]>> => {
  const { onError = 'continue', maxErrors = Infinity } = config;
  const results: U[] = [];
  const errors: E[] = [];

  for await (const item of stream) {
    const result = await processor(item);
    if (result.ok) {
      results.push(result.value);
    } else {
      errors.push(result.error);
      if (onError === 'stop') return Err(errors);
      if (errors.length >= maxErrors) return Err(errors);
    }
  }

  return errors.length > 0 ? Err(errors) : Ok(results);
};

// ===== Pattern 3: Batch processing =====

const processInBatches = async <T, U, E>(
  items: T[],
  processor: (item: T) => Promise<Result<U, E>>,
  batchSize: number = 10,
): Promise<Result<U[], E[]>> => {
  const results: U[] = [];
  const errors: E[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));

    for (const result of batchResults) {
      if (result.ok) {
        results.push(result.value);
      } else {
        errors.push(result.error);
      }
    }

    if (i + batchSize < items.length) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  return errors.length > 0 ? Err(errors) : Ok(results);
};

// ===== Example usage =====

const runExample = async () => {
  // Example 1: Async generator
  const numbers: number[] = [1, 2, 3, 4, 5];

  const generator = asyncResultGenerator(numbers, async (n) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return n % 2 === 0 ? Ok(n * 2) : Err(`Odd: ${n}`);
  });

  for await (const result of generator) {
    match(result, console.log, console.error);
  }

  // Example 2: Batch processing
  const items = Array.from({ length: 25 }, (_, i) => i + 1);
  const batchResult = await processInBatches(items, async (n) => Ok(n * 2), 5);
  console.log('Batch result:', batchResult);
};

// Run example
runExample().catch(console.error);
