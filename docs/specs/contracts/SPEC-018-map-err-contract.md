---
id: SPEC-018
uuid: b1c2d3e4-f5a6-7890-bcde-100000000018
title: "mapErr — transformation method contract"
type: language-neutral-contract
status: canonical
layer: authored
lang: en
scope: monorepo
owner: Denis
created: 2026-03-26
updated: 2026-03-26
symbol: mapErr
category: method
links: [SPEC-002, SPEC-010, SPEC-017]
tags: [result, method, transformation, contract, core]
---

# SPEC-018: `mapErr` — transformation method contract

> Language-neutral contract. No language syntax.
> Contract writing rules: [SPEC-002](../SPEC-002-language-neutral-contract-standard.md)

## Symbol

| Attribute | Value |
|-----------|-------|
| Name | `mapErr` |
| Category | method |
| Part of | Result family — transformation method for failure state |
| Related contracts | [SPEC-010](SPEC-010-result-type-contract.md) · [SPEC-017](SPEC-017-map-contract.md) |

## Signature (language-neutral)

```
mapErr(result, fn) → Result
```

Takes a Result and a transformation function. Applies the function to the error if the Result is in the failure state. Returns a new Result with the transformed error. Preserves the success state unchanged.

---

## Preconditions

- The input must be a valid Result instance
- The function must be a pure function (no side effects)
- The function takes one argument (the error) and returns a value

---

## Behavior

### Case: result is in failure state (Err)

- Calls the function with the error
- Returns a new Result in the failure state with the transformed error
- The original Result is not modified

### Case: result is in success state (Ok)

- Does not call the function
- Returns a Result in the success state with the same value
- The original Result is not modified

---

## Postconditions

- When failure: returns Err(fn(error))
- When success: returns Ok(value) unchanged
- The input Result is unchanged
- The return value is always a Result

---

## Edge cases

| Input | Expected output | Notes |
|-------|----------------|-------|
| `mapErr(Err(null), fn)` | `Err(fn(null))` | null is passed to fn |
| `mapErr(Err(undefined), fn)` | `Err(fn(undefined))` | undefined is passed to fn |
| `mapErr(Err(0), fn)` | `Err(fn(0))` | 0 is passed to fn |
| `mapErr(Ok(value), fn)` | `Ok(value)` | fn is NOT called |
| `mapErr(Ok(null), fn)` | `Ok(null)` | fn is NOT called |
| `mapErr(Err(error), identity)` | `Err(error)` | identity function returns same error |

---

## Parity requirements

1. The function is called if and only if the Result is in the failure state — this cannot be deviated from
2. The function receives the error as its single argument — this cannot be deviated from
3. When Result is success, the value is preserved unchanged — this cannot be deviated from
4. The input Result is never modified — this cannot be deviated from
5. The return value is always a Result — this cannot be deviated from

---

## Allowed parity deviations

| Aspect | Notes |
|--------|-------|
| Syntax | Method vs function call syntax varies by language |
| Naming | May be named `mapFailure`, `transformErr`, `mapError` in other languages |
| Currying | Function may be curried or uncurried |

---

## Test contract

Every implementation must have tests covering:
- [ ] Case: result is in success state — all clauses
- [ ] Case: result is in failure state — all clauses
- [ ] All edge cases in the table above
- [ ] Function is NOT called for Ok case
- [ ] Tests reference this contract: `// Verifies: SPEC-018`

---

## Implementations

| Language | Package | Status | Impl SPEC |
|----------|---------|--------|-----------|
| TypeScript | `@resultsafe/core-fp-result` | ✅ implemented | — |
| Python | — | 🔧 planned | — |
