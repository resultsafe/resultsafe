/**
 * @module 001-error-recovery
 * @title Error Recovery Strategies
 * @description Comprehensive error recovery patterns including retry with exponential backoff, fallback chains, circuit breaker, bulkhead, and timeout. Production-ready resilience patterns.
 * @example
 * import { Err, Ok, match } from '@resultsafe/core-fp-result';
 * const result = await retryWithBackoff(operation, { maxRetries: 3, baseDelay: 1000 }, isRetryable);
 * match(result, value => console.log('Success:', value), err => console.error('Failed:', err));
 * @example
 * import { Err, Ok } from '@resultsafe/core-fp-result';
 * const fallbackResult = fallbackChain(primary, secondary, tertiary);
 * const circuitResult = await circuitBreaker.execute(operation);
 * @tags error-recovery,retry,circuit-breaker,bulkhead,timeout,advanced
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 * @difficulty Advanced
 * @time 25min
 * @category patterns
 * @see {@link 001-api-client} @see {@link 002-web-scraping} @see {@link https://github.com/Livooon/resultsafe}
 * @ai {"purpose":"Teach error recovery strategies with Result","prerequisites":["Result type","Async patterns","Error handling"],"objectives":["Retry patterns","Circuit breaker","Bulkhead"],"rag":{"queries":["Result retry pattern example","circuit breaker Result"],"intents":["learning","practical"],"expectedAnswer":"Use retry, circuit breaker, and fallback patterns with Result","confidence":0.95},"embedding":{"semanticKeywords":["error-recovery","retry","circuit-breaker","bulkhead","timeout"],"conceptualTags":["resilience","fault-tolerance"],"useCases":["microservices","distributed-systems"]},"codeSearch":{"patterns":["retryWithBackoff(operation","new CircuitBreaker(","fallbackChain("],"imports":["import { Err, match, Ok } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["001-api-client","002-web-scraping"]},"chunking":{"type":"self-contained","section":"patterns","subsection":"error-handling","tokenCount":500,"relatedChunks":["001-api-client","002-web-scraping"]}}
 */

import { Err, match, Ok } from '@resultsafe/core-fp-result';

// ===== Error Types =====

type FetchError =
  | { type: 'network'; message: string; retryable: boolean }
  | { type: 'timeout'; ms: number }
  | { type: 'http'; status: number; retryable: boolean }
  | { type: 'parse'; message: string }
  | { type: 'circuit-open'; message: string };

type Result<T, E = FetchError> = Ok<T, E> | Err<E>;

// ===== Strategy 1: Retry with Exponential Backoff =====

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  factor: number;
}

const retryWithBackoff = async <T, E extends FetchError>(
  operation: () => Promise<Result<T, E>>,
  config: RetryConfig,
  isRetryable: (error: E) => boolean,
): Promise<Result<T, E>> => {
  let lastError: E | null = null;
  let delay = config.baseDelay;

  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    const result = await operation();

    if (result.ok) {
      return result;
    }

    lastError = result.error;

    // Check if error is retryable
    if (!isRetryable(result.error)) {
      return result;
    }

    // Don't retry on last attempt
    if (attempt === config.maxRetries) {
      return result;
    }

    // Wait with exponential backoff
    console.log(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Calculate next delay with cap
    delay = Math.min(delay * config.factor, config.maxDelay);
  }

  return Err(lastError!);
};

// ===== Strategy 2: Fallback Chain =====

const fallbackChain = <T, E>(
  ...operations: Array<() => Result<T, E>>
): Result<T, E> => {
  let lastError: E | null = null;

  for (const operation of operations) {
    const result = operation();
    if (result.ok) {
      return result;
    }
    lastError = result.error;
  }

  return Err(lastError!);
};

// ===== Strategy 3: Circuit Breaker =====

interface CircuitBreakerState {
  failures: number;
  lastFailureTime?: number;
  state: 'closed' | 'open' | 'half-open';
}

class CircuitBreaker {
  private state: CircuitBreakerState = {
    failures: 0,
    state: 'closed',
  };

  constructor(
    private threshold: number,
    private timeout: number,
  ) {}

