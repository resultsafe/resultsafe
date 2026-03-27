# 03 Extraction

Extract values from Result.

## Functions

| Function                                       | Example | Description                         |
| ---------------------------------------------- | ------- | ----------------------------------- |
| [**01-unwrap/**](./01-unwrap/)                 | 1       | Extract or throw                    |
| [**02-unwrap-or/**](./02-unwrap-or/)           | 1       | Extract or default                  |
| [**03-expect/**](./03-expect/)                 | 1       | Extract or throw with message       |
| [**04-unwrap-err/**](./04-unwrap-err/)         | 1       | Extract error or throw              |
| [**05-expect-err/**](./05-expect-err/)         | 1       | Extract error or throw with message |
| [**06-unwrap-or-else/**](./06-unwrap-or-else/) | 1       | Extract or compute default          |

## Structure

```
03-extraction/
├── 01-unwrap/
├── 02-unwrap-or/
├── 03-expect/
├── 04-unwrap-err/
├── 05-expect-err/
└── 06-unwrap-or-else/
```

## Quick Examples

### unwrap

```ts
import { Ok, unwrap } from '@resultsafe/core-fp-result';

const result = Ok(42);
const value = unwrap(result); // 42
```

### unwrapOr

```ts
import { Err, unwrapOr } from '@resultsafe/core-fp-result';

const error = Err('failed');
const value = unwrapOr(error, 0); // 0
```

## See Also

- [Chaining](../02-chaining/) — Chain operations
- [Side Effects](../04-side-effects/) — Side effects
