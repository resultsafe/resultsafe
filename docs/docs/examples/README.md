# Examples Documentation

**Auto-generated documentation from examples.**

---

## 🔄 Generation

This documentation is automatically generated from examples in:
```
packages/core/fp/result/__examples__/
```

### Generate Documentation

```bash
# From project root
node tools/artifacts/examples-to-docs.js
```

### Output

Generated files are placed in:
```
docs/docs/examples/
```

---

## 📁 Structure

```
docs/docs/examples/
├── index.md                      # Main examples index
├── 00-quick-start/
│   ├── index.md
│   ├── 001-hello-world/
│   │   └── example.md
│   └── ...
├── 01-api-reference/
│   ├── index.md
│   └── (38 example files)
└── 02-patterns/
    ├── index.md
    └── (9 example files)
```

---

## 📊 Statistics

- **Total Examples:** 51
- **Categories:** 3 (Quick Start, API Reference, Patterns)
- **Generated Files:** 60+ Markdown files

---

## 🔧 For AI Agents

**Source of truth:** Examples in `packages/core/fp/result/__examples__/`

**Generated documentation:** `docs/docs/examples/`

**Generation script:** `tools/artifacts/examples-to-docs.js`

**Process:**
1. Read example.ts files
2. Parse JSDoc comments
3. Generate Markdown documentation
4. Update sidebars.ts

---

**Last Updated:** 2026-03-27  
**Generator Version:** 1.0.0
