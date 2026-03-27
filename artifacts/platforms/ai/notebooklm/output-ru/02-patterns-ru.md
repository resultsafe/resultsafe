# 02-patterns

# Как мне to use result with async/await patterns?

## Краткий ответ
Используйте Err, match, Ok для обработки.

## Подробное объяснение
to use Result with Асинхронный/await Паттерны. Covers Асинхронный functions returning Result, parallel operations, and sequential chaining.

## Пример кода
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

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Err`
- `match`
- `Ok`
- `Result`

## Связанные концепции
- [[Err]]
- [[match]]
- [[Ok]]
- [[Result]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне multiple async operations in parallel with result обработать ошибки?

## Краткий ответ
Используйте Err, Ok, map для обработки.

## Подробное объяснение
multiple Асинхронный operations in parallel with Result Обработка ошибок. Демонстрирует Promise.all, allSettled, and race Паттерны.

## Пример кода
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

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Err`
- `Ok`
- `Result`
- `map`

## Связанные концепции
- [[Err]]
- [[Ok]]
- [[Result]]
- [[map]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне async iterables and streams with result обработать ошибки?

## Краткий ответ
Используйте Err, match, Ok, map для обработки.

## Подробное объяснение
Асинхронный iterables and streams with Result Обработка ошибок. Демонстрирует generators, backpressure, and batch processing.

## Пример кода
```typescript
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
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Err`
- `match`
- `Ok`
- `Result`
- `map`

## Связанные концепции
- [[Err]]
- [[match]]
- [[Ok]]
- [[Result]]
- [[map]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне rest api client implementation with typed errors, retry logic, authentication, and rate limiting?

## Краткий ответ
Используйте Err, match, Ok для обработки.

## Подробное объяснение
REST API client implementation with typed errors, retry logic, authentication, and rate limiting. Продакшн-ready pattern for HTTP operations.

## Пример кода
```typescript
import { Err, match, Ok, type Result } from '@resultsafe/core-fp-result';

// ===== Error Types =====

type ApiError =
  | { type: 'network'; message: string; url: string }
  | { type: 'http'; status: number; statusText: string; url: string }
  | { type: 'parse'; message: string; data: string }
  | { type: 'validation'; field: string; message: string }
  | { type: 'auth'; code: 'unauthorized' | 'forbidden' | 'token_expired' }
  | { type: 'rate-limit'; retryAfter: number }
  | { type: 'timeout'; ms: number };

type ResultType<T, E = ApiError> = Result<T, E>;

// ===== API Client Configuration =====

interface ApiClientConfig {
  baseUrl: string;
  token?: string;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
}

// ===== API Client Class =====

class ApiClient {
  private config: Required<ApiClientConfig>;

  constructor(config: ApiClientConfig) {
    this.config = {
      baseUrl: config.baseUrl,
      token: config.token || '',
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 1000,
    };
  }

  // Update token (e.g., after refresh)
  setToken(token: string): void {
    this.config.token = token;
  }

  // Generic request method
  protected async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<ResultType<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;

    const headersInit: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.config.token) {
      headersInit['Authorization'] = `Bearer ${this.config.token}`;
    }

    if (options?.headers) {
      Object.assign(headersInit, options.headers);
    }

    const headers = headersInit;

    // Retry loop
    let lastError: ApiError | null = null;

    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          this.config.timeout,
        );

        const response = await fetch(url, {
          ...options,
          headers,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = parseInt(
            response.headers.get('Retry-After') || '60',
            10,
          );
          lastError = { type: 'rate-limit', retryAfter };

          if (attempt < this.config.maxRetries) {
            await new Promise((resolve) =>
              setTimeout(resolve, retryAfter * 1000),
            );
            continue;
          }
        }

        // Handle authentication errors
        if (response.status === 401) {
          return Err({
            type: 'auth',
            code: 'unauthorized',
          });
        }

        if (response.status === 403) {
          return Err({
            type: 'auth',
            code: 'forbidden',
          });
        }

        // Handle not found
        if (response.status === 404) {
          return Err({
            type: 'http',
            status: 404,
            statusText: 'Not Found',
            url,
          });
        }

        // Handle other HTTP errors
        if (!response.ok) {
          return Err({
            type: 'http',
            status: response.status,
            statusText: response.statusText,
            url,
          });
        }

        // Parse response
        try {
          const data = await response.json();
          return Ok(data as T);
        } catch (parseError) {
          return Err({
            type: 'parse',
            message:
              parseError instanceof Error
                ? parseError.message
                : 'JSON parse failed',
            data: await response.text(),
          });
        }
      } catch (error) {
        // Network error or timeout
        if (error instanceof Error && error.name === 'AbortError') {
          lastError = { type: 'timeout', ms: this.config.timeout };
        } else {
          lastError = {
            type: 'network',
            message:
              error instanceof Error ? error.message : 'Unknown network error',
            url,
          };
        }

        // Retry with exponential backoff
        if (attempt < this.config.maxRetries && lastError.type === 'network') {
          const delay = this.config.retryDelay * Math.pow(2, attempt - 1);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
      }
    }

    return Err(lastError!);
  }

  // ===== CRUD Operations =====

  async getUser(id: string): Promise<ResultType<User>> {
    if (!id.startsWith('user-')) {
      return Err({
        type: 'validation',
        field: 'id',
        message: 'Invalid user ID format. Must start with "user-"',
      });
    }
    return this.request<User>(`/users/${id}`);
  }

  async createUser(input: CreateUserInput): Promise<ResultType<User>> {
    // Validate input
    const validationError = this.validateUserInput(input);
    if (validationError) {
      return Err(validationError);
    }

    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateUser(
    id: string,
    input: Partial<CreateUserInput>,
  ): Promise<ResultType<User>> {
    return this.request<User>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }

  async deleteUser(id: string): Promise<ResultType<void>> {
    return this.request<void>(`/users/${id}`, { method: 'DELETE' });
  }

  async listUsers(params?: {
    page?: number;
    limit?: number;
  }): Promise<ResultType<User[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString();
    return this.request<User[]>(`/users${query ? `?${query}` : ''}`);
  }

  // ===== Helper Methods =====

  private validateUserInput(input: CreateUserInput): ApiError | null {
    if (!input.email || !input.email.includes('@')) {
      return {
        type: 'validation',
        field: 'email',
        message: 'Valid email required',
      };
    }
    if (!input.name || input.name.length < 2) {
      return {
        type: 'validation',
        field: 'name',
        message: 'Name must be at least 2 characters',
      };
    }
    return null;
  }
}

// ===== Types =====

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
}

interface CreateUserInput {
  name: string;
  email: string;
}

// ===== Error Handling Helpers =====

const handleApiError = (error: ApiError): string => {
  switch (error.type) {
    case 'network':
      return `Network error: ${error.message}`;
    case 'http':
      return `HTTP ${error.status}: ${error.statusText}`;
    case 'parse':
      return `Parse error: ${error.message}`;
    case 'validation':
      return `Validation error (${error.field}): ${error.message}`;
    case 'auth':
      return `Auth error: ${error.code}`;
    case 'rate-limit':
      return `Rate limited. Retry after ${error.retryAfter}s`;
    case 'timeout':
      return `Request timed out after ${error.ms}ms`;
    default:
      return 'Unknown error';
  }
};

const isAuthError = (
  error: ApiError,
): error is Extract<ApiError, { type: 'auth' }> => {
  return error.type === 'auth';
};

const isRetryable = (error: ApiError): boolean => {
  return (
    error.type === 'network' ||
    error.type === 'timeout' ||
    error.type === 'rate-limit'
  );
};

// ===== Example Usage =====

const runExample = async () => {
  console.log('=== API Client Example ===\n');

  const client = new ApiClient({
    baseUrl: 'https://jsonplaceholder.typicode.com',
    timeout: 5000,
    maxRetries: 2,
  });

  // Example 1: Get user (will fail - different API structure)
  console.log('--- Test 1: Get User ---');
  const userResult = await client.getUser('user-1');
  match(
    userResult,
    (user) => console.log('User:', user),
    (error) => console.log('Error:', handleApiError(error)),
  );

  // Example 2: Create user with validation error
  console.log('\n--- Test 2: Create User (Invalid) ---');
  const createInvalidResult = await client.createUser({
    name: 'J',
    email: 'invalid',
  });
  match(
    createInvalidResult,
    (user) => console.log('Created:', user),
    (error) => console.log('Error:', handleApiError(error)),
  );

  // Example 3: Create user successfully
  console.log('\n--- Test 3: Create User (Valid) ---');
  const createResult = await client.createUser({
    name: 'John Doe',
    email: 'john@example.com',
  });
  match(
    createResult,
    (user) => console.log('Created:', user),
    (error) => console.log('Error:', handleApiError(error)),
  );

  // Example 4: Handle auth errors
  console.log('\n--- Test 4: Auth Error Handling ---');
  const protectedClient = new ApiClient({
    baseUrl: 'https://api.example.com',
    token: 'invalid-token',
  });

  const protectedResult = await protectedClient.getUser('user-1');
  match(
    protectedResult,
    (user) => console.log('User:', user),
    (error) => {
      if (isAuthError(error)) {
        console.log('Authentication failed:', error.code);
        // Trigger token refresh
      } else {
        console.log('Error:', handleApiError(error));
      }
    },
  );

  // Example 5: Retry logic
  console.log('\n--- Test 5: Retry Logic ---');
  const retryClient = new ApiClient({
    baseUrl: 'https://unreliable-api.example.com',
    maxRetries: 3,
    retryDelay: 1000,
  });

  const retryResult = await retryClient.getUser('user-1');
  match(
    retryResult,
    (user) => console.log('User (after retries):', user),
    (error) => {
      if (isRetryable(error)) {
        console.log('Failed after retries:', handleApiError(error));
      } else {
        console.log('Non-retryable error:', handleApiError(error));
      }
    },
  );
};

// Uncomment to run (requires network):
// runExample().catch(console.error);

// ===== Additional Patterns =====

// Token refresh interceptor
class AuthApiClient extends ApiClient {
  private refreshPromise: Promise<string> | null = null;

  async requestWithRefresh<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<ResultType<T>> {
    const result = await this.request<T>(endpoint, options);

    if (result.ok === false && isAuthError(result.error)) {
      // Token expired, refresh it
      const newToken = await this.refreshToken();
      this.setToken(newToken);

      // Retry once
      return this.request<T>(endpoint, options);
    }

    return result;
  }

  private async refreshToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      // Simulate token refresh
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return 'new-token';
    })();

    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }
}
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Err`
- `match`
- `Ok`
- `Result`

## Связанные концепции
- [[Err]]
- [[match]]
- [[Ok]]
- [[Result]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне web scraping implementation with retry logic, rate limiting, and error recovery?

## Краткий ответ
Используйте Err, match, Ok, map для обработки.

## Подробное объяснение
web scraping implementation with retry logic, rate limiting, and error recovery. Handles network failures and HTML parsing gracefully.

## Пример кода
```typescript
import { Err, match, Ok, type Result } from '@resultsafe/core-fp-result';

// ===== Error types =====

type ScrapingError =
  | { type: 'network'; message: string; url: string }
  | { type: 'parse'; message: string; url: string }
  | { type: 'selector'; message: string; selector: string }
  | { type: 'rate-limit'; retryAfter: number }
  | { type: 'not-found'; url: string };

// ===== Scraping utilities =====

interface ScrapedData {
  url: string;
  title: string;
  content: string;
  links: string[];
  timestamp: string;
}

const fetchWithRetry = async (
  url: string,
  maxRetries = 3,
): Promise<Result<string, ScrapingError>> => {
  let lastError: ScrapingError | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ResultSafe Bot/1.0)',
        },
      });

      if (response.status === 429) {
        const retryAfter = parseInt(
          response.headers.get('Retry-After') || '5',
          10,
        );
        lastError = { type: 'rate-limit', retryAfter };
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
        continue;
      }

      if (response.status === 404) {
        return Err({ type: 'not-found', url });
      }

      if (!response.ok) {
        lastError = {
          type: 'network',
          message: `HTTP ${response.status}`,
          url,
        };
        continue;
      }

      return Ok(await response.text());
    } catch (error) {
      lastError = {
        type: 'network',
        message: error instanceof Error ? error.message : 'Unknown error',
        url,
      };

      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  return Err(lastError!);
};

const parseHtml = (
  html: string,
  url: string,
): Result<ScrapedData, ScrapingError> => {
  try {
    // Simulated parsing (in real code, use cheerio, jsdom, or similar)
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const title =
      titleMatch && titleMatch[1] ? titleMatch[1].trim() : 'Untitled';

    // Extract links
    const linkMatches = html.match(/href=["']([^"']+)["']/g) || [];
    const links = linkMatches
      .map((link) => link.replace(/href=["']([^"']+)["']/, '$1'))
      .filter((link) => link.startsWith('http'));

    return Ok({
      url,
      title,
      content: html.slice(0, 500), // First 500 chars
      links: links.slice(0, 10), // First 10 links
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Err({
      type: 'parse',
      message: error instanceof Error ? error.message : 'Parse failed',
      url,
    });
  }
};

// ===== Scraping pipeline =====

const scrapeUrl = async (
  url: string,
): Promise<Result<ScrapedData, ScrapingError>> => {
  // Step 1: Fetch with retry
  const fetchResult = await fetchWithRetry(url);
  if (fetchResult.ok === false) return fetchResult;

  // Step 2: Parse HTML
  return parseHtml(fetchResult.value, url);
};

const scrapeMultiple = async (
  urls: string[],
  concurrency = 3,
): Promise<Result<ScrapedData[], ScrapingError>> => {
  const results: ScrapedData[] = [];
  const errors: ScrapingError[] = [];

  // Process with limited concurrency
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map((url) => scrapeUrl(url)));

    for (const result of batchResults) {
      if (result.ok) {
        results.push(result.value);
      } else {
        errors.push(result.error);
      }
    }

    // Rate limiting between batches
    if (i + concurrency < urls.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  if (errors.length > 0) {
    // Return partial results with errors
    console.warn(`Scraped ${results.length} URLs, ${errors.length} failed`);
  }

  return Ok(results);
};

// ===== Example usage =====

const runExample = async () => {
  console.log('=== Web Scraping Example ===\n');

  const urls = [
    'https://example.com',
    'https://example.org',
    'https://httpstat.us/404', // Will fail
  ];

  const result = await scrapeMultiple(urls);

  match(
    result,
    (data) => {
      console.log(`Successfully scraped ${data.length} pages:`);
      data.forEach((page) => {
        console.log(`  - ${page.title} (${page.url})`);
      });
    },
    (error) => {
      console.log('Scraping failed:', error);
    },
  );
};

// Uncomment to run:
// runExample().catch(console.error);
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Err`
- `match`
- `Ok`
- `Result`
- `map`

## Связанные концепции
- [[Err]]
- [[match]]
- [[Ok]]
- [[Result]]
- [[map]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне form validation pipeline with error accumulation?

## Краткий ответ
Используйте Err, match, Ok для обработки.

## Подробное объяснение
form Валидация pipeline with error accumulation. Validates multiple fields and collects all errors for user feedback.

## Пример кода
```typescript
import { Err, match, Ok, type Result } from '@resultsafe/core-fp-result';

// ===== Types =====

interface FormData {
  username: string;
  email: string;
  password: string;
  age: number;
}

interface FormErrors {
  field: string;
  message: string;
}

type ValidationResult<T> = Result<T, FormErrors[]>;

// ===== Validators =====

const validateUsername = (username: string): Result<string, FormErrors[]> => {
  const errors: FormErrors[] = [];

  if (!username || username.trim().length === 0) {
    errors.push({ field: 'username', message: 'Username is required' });
  } else if (username.length < 3) {
    errors.push({
      field: 'username',
      message: 'Username must be at least 3 characters',
    });
  } else if (username.length > 20) {
    errors.push({
      field: 'username',
      message: 'Username must be less than 20 characters',
    });
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push({
      field: 'username',
      message: 'Username can only contain letters, numbers, and underscores',
    });
  }

  return errors.length > 0 ? Err(errors) : Ok(username.trim());
};

const validateEmail = (email: string): Result<string, FormErrors[]> => {
  const errors: FormErrors[] = [];

  if (!email || email.trim().length === 0) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  } else if (!email.endsWith('@example.com')) {
    errors.push({
      field: 'email',
      message: 'Email must be @example.com domain',
    });
  }

  return errors.length > 0 ? Err(errors) : Ok(email.toLowerCase().trim());
};

const validatePassword = (password: string): Result<string, FormErrors[]> => {
  const errors: FormErrors[] = [];

  if (!password || password.length === 0) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (password.length < 8) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 8 characters',
    });
  } else if (!/[A-Z]/.test(password)) {
    errors.push({
      field: 'password',
      message: 'Password must contain at least one uppercase letter',
    });
  } else if (!/[a-z]/.test(password)) {
    errors.push({
      field: 'password',
      message: 'Password must contain at least one lowercase letter',
    });
  } else if (!/[0-9]/.test(password)) {
    errors.push({
      field: 'password',
      message: 'Password must contain at least one number',
    });
  }

  return errors.length > 0 ? Err(errors) : Ok(password);
};

const validateAge = (age: number): Result<number, FormErrors[]> => {
  const errors: FormErrors[] = [];

  if (!Number.isInteger(age)) {
    errors.push({ field: 'age', message: 'Age must be an integer' });
  } else if (age < 18) {
    errors.push({ field: 'age', message: 'You must be at least 18 years old' });
  } else if (age > 120) {
    errors.push({ field: 'age', message: 'Age must be less than 120' });
  }

  return errors.length > 0 ? Err(errors) : Ok(age);
};

// ===== Validation Pipeline =====

const validateForm = (data: FormData): ValidationResult<FormData> => {
  const allErrors: FormErrors[] = [];
  const validData: Partial<FormData> = {};

  // Validate username
  const usernameResult = validateUsername(data.username);
  if (usernameResult.ok) {
    validData.username = usernameResult.value;
  } else {
    allErrors.push(...usernameResult.error);
  }

  // Validate email
  const emailResult = validateEmail(data.email);
  if (emailResult.ok) {
    validData.email = emailResult.value;
  } else {
    allErrors.push(...emailResult.error);
  }

  // Validate password
  const passwordResult = validatePassword(data.password);
  if (passwordResult.ok) {
    validData.password = passwordResult.value;
  } else {
    allErrors.push(...passwordResult.error);
  }

  // Validate age
  const ageResult = validateAge(data.age);
  if (ageResult.ok) {
    validData.age = ageResult.value;
  } else {
    allErrors.push(...ageResult.error);
  }

  // Return result
  if (allErrors.length > 0) {
    return Err(allErrors);
  }

  return Ok(validData as FormData);
};

// ===== Display Helpers =====

const displayErrors = (errors: FormErrors[]) => {
  console.log('\n❌ Validation Errors:');
  errors.forEach((error) => {
    console.log(`  - ${error.field}: ${error.message}`);
  });
};

const displaySuccess = (data: FormData) => {
  console.log('\n✅ Validation Successful!');
  console.log('  Username:', data.username);
  console.log('  Email:', data.email);
  console.log('  Age:', data.age);
};

// ===== Example Usage =====

const runExample = () => {
  console.log('=== Form Validation Example ===\n');

  // Example 1: Valid data
  console.log('--- Test 1: Valid Data ---');
  const validData: FormData = {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'SecurePass123',
    age: 25,
  };

  const validResult = validateForm(validData);
  match(validResult, displaySuccess, displayErrors);

  // Example 2: Invalid data (all fields wrong)
  console.log('\n--- Test 2: Invalid Data ---');
  const invalidData: FormData = {
    username: 'J',
    email: 'invalid-email',
    password: 'weak',
    age: 15,
  };

  const invalidResult = validateForm(invalidData);
  match(invalidResult, displaySuccess, displayErrors);

  // Example 3: Partial errors
  console.log('\n--- Test 3: Partial Errors ---');
  const partialData: FormData = {
    username: 'valid_user',
    email: 'also-valid@example.com',
    password: 'short',
    age: 200,
  };

  const partialResult = validateForm(partialData);
  match(partialResult, displaySuccess, displayErrors);
};

// Run example
runExample();

// ===== Additional Utilities =====

// Async validation (e.g., check username availability)
const checkUsernameAvailability = async (
  username: string,
): Promise<Result<boolean, FormErrors[]>> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 100));

  const takenUsernames = ['admin', 'root', 'moderator'];
  if (takenUsernames.includes(username)) {
    return Err([{ field: 'username', message: 'Username is already taken' }]);
  }

  return Ok(true);
};

// Real-time validation debouncing
const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Err`
- `match`
- `Ok`
- `Result`

## Связанные концепции
- [[Err]]
- [[match]]
- [[Ok]]
- [[Result]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне error recovery patterns including retry with exponential backoff, fallback chains, circuit breaker, bulkhead, and timeout?

## Краткий ответ
Используйте Err, match, Ok, map для обработки.

## Подробное объяснение
error recovery Паттерны including retry with exponential backoff, fallback chains, circuit breaker, bulkhead, and timeout. Продакшн-ready resilience Паттерны.

## Пример кода
```typescript
import { Err, match, Ok, type Result } from '@resultsafe/core-fp-result';

// ===== Error Types =====

type FetchError =
  | { type: 'network'; message: string; retryable: boolean }
  | { type: 'timeout'; ms: number }
  | { type: 'http'; status: number; retryable: boolean }
  | { type: 'parse'; message: string }
  | { type: 'circuit-open'; message: string };

type ResultType<T, E = FetchError> = Result<T, E>;

// ===== Strategy 1: Retry with Exponential Backoff =====

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  factor: number;
}

const retryWithBackoff = async <T, E extends FetchError>(
  operation: () => Promise<ResultType<T, E>>,
  config: RetryConfig,
  isRetryable: (error: E) => boolean,
): Promise<ResultType<T, E>> => {
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

  return Err(lastError!) as Result<T, E>;
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
    operation: () => Promise<ResultType<T, E>>,
  ): Promise<ResultType<T, E | { type: 'circuit-open'; message: string }>> {
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
    operation: () => Promise<ResultType<T, E>>,
  ): Promise<ResultType<T, E | { type: 'rejected'; message: string }>> {
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
  operation: () => Promise<ResultType<T, E>>,
  timeoutMs: number,
): Promise<ResultType<T, E | { type: 'timeout'; ms: number }>> => {
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
  ): Promise<ResultType<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const operation = async (): Promise<ResultType<T>> => {
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
          } as FetchError);
        }

        return Ok((await response.json()) as T);
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
      () => operation() as Promise<ResultType<T, FetchError>>,
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
  const flakyOperation = async (): Promise<ResultType<string>> => {
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
    (error) =>
      error.type === 'network' || (error.type === 'http' && error.retryable),
  );

  match(
    retryResult,
    (value) => console.log('Result:', value),
    (error) => console.log('Failed:', error),
  );

  // Example 2: Fallback chain
  console.log('\n--- Test 2: Fallback Chain ---');
  const primary = (): Result<string, FetchError> =>
    Err({
      type: 'network',
      message: 'Primary down',
      retryable: true,
    } as FetchError);
  const secondary = (): Result<string, FetchError> =>
    Err({
      type: 'network',
      message: 'Secondary down',
      retryable: true,
    } as FetchError);
  const tertiary = (): Result<string, FetchError> => Ok('Tertiary succeeded!');

  const fallbackResult = fallbackChain(primary, secondary, tertiary);
  match(
    fallbackResult,
    (value) => console.log('Result:', value),
    (error) => console.log('All failed:', error),
  );

  // Example 3: Circuit breaker
  console.log('\n--- Test 3: Circuit Breaker ---');
  const breaker = new CircuitBreaker(3, 5000);

  const failingOperation = async (): Promise<ResultType<string>> => {
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
  const slowApi = async (): Promise<ResultType<string>> => {
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
    operation: () => Promise<ResultType<T, E>>,
  ): Promise<ResultType<T, E | { type: 'rate-limited'; message: string }>> {
    this.refill();

    if (this.tokens <= 0) {
      return Err({ type: 'rate-limited', message: 'Rate limit exceeded' });
    }

    this.tokens--;
    return operation();
  }
}
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Err`
- `match`
- `Ok`
- `Result`
- `map`

## Связанные концепции
- [[Err]]
- [[match]]
- [[Ok]]
- [[Result]]
- [[map]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне architecture patterns with result-based обработать ошибки?

## Краткий ответ
Используйте Err, Ok для обработки.

## Подробное объяснение
architecture Паттерны with Result-based Обработка ошибок. Includes TypedEventEmitter, EventBus, and CommandQueue with comprehensive error aggregation.

## Пример кода
```typescript
import { Err, Ok, type Result } from '@resultsafe/core-fp-result';

// ===== Pattern 1: Event Emitter with Result =====

type EventHandler<T> = (data: T) => Promise<Result<void, Error>>;

class TypedEventEmitter<Events extends Record<string, unknown>> {
  private listeners: Map<keyof Events, Array<EventHandler<any>>> = new Map();

  on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): this {
    const handlers = this.listeners.get(event) || [];
    handlers.push(handler);
    this.listeners.set(event, handlers);
    return this;
  }

  off<K extends keyof Events>(
    event: K,
    handler: EventHandler<Events[K]>,
  ): this {
    const handlers = this.listeners.get(event) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
    return this;
  }

  async emit<K extends keyof Events>(
    event: K,
    data: Events[K],
  ): Promise<Result<void, Error[]>> {
    const handlers = this.listeners.get(event) || [];
    const errors: Error[] = [];

    for (const handler of handlers) {
      try {
        const result = await handler(data);
        if (result.ok === false) {
          errors.push(
            result.error instanceof Error
              ? result.error
              : new Error(String(result.error)),
          );
        }
      } catch (error) {
        errors.push(error instanceof Error ? error : new Error(String(error)));
      }
    }

    if (errors.length > 0) {
      return Err(errors);
    }

    return Ok(undefined);
  }

  once<K extends keyof Events>(
    event: K,
    handler: EventHandler<Events[K]>,
  ): this {
    const onceHandler = async (data: Events[K]) => {
      this.off(event, onceHandler);
      return handler(data);
    };
    return this.on(event, onceHandler);
  }
}

// ===== Pattern 2: Event Bus with typed events =====

interface EventBusEvent {
  type: string;
  payload: unknown;
  timestamp: number;
}

class EventBus {
  private handlers: Map<
    string,
    Array<(event: EventBusEvent) => Promise<Result<void, unknown>>>
  > = new Map();

  private history: EventBusEvent[] = [];

  subscribe(
    type: string,
    handler: (event: EventBusEvent) => Promise<Result<void, unknown>>,
  ): () => void {
    const handlers = this.handlers.get(type) || [];
    handlers.push(handler);
    this.handlers.set(type, handlers);

    // Return unsubscribe function
    return () => {
      const idx = handlers.indexOf(handler);
      if (idx > -1) handlers.splice(idx, 1);
    };
  }

  async publish(
    type: string,
    payload: unknown,
  ): Promise<Result<void, unknown[]>> {
    const event: EventBusEvent = {
      type,
      payload,
      timestamp: Date.now(),
    };

    this.history.push(event);

    const handlers = this.handlers.get(type) || [];
    const errors: unknown[] = [];

    for (const handler of handlers) {
      try {
        const result = await handler(event);
        if (result.ok === false) {
          errors.push(result.error);
        }
      } catch (error) {
        errors.push(error);
      }
    }

    if (errors.length > 0) {
      return Err(errors);
    }

    return Ok(undefined);
  }

  getHistory(type?: string): EventBusEvent[] {
    if (type) {
      return this.history.filter((e) => e.type === type);
    }
    return [...this.history];
  }

  clearHistory(): void {
    this.history = [];
  }
}

// ===== Pattern 3: Command Queue with Result =====

interface Command<T = unknown> {
  id: string;
  type: string;
  payload: T;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: unknown;
  createdAt: number;
  completedAt?: number;
}

class CommandQueue {
  private queue: Command<any>[] = [];
  private processing = false;

  enqueue<T>(type: string, payload: T): Command<T> {
    const command: Command<T> = {
      id: `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      payload,
      status: 'pending',
      createdAt: Date.now(),
    };
    this.queue.push(command);
    return command;
  }

  async process<T>(
    handler: (command: Command<T>) => Promise<Result<unknown, unknown>>,
  ): Promise<Result<Command<T>[], unknown[]>> {
    if (this.processing) {
      return Err(['Already processing']);
    }

    this.processing = true;
    const errors: unknown[] = [];
    const completed: Command<T>[] = [];

    while (this.queue.length > 0) {
      const command = this.queue.shift() as Command<T>;
      command.status = 'processing';

      try {
        const result = await handler(command);
        if (result.ok) {
          command.status = 'completed';
          command.completedAt = Date.now();
          completed.push(command);
        } else {
          command.status = 'failed';
          command.error = result.error;
          errors.push(result.error);
        }
      } catch (error) {
        command.status = 'failed';
        command.error = error;
        errors.push(error);
      }
    }

    this.processing = false;

    if (errors.length > 0) {
      return Err(errors);
    }

    return Ok(completed);
  }
}

// ===== Example usage =====

interface AppEvents {
  [key: string]: unknown;
  userLogin: { userId: string; email: string };
  userLogout: { userId: string };
  dataUpdate: { table: string; records: number };
  error: { code: string; message: string };
}

const runExample = async () => {
  console.log('=== Async Event Handling Example ===\n');

  // Example 1: Typed Event Emitter
  const emitter = new TypedEventEmitter<AppEvents>();

  emitter.on('userLogin', async (data) => {
    console.log(`User ${data.userId} logged in`);
    return Ok(undefined);
  });

  emitter.on('userLogin', async (data) => {
    // Simulate potential error
    if (!data.email.includes('@')) {
      return Err(new Error('Invalid email'));
    }
    console.log(`Email: ${data.email}`);
    return Ok(undefined);
  });

  const emitResult = await emitter.emit('userLogin', {
    userId: 'user-123',
    email: 'john@example.com',
  });

  console.log('Emit result:', emitResult);

  // Example 2: Event Bus
  const bus = new EventBus();

  const unsubscribe = bus.subscribe('data-update', async (event) => {
    console.log('Data update:', event.payload);
    return Ok(undefined);
  });

  await bus.publish('data-update', { table: 'users', records: 100 });

  // Unsubscribe when needed
  unsubscribe();

  // Example 3: Command Queue
  const queue = new CommandQueue();

  queue.enqueue('send-email', { to: 'user@example.com', subject: 'Hello' });
  queue.enqueue('send-email', { to: 'admin@example.com', subject: 'Report' });

  const processResult = await queue.process(async (command) => {
    console.log(`Processing command: ${command.type}`);
    await new Promise((resolve) => setTimeout(resolve, 100));
    return Ok({ processed: true });
  });

  console.log('Queue result:', processResult);
};

// Uncomment to run:
// runExample().catch(console.error);

// ===== Additional patterns =====

// Pattern: Middleware chain for events
type EventMiddleware<T> = (
  event: T,
  next: () => Promise<Result<void, Error>>,
) => Promise<Result<void, Error>>;

const createMiddlewarePipeline = <T>(
  middlewares: EventMiddleware<T>[],
): ((event: T) => Promise<Result<void, Error>>) => {
  return async (event: T) => {
    let index = -1;

    const dispatch = async (): Promise<Result<void, Error>> => {
      index++;
      if (index >= middlewares.length) {
        return Ok(undefined);
      }

      const middleware = middlewares[index];
      if (!middleware) {
        return Ok(undefined);
      }
      return middleware(event, dispatch);
    };

    return dispatch();
  };
};

// Pattern: Retry failed event handlers
const withRetry = <T>(
  handler: (event: T) => Promise<Result<void, Error>>,
  maxRetries: number,
): ((event: T) => Promise<Result<void, Error>>) => {
  return async (event: T) => {
    let lastError: Error | null = null;

    for (let i = 0; i < maxRetries; i++) {
      const result = await handler(event);
      if (result.ok) return result;

      lastError = result.error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }

    return Err(lastError!);
  };
};
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `Err`
- `Ok`
- `Result`

## Связанные концепции
- [[Err]]
- [[Ok]]
- [[Result]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**

---

# Как мне pool implementation with task queues, priority scheduling, and job scheduling?

## Краткий ответ
Используйте match, Ok, map для обработки.

## Подробное объяснение
pool implementation with task queues, priority scheduling, and job scheduling. Includes retry logic, timeout handling, and concurrency control.

## Пример кода
```typescript
import { match, Ok, type Result } from '@resultsafe/core-fp-result';

// ===== Pattern 1: Simple Worker Pool =====

interface Task<T, R> {
  id: string;
  fn: (input: T) => Promise<R>;
  input: T;
  resolve: (result: R) => void;
  reject: (error: Error) => void;
}

interface WorkerPoolConfig {
  size: number;
  maxRetries?: number;
  timeout?: number;
}

class WorkerPool<T, R> {
  private tasks: Task<T, R>[] = [];
  private workers: Array<Promise<void>> = [];
  private running = false;
  private config: WorkerPoolConfig;

  constructor(config: WorkerPoolConfig) {
    this.config = config;
  }

  start(): void {
    if (this.running) return;
    this.running = true;

    for (let i = 0; i < this.config.size; i++) {
      this.workers.push(this.workerLoop(i));
    }
  }

  private async workerLoop(workerId: number): Promise<void> {
    while (this.running) {
      const task = this.tasks.shift();
      if (!task) {
        await new Promise((resolve) => setTimeout(resolve, 10));
        continue;
      }

      try {
        const result = await this.executeWithRetry(task);
        task.resolve(result);
      } catch (error) {
        task.reject(error as Error);
      }
    }
  }

  private async executeWithRetry(task: Task<T, R>): Promise<R> {
    const maxRetries = this.config.maxRetries || 3;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const timeout = this.config.timeout || 30000;
        const result = await Promise.race([
          task.fn(task.input),
          new Promise<R>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), timeout),
          ),
        ]);
        return result as R;
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxRetries - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * (attempt + 1)),
          );
        }
      }
    }

    throw lastError;
  }

  submit(fn: (input: T) => Promise<R>, input: T): Promise<R> {
    return new Promise((resolve, reject) => {
      const task: Task<T, R> = {
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fn,
        input,
        resolve,
        reject,
      };
      this.tasks.push(task);
    });
  }

  async stop(): Promise<void> {
    this.running = false;
    await Promise.all(this.workers);
  }

  get queueLength(): number {
    return this.tasks.length;
  }

  get isRunning(): boolean {
    return this.running;
  }
}

// ===== Pattern 2: Task Queue with Priority =====

type Priority = 'low' | 'normal' | 'high' | 'critical';

interface PriorityTask<T, R> {
  id: string;
  fn: (input: T) => Promise<Result<R, Error>>;
  input: T;
  priority: Priority;
  createdAt: number;
}

class PriorityTaskQueue<T, R> {
  private queue: PriorityTask<T, R>[] = [];

  enqueue(
    fn: (input: T) => Promise<Result<R, Error>>,
    input: T,
    priority: Priority = 'normal',
  ): string {
    const task: PriorityTask<T, R> = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fn,
      input,
      priority,
      createdAt: Date.now(),
    };

    this.queue.push(task);
    this.sortQueue();

    return task.id;
  }

  private sortQueue(): void {
    const priorityOrder: Record<Priority, number> = {
      low: 0,
      normal: 1,
      high: 2,
      critical: 3,
    };

    this.queue.sort((a, b) => {
      // First by priority
      const priorityDiff =
        priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Then by creation time (FIFO within same priority)
      return a.createdAt - b.createdAt;
    });
  }

  dequeue(): PriorityTask<T, R> | undefined {
    return this.queue.shift();
  }

  get length(): number {
    return this.queue.length;
  }

  clear(): void {
    this.queue = [];
  }
}

// ===== Pattern 3: Job Scheduler =====

interface Job {
  id: string;
  name: string;
  cron?: string;
  interval?: number;
  handler: () => Promise<Result<void, Error>>;
  enabled: boolean;
  lastRun?: number;
  nextRun?: number | undefined;
}

class JobScheduler {
  private jobs: Map<string, Job> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();

  addJob(job: Job): void {
    if (job.cron) {
      job.nextRun = this.parseCron(job.cron);
    } else if (job.interval) {
      job.nextRun = Date.now() + job.interval;
    }

    this.jobs.set(job.id, job);
    this.scheduleJob(job);
  }

  private scheduleJob(job: Job): void {
    if (!job.enabled || !job.nextRun) return;

    const delay = job.nextRun - Date.now();
    if (delay <= 0) {
      this.executeJob(job);
    } else {
      const timer = setTimeout(() => this.executeJob(job), delay);
      this.timers.set(job.id, timer);
    }
  }

  private async executeJob(job: Job): Promise<void> {
    job.lastRun = Date.now();

    const result = await job.handler();

    match(
      result,
      () => console.log(`Job ${job.name} completed successfully`),
      (error) => console.error(`Job ${job.name} failed:`, error),
    );

    // Schedule next run
    if (job.cron) {
      job.nextRun = this.parseCron(job.cron);
    } else if (job.interval) {
      job.nextRun = Date.now() + job.interval;
    } else {
      delete job.nextRun;
    }

    this.scheduleJob(job);
  }

  private parseCron(cron: string): number {
    // Simplified cron parser - only supports */N pattern for minutes
    const cronMatch = cron.match(/^\*\/(\d+) \* \* \* \*$/);
    if (cronMatch && cronMatch[1]) {
      const minutes = parseInt(cronMatch[1], 10);
      return Date.now() + minutes * 60 * 1000;
    }
    // Default: run in 1 minute
    return Date.now() + 60 * 1000;
  }

  removeJob(jobId: string): void {
    const timer = this.timers.get(jobId);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(jobId);
    }
    this.jobs.delete(jobId);
  }

  enableJob(jobId: string): void {
    const job = this.jobs.get(jobId);
    if (job) {
      job.enabled = true;
      this.scheduleJob(job);
    }
  }

  disableJob(jobId: string): void {
    const job = this.jobs.get(jobId);
    if (job) {
      job.enabled = false;
      const timer = this.timers.get(jobId);
      if (timer) {
        clearTimeout(timer);
        this.timers.delete(jobId);
      }
    }
  }

  getJobStatus(jobId: string): Job | undefined {
    return this.jobs.get(jobId);
  }
}

// ===== Example usage =====

const runExample = async () => {
  console.log('=== Async Worker Pool Example ===\n');

  // Example 1: Worker Pool
  const pool = new WorkerPool<number, number>({
    size: 3,
    maxRetries: 3,
    timeout: 5000,
  });

  pool.start();

  const tasks = Array.from({ length: 10 }, (_, i) => i + 1);
  const results = await Promise.all(
    tasks.map((n) =>
      pool.submit(async (x) => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return x * 2;
      }, n),
    ),
  );

  console.log('Worker pool results:', results);

  await pool.stop();

  // Example 2: Priority Queue
  const priorityQueue = new PriorityTaskQueue<string, string>();

  priorityQueue.enqueue(
    async (input) => Ok(`Processed: ${input}`),
    'low-priority-task',
    'low',
  );
  priorityQueue.enqueue(
    async (input) => Ok(`Processed: ${input}`),
    'critical-task',
    'critical',
  );
  priorityQueue.enqueue(
    async (input) => Ok(`Processed: ${input}`),
    'normal-task',
    'normal',
  );

  console.log('Queue length:', priorityQueue.length);

  // Dequeue in priority order
  while (priorityQueue.length > 0) {
    const task = priorityQueue.dequeue();
    if (task) {
      const result = await task.fn(task.input);
      console.log('Processed:', result);
    }
  }

  // Example 3: Job Scheduler
  const scheduler = new JobScheduler();

  let runCount = 0;
  scheduler.addJob({
    id: 'job-1',
    name: 'Periodic Task',
    interval: 1000, // Every second
    enabled: true,
    handler: async () => {
      runCount++;
      console.log(`Periodic task run #${runCount}`);
      return Ok(undefined);
    },
  });

  // Let it run for 3 seconds
  await new Promise((resolve) => setTimeout(resolve, 3000));

  scheduler.removeJob('job-1');
  console.log('Total runs:', runCount);
};

// Uncomment to run (may take a few seconds):
// runExample().catch(console.error);
```

## Когда использовать
При трансформации или связывании операций Result

## Ключевые функции
- `match`
- `Ok`
- `Result`
- `map`

## Связанные концепции
- [[match]]
- [[Ok]]
- [[Result]]
- [[map]]

## Метаданные
- **Теги:** 
- **Сложность:** Средний
- **Модуль:**