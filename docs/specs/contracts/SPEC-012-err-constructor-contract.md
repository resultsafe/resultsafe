---
id: SPEC-012
uuid: b1c2d3e4-f5a6-7890-bcde-100000000012
title: "Err — constructor contract"
type: language-neutral-contract
status: canonical
layer: authored
lang: en
scope: monorepo
owner: Denis
created: 2026-03-26
updated: 2026-03-26
symbol: Err
category: constructor
links: [SPEC-002, SPEC-010, SPEC-011]
tags: [result, constructor, contract, core]
---

# SPEC-012: `Err` — constructor contract

> Language-neutral contract. No language syntax.
> Contract writing rules: [SPEC-002](../SPEC-002-language-neutral-contract-standard.md)

## Symbol

| Attribute | Value |
|-----------|-------|
| Name | `Err` |
| Category | constructor |
| Part of | Result family — constructor for failure state |
| Related contracts | [SPEC-010](SPEC-010-result-type-contract.md) · [SPEC-011](SPEC-011-ok-constructor-contract.md) |

## Signature (language-neutral)

```
Err(error) → Result
```

Takes an error of any type and returns a Result in the failure state carrying that error.

---

## Preconditions

- The error can be of any type, including null
- No constraints on the error type — it is unconstrained input

---

## Behavior

### Case: error is provided

- Returns a Result in the failure state
- The Result carries the provided error as its inner payload
- The Result is immutable after creation
- The failure state is unambiguously determinable

### Case: error is null

- Returns a valid Result in the failure state
- null is a valid error — the Result does not fail to create

### Case: error is another Result

- Returns a Result in the failure state
- The inner Result becomes the error (no auto-flattening)
- Outer Result is failure; inner Result is the error

---

## Postconditions

- The returned Result is always in the failure state
- The error is accessible from the returned Result
- The Result does not change state after creation
- Calling Err twice with the same error returns two independent Result instances

---

## Edge cases

| Input | Expected output | Notes |
|-------|----------------|-------|
| `Err(null)` | Valid Result in failure state with null error | null is a valid error |
| `Err(undefined)` | Valid Result in failure state with undefined error | undefined is a valid error |
| `Err(0)` | Valid Result in failure state with error 0 | 0 is falsy but valid |
| `Err(false)` | Valid Result in failure state with error false | false is falsy but valid |
| `Err("")` | Valid Result in failure state with empty string error | empty string is valid |
| `Err(Ok(v))` | Valid Result — outer is failure, inner Result is the error | no auto-flattening |
| `Err(Err(e))` | Valid Result — outer is failure, inner Result is the error | no auto-flattening |

---

## Parity requirements

1. Err always returns a Result in the failure state — this cannot be deviated from
2. The error is always accessible from the returned Result — this cannot be deviated from
3. null and undefined are valid errors — this cannot be deviated from
4. The Result is immutable after creation — this cannot be deviated from
5. No auto-flattening: `Err(Err(e))` is a nested Result, not flattened — this cannot be deviated from

---

## Allowed parity deviations

| Aspect | Notes |
|--------|-------|
| Syntax | Constructor call syntax varies by language |
| Naming | May be named `Failure`, `fail`, `makeErr` in other languages |
| Type inference | Generic type parameters may be explicit or inferred |

---

## Test contract

Every implementation must have tests covering:
- [ ] Case: error is provided — all clauses
- [ ] Case: error is null — all clauses
- [ ] Case: error is another Result — all clauses
- [ ] All edge cases in the table above
- [ ] Tests reference this contract: `// Verifies: SPEC-012`

---

## Implementations

| Language | Package | Status | Impl SPEC |
|----------|---------|--------|-----------|
| TypeScript | `@resultsafe/core-fp-result` | ✅ implemented | — |
| Python | — | 🔧 planned | — |
