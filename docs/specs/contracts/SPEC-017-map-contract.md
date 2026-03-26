---
id: SPEC-017
uuid: b1c2d3e4-f5a6-7890-bcde-100000000017
title: "map — transformation method contract"
type: language-neutral-contract
status: canonical
layer: authored
lang: en
scope: monorepo
owner: Denis
created: 2026-03-26
updated: 2026-03-26
symbol: map
category: method
links: [SPEC-002, SPEC-010, SPEC-018]
tags: [result, method, transformation, contract, core]
---

# SPEC-017: `map` — transformation method contract

> Language-neutral contract. No language syntax.
> Contract writing rules: [SPEC-002](../SPEC-002-language-neutral-contract-standard.md)

## Symbol

| Attribute | Value |
|-----------|-------|
| Name | `map` |
| Category | method |
| Part of | Result family — transformation method |
| Related contracts | [SPEC-010](SPEC-010-result-type-contract.md) · [SPEC-018](SPEC-018-map-err-contract.md) |

## Signature (language-neutral)

```
map(result, fn) → Result
```

Takes a Result and a transformation function. Applies the function to the value if the Result is in the success state. Returns a new Result with the transformed value. Preserves the failure state unchanged.

---

## Preconditions

- The input must be a valid Result instance
- The function must be a pure function (no side effects)
- The function takes one argument (the value) and returns a value

---

## Behavior

### Case: result is in success state (Ok)

- Calls the function with the value
- Returns a new Result in the success state with the transformed value
- The original Result is not modified

### Case: result is in failure state (Err)

- Does not call the function
- Returns a Result in the failure state with the same error
- The original Result is not modified

---

## Postconditions

- When success: returns Ok(fn(value))
- When failure: returns Err(error) unchanged
- The input Result is unchanged
- The return value is always a Result

---

## Edge cases

| Input | Expected output | Notes |
|-------|----------------|-------|
| `map(Ok(null), fn)` | `Ok(fn(null))` | null is passed to fn |
| `map(Ok(undefined), fn)` | `Ok(fn(undefined))` | undefined is passed to fn |
| `map(Ok(0), fn)` | `Ok(fn(0))` | 0 is passed to fn |
| `map(Err(error), fn)` | `Err(error)` | fn is NOT called |
| `map(Err(null), fn)` | `Err(null)` | fn is NOT called |
| `map(Ok(value), identity)` | `Ok(value)` | identity function returns same value |

---

## Parity requirements

1. The function is called if and only if the Result is in the success state — this cannot be deviated from
2. The function receives the value as its single argument — this cannot be deviated from
3. When Result is failure, the error is preserved unchanged — this cannot be deviated from
4. The input Result is never modified — this cannot be deviated from
5. The return value is always a Result — this cannot be deviated from

---

## Allowed parity deviations

| Aspect | Notes |
|--------|-------|
| Syntax | Method vs function call syntax varies by language |
| Naming | May be named `mapOk`, `transform`, `select` in other languages |
| Currying | Function may be curried or uncurried |

---

## Test contract

Every implementation must have tests covering:
- [ ] Case: result is in success state — all clauses
- [ ] Case: result is in failure state — all clauses
- [ ] All edge cases in the table above
- [ ] Function is NOT called for Err case
- [ ] Tests reference this contract: `// Verifies: SPEC-017`

---

## Implementations

| Language | Package | Status | Impl SPEC |
|----------|---------|--------|-----------|
| TypeScript | `@resultsafe/core-fp-result` | ✅ implemented | — |
| Python | — | 🔧 planned | — |
