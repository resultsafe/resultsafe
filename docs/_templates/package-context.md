---
id: CONTEXT
uuid: <generate-uuid-v4>
title: "<package-name> — Package Context"
status: canonical
layer: authored
lang: en
scope: package
package: "@resultsafe/<package-name>"
owner: Denis
created: YYYY-MM-DD
updated: YYYY-MM-DD
links: []
---

# <package-name> — Package Context

<!-- AGENT: update only when this package's purpose or scope changes -->

## What this package does

[One paragraph: what this specific package provides.
Use domain terms from DOMAIN.md.
Avoid repeating the monorepo-level context.]

---

## Why it exists as a separate package

[What it provides that other packages do not.
Justification for the package boundary.]

---

## Public API surface

[Key exported symbols — derive from `src/index.ts`]

| Symbol | Category | Description |
|--------|----------|-------------|
| `Symbol` | constructor / method / type / guard | [brief description] |

---

## Dependencies on other resultsafe packages

| Package | Why |
|---------|-----|
| `@resultsafe/core-fp-shared` | [reason] |

---

## Contracts implemented

| Contract | Symbol | Impl SPEC |
|----------|--------|-----------|
| [SPEC-NNN](../../../../docs/specs/contracts/SPEC-NNN-*.md) | `symbol` | [SPEC-001](specs/SPEC-001-*.md) |

---

## Related root docs

- [Monorepo context](../../../../docs/core/CONTEXT.md)
- [Architecture](../../../../docs/core/ARCHITECTURE.md)
- [Domain glossary](../../../../docs/core/DOMAIN.md)
