# 04 Side Effects

Execute side effects without changing the Result.

## Functions

| Function                                 | Example | Description            |
| ---------------------------------------- | ------- | ---------------------- |
| [**01-tap/**](./01-tap/)                 | 1       | Side effect on success |
| [**02-tap-err/**](./02-tap-err/)         | 1       | Side effect on error   |
| [**03-inspect/**](./03-inspect/)         | 1       | Debug success value    |
| [**04-inspect-err/**](./04-inspect-err/) | 1       | Debug error value      |

## Structure

```
04-side-effects/
├── 01-tap/
├── 02-tap-err/
├── 03-inspect/
└── 04-inspect-err/
```

## Quick Examples

### tap

```ts
import { Ok, tap } from '@resultsafe/core-fp-result';

const result = Ok(42);
const logged = tap(result, (x) => console.log(x));
// Logs: 42, returns: Ok(42)
```

### tapErr

```ts
import { Err, tapErr } from '@resultsafe/core-fp-result';

const error = Err('failed');
const logged = tapErr(error, (e) => console.error(e));
// Logs: failed, returns: Err('failed')
```

## See Also

- [Extraction](../03-extraction/) — Extract values
- [Advanced](../05-advanced/) — Advanced operations
