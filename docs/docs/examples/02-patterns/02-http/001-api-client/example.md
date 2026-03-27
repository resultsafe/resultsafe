---
id: example
title: Example
sidebar_label: Example
description: Code example demonstrating usage



---

# Example



## Source

`packages/core/fp/result/__examples__/02-patterns/02-http/001-api-client/example.ts`



## Code

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

---

**Category:** examples | **Since:** unknown
