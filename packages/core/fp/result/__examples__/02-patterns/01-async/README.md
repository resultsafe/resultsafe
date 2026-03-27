# 01 Async Patterns

Asynchronous operations with Result.

## Examples

| #   | Example                              | Description                    | Difficulty | Time   |
| --- | ------------------------------------ | ------------------------------ | ---------- | ------ |
| 001 | [001-basics/](./001-basics/)         | Promise integration basics     | ⭐⭐       | 15 min |
| 002 | [002-concurrent/](./002-concurrent/) | Promise.all, allSettled, race  | ⭐⭐       | 15 min |
| 003 | [003-streams/](./003-streams/)       | Async generators, backpressure | ⭐⭐⭐     | 20 min |

## Structure

```
01-async/
├── 001-basics/
│   └── example.ts
├── 002-concurrent/
│   └── example.ts
└── 003-streams/
    └── example.ts
```

## Running

```bash
# Run all async examples
npx tsx */example.ts

# Run single example
npx tsx 001-basics/example.ts
```

## See Also

- [HTTP Patterns](../02-http/) — HTTP-specific async
- [Streaming Patterns](../07-streaming/) — Advanced streams
