# 02 HTTP Patterns

HTTP clients, APIs, and web scraping with Result.

## Examples

| #   | Example                                  | Description              | Difficulty | Time   |
| --- | ---------------------------------------- | ------------------------ | ---------- | ------ |
| 001 | [001-api-client/](./001-api-client/)     | Complete REST API client | ⭐⭐⭐     | 25 min |
| 002 | [002-web-scraping/](./002-web-scraping/) | Robust web scraping      | ⭐⭐⭐     | 20 min |

## Structure

```
02-http/
├── 001-api-client/
│   └── example.ts
└── 002-web-scraping/
    └── example.ts
```

## Running

```bash
# Run all HTTP examples
npx tsx */example.ts

# Run single example
npx tsx 001-api-client/example.ts
```

## See Also

- [Async Patterns](../01-async/) — General async patterns
- [Error Handling](../04-error-handling/) — Retry strategies