  async execute<T, E extends FetchError>(
    operation: () => Promise<Result<T, E>>,
  ): Promise<Result<T, E | { type: 'circuit-open'; message: string }>> {
    // Check if circuit is open
    if (this.state.state === 'open') {
      if (Date.now() - (this.state.lastFailureTime || 0) > this.timeout) {
        this.state.state = 'half-open';
        console.log('Circuit breaker: Half-open, trying...');
      } else {
        return Err({
          type: 'circuit-open',
          message: 'Circuit breaker is open',
        });
      }
    }

    // Execute operation
    const result = await operation();

    // Update state based on result
    if (result.ok) {
      this.state.failures = 0;
      this.state.state = 'closed';
      console.log('Circuit breaker: Success, circuit closed');
    } else {
      this.state.failures++;
      this.state.lastFailureTime = Date.now();

      if (this.state.failures >= this.threshold) {
        this.state.state = 'open';
        console.log(
          `Circuit breaker: Opened after ${this.state.failures} failures`,
        );
      }
    }

    return result;
  }

  getState(): CircuitBreakerState {
    return { ...this.state };
  }
}

// ===== Strategy 4: Bulkhead (Concurrency Limit) =====

class Bulkhead {
  private running = 0;
  private queue: Array<() => void> = [];

  constructor(private maxConcurrent: number) {}

  async execute<T, E>(
    operation: () => Promise<Result<T, E>>,
  ): Promise<Result<T, E | { type: 'rejected'; message: string }>> {
    if (this.running >= this.maxConcurrent) {
      // Wait for a slot
      await new Promise<void>((resolve) => {
        this.queue.push(resolve);
      });
    }

    this.running++;

    try {
      return await operation();
    } finally {
      this.running--;

      // Release next waiting operation
      const next = this.queue.shift();
      if (next) next();
    }
  }
}

// ===== Strategy 5: Timeout =====

const withTimeout = async <T, E>(
  operation: () => Promise<Result<T, E>>,
  timeoutMs: number,
): Promise<Result<T, E | { type: 'timeout'; ms: number }>> => {
  return Promise.race([
    operation(),
    new Promise<ReturnType<typeof operation>>((_, reject) =>
      setTimeout(() => reject({ type: 'timeout', ms: timeoutMs }), timeoutMs),
    ),
  ]).catch((error) => Err(error));
};

// ===== Real-World Example: Resilient API Client =====

class ResilientApiClient {
  private circuitBreaker: CircuitBreaker;
  private bulkhead: Bulkhead;

  constructor(
    private baseUrl: string,
    retryConfig: RetryConfig,
  ) {
    this.circuitBreaker = new CircuitBreaker(5, 60000); // 5 failures, 1 min timeout
    this.bulkhead = new Bulkhead(10); // Max 10 concurrent requests
  }

  async fetchWithRetry<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<Result<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const operation = async (): Promise<Result<T>> => {
      try {
        const response = await fetch(url, {
          ...options,
          signal: AbortSignal.timeout(5000),
        });

        if (!response.ok) {
          return Err({
            type: 'http',
            status: response.status,
            statusText: response.statusText,
            retryable: response.status >= 500 || response.status === 429,
          });
        }

        return Ok(await response.json());
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return Err({ type: 'timeout', ms: 5000 });
        }
        return Err({
          type: 'network',
          message: error instanceof Error ? error.message : 'Unknown error',
          retryable: true,
        });
      }
    };

    // Apply circuit breaker
    const circuitResult = await this.circuitBreaker.execute(operation);
    if (
      circuitResult.ok === false &&
      circuitResult.error.type === 'circuit-open'
    ) {
      return circuitResult;
    }

    // Apply retry with backoff
    return retryWithBackoff(
      () => operation() as Promise<Result<T, FetchError>>,
      { maxRetries: 3, baseDelay: 1000, maxDelay: 10000, factor: 2 },
      (error) => 'retryable' in error && error.retryable,
    );
  }
}

// ===== Example Usage =====

