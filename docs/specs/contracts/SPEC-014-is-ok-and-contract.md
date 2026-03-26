---
id: SPEC-014
uuid: b1c2d3e4-f5a6-7890-bcde-100000000014
title: "isOkAnd — guard contract"
type: language-neutral-contract
status: canonical
layer: authored
lang: en
scope: monorepo
owner: Denis
created: 2026-03-26
updated: 2026-03-26
symbol: isOkAnd
category: guard
links: [SPEC-002, SPEC-010, SPEC-013]
tags: [result, guard, contract, core]
---

# SPEC-014: `isOkAnd` — guard contract

> Language-neutral contract. No language syntax.
> Contract writing rules: [SPEC-002](../SPEC-002-language-neutral-contract-standard.md)

## Symbol

| Attribute | Value |
|-----------|-------|
| Name | `isOkAnd` |
| Category | guard |
| Part of | Result family — predicate guard for success state |
| Related contracts | [SPEC-010](SPEC-010-result-type-contract.md) · [SPEC-013](SPEC-013-is-ok-contract.md) · [SPEC-016](SPEC-016-is-err-and-contract.md) |

## Signature (language-neutral)

```
isOkAnd(result, predicate) → boolean
```

Takes a Result and a predicate function. Returns true if and only if the Result is in the success state AND the predicate returns true for the value.

---

## Preconditions

- The input must be a valid Result instance
- The predicate must be a function that takes one argument and returns a boolean
- The predicate must not have side effects

---

## Behavior

### Case: result is in success state (Ok)

- Calls the predicate with the value
- Returns the boolean result of the predicate
- The Result is not modified

### Case: result is in failure state (Err)

- Does not call the predicate
- Returns false
- The Result is not modified

---

## Postconditions

- Returns true if and only if the Result is in the success state AND the predicate returns true
- Returns false if the Result is in the failure state (predicate not called)
- Returns false if the Result is in the success state but the predicate returns false
- The input Result is unchanged

---

## Edge cases

| Input | Expected output | Notes |
|-------|----------------|-------|
| `isOkAnd(Ok(null), fn)` | `fn(null)` | null value is passed to predicate |
| `isOkAnd(Ok(undefined), fn)` | `fn(undefined)` | undefined is passed to predicate |
| `isOkAnd(Ok(0), fn)` | `fn(0)` | 0 is passed to predicate |
| `isOkAnd(Ok(false), fn)` | `fn(false)` | false is passed to predicate |
| `isOkAnd(Err(error), fn)` | false | predicate is NOT called |
| `isOkAnd(Err(null), fn)` | false | null error — predicate NOT called |

---

## Parity requirements

1. The predicate is called if and only if the Result is in the success state — this cannot be deviated from
2. The predicate receives the value as its single argument — this cannot be deviated from
3. Returns false when Result is in the failure state — this cannot be deviated from
4. The input Result is never modified — this cannot be deviated from
5. The return value is always a plain boolean — this cannot be deviated from

---

## Allowed parity deviations

| Aspect | Notes |
|--------|-------|
| Syntax | Function call syntax varies by language |
| Naming | May be named `isSuccessAnd`, `isOkSatisfies`, `matchesOk` in other languages |
| Predicate type | Type signature of predicate is language-specific |

---

## Test contract

Every implementation must have tests covering:
- [ ] Case: result is in success state — all clauses
- [ ] Case: result is in failure state — all clauses
- [ ] All edge cases in the table above
- [ ] Predicate is NOT called for Err case
- [ ] Tests reference this contract: `// Verifies: SPEC-014`

---

## Implementations

| Language | Package | Status | Impl SPEC |
|----------|---------|--------|-----------|
| TypeScript | `@resultsafe/core-fp-result` | ✅ implemented | — |
| Python | — | 🔧 planned | — |
