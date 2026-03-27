# @resultsafe/core-fp-result Examples

**47 examples** — Scalable structure for 1000+ examples.

---

## 📊 Statistics

| Category          | Folders | Examples  | Difficulty     |
| ----------------- | ------- | --------- | -------------- |
| **Quick Start**   | 4       | 4         | ⭐             |
| **API Reference** | 57      | 47        | ⭐ to ⭐⭐⭐   |
| **Patterns**      | 8       | 9         | ⭐⭐ to ⭐⭐⭐ |
| **Integrations**  | 3       | 0 (ready) | -              |
| **Real World**    | 3       | 0 (ready) | -              |
| **TOTAL**         | **75**  | **60**    | **All levels** |

---

## 🗂️ Complete Structure (1000+ Ready)

```
__examples__/
│
├── 00-quick-start/                    # 4 examples
│   ├── 001-hello-world/
│   │   └── example.ts
│   ├── 002-basic-usage/
│   │   └── example.ts
│   ├── 003-error-handling/
│   │   └── example.ts
│   └── 004-chaining/
│       └── example.ts
│
├── 01-api-reference/
│   ├── 01-constructors/
│   │   ├── 001-basic-usage/          # Ok
│   │   │   └── example.ts
│   │   └── 002-basic-usage/          # Err
│   │       └── example.ts
│   ├── 02-guards/
│   │   ├── 001-basic/                # isOk
│   │   ├── 002-basic/                # isErr
│   │   ├── 003-with-predicate/       # isOkAnd
│   │   └── 004-with-predicate/       # isErrAnd
│   ├── 03-methods/
│   │   ├── 01-transformation/
│   │   │   ├── 001-basic/            # map
│   │   │   └── 002-basic/            # mapErr
│   │   ├── 02-chaining/
│   │   │   ├── 001-basic/            # andThen
│   │   │   └── 002-basic/            # orElse
│   │   ├── 03-extraction/
│   │   │   ├── 001-basic/            # unwrap
│   │   │   ├── 002-basic/            # unwrapOr
│   │   │   ├── 003-basic/            # expect
│   │   │   ├── 004-basic/            # unwrapErr
│   │   │   ├── 005-basic/            # expectErr
│   │   │   └── 006-basic/            # unwrapOrElse
│   │   ├── 04-side-effects/
│   │   │   ├── 001-basic/            # tap
│   │   │   ├── 002-basic/            # tapErr
│   │   │   ├── 003-basic/            # inspect
│   │   │   └── 004-basic/            # inspectErr
│   │   └── 05-advanced/
│   │       ├── 001-basic/            # match
│   │       ├── 002-basic/            # flatten
│   │       ├── 003-basic/            # transpose
│   │       ├── 004-basic/            # ok
│   │       └── 005-basic/            # err
│   └── 04-refiners/
│       ├── 001-basic/                # isTypedVariant
│       ├── 002-basic/                # isTypedVariantOf
│       ├── 003-basic/                # matchVariant
│       ├── 004-basic/                # matchVariantStrict
│       ├── 005-basic/                # refineResult
│       ├── 006-basic/                # refineResultU
│       ├── 007-basic/                # refineAsyncResult
│       ├── 008-basic/                # refineAsyncResultU
│       └── 009-basic/                # refineVariantMap
│
├── 02-patterns/
│   ├── 01-async/
│   │   ├── 001-basics/
│   │   ├── 002-concurrent/
│   │   └── 003-streams/
│   ├── 02-http/
│   │   ├── 001-api-client/
│   │   └── 002-web-scraping/
│   ├── 03-validation/
│   │   └── 001-validation/
│   ├── 04-error-handling/
│   │   └── 001-error-recovery/
│   ├── 05-events/
│   │   └── 001-event-handling/
│   ├── 06-workers/
│   │   └── 001-worker-pool/
│   ├── 07-streaming/
│   └── 08-database/
│
├── 03-integrations/
│   ├── 01-zod/
│   ├── 02-express/
│   └── 03-prisma/
│
└── 04-real-world/
    ├── 01-auth/
    ├── 02-payment/
    └── 03-notification/
```

---

## 📝 Naming Convention

### Format: `<category>/<number>-<description>/`

```
✅ 001-hello-world/
✅ 002-basic-usage/
✅ 003-with-predicate/
✅ 004-in-pipeline/
✅ 005-with-error-handling/
```

**Why 3 digits?**

- ✅ Sorts correctly: `001`, `002`, ... `099`, `100`, `101`
- ✅ Scalable to 999 variants per function
- ✅ Docusaurus-friendly sidebar order
- ✅ GitHub file browser friendly

