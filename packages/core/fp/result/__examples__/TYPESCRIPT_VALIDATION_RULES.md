# TypeScript Validation Rules

**Version:** 1.0.0  
**Effective Date:** 2026-03-27  
**Author:** Denis Savasteev

Common TypeScript validation errors and their fixes for examples in `__examples__/`.

---

## Table of Contents

1. [Discriminated Unions](#discriminated-unions)
2. [Headers and Fetch Types](#headers-and-fetch-types)
3. [Class Inheritance](#class-inheritance)
4. [Optional Properties](#optional-properties)
5. [ES Module Syntax](#es-module-syntax)
6. [Generic Type Parameters](#generic-type-parameters)

---

## Discriminated Unions

### Problem

Accessing a property that exists only in one variant of a union type without proper narrowing.

### Example Error

```
Property 'timeout' does not exist on type '{ type: "timeout"; ms: number; }'.
```

### Wrong Code

```typescript
type ApiError =
  | { type: 'network'; message: string }
  | { type: 'timeout'; ms: number }
  | { type: 'http'; status: number };

const handleError = (error: ApiError): string => {
  switch (error.type) {
    case 'timeout':
      return `Timeout after ${error.timeout}ms`; // ❌ Wrong property name
  }
};
```

### Correct Code

```typescript
const handleError = (error: ApiError): string => {
  switch (error.type) {
    case 'timeout':
      return `Timeout after ${error.ms}ms`; // ✅ Correct property from union variant
    case 'network':
      return `Network: ${error.message}`;
    case 'http':
      return `HTTP ${error.status}`;
  }
};
```

### Rule

**Always use the correct property name from the specific union variant after narrowing with discriminant property.**

---

## Headers and Fetch Types

### Problem

`HeadersInit` type may not be available in all TypeScript configurations or causes type inference issues with spread operators.

### Example Error

```
Type '{ Authorization?: string; 'Content-Type': string; }' is not assignable to type 'Record<string, string>'.
```

### Wrong Code

```typescript
const headers: HeadersInit = {
  'Content-Type': 'application/json',
  ...(this.config.token
    ? { Authorization: `Bearer ${this.config.token}` }
    : {}),
  ...options?.headers, // ❌ Spread causes type issues
};
```

### Correct Code

```typescript
const headersInit: Record<string, string> = {
  'Content-Type': 'application/json',
};

if (this.config.token) {
  headersInit['Authorization'] = `Bearer ${this.config.token}`;
}

if (options?.headers) {
  Object.assign(headersInit, options.headers); // ✅ Safe assignment
}

const headers = headersInit;
```

### Rule

**Use `Record<string, string>` with `Object.assign()` for headers instead of spread operators with `HeadersInit`.**

---

## Class Inheritance

### Problem

Child class cannot access `private` members of parent class.

### Example Error

```
Property 'request' is private and only accessible within class 'ApiClient'.
```

### Wrong Code

```typescript
class ApiClient {
  private async request<T>(): Promise<Result<T>> {
    // ❌ Private
    // ...
  }
}

class AuthApiClient extends ApiClient {
  async requestWithRefresh<T>(): Promise<Result<T>> {
    return this.request<T>(); // ❌ Error: private member
  }
}
```

### Correct Code

```typescript
class ApiClient {
  protected async request<T>(): Promise<Result<T>> {
    // ✅ Protected
    // ...
  }
}

class AuthApiClient extends ApiClient {
  async requestWithRefresh<T>(): Promise<Result<T>> {
    return this.request<T>(); // ✅ Works
  }
}
```

### Rule

**Use `protected` instead of `private` for class members that need to be accessed by subclasses.**

| Modifier    | Class | Subclass | Instance |
| ----------- | ----- | -------- | -------- |
| `private`   | ✅    | ❌       | ❌       |
| `protected` | ✅    | ✅       | ❌       |
| `public`    | ✅    | ✅       | ✅       |

---

## Optional Properties

### Problem

TypeScript's `exactOptionalPropertyTypes` flag disallows assigning `undefined` to optional properties.

### Example Error

```
Type 'undefined' is not assignable to type 'number' with 'exactOptionalPropertyTypes: true'.
```

### Wrong Code

```typescript
interface Job {
  nextRun?: number;
}

const job: Job = { nextRun: 123 };
job.nextRun = undefined; // ❌ Fails with exactOptionalPropertyTypes
```

### Correct Code

**Option 1: Delete the property**

```typescript
delete job.nextRun; // ✅ Remove property entirely
```

**Option 2: Allow undefined explicitly**

```typescript
interface Job {
  nextRun?: number | undefined; // ✅ Explicitly allow undefined
}

job.nextRun = undefined; // ✅ Now works
```

### Rule

**Don't assign `undefined` to optional properties. Use `delete` or explicitly allow `undefined` in the type.**

---

## ES Module Syntax

### Problem

Using CommonJS `require` and `module` in ES module context.

### Example Error

```
ReferenceError: require is not defined in ES module scope
```

### Wrong Code

```typescript
if (require.main === module) {
  // ❌ CommonJS syntax
  runExample().catch(console.error);
}
```

### Correct Code

```typescript
// Run example directly in ES module context
runExample().catch(console.error);

// Or use dynamic import for conditional execution
import { pathToFileURL } from 'url';
const main = async () => {
  const moduleUrl = pathToFileURL(__filename).href;
  if (import.meta.url === moduleUrl) {
    await runExample();
  }
};
main();
```

### Rule

**Use ES module syntax. For example files, run the example directly without `require.main` check.**

---

## Generic Type Parameters

### Problem

Generic type parameters not properly constrained or inferred.

### Example Error

```
Type 'unknown' is not assignable to type 'T'.
```

### Wrong Code

```typescript
async function* asyncResultGenerator<T, E>(
  items: unknown[], // ❌ Too broad
  processor: (item: unknown) => Promise<Result<unknown, E>>,
): AsyncGenerator<Result<unknown, E>> {
  for (const item of items) {
    const result = await processor(item);
    yield result;
  }
}
```

### Correct Code

```typescript
async function* asyncResultGenerator<T, E>(
  items: T[], // ✅ Generic type
  processor: (item: T) => Promise<Result<unknown, E>>,
): AsyncGenerator<Result<unknown, E>, void, unknown> {
  for (const item of items) {
    const result = await processor(item);
    yield result;
  }
}

// Usage with explicit type:
const numbers: number[] = [1, 2, 3];
const generator = asyncResultGenerator(numbers, async (n) => {
  return Ok(n * 2); // ✅ n is number
});
```

### Rule

**Use generic type parameters consistently. Avoid `unknown` when the type can be inferred from context.**

---

## Quick Reference

| Error Pattern                             | Fix                                            |
| ----------------------------------------- | ---------------------------------------------- | ---------- |
| `Property 'X' does not exist on type`     | Check union variant properties                 |
| `HeadersInit type error`                  | Use `Record<string, string>`                   |
| `Property is private`                     | Change to `protected`                          |
| `undefined not assignable`                | Use `delete` or add `                          | undefined` |
| `require is not defined`                  | Use ES module syntax                           |
| `unknown not assignable to T`             | Use proper generics                            |
| `Object is possibly 'undefined'` (RegExp) | Check match result: `match && match[1]`        |
| `Index signature missing`                 | Add `[key: string]: unknown` to interface      |
| `Cannot invoke possibly 'undefined'`      | Add guard: `if (!fn) return`                   |
| `Result<T,E> type mismatch`               | Use explicit return type: `(): Result<T,E> =>` |

---

## Additional Rules

### RegExp Match Results (possibly 'undefined')

**Problem:** `RegExp.match()` returns `RegExpMatchArray | null`, and array access may be undefined.

**Example Error:**

```
Object is possibly 'undefined'.
```

**Wrong Code:**

```typescript
const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
const title = titleMatch ? titleMatch[1].trim() : 'Untitled'; // ❌ titleMatch[1] may be undefined
```

**Correct Code:**

```typescript
const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
const title = titleMatch && titleMatch[1] ? titleMatch[1].trim() : 'Untitled'; // ✅

// Or use optional chaining:
const title = titleMatch?.[1]?.trim() ?? 'Untitled'; // ✅
```

---

### Index Signature Missing

**Problem:** Generic type constraint requires index signature but interface doesn't have one.

**Example Error:**

```
Type 'AppEvents' does not satisfy the constraint 'Record<string, unknown>'.
Index signature for type 'string' is missing in type 'AppEvents'.
```

**Wrong Code:**

```typescript
interface AppEvents {
  userLogin: { userId: string; email: string }; // ❌ No index signature
}

const emitter = new TypedEventEmitter<AppEvents>();
```

**Correct Code:**

```typescript
interface AppEvents {
  [key: string]: unknown; // ✅ Index signature
  userLogin: { userId: string; email: string };
}

const emitter = new TypedEventEmitter<AppEvents>();
```

---

### Cannot Invoke Possibly 'Undefined'

**Problem:** Array access may return undefined, and calling it causes error.

**Example Error:**

```
Cannot invoke an object which is possibly 'undefined'.
```

**Wrong Code:**

```typescript
const middleware = middlewares[index];
return middleware(event, dispatch); // ❌ middleware may be undefined
```

**Correct Code:**

```typescript
const middleware = middlewares[index];
if (!middleware) {
  return Ok(undefined); // ✅ Guard
}
return middleware(event, dispatch);
```

---

### Result<T,E> Type Mismatch in Functions

**Problem:** Generic function type inference fails when return types don't match.

**Example Error:**

```
Type 'Result<string, FetchError>' is not assignable to type 'Result<FetchError, string>'.
```

**Wrong Code:**

```typescript
const fallbackChain = <T, E>(
  ...operations: Array<() => Result<T, E>>
): Result<T, E> => {
  // ...
  return Err(lastError!); // ❌ Type inference fails
};

const tertiary = () => Ok('Success!'); // ❌ Inferred as Result<string, never>
```

**Correct Code:**

```typescript
const fallbackChain = <T, E>(
  ...operations: Array<() => Result<T, E>>
): Result<T, E> => {
  // ...
  return Err(lastError!) as Result<T, E>; // ✅ Type assertion
};

// Explicit return type:
const tertiary = (): Result<string, FetchError> => Ok('Success!'); // ✅
```

---

---

## Validation Commands

```bash
# Full validation (AI JSDoc + ESLint + TypeScript)
pnpm run validate:examples

# TypeScript only
pnpm run typecheck:examples

# ESLint only
pnpm run lint:examples

# AI JSDoc JSON only
pnpm run validate:ai-json

# Before build (automatic - runs in prebuild:all)
pnpm run build:all
# Automatically runs: validate:examples

# Before publish (automatic - runs in prepublishOnly)
pnpm publish --dry-run
# Automatically runs: validate:examples
```

### Automatic Validation Pipeline

| Command                   | Runs Before | Checks                                               |
| ------------------------- | ----------- | ---------------------------------------------------- |
| `pnpm run build:all`      | Build       | `validate:examples` (AI JSDoc + ESLint + TypeScript) |
| `pnpm publish`            | Publish     | `validate:examples` + `test` + `verify:release`      |
| `pnpm run verify:release` | Release     | `test` + build artifacts                             |

**Note:** `test:examples` is **NOT** used because example files are demonstrations, not tests. They contain runnable code, not `describe()`/`it()` blocks.

---

**Last Updated:** 2026-03-27  
**Version:** 1.0.0  
**Maintainer:** Denis Savasteev
