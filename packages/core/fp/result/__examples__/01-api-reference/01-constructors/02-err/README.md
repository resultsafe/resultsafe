# 02 Err

Create error Result values.

## Examples

| # | Example | Description | Difficulty | Time |
|---|---------|-------------|------------|------|
| 001 | [001-basic-usage/](./001-basic-usage/) | Basic Err usage | ⭐ | 5 min |
| 002 | [002-with-custom-error/](./002-with-custom-error/) | Custom error types | ⭐⭐ | 5 min |
| 003 | [003-real-world/](./003-real-world/) | Real-world scenarios | ⭐⭐ | 10 min |

## Structure

```
02-err/
├── 001-basic-usage/
│   └── example.ts
├── 002-with-custom-error/
│   └── example.ts
└── 003-real-world/
    └── example.ts
```

## Basic Usage

```ts
import { Err } from '@resultsafe/core-fp-result';

// String error
const error = Err('Something went wrong');

// Error object
const errorObj = Err(new Error('Runtime error'));

// Custom error type
const customErr = Err({ code: 500, message: 'Server error' });
```

## Running

```bash
npx tsx 001-basic-usage/example.ts
npx tsx 002-with-custom-error/example.ts
npx tsx 003-real-world/example.ts
```

## See Also

- [Ok](../01-ok/) — Create success result
- [Error Handling](../../../02-patterns/04-error-handling/) — Recovery patterns
