---
id: SPEC-002
uuid: a1b2c3d4-e5f6-7890-abcd-000000000011
title: "Language-Neutral Contract Standard"
status: canonical
layer: authored
lang: en
scope: monorepo
owner: Denis
created: 2026-03-26
updated: 2026-03-26
links: [ADR-002]
tags: [contracts, api-parity, cross-language, standard]
---

# SPEC-002: Language-Neutral Contract Standard

> Rules for writing language-neutral API contracts.
> Decision basis: [ADR-002](../decisions/ADR-002-cross-language-api-parity.md)
> Contracts live in: `docs/specs/contracts/`

## Quick navigation

| § | Section |
|---|---------|
| [1](#1-what-a-contract-is) | What a contract is |
| [2](#2-what-a-contract-is-not) | What a contract is not |
| [3](#3-contract-document-structure) | Document structure |
| [4](#4-language-neutral-vocabulary) | Vocabulary |
| [5](#5-edge-cases) | Edge cases |
| [6](#6-parity-deviations) | Parity deviations |
| [7](#7-id-and-naming) | ID and naming |
| [8](#8-contract-lifecycle) | Lifecycle |
| [9](#9-implementation-linking) | Implementation linking |
| [10](#10-verification-via-tests) | Verification |
| [11](#11-agent-rules) | Agent rules |

---

## 1. What a contract is

A language-neutral contract specifies the **observable behavior** of a
single API symbol — type, constructor, method, or function — without any
language syntax.

A contract answers:
- **What does it require?** (preconditions)
- **What does it guarantee?** (postconditions)
- **What happens in edge cases?** (edge case table)

A contract is the source of truth for **all** language implementations.
When any implementation conflicts with the contract, the contract wins.

---

## 2. What a contract is not

A contract is **not**:

- A TypeScript type definition
- A Python docstring or type hint
- A code example in any language
- An architecture document
- A test file
- A description of *how* something is implemented
- A migration guide

A contract describes **what** — never **how**.

---

## 3. Contract document structure

```markdown
---
id: SPEC-NNN
uuid: <uuid-v4>
title: "<symbol-name> — contract"
type: language-neutral-contract
status: draft | review | canonical
layer: authored
lang: en
scope: monorepo
owner: Denis
created: YYYY-MM-DD
updated: YYYY-MM-DD
symbol: <symbol-name>
category: type | constructor | method | refiner | guard
links: [SPEC-NNN]
tags: [result, contract]
---

# SPEC-NNN: `<symbol>` — contract

> Language-neutral contract. No language syntax.
> Rules for writing contracts: [SPEC-002](../SPEC-002-language-neutral-contract-standard.md)

## Symbol

| Attribute | Value |
|-----------|-------|
| Name | `<symbol>` |
| Category | type / constructor / method / refiner / guard |
| Part of | `Result` family |
| Related contracts | [SPEC-NNN](SPEC-NNN-related-contract.md) |

## Signature (language-neutral)

<symbol>(parameters) → return-type

[Parameters and return described in plain English, no syntax]

## Preconditions

[What must be true before calling this]

## Behavior

### Case: <descriptive name>
[Observable outcome — what happens, what is returned]

### Case: <descriptive name>
[Observable outcome]

## Postconditions

[What is guaranteed after calling this]

## Edge cases

| Input | Expected output | Notes |
|-------|----------------|-------|

## Parity requirements

[What every implementation must satisfy — non-negotiable]

## Allowed parity deviations

[What implementations are allowed to differ on]

## Implementations

| Language | Package | Status | Impl SPEC |
|----------|---------|--------|-----------|
| TypeScript | `@resultsafe/core-fp-result` | ✅ implemented | [link] |
| Python | planned | 🔧 planned | — |
```

---

## 4. Language-neutral vocabulary

### Allowed terms

| Term | Meaning |
|------|---------|
| `Ok(value)` | A success result carrying value |
| `Err(error)` | A failure result carrying error |
| `value` | The inner value of an Ok result |
| `error` | The inner error of an Err result |
| `fn` | A function argument |
| `result` | A Result argument |
| "returns Ok(X)" | Output is a success result with inner value X |
| "returns Err(X)" | Output is a failure result with inner value X |
| "returns result unchanged" | Output is identical to input |
| "calls fn exactly once with value" | fn invoked once, value as argument |
| "does not call fn" | fn is never invoked — zero calls |

### Forbidden in contracts

| Forbidden | Why |
|-----------|-----|
| `result.ok`, `result.value` | TypeScript field access syntax |
| `<T, E>`, `<T extends ...>` | TypeScript generics |
| `Result[T, E]`, `Optional[T]` | Python type hints |
| `.map(fn)`, `result.andThen(fn)` | Method call syntax |
| `\|>` | Pipe operator (language-specific) |
| `async/await`, `Promise` | Async syntax |
| `Option`, `None`, `Some` | Other type system names |
| `None`, `null`, `undefined` | Language-specific null representations |
| "uses a switch statement" | Implementation detail |
| "checks the ok field" | Implementation detail |

### Correct example

```markdown
## Behavior

### Case: result is Ok(value)
- Calls fn exactly once
- fn receives value as its only argument
- Returns Ok(fn(value))

### Case: result is Err(error)
- Does not call fn — zero invocations
- Returns Err(error)
- The returned error is identical to the input error
```

### Incorrect — do not write this

```markdown
## Behavior
If result.ok === true, return { ok: true, value: fn(result.value) }
```

---

## 5. Edge cases

### Required coverage for all contracts

| Case | Required |
|------|---------|
| Null inner value: `Ok(null)` | ✅ |
| Empty string: `Ok("")` | ✅ if string domain |
| Zero: `Ok(0)` | ✅ if numeric domain |
| Nested Result: `Ok(Ok(v))` | ✅ where applicable |
| fn returns Err: `Ok(v), fn → Err` | ✅ where applicable |
| Err input with any fn | ✅ fn not called |
| Null error: `Err(null)` | ✅ |

---

## 6. Parity deviations

A parity deviation is a **known, documented** difference between an
implementation and the contract.

### Allowed deviation types

| Type | Example |
|------|---------|
| Syntax | Free function vs method syntax |
| Naming | `andThen` vs `flat_map` (Python convention) |
| Async variant | Different module, same behavior contract |
| Type representation | Discriminated union vs dataclass variants |

### Forbidden deviation types

| Type | Example |
|------|---------|
| Behavioral | Python `map` calls fn on Err — **forbidden** |
| Postcondition | Returns None instead of Err — **forbidden** |
| Edge case | Throws on `Ok(null)` — **forbidden** |

### How to document a deviation

In the implementing package's SPEC:

```markdown
## Parity deviations from SPEC-013

| Aspect | Contract | This implementation | Reason |
|--------|----------|--------------------:|--------|
| Method name | `andThen` | `flat_map` | Python monadic bind convention |
| Call syntax | Free function | Method on Result | Python OOP idioms |
```

---

## 7. ID and naming

### ID ranges

```
SPEC-001..009   process/operational specs
SPEC-010+       language-neutral API contracts
```

### Slug format

```
SPEC-NNN-<symbol-name>-contract.md

SPEC-010-result-type-contract.md
SPEC-011-ok-constructor-contract.md
SPEC-012-err-constructor-contract.md
SPEC-013-map-contract.md
SPEC-014-map-err-contract.md
SPEC-015-and-then-contract.md
SPEC-016-or-else-contract.md
SPEC-017-match-contract.md
SPEC-018-is-ok-contract.md
SPEC-019-is-err-contract.md
SPEC-020-unwrap-contract.md
SPEC-021-unwrap-or-contract.md
SPEC-022-unwrap-or-else-contract.md
SPEC-023-unwrap-err-contract.md
SPEC-024-expect-contract.md
SPEC-025-expect-err-contract.md
SPEC-026-flatten-contract.md
SPEC-027-transpose-contract.md
SPEC-028-inspect-contract.md
SPEC-029-inspect-err-contract.md
SPEC-030-tap-contract.md
SPEC-031-tap-err-contract.md
SPEC-032-ok-method-contract.md
SPEC-033-err-method-contract.md
SPEC-034-refine-result-contract.md
SPEC-035-refine-result-u-contract.md
SPEC-036-refine-async-result-contract.md
SPEC-037-match-variant-contract.md
SPEC-038-match-variant-strict-contract.md
SPEC-039-is-typed-variant-contract.md
SPEC-040-is-typed-variant-of-contract.md
SPEC-041-refine-variant-map-contract.md
```

---

## 8. Contract lifecycle

### Creating

```
1. Check docs/registry/COUNTERS.md for next SPEC number
2. Create docs/specs/contracts/SPEC-NNN-<symbol>-contract.md
3. Set status: draft
4. Write all sections using this template
5. Review against existing TypeScript implementation for accuracy
6. Set status: review
7. Set status: canonical when accepted
8. Update docs/registry/COUNTERS.md
9. Update docs/MANIFEST.md contracts table
```

### Changing a canonical contract

Canonical contracts are **immutable**.

```
1. Set old contract status: superseded, add superseded_by: SPEC-NNN
2. Create new SPEC-NNN with updated behavior
3. Update all implementation SPECs that link the old contract
4. Document migration in CHANGELOG.md
```

---

## 9. Implementation linking

**In the implementing package's SPEC:**

```markdown
---
id: SPEC-001
implements: SPEC-013
links: [SPEC-013]
package: "@resultsafe/core-fp-result"
---

# SPEC-001: `map` — TypeScript implementation

Implements: [SPEC-013](../../../../docs/specs/contracts/SPEC-013-map-contract.md)

## TypeScript-specific notes
[Generics, type constraints, syntax]

## Parity deviations from SPEC-013
None — full parity.
```

**In the contract — update Implementations table:**

```markdown
## Implementations

| Language | Package | Status | Impl SPEC |
|----------|---------|--------|-----------|
| TypeScript | `@resultsafe/core-fp-result` | ✅ | [SPEC-001](path) |
| Python | planned | 🔧 | — |
```

---

## 10. Verification via tests

Tests prove contract compliance. Reference the contract ID in test files:

```typescript
// __tests__/unit/methods/map.test.ts
// Verifies: SPEC-013 — map contract

describe("map — SPEC-013 compliance", () => {

  // SPEC-013 §Behavior: Case result is Ok(value)
  it("calls fn exactly once with value", () => { ... })
  it("returns Ok(fn(value))", () => { ... })

  // SPEC-013 §Behavior: Case result is Err(error)
  it("does not call fn when Err", () => { ... })
  it("returns Err(error) unchanged", () => { ... })

  // SPEC-013 §Edge cases
  it("handles Ok(null)", () => { ... })

})
```

---

## 11. Agent rules

```
READING contracts:
  — Before implementing any symbol: read its contract first
  — Contract is source of truth — not the TypeScript code
  — If contract and implementation conflict → implementation is wrong

WRITING contracts:
  — Language-neutral vocabulary only (see §4)
  — No TypeScript/Python/any language syntax
  — Cover all mandatory edge cases (§5)
  — Set status: draft until reviewed by Denis

WRITING implementations:
  — Link contract in frontmatter: implements: SPEC-NNN
  — Document parity deviations explicitly — never silent
  — Tests must reference contract ID: // Verifies: SPEC-NNN

FORBIDDEN:
  ❌ TypeScript syntax in a contract document
  ❌ Using TypeScript implementation as reference instead of contract
  ❌ Creating contracts in packages/*/docs/meta/ (contracts are monorepo-level)
  ❌ Marking deviation as "none" when one exists
  ❌ Editing a canonical contract (create new version instead)

SIGNALS:
  <!-- CONTRACT-MISSING: no contract for symbol X — create before implementing -->
  <!-- PARITY-VIOLATION: impl deviates from SPEC-NNN without documented deviation -->
  <!-- CONTRACT-CONFLICT: contract and implementation disagree — contract wins -->
```
