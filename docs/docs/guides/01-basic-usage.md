---
id: basic-usage
title: Basic Usage
sidebar_label: Basic Usage
description: Learn the core concepts of ResultSafe
---

# Basic Usage

Learn the fundamental concepts of ResultSafe.

## Creating Result Values

### Ok - Success Value

```typescript
import { Ok } from '@resultsafe/core-fp-result';

// Simple value
const success = Ok(42);
// { ok: true, value: 42 }

// With type annotation
const typed: Ok<number, string> = Ok(42);

// Object value
const user = Ok({ id: 1, name: 'John' });
```

### Err - Error Value

```typescript
import { Err } from '@resultsafe/core-fp-result';

// Simple error
const error = Err('Something went wrong');
// { ok: false, error: 'Something went wrong' }

// With custom error type
const typed: Err<string, number> = Err(500);

// Error object
const complex = Err({ code: 500, message: 'Server error' });
```

## Checking Result

### Using Guards

```typescript
import { Ok, Err, isOk, isErr } from '@resultsafe/core-fp-result';

const result = Ok(42);

if (isOk(result)) {
  console.log(result.value); // TypeScript knows it's Ok
}

if (isErr(result)) {
  console.log(result.error); // TypeScript knows it's Err
}
```

### Using Pattern Matching

```typescript
import { match } from '@resultsafe/core-fp-result';

const result = Ok(42);

match(
  result,
  (value) => console.log('Success:', value),
  (error) => console.log('Error:', error)
);
```

## Transforming Values

### map - Transform Success

```typescript
import { Ok } from '@resultsafe/core-fp-result';

const result = Ok(5)
  .map(x => x * 2)
  .map(x => x.toString());

// Ok("10")
```

### mapErr - Transform Error

```typescript
import { Err } from '@resultsafe/core-fp-result';

const result = Err('error')
  .mapErr(e => e.toUpperCase());

// Err("ERROR")
```

## Extracting Values

### unwrap - Get Value or Throw

```typescript
import { Ok, Err } from '@resultsafe/core-fp-result';

Ok(42).unwrap(); // 42

try {
  Err('error').unwrap(); // Throws!
} catch (e) {
  console.error(e);
}
```

### unwrapOr - Get Value or Default

```typescript
import { Ok, Err } from '@resultsafe/core-fp-result';

Ok(42).unwrapOr(0); // 42
Err('error').unwrapOr(0); // 0
```

### expect - Get Value or Custom Error

```typescript
import { Ok, Err } from '@resultsafe/core-fp-result';

Ok(42).expect('Expected success'); // 42

try {
  Err('error').expect('Expected success'); // Throws with custom message
} catch (e) {
  console.error(e);
}
```

## Next Steps

- [Error Handling](./error-handling.md) - Advanced patterns
- [Chaining](./chaining.md) - Method composition
