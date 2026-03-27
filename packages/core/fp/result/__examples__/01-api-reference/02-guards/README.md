# 02 Guards

Type guards for checking Result values.

## Functions

| Function                               | Examples | Description            |
| -------------------------------------- | -------- | ---------------------- |
| [**01-is-ok/**](./01-is-ok/)           | 1        | Check if success       |
| [**02-is-err/**](./02-is-err/)         | 1        | Check if error         |
| [**03-is-ok-and/**](./03-is-ok-and/)   | 1        | Success with predicate |
| [**04-is-err-and/**](./04-is-err-and/) | 1        | Error with predicate   |

## Structure

```
02-guards/
├── 01-is-ok/
│   └── 001-basic-usage/
│       └── example.ts
├── 02-is-err/
│   └── 001-basic-usage/
│       └── example.ts
├── 03-is-ok-and/
│   └── 001-basic-usage/
│       └── example.ts
└── 04-is-err-and/
    └── 001-basic-usage/
        └── example.ts
```

## Quick Examples

### isOk — Check success

```ts
import { Ok, isOk } from '@resultsafe/core-fp-result';

const result = Ok(42);
isOk(result); // true
```

### isErr — Check error

```ts
import { Err, isErr } from '@resultsafe/core-fp-result';

const error = Err('failed');
isErr(error); // true
```

## Running

```bash
# Run all guard examples
npx tsx */**/example.ts
```

## See Also

- [Constructors](../01-constructors/) — Create results
- [Methods](../03-methods/) — Transform results
