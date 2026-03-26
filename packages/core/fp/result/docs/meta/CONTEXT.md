---
id: CONTEXT
uuid: 3143ad43-830e-4a51-9795-c484204e0e00
title: "@resultsafe/core-fp-result — Package Context"
status: canonical
layer: authored
lang: en
scope: package
package: "@resultsafe/core-fp-result"
owner: Denis
created: 2026-03-26
updated: 2026-03-26
links: []
---

# @resultsafe/core-fp-result — Package Context

<!-- AGENT: update only when this package's purpose or scope changes -->

## What this package does

Provides the Result type implementation for handling operations that can succeed or fail.
The Result type represents either a success value (Ok) or an error value (Err),
offering a type-safe alternative to exception-based error handling.

---

## Why it exists as a separate package

This package isolates the Result type implementation, allowing other packages
to depend on it without requiring the entire resultsafe runtime.
It is the core error handling primitive for the functional programming ecosystem.

---

## Public API surface

[Key exported symbols — derive from `src/index.ts`]

| Symbol | Category | Description |
|--------|----------|-------------|
| `Result` | type | The Result type union |
| `Ok` | constructor | Constructs an Ok variant |
| `Err` | constructor | Constructs an Err variant |
| `isOk` | guard | Type guard for Ok |
| `isErr` | guard | Type guard for Err |

---

## Dependencies on other resultsafe packages

| Package | Why |
|---------|-----|
| `@resultsafe/core-fp-result-shared` | Shared utilities |

---

## Contracts implemented

| Contract | Symbol | Impl SPEC |
|----------|--------|-----------|
| [SPEC-010](../../../../docs/specs/contracts/SPEC-010-result-type-contract.md) | `Result` | [SPEC-001](specs/SPEC-001-result-implementation.md) |

---

## Related root docs

- [Monorepo context](../../../../docs/core/CONTEXT.md)
- [Architecture](../../../../docs/core/ARCHITECTURE.md)
- [Domain glossary](../../../../docs/core/DOMAIN.md)
