# 02 Chaining

Chain Result-returning functions.

## Functions

| Function                           | Example | Description        |
| ---------------------------------- | ------- | ------------------ |
| [**01-and-then/**](./01-and-then/) | 1       | Chain (flatMap)    |
| [**02-or-else/**](./02-or-else/)   | 1       | Recover from error |

## Structure

```
02-chaining/
├── 01-and-then/
│   └── 001-basic-usage/
│       └── example.ts
└── 02-or-else/
    └── 001-basic-usage/
        └── example.ts
```

## Quick Examples

### andThen

```ts
import { Ok, andThen } from '@resultsafe/core-fp-result';

const result = Ok('8080');
const parsed = andThen(result, (s) => Ok(Number(s)));
// Ok(8080)
```

### orElse

```ts
import { Err, Ok, orElse } from '@resultsafe/core-fp-result';

const error = Err('failed');
const recovered = orElse(error, () => Ok(3000));
// Ok(3000)
```

## See Also

- [Transformation](../01-transformation/) — Transform values
- [Extraction](../03-extraction/) — Extract values