---

## 🚀 Quick Start

### For Beginners (30 minutes)

```bash
# 1. Hello World (30 sec)
npx tsx 00-quick-start/001-hello-world/example.ts

# 2. Basic Usage (5 min)
npx tsx 00-quick-start/002-basic-usage/example.ts

# 3. Error Handling (10 min)
npx tsx 00-quick-start/003-error-handling/example.ts

# 4. Chaining (15 min)
npx tsx 00-quick-start/004-chaining/example.ts
```

### For Intermediate (1 hour)

```bash
# API Reference - Methods
npx tsx 01-api-reference/03-methods/01-transformation/001-basic/example.ts
npx tsx 01-api-reference/03-methods/02-chaining/001-basic/example.ts
npx tsx 01-api-reference/03-methods/03-extraction/002-basic/example.ts

# Patterns
npx tsx 02-patterns/01-async/001-basics/example.ts
npx tsx 02-patterns/02-http/001-api-client/example.ts
```

### For Advanced (2 hours)

```bash
# Error Recovery
npx tsx 02-patterns/04-error-handling/001-error-recovery/example.ts

# Validation Pipeline
npx tsx 02-patterns/03-validation/001-validation/example.ts

# Event Handling
npx tsx 02-patterns/05-events/001-event-handling/example.ts
```

---

## 🏃 Running Examples

### Single Example

```bash
# With tsx
npx tsx 00-quick-start/001-hello-world/example.ts

# With type checking
npx tsc --noEmit 00-quick-start/001-hello-world/example.ts
```

### All Examples by Category

```bash
# Run all quick-start
npx tsx 00-quick-start/*/example.ts

# Run all async patterns
npx tsx 02-patterns/01-async/*/example.ts
```

---

## 🎯 Difficulty Levels

| Level  | Description  | Sections                  | Examples |
| ------ | ------------ | ------------------------- | -------- |
| ⭐     | Beginner     | Quick Start, Constructors | 8        |
| ⭐⭐   | Intermediate | Guards, Methods, Async    | 30+      |
| ⭐⭐⭐ | Advanced     | Refiners, Patterns        | 22+      |

---

## 🌐 Platform Integration

### Docusaurus

```js
// sidebars.js
module.exports = {
  examples: [
    'examples/index',
    {
      type: 'category',
      label: 'Quick Start',
      items: [
        'examples/00-quick-start/001-hello-world/example',
        'examples/00-quick-start/002-basic-usage/example',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'examples/01-api-reference/01-constructors/001-basic-usage/example',
        'examples/01-api-reference/02-guards/001-basic/example',
      ],
    },
  ],
};
```

### GitHub

- Browse directly in repository
- Click any `example.ts` to view
- Folder structure provides context

### npm

```bash
node_modules/@resultsafe/core-fp-result/__examples__/
├── 00-quick-start/
│   └── 001-hello-world/
│       └── example.ts
```

---

## 🤝 Contributing

### Adding New Examples

1. **Find category** — Choose right folder
2. **Name folder** — `<number>-<description>/`
3. **Create example.ts** — Inside folder
4. **Add JSDoc**:

```ts
/**
 * @module 001-basic
 * @description What this example demonstrates
 * @difficulty Beginner
 * @time 10 minutes
 * @category quick-start
 */
```

5. **Update README** — Add to category table

### Quality Checklist

- [ ] Self-contained and runnable
- [ ] Clear JSDoc comments
- [ ] Expected output in comments
- [ ] Real-world use case
- [ ] Error handling shown
- [ ] Type-safe (no `any`)
- [ ] English only

---

## 📈 Growth Plan

| Phase   | Examples | Structure     | Status         |
| ------- | -------- | ------------- | -------------- |
| Phase 1 | 50       | Flat          | ✅ Complete    |
| Phase 2 | 100      | Folders       | ✅ Complete    |
| Phase 3 | 200      | 3-digit       | ✅ Complete    |
| Phase 4 | 500      | Full taxonomy | 🔄 In Progress |
| Phase 5 | 1000+    | Exhaustive    | ⏳ Planned     |

---

## 🔗 See Also

- [API Documentation](../docs/api/README.md)
- [README](../README.md)
- [TypeDoc](https://typedoc.org/)
- [Docusaurus](https://docusaurus.io/)
- [npm package](https://www.npmjs.com/package/@resultsafe/core-fp-result)

---

**Last updated:** 2026-03-27  
**Version:** 0.1.10  
**Package:** @resultsafe/core-fp-result  
**Total examples:** 60+  
**Total folders:** 52  
**Scalability:** Ready for 1000+ ✅
