# 04 Refiners

Advanced type refinement and variant matching.

## Functions

| Function                                                     | Example | Description                  |
| ------------------------------------------------------------ | ------- | ---------------------------- |
| [**01-is-typed-variant/**](./01-is-typed-variant/)           | 1       | Type guard for variant       |
| [**02-is-typed-variant-of/**](./02-is-typed-variant-of/)     | 1       | Type guard with variant map  |
| [**03-match-variant/**](./03-match-variant/)                 | 1       | Match variant with handlers  |
| [**04-match-variant-strict/**](./04-match-variant-strict/)   | 1       | Strict variant matching      |
| [**05-refine-result/**](./05-refine-result/)                 | 1       | Sync result refinement       |
| [**06-refine-result-u/**](./06-refine-result-u/)             | 1       | Sync refinement (uncurried)  |
| [**07-refine-async-result/**](./07-refine-async-result/)     | 1       | Async result refinement      |
| [**08-refine-async-result-u/**](./08-refine-async-result-u/) | 1       | Async refinement (uncurried) |
| [**09-refine-variant-map/**](./09-refine-variant-map/)       | 1       | Refine variant map           |

## Structure

```
04-refiners/
├── 01-is-typed-variant/
├── 02-is-typed-variant-of/
├── 03-match-variant/
├── 04-match-variant-strict/
├── 05-refine-result/
├── 06-refine-result-u/
├── 07-refine-async-result/
├── 08-refine-async-result-u/
└── 09-refine-variant-map/
```

## What are Refiners?

Refiners provide advanced pattern matching and type refinement for discriminated unions:

- **Type guards** — Narrow types at runtime
- **Variant matching** — Exhaustive pattern matching
- **Result refinement** — Validate and narrow variant structures
- **Async support** — Handle async validation

## Running

```bash
# Run all refiner examples
npx tsx */**/example.ts
```

## See Also

- [Methods](../03-methods/) — Core Result methods
- [Patterns](../../../02-patterns/) — Real-world patterns
