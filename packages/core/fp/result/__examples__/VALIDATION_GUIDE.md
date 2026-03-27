# Examples Validation Guide

Automated validation for code examples in the `__examples__/` directory.

## Quick Start

```bash
# Run all example validations
pnpm run validate:examples

# Run individual checks
pnpm run typecheck:examples    # TypeScript type checking
pnpm run lint:examples          # ESLint code style
pnpm run validate:ai-json       # AI JSDoc validation
pnpm run test:examples          # Runtime execution tests
```

## Validation Pipeline

### 1. TypeScript Type Checking

Ensures all examples compile without type errors:

```bash
pnpm run typecheck:examples
```

**Config:** `tsconfig.examples.json`

**What it checks:**

- Type correctness
- Import/export validity
- Generic type parameters
- No emit (compilation only)

### 2. ESLint Code Style

Ensures consistent code style and JSDoc presence:

```bash
pnpm run lint:examples
```

**Config:** `config/eslint.config.examples.mjs`

**What it checks:**

- JSDoc `@description` present (warn)
- JSDoc `@example` present (warn)
- TypeScript syntax valid
- No console errors (disabled for examples)

### 3. AI JSDoc JSON Validation

Validates `@ai` JSON structure in JSDoc comments:

```bash
pnpm run validate:ai-json
```

**Script:** `__scripts__/validate-ai-json.js`

**What it checks:**

- `@module` tag present
- `@ai` JSON valid and complete
- Required fields: `purpose`, `prerequisites`, `objectives`, `rag`, `embedding`, `codeSearch`, `learningPath`, `chunking`

### 4. Runtime Execution Tests

Runs examples as tests to ensure they execute without errors:

```bash
pnpm run test:examples
```

**Config:** `config/vitest.config.examples.ts`

**What it checks:**

- No runtime errors
- No unhandled exceptions
- Console output (for debugging)

## CI/CD Integration

Examples are automatically validated in:

1. **Local Development**

   ```bash
   pnpm run validate:examples
   ```

2. **GitHub Actions** (`.github/workflows/examples.yml`)
   - On push to `__examples__/`
   - On pull requests with example changes

3. **npm Publish** (`prepublishOnly` hook)
   - Blocks publish if validation fails

## File Structure

```
__examples__/
├── 00-quick-start/
│   ├── 001-hello-world/
│   │   └── example.ts       # ✅ Has @module, @ai
│   └── README.md
├── 01-api-reference/
│   ├── 01-constructors/
│   │   └── 01-ok/
│   │       └── 001-basic-usage/
│   │           └── example.ts   # ✅ Has @module, @ai
│   └── README.md
├── 02-patterns/
│   └── 01-async/
│       └── 001-basics/
│           └── example.ts       # ✅ Has @module, @ai
├── AI_JSDOC_STANDARD.md       # Documentation standard
├── CI_CD_INTEGRATION.md       # CI/CD pipeline docs
└── README.md                  # This file
```

## Example File Template

```typescript
/**
 * @module 001-basic-usage
 * @title Creating Ok Values
 * @description Learn how to create successful Result values with Ok constructor.
 *
 * @example
 * // Basic usage
 * import { Ok } from '@resultsafe/core-fp-result';
 * const result = Ok(42);
 * console.log(result); // { ok: true, value: 42 }
 *
 * @tags result,ok,constructor,basic,beginner
 * @since 0.1.0
 * @lastModified 2026-03-27T14:30:00Z
 *
 * @difficulty Beginner
 * @time 5min
 * @category constructors
 * @see {@link Err} @see {@link match}
 *
 * @ai {"purpose":"Teach Ok constructor usage","prerequisites":["TypeScript types"],"objectives":["Ok syntax"],"rag":{"queries":["how to create Ok"],"intents":["learning"],"expectedAnswer":"Use Ok(value)","confidence":0.95},"embedding":{"semanticKeywords":["result","ok"],"conceptualTags":["explicit-errors"],"useCases":["api-response"]},"codeSearch":{"patterns":["Ok(value)"],"imports":["import { Ok } from '@resultsafe/core-fp-result'"]},"learningPath":{"progression":["002-with-generics"]},"chunking":{"type":"self-contained","section":"constructors","subsection":"ok","tokenCount":200,"relatedChunks":["002-with-generics"]}}
 */

import { Ok } from '@resultsafe/core-fp-result';

const result = Ok(42);
console.log(result); // { ok: true, value: 42 }
```

## Troubleshooting

### "Cannot find name 'Result'"

**Fix:** Import `Result` type:

```typescript
import type { Result } from '@resultsafe/core-fp-result';
```

### "Property 'value' does not exist on type 'Result'"

