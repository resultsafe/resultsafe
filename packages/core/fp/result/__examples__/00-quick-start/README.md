# 00 Quick Start

Heuristic onboarding for Result beginners.

## Examples

| #   | Example                                      | Description                       | Time   |
| --- | -------------------------------------------- | --------------------------------- | ------ |
| 001 | [001-hello-world/](./001-hello-world/)       | Hello World with Result           | 30 sec |
| 002 | [002-basic-usage/](./002-basic-usage/)       | Creating Ok/Err, pattern matching | 5 min  |
| 003 | [003-error-handling/](./003-error-handling/) | Explicit errors without try/catch | 10 min |
| 004 | [004-chaining/](./004-chaining/)             | map, andThen, orElse composition  | 15 min |

## Structure

```
00-quick-start/
├── 001-hello-world/
│   └── example.ts          # Your first 30 seconds
├── 002-basic-usage/
│   └── example.ts          # Ok, Err, match
├── 003-error-handling/
│   └── example.ts          # Explicit errors
└── 004-chaining/
    └── example.ts          # Composition
```

## Running

```bash
# Run any example
npx tsx 001-hello-world/example.ts

# Run all quick-start examples
npx tsx *.ts
```

## Learning Path

1. **Start:** 001-hello-world (30 seconds)
2. **Basics:** 002-basic-usage (5 minutes)
3. **Errors:** 003-error-handling (10 minutes)
4. **Composition:** 004-chaining (15 minutes)

**Total time:** 30 minutes

## Next Steps

After completing quick-start:

1. **API Reference** → [`01-api-reference/`](../01-api-reference/)
2. **Patterns** → [`02-patterns/`](../02-patterns/)

---

**Difficulty:** ⭐ Beginner  
**Total examples:** 4
