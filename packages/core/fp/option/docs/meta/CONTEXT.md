---
id: CONTEXT
uuid: abcb1a48-e10f-4d73-8c85-ec5dc37992cc
title: "@resultsafe/core-fp-option — Package Context"
status: canonical
layer: authored
lang: en
scope: package
package: "@resultsafe/core-fp-option"
owner: Denis
created: 2026-03-26
updated: 2026-03-26
links: []
---

# @resultsafe/core-fp-option — Package Context

<!-- AGENT: update only when this package's purpose or scope changes -->

## What this package does

Provides the Option type implementation for handling optional values in a functional way.
The Option type represents a value that may be present (Some) or absent (None),
offering a type-safe alternative to null/undefined checks.

---

## Why it exists as a separate package

This package isolates the Option type implementation, allowing other packages
to depend on it without requiring the entire resultsafe runtime.
It complements the Result type by handling the absence of values rather than errors.

---

## Public API surface

[Key exported symbols — derive from `src/index.ts`]

| Symbol | Category | Description |
|--------|----------|-------------|
| `Option` | type | The Option type union |
| `Some` | constructor | Constructs a Some variant |
| `None` | constructor | Constructs a None variant |
| `isSome` | guard | Type guard for Some |
| `isNone` | guard | Type guard for None |

---

## Dependencies on other resultsafe packages

| Package | Why |
|---------|-----|
| `@resultsafe/core-fp-shared` | Shared utilities |

---

## Contracts implemented

| Contract | Symbol | Impl SPEC |
|----------|--------|-----------|
| [SPEC-013](../../../../docs/specs/contracts/SPEC-013-option-contract.md) | `Option` | [SPEC-001](specs/SPEC-001-option-implementation.md) |

---

## Related root docs

- [Monorepo context](../../../../docs/core/CONTEXT.md)
- [Architecture](../../../../docs/core/ARCHITECTURE.md)
- [Domain glossary](../../../../docs/core/DOMAIN.md)
