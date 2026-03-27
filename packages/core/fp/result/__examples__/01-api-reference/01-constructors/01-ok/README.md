# 01 Ok

Create successful Result values.

## Examples

| # | Example | Description | Difficulty | Time |
|---|---------|-------------|------------|------|
| 001 | [001-basic-usage/](./001-basic-usage/) | Basic Ok usage | ⭐ | 5 min |
| 002 | [002-with-generics/](./002-with-generics/) | Explicit generic types | ⭐ | 5 min |
| 003 | [003-real-world/](./003-real-world/) | Real-world scenarios | ⭐⭐ | 10 min |

## Structure

```
01-ok/
├── 001-basic-usage/
│   └── example.ts
├── 002-with-generics/
│   └── example.ts
└── 003-real-world/
    └── example.ts
```

## Basic Usage

```ts
import { Ok } from '@resultsafe/core-fp-result';

// Simple value
const num = Ok(42);

// Object
const user = Ok({ id: '1', name: 'John' });

// With explicit generics
const explicit = Ok<number, string>(42);
```

## Running

```bash
npx tsx 001-basic-usage/example.ts
npx tsx 002-with-generics/example.ts
npx tsx 003-real-world/example.ts
```

## See Also

- [Err](../02-err/) — Create error result
- [Guards](../../02-guards/) — Check result type
