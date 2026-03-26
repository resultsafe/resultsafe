---
id: SPEC-015
uuid: b1c2d3e4-f5a6-7890-bcde-100000000015
title: "isErr — guard contract"
type: language-neutral-contract
status: canonical
layer: authored
lang: en
scope: monorepo
owner: Denis
created: 2026-03-26
updated: 2026-03-26
symbol: isErr
category: guard
links: [SPEC-002, SPEC-010, SPEC-013]
tags: [result, guard, contract, core]
---

# SPEC-015: `isErr` — guard contract

> Language-neutral contract. No language syntax.
> Contract writing rules: [SPEC-002](../SPEC-002-language-neutral-contract-standard.md)

## Symbol

| Attribute | Value |
|-----------|-------|
| Name | `isErr` |
| Category | guard |
| Part of | Result family — state guard |
| Related contracts | [SPEC-010](SPEC-010-result-type-contract.md) · [SPEC-013](SPEC-013-is-ok-contract.md) |

## Signature (language-neutral)

```
isErr(result) → boolean
```

Takes a Result and returns true if and only if the Result is in the failure state.

---

## Preconditions

- The input must be a valid Result instance
- The Result must be in exactly one state: success or failure

---

## Behavior

### Case: result is in success state (Ok)

- Returns false
- The Result is not modified
- No value is extracted or returned

### Case: result is in failure state (Err)

- Returns true
- The Result is not modified
- No error is extracted or returned

---

## Postconditions

- Returns true if and only if the Result is in the failure state
- The input Result is unchanged
- The return value is a plain boolean

---

## Edge cases

| Input | Expected output | Notes |
|-------|----------------|-------|
| `isErr(Ok(null))` | false | null value is still success |
| `isErr(Ok(value))` | false | any value means success |
| `isErr(Err(null))` | true | null error is still failure |
| `isErr(Err(undefined))` | true | undefined error is still failure |
| `isErr(Err(0))` | true | 0 is falsy but state is failure |
| `isErr(Err(false))` | true | false is falsy but state is failure |

---

## Parity requirements

1. isErr returns true if and only if the Result is in the failure state — this cannot be deviated from
2. isErr returns false if and only if the Result is in the success state — this cannot be deviated from
3. The input Result is never modified — this cannot be deviated from
4. The return value is always a plain boolean — this cannot be deviated from

---

## Allowed parity deviations

| Aspect | Notes |
|--------|-------|
| Syntax | Function call syntax varies by language |
| Naming | May be named `isFailure`, `isErrVariant`, `isFailureState` in other languages |
| Type narrowing | Type predicate behavior is language-specific |

---

## Test contract

Every implementation must have tests covering:
- [ ] Case: result is in success state — all clauses
- [ ] Case: result is in failure state — all clauses
- [ ] All edge cases in the table above
- [ ] Tests reference this contract: `// Verifies: SPEC-015`

---

## Implementations

| Language | Package | Status | Impl SPEC |
|----------|---------|--------|-----------|
| TypeScript | `@resultsafe/core-fp-result` | ✅ implemented | — |
| Python | — | 🔧 planned | — |
