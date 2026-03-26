---
id: MANIFEST
uuid: <generate-uuid-v4>
title: "<package-name> — Documentation Map"
status: canonical
layer: authored
lang: en
scope: package
package: "@resultsafe/<package-name>"
owner: Denis
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# <package-name> — Documentation Map

> Package: `packages/<path>`
> Monorepo map: [docs/MANIFEST.md](../../../../docs/MANIFEST.md)

## What this package does

[One sentence: what this package provides.
Use domain terms from DOMAIN.md.]

---

## Agent reading chain

```
Package task → this MANIFEST → CONTEXT.md → targeted files
For cross-cutting context → ../../../../docs/MANIFEST.md
```

---

## Package documents

| File | Role | Status | Updated |
|------|------|--------|---------|
| [CONTEXT.md](CONTEXT.md) | Why this package exists | canonical | YYYY-MM-DD |

---

## Generated (not committed)

| Folder | What | Command |
|--------|------|---------|
| `../api/` | TypeDoc API docs | `pnpm docs:api` |
| `../examples/` | Example docs | `pnpm docs:examples` |

---

## Related root docs

- [Monorepo context](../../../../docs/core/CONTEXT.md)
- [Architecture](../../../../docs/core/ARCHITECTURE.md)
- [Domain glossary](../../../../docs/core/DOMAIN.md)
- [This package in registry](../../../../docs/registry/PACKAGES.md)
- [Contracts](../../../../docs/specs/contracts/)
