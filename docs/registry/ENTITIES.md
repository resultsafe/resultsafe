---
id: ENTITIES
uuid: a1b2c3d4-e5f6-7890-abcd-000000000052
title: "Cross-Cutting Entity Registry"
status: canonical
layer: authored
lang: en
scope: monorepo
owner: Denis
created: 2026-03-26
updated: 2026-03-26
---

# Cross-Cutting Entity Registry

> Registry of named entities that span multiple packages.
> Single-package entities belong in packages/*/docs/meta/registry/ENTITIES.md.

## Domain entities

| Entity | Definition | Primary package | Contracts |
|--------|-----------|----------------|-----------|
| `Result<T,E>` | Success/failure container | `core-fp-result` | [SPEC-010](../specs/contracts/SPEC-010-result-type-contract.md) |
| `Ok<T>` | Success variant | `core-fp-result` | [SPEC-011](../specs/contracts/SPEC-011-ok-constructor-contract.md) |
| `Err<E>` | Failure variant | `core-fp-result` | [SPEC-012](../specs/contracts/SPEC-012-err-constructor-contract.md) |
| `TaskResult<T,E>` | Async Result | `core-fp-task-result` | — |
| `Codec<A,B,E>` | Bidirectional transform | `core-fp-codec` | — |
| `RefinedResult` | Narrowed Result variants | `core-fp-result` | [SPEC-034](../specs/contracts/SPEC-034-refine-result-contract.md) |

## Status codes

| Status | Meaning |
|--------|---------|
| `active` | In use, supported |
| `deprecated` | Being phased out — see LEGACY.md |
| `planned` | Not yet implemented |
