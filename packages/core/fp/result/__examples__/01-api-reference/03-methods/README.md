# 03 Methods

Core Result methods for transformation, chaining, extraction, and more.

## Categories

| Category | Functions | Examples |
|----------|-----------|----------|
| [**01-transformation/**](./01-transformation/) | 2 | map, mapErr |
| [**02-chaining/**](./02-chaining/) | 2 | andThen, orElse |
| [**03-extraction/**](./03-extraction/) | 6 | unwrap, unwrapOr, expect, ... |
| [**04-side-effects/**](./04-side-effects/) | 4 | tap, tapErr, inspect, ... |
| [**05-advanced/**](./05-advanced/) | 5 | match, flatten, transpose, ... |

## Structure

```
03-methods/
├── 01-transformation/
│   ├── 01-map/
│   └── 02-map-err/
├── 02-chaining/
│   ├── 01-and-then/
│   └── 02-or-else/
├── 03-extraction/
│   ├── 01-unwrap/
│   ├── 02-unwrap-or/
│   ├── 03-expect/
│   ├── 04-unwrap-err/
│   ├── 05-expect-err/
│   └── 06-unwrap-or-else/
├── 04-side-effects/
│   ├── 01-tap/
│   ├── 02-tap-err/
│   ├── 03-inspect/
│   └── 04-inspect-err/
└── 05-advanced/
    ├── 01-match/
    ├── 02-flatten/
    ├── 03-transpose/
    ├── 04-ok/
    └── 05-err/
```

## Running

```bash
# Run all method examples
npx tsx */**/example.ts

# Run specific category
npx tsx 01-transformation/**/example.ts
```

## See Also

- [Constructors](../01-constructors/) — Create results
- [Guards](../02-guards/) — Check results
- [Refiners](../04-refiners/) — Advanced refinement
