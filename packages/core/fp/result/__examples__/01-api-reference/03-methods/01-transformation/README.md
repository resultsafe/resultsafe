# 01 Transformation

Transform success and error values.

## Functions

| Function                         | Example | Description             |
| -------------------------------- | ------- | ----------------------- |
| [**01-map/**](./01-map/)         | 1       | Transform success value |
| [**02-map-err/**](./02-map-err/) | 1       | Transform error value   |

## Structure

```
01-transformation/
├── 01-map/
│   └── 001-basic-usage/
│       └── example.ts
└── 02-map-err/
    └── 001-basic-usage/
        └── example.ts
```

## Quick Examples

### map

```ts
import { Ok, map } from '@resultsafe/core-fp-result';

const result = Ok(21);
const doubled = map(result, (x) => x * 2);
// Ok(42)
```

### mapErr

```ts
import { Err, mapErr } from '@resultsafe/core-fp-result';

const error = Err('error');
const transformed = mapErr(error, (e) => `Transformed: ${e}`);
// Err('Transformed: error')
```

## See Also

- [Chaining](../02-chaining/) — Chain operations
- [Extraction](../03-extraction/) — Extract values