const runExample = async () => {
  console.log('=== Error Recovery Example ===\n');

  // Example 1: Retry with backoff
  console.log('--- Test 1: Retry with Backoff ---');
  let attempt = 0;
  const flakyOperation = async (): Promise<Result<string>> => {
    attempt++;
    console.log(`  Attempt ${attempt}`);

    if (attempt < 3) {
      return Err({
        type: 'network',
        message: 'Temporary failure',
        retryable: true,
      });
    }
    return Ok('Success!');
  };

  const retryResult = await retryWithBackoff(
    flakyOperation,
    { maxRetries: 5, baseDelay: 500, maxDelay: 5000, factor: 2 },
    (error) => error.retryable,
  );

  match(
    retryResult,
    (value) => console.log('Result:', value),
    (error) => console.log('Failed:', error),
  );

  // Example 2: Fallback chain
  console.log('\n--- Test 2: Fallback Chain ---');
  const primary = () =>
    Err<string, FetchError>({
      type: 'network',
      message: 'Primary down',
      retryable: true,
    });
  const secondary = () =>
    Err<string, FetchError>({
      type: 'network',
      message: 'Secondary down',
      retryable: true,
    });
  const tertiary = () => Ok('Tertiary succeeded!');

  const fallbackResult = fallbackChain(primary, secondary, tertiary);
  match(
    fallbackResult,
    (value) => console.log('Result:', value),
    (error) => console.log('All failed:', error),
  );

  // Example 3: Circuit breaker
  console.log('\n--- Test 3: Circuit Breaker ---');
  const breaker = new CircuitBreaker(3, 5000);

  const failingOperation = async (): Promise<Result<string>> => {
    return Err({
      type: 'http',
      status: 500,
      statusText: 'Internal Server Error',
      retryable: true,
    });
  };

  for (let i = 1; i <= 5; i++) {
    console.log(`\nRequest ${i}:`);
    const result = await breaker.execute(failingOperation);
    match(
      result,
      (value) => console.log('  Success:', value),
      (error) => console.log('  Error:', error.type),
    );
  }

  console.log('\nCircuit state:', breaker.getState());

  // Example 4: Bulkhead
  console.log('\n--- Test 4: Bulkhead (Concurrency Limit) ---');
  const bulkhead = new Bulkhead(2);

  const slowOperation = async (id: number) => {
    console.log(`  Operation ${id} started`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`  Operation ${id} completed`);
    return Ok(`Result ${id}`);
  };

  const results = await Promise.all([
    bulkhead.execute(() => slowOperation(1)),
    bulkhead.execute(() => slowOperation(2)),
    bulkhead.execute(() => slowOperation(3)),
    bulkhead.execute(() => slowOperation(4)),
  ]);

  console.log(
    'All results:',
    results.map((r) => (r.ok ? r.value : r.error)),
  );

  // Example 5: Timeout
  console.log('\n--- Test 5: Timeout ---');
  const slowApi = async (): Promise<Result<string>> => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return Ok('Too late!');
  };

  const timeoutResult = await withTimeout(slowApi, 1000);
  match(
    timeoutResult,
    (value) => console.log('Result:', value),
    (error) => console.log('Error:', error),
  );
};

// Run example
runExample().catch(console.error);

// ===== Additional Utilities =====

// Rate limiter
class RateLimiter {
  private tokens: number;
  private lastRefill: number;

  constructor(
    private maxTokens: number,
    private refillInterval: number,
  ) {
    this.tokens = maxTokens;
    this.lastRefill = Date.now();
  }

  private refill() {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const tokensToAdd = Math.floor(elapsed / this.refillInterval);

    if (tokensToAdd > 0) {
      this.tokens = Math.min(this.tokens + tokensToAdd, this.maxTokens);
      this.lastRefill = now;
    }
  }

  async execute<T, E>(
    operation: () => Promise<Result<T, E>>,
  ): Promise<Result<T, E | { type: 'rate-limited'; message: string }>> {
    this.refill();

    if (this.tokens <= 0) {
      return Err({ type: 'rate-limited', message: 'Rate limit exceeded' });
    }

    this.tokens--;
    return operation();
  }
}
