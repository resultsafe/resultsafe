# 01 Constructors

Create Result values with `Ok` and `Err`.

## Functions

| Function                 | Examples | Description           |
| ------------------------ | -------- | --------------------- |
| [**01-ok/**](./01-ok/)   | 3        | Create success result |
| [**02-err/**](./02-err/) | 3        | Create error result   |

## Structure

```
01-constructors/
├── 01-ok/
│   ├── 001-basic-usage/
│   │   └── example.ts
│   ├── 002-with-generics/
│   │   └── example.ts
│   └── 003-real-world/
│       └── example.ts
└── 02-err/
    ├── 001-basic-usage/
    │   └── example.ts
    ├── 002-with-custom-error/
    │   └── example.ts
    └── 003-real-world/
        └── example.ts
```

## Quick Examples

### Ok — Create success

```ts
import { Ok } from '@resultsafe/core-fp-result';

const result = Ok(42);
// { ok: true, value: 42 }
```

### Err — Create error

```ts
import { Err } from '@resultsafe/core-fp-result';

const error = Err('Something went wrong');
// { ok: false, error: 'Something went wrong' }
```

## Running

```bash
# Run all constructor examples
npx tsx */**/example.ts

# Run Ok examples
npx tsx 01-ok/*/example.ts

# Run Err examples
npx tsx 02-err/*/example.ts
```

## See Also

- [Guards](../02-guards/) — Check result type
- [Methods](../03-methods/) — Transform and chain
