---
id: ADR-002
uuid: a1b2c3d4-e5f6-7890-abcd-000000000021
title: "Contract-first cross-language API parity"
status: accepted
layer: authored
lang: en
scope: monorepo
owner: Denis
created: 2026-03-26
updated: 2026-03-26
links: [SPEC-002, ADR-001]
---

# ADR-002: Contract-first cross-language API parity

## Status

`accepted` — 2026-03-26

## Context

resultsafe is expanding beyond TypeScript. The goal is to provide the same
`Result<T, E>` API — constructors, methods, refiners — in multiple languages:
TypeScript, Python, and others.

The core design is inspired by Rust's `Result<T, E>`. Rust is not an
implementation language, but its semantics are the reference point:
explicit error handling, no hidden throws, composable transformation pipelines.

The fundamental question: **what is the source of truth for API behavior?**

Three forces are in tension:

**TypeScript exists first.** TypeScript packages are implemented and
published. It would be natural to treat them as the reference.

**Each language has idioms.** A Python function call looks different from
TypeScript method chaining. Syntax differs necessarily.

**Behavior must be identical.** `map` on `Ok(value)` must return
`Ok(fn(value))` in every language. `map` on `Err(error)` must return
`Err(error)` without calling `fn` — in every language, without exception.

## Considered options

### Option A: TypeScript as canonical

TypeScript implementation is the reference.
Python and others must match TypeScript API adapted to language idioms.

**Pros:**
- TypeScript already exists — no extra work
- One implementation to keep as reference

**Cons:**
- TypeScript idioms become law for all languages
  (e.g., `ok: true` discriminant is TypeScript-specific)
- TypeScript-specific changes force changes in all other languages
- Treats TypeScript as "more real" than other languages
- Conflates implementation with specification

### Option B: Contract-first — language-neutral spec is canonical

A language-neutral contract defines behavior without any syntax.
Each language implements the contract independently.
TypeScript is the first implementation — not the reference.

**Pros:**
- Contract captures intent, not syntax
- TypeScript-specific changes do not pollute other languages
- Python, Go, others are first-class — not ports of TypeScript
- Aligns with Rust inspiration: trait-first thinking
- AI agent verifies any implementation against one source of truth
- Contracts stable across language version upgrades
- Contracts serve as TDD specification (links with ADR-001)

**Cons:**
- More upfront: contracts must be written before or alongside first impl
- Contracts require maintenance discipline
- TypeScript packages were built before contracts existed — retroactive work

### Option C: No formal parity — best-effort per language

Each language team implements their best interpretation.
Parity is a goal, not a contract.

**Pros:**
- Maximum flexibility
- No coordination overhead

**Cons:**
- Silent divergence between languages
- Consumers cannot trust cross-language parity
- AI agents have no cross-language source of truth

## Decision

**Option B: Contract-first. Language-neutral contracts are canonical.**

The behavior of every method, constructor, type, and refiner in the
resultsafe API is defined in a language-neutral contract document
(`docs/specs/contracts/`). These documents are the source of truth.

TypeScript, Python, and every future language implementation:
- must satisfy the contract
- may use language-native idioms for syntax
- must document any known parity deviation explicitly

Contracts are written in terms of behavior, preconditions, postconditions,
and edge cases — never in language syntax.

Rust semantics are the inspiration but Rust syntax is never used in contracts.

Full rules for contract writing: [SPEC-002](../specs/SPEC-002-language-neutral-contract-standard.md)

## Consequences

**Positive:**
- resultsafe API is language-independent by design
- Any implementation verifiable against a single source of truth
- AI agent validates any language implementation against contracts
- Parity deviations are visible, documented, and deliberate
- TypeScript-specific changes do not force changes in other languages
- New language ports have a complete specification to implement against
- Contracts serve as TDD targets (aligns with ADR-001)

**Negative / risks:**
- TypeScript packages were implemented before contracts.
  Contracts must be written retroactively to match current behavior.
- Contract writing requires discipline: language-neutral vocabulary is a skill.
- Parity deviation tracking requires maintenance as implementations evolve.

**Canonicalization rule:**
When TypeScript behavior and contract conflict — **contract wins**.
TypeScript implementation is the bug.
Exception: if TypeScript behavior is intentionally TypeScript-specific,
document it as a parity deviation in the TypeScript package SPEC.

**What needs to change:**
- Create `docs/specs/contracts/` with SPEC-010+ contracts
- Create `SPEC-002` — rules for writing contracts (created alongside this ADR)
- Write contracts for all symbols in `@resultsafe/core-fp-result`
- Update `docs/core/ARCHITECTURE.md` — add multi-language strategy
- Update `docs/core/DOMAIN.md` — add contract/parity terminology
- Update `docs/_templates/spec.md` — add `implements:` field
- Update `docs/registry/COUNTERS.md` — SPEC → 003+, ADR → 003
- Per-package: each TypeScript SPEC links to its contract via `implements:`
