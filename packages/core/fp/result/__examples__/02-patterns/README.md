# 02 Patterns

Real-world patterns organized by category.

## Categories

| Category                                       | Folders | Examples  | Difficulty     |
| ---------------------------------------------- | ------- | --------- | -------------- |
| [**01-async/**](./01-async/)                   | 3       | 3         | ⭐⭐ to ⭐⭐⭐ |
| [**02-http/**](./02-http/)                     | 2       | 2         | ⭐⭐⭐         |
| [**03-validation/**](./03-validation/)         | 1       | 1         | ⭐⭐           |
| [**04-error-handling/**](./04-error-handling/) | 1       | 1         | ⭐⭐⭐         |
| [**05-events/**](./05-events/)                 | 1       | 1         | ⭐⭐⭐         |
| [**06-workers/**](./06-workers/)               | 1       | 1         | ⭐⭐⭐         |
| [**07-streaming/**](./07-streaming/)           | 0       | 0 (ready) | -              |
| [**08-database/**](./08-database/)             | 0       | 0 (ready) | -              |

## Structure

```
02-patterns/
├── 01-async/
│   ├── 001-basics/
│   │   └── example.ts
│   ├── 002-concurrent/
│   │   └── example.ts
│   └── 003-streams/
│       └── example.ts
├── 02-http/
│   ├── 001-api-client/
│   │   └── example.ts
│   └── 002-web-scraping/
│       └── example.ts
├── 03-validation/
│   └── 001-validation/
│       └── example.ts
├── 04-error-handling/
│   └── 001-error-recovery/
│       └── example.ts
├── 05-events/
│   └── 001-event-handling/
│       └── example.ts
└── 06-workers/
    └── 001-worker-pool/
        └── example.ts
```

## Running

```bash
# Run single category
npx tsx 01-async/*/example.ts

# Run single example
npx tsx 01-async/001-basics/example.ts
```

## See Also

- [Quick Start](../00-quick-start/) — Beginner examples
- [API Reference](../01-api-reference/) — API surface
- [Integrations](../03-integrations/) — Third-party libs
