# API Reference Examples

Examples organized by API surface area.

## Categories

| Category | Examples | Description |
|----------|----------|-------------|
| [**01-constructors/**](./01-constructors/) | 2 | Create Ok/Err values |
| [**02-guards/**](./02-guards/) | 4 | Type guards and checks |
| [**03-methods/**](./03-methods/) | 19 | Transform, chain, extract |
| [**04-refiners/**](./04-refiners/) | 9 | Advanced refinement |

## Quick Reference

### Constructors

```bash
01-constructors/
├── 01-Ok.example.ts         # Create success result
└── 02-Err.example.ts        # Create error result
```

### Guards

```bash
02-guards/
├── 01-isOk.example.ts       # Check if success
├── 02-isErr.example.ts      # Check if error
├── 03-isOkAnd.example.ts    # Success with predicate
└── 04-isErrAnd.example.ts   # Error with predicate
```

### Methods

```bash
03-methods/
├── 01-transformation/
│   ├── 01-map.example.ts
│   └── 02-mapErr.example.ts
├── 02-chaining/
│   ├── 01-andThen.example.ts
│   └── 02-orElse.example.ts
├── 03-extraction/
│   ├── 01-unwrap.example.ts
│   ├── 02-unwrapOr.example.ts
│   ├── 03-expect.example.ts
│   └── 04-unwrapErr.example.ts
├── 04-side-effects/
│   ├── 01-tap.example.ts
│   ├── 02-tapErr.example.ts
│   ├── 03-inspect.example.ts
│   └── 04-inspectErr.example.ts
└── 05-advanced/
    ├── 01-match.example.ts
    ├── 02-flatten.example.ts
    ├── 03-transpose.example.ts
    ├── 04-ok.example.ts
    └── 05-err.example.ts
```

### Refiners

```bash
04-refiners/
├── 01-isTypedVariant.example.ts
├── 02-isTypedVariantOf.example.ts
├── 03-matchVariant.example.ts
├── 04-matchVariantStrict.example.ts
├── 05-refineResult.example.ts
├── 06-refineResultU.example.ts
├── 07-refineAsyncResult.example.ts
├── 08-refineAsyncResultU.example.ts
└── 09-refineVariantMap.example.ts
```

## Learning Path

1. **Start:** Constructors → Guards
2. **Core:** Methods (transformation → chaining → extraction)
3. **Advanced:** Refiners

## See Also

- [Quick Start](../00-quick-start/) — Beginner examples
- [Patterns](../02-patterns/) — Real-world use cases
