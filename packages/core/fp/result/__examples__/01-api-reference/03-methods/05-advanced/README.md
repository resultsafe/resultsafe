# 05 Advanced

Advanced Result operations.

## Functions

| Function                             | Example | Description                     |
| ------------------------------------ | ------- | ------------------------------- |
| [**01-match/**](./01-match/)         | 1       | Pattern matching                |
| [**02-flatten/**](./02-flatten/)     | 1       | Flatten nested Result           |
| [**03-transpose/**](./03-transpose/) | 1       | Result<Option> → Option<Result> |
| [**04-ok/**](./04-ok/)               | 1       | Convert to Option (success)     |
| [**05-err/**](./05-err/)             | 1       | Convert to Option (error)       |

## Structure

```
05-advanced/
├── 01-match/
├── 02-flatten/
├── 03-transpose/
├── 04-ok/
└── 05-err/
```

## Quick Examples

### match

```ts
import { Ok, match } from '@resultsafe/core-fp-result';

const result = Ok(42);
const value = match(
  result,
  (x) => x,
  (e) => 0,
);
// 42
```

### flatten

```ts
import { Ok, flatten } from '@resultsafe/core-fp-result';

const nested = Ok(Ok(42));
const flat = flatten(nested);
// Ok(42)
```

## See Also

- [Side Effects](../04-side-effects/) — Side effects
- [Refiners](../../04-refiners/) — Advanced refinement
