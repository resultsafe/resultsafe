---
id: SPEC-016
uuid: b1c2d3e4-f5a6-7890-bcde-100000000016
title: "isErrAnd — guard contract"
type: language-neutral-contract
status: canonical
layer: authored
lang: en
scope: monorepo
owner: Denis
created: 2026-03-26
updated: 2026-03-26
symbol: isErrAnd
category: guard
links: [SPEC-002, SPEC-010, SPEC-014, SPEC-015]
tags: [result, guard, contract, core]
---

# SPEC-016: `isErrAnd` — guard contract

> Language-neutral contract. No language syntax.
> Contract writing rules: [SPEC-002](../SPEC-002-language-neutral-contract-standard.md)

## Symbol

| Attribute | Value |
|-----------|-------|
| Name | `isErrAnd` |
| Category | guard |
| Part of | Result family — predicate guard for failure state |
| Related contracts | [SPEC-010](SPEC-010-result-type-contract.md) · [SPEC-014](SPEC-014-is-ok-and-contract.md) · [SPEC-015](SPEC-015-is-err-contract.md) |

## Signature (language-neutral)

```
isErrAnd(result, predicate) → boolean
```

Takes a Result and a predicate function. Returns true if and only if the Result is in the failure state AND the predicate returns true for the error.

---

## Preconditions

- The input must be a valid Result instance
- The predicate must be a function that takes one argument and returns a boolean
- The predicate must not have side effects

---

## Behavior

### Case: result is in failure state (Err)

- Calls the predicate with the error
- Returns the boolean result of the predicate
- The Result is not modified

### Case: result is in success state (Ok)

- Does not call the predicate
- Returns false
- The Result is not modified

---

## Postconditions

- Returns true if and only if the Result is in the failure state AND the predicate returns true
- Returns false if the Result is in the success state (predicate not called)
- Returns false if the Result is in the failure state but the predicate returns false
- The input Result is unchanged

---

## Edge cases

| Input | Expected output | Notes |
|-------|----------------|-------|
| `isErrAnd(Err(null), fn)` | `fn(null)` | null error is passed to predicate |
| `isErrAnd(Err(undefined), fn)` | `fn(undefined)` | undefined is passed to predicate |
| `isErrAnd(Err(0), fn)` | `fn(0)` | 0 is passed to predicate |
| `isErrAnd(Err(false), fn)` | `fn(false)` | false is passed to predicate |
| `isErrAnd(Ok(value), fn)` | false | predicate is NOT called |
| `isErrAnd(Ok(null), fn)` | false | null value — predicate NOT called |

---

## Parity requirements

1. The predicate is called if and only if the Result is in the failure state — this cannot be deviated from
2. The predicate receives the error as its single argument — this cannot be deviated from
3. Returns false when Result is in the success state — this cannot be deviated from
4. The input Result is never modified — this cannot be deviated from
5. The return value is always a plain boolean — this cannot be deviated from

---

## Allowed parity deviations

| Aspect | Notes |
|--------|-------|
| Syntax | Function call syntax varies by language |
| Naming | May be named `isFailureAnd`, `isErrSatisfies`, `matchesErr` in other languages |
| Predicate type | Type signature of predicate is language-specific |

---

## Test contract

Every implementation must have tests covering:
- [ ] Case: result is in success state — all clauses
- [ ] Case: result is in failure state — all clauses
- [ ] All edge cases in the table above
- [ ] Predicate is NOT called for Ok case
- [ ] Tests reference this contract: `// Verifies: SPEC-016`

---

## Implementations

| Language | Package | Status | Impl SPEC |
|----------|---------|--------|-----------|
| TypeScript | `@resultsafe/core-fp-result` | ✅ implemented | — |
| Python | — | 🔧 planned | — |