**Fix:** Narrow the type first:

```typescript
if (result.ok) {
  console.log(result.value); // ✅ TypeScript knows it's Ok
}
```

### "TS2749: 'Ok' refers to a value, but is being used as a type"

**Fix:** Use `typeof Ok` for types:

```typescript
// Wrong:
type MyResult = Ok<number, string>;

// Correct:
type MyResult = ReturnType<typeof Ok<number, string>>;
// Or use Result type:
type MyResult = Result<number, string>;
```

### "@ai JSON validation failed"

**Fix:** Ensure all required fields are present:

```typescript
@ai {"purpose":"...","prerequisites":[],"objectives":[],"rag":{"queries":[],"intents":[],"expectedAnswer":"...","confidence":0.95},"embedding":{"semanticKeywords":[],"conceptualTags":[],"useCases":[]},"codeSearch":{"patterns":[],"imports":[]},"learningPath":{"progression":[]},"chunking":{"type":"...","section":"...","tokenCount":200,"relatedChunks":[]}}
```

### "Property 'X' does not exist on type '...'" (Discriminated Union)

**Problem:** Accessing a property that exists only in one variant of a union type without narrowing.

**Example Error:**

```
Property 'timeout' does not exist on type '{ type: "timeout"; ms: number; }'
```

**Fix:** Use discriminated union pattern matching or type guards:

```typescript
// Wrong:
case 'timeout':
  return `Timeout after ${error.timeout}ms`; // ❌ 'timeout' not in union

// Correct:
case 'timeout':
  return `Timeout after ${error.ms}ms`; // ✅ Use correct property from union variant
```

**For union types:**

```typescript
type ApiError =
  | { type: 'timeout'; ms: number }
  | { type: 'network'; message: string };

// Narrow first:
if (error.type === 'timeout') {
  console.log(error.ms); // ✅ TypeScript knows it's timeout variant
}
```

### "HeadersInit cannot be found" or "HeadersInit type error"

**Problem:** `HeadersInit` type may not be available in all TypeScript configurations.

**Fix:** Use `Record<string, string>` instead:

```typescript
// Wrong (may fail):
const headers: HeadersInit = {
  'Content-Type': 'application/json',
  ...options?.headers, // ❌ Spread with HeadersInit causes type issues
};

// Correct:
const headersInit: Record<string, string> = {
  'Content-Type': 'application/json',
};

if (options?.headers) {
  Object.assign(headersInit, options.headers); // ✅ Safe assignment
}

const headers = headersInit;
```

### "Property is private and only accessible within class"

**Problem:** Child class cannot access private members of parent class.

**Fix:** Change `private` to `protected` for members that need inheritance:

```typescript
// Parent class:
class ApiClient {
  // Wrong:
  private async request<T>() { ... } // ❌ Not accessible in subclasses

  // Correct:
  protected async request<T>() { ... } // ✅ Accessible in subclasses
}

// Child class:
class AuthApiClient extends ApiClient {
  async requestWithRefresh<T>() {
    return this.request<T>(); // ✅ Now works with 'protected'
  }
}
```

### "Type 'undefined' is not assignable" (exactOptionalPropertyTypes)

**Problem:** TypeScript's `exactOptionalPropertyTypes` flag disallows assigning `undefined` to optional properties.

**Fix:** Use `delete` or explicitly allow `undefined` in type:

```typescript
// Wrong:
interface Job {
  nextRun?: number;
}
job.nextRun = undefined; // ❌ Fails with exactOptionalPropertyTypes

// Correct:
delete job.nextRun; // ✅ Remove property entirely

// Or allow undefined explicitly:
interface Job {
  nextRun?: number | undefined;
}
```

## Best Practices

1. **Always import types explicitly**

   ```typescript
   import type { Result, Option } from '@resultsafe/core-fp-result';
   import { Ok, Err } from '@resultsafe/core-fp-result';
   ```

2. **Narrow types before accessing properties**

   ```typescript
   if (result.ok) {
     return result.value; // ✅ Safe
   }
   ```

3. **Use `match()` for exhaustive handling**

   ```typescript
   const value = match(
     result,
     (ok) => ok.value,
     (err) => err.error,
   );
   ```

4. **Keep examples self-contained**
   - Minimal dependencies
   - Clear input/output
   - Executable as-is

5. **Update `@ai` JSON when changing examples**
   - Keep `chunking.relatedChunks` up to date
   - Update `codeSearch.patterns` for new APIs

## Related Documents

- [AI_JSDOC_STANDARD.md](./AI_JSDOC_STANDARD.md) — Full JSDoc specification
- [CI_CD_INTEGRATION.md](./CI_CD_INTEGRATION.md) — CI/CD pipeline details
