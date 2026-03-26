---
id: SPEC-019
uuid: b1c2d3e4-f5a6-7890-bcde-100000000019
title: "andThen — transformation method contract"
type: language-neutral-contract
status: canonical
layer: authored
lang: en
scope: monorepo
owner: Denis
created: 2026-03-26
updated: 2026-03-26
symbol: andThen
category: method
links: [SPEC-002, SPEC-010, SPEC-017, SPEC-020]
tags: [result, method, transformation, contract, core]
---

# SPEC-019: `andThen` — transformation method contract

> Language-neutral contract. No language syntax.
> Contract writing rules: [SPEC-002](../SPEC-002-language-neutral-contract-standard.md)

## Symbol

| Attribute | Value |
|-----------|-------|
| Name | `andThen` |
| Category | method |
| Part of | Result family — flatMap / bind / chain |
| Related contracts | [SPEC-010](SPEC-010-result-type-contract.md) · [SPEC-017](SPEC-017-map-contract.md) · [SPEC-020](SPEC-020-or-else-contract.md) |

## Signature (language-neutral)

```
andThen(result, fn) → Result
```

Takes a Result and a function that returns a Result. Applies the function to the value if the Result is in the success state. Returns the Result produced by the function without additional wrapping. Preserves the failure state unchanged.

---

## Preconditions

- The input must be a valid Result instance
- The function must return a Result
- The function takes one argument (the value) and returns a Result

---

## Behavior

### Case: result is in success state (Ok)

- Calls the function with the value
- Returns the Result produced by the function directly (no additional wrapping)
- The original Result is not modified

### Case: result is in failure state (Err)

- Does not call the function
- Returns a Result in the failure state with the same error
- The original Result is not modified

---

## Postconditions

- When success: returns fn(value) — the Result returned by fn
- When failure: returns Err(error) unchanged
- The input Result is unchanged
- The return value is always a Result

---

## Edge cases

| Input | Expected output | Notes |
|-------|----------------|-------|
| `andThen(Ok(null), fn)` | `fn(null)` | null is passed to fn |
| `andThen(Ok(undefined), fn)` | `fn(undefined)` | undefined is passed to fn |
| `andThen(Ok(0), fn)` | `fn(0)` | 0 is passed to fn |
| `andThen(Err(error), fn)` | `Err(error)` | fn is NOT called |
| `andThen(Err(null), fn)` | `Err(null)` | fn is NOT called |
| `andThen(Ok(value), Ok)` | `Ok(value)` | fn returns Ok — no nesting |
| `andThen(Ok(value), Err)` | `Err(value)` | fn returns Err — error from fn |

---

## Parity requirements

1. The function is called if and only if the Result is in the success state — this cannot be deviated from
2. The function receives the value as its single argument — this cannot be deviated from
3. The Result returned by fn is returned directly — no auto-wrapping — this cannot be deviated from
4. When Result is failure, the error is preserved unchanged — this cannot be deviated from
5. The input Result is never modified — this cannot be deviated from

---

## Allowed parity deviations

| Aspect | Notes |
|--------|-------|
| Syntax | Method vs function call syntax varies by language |
| Naming | May be named `flatMap`, `bind`, `chain`, `then` in other languages |
| Currying | Function may be curried or uncurried |

---

## Test contract

Every implementation must have tests covering:
- [ ] Case: result is in success state — all clauses
- [ ] Case: result is in failure state — all clauses
- [ ] All edge cases in the table above
- [ ] Function is NOT called for Err case
- [ ] fn returns Ok — result is returned directly (no nesting)
- [ ] fn returns Err — result is returned directly
- [ ] Tests reference this contract: `// Verifies: SPEC-019`

---

## Implementations

| Language | Package | Status | Impl SPEC |
|----------|---------|--------|-----------|
| TypeScript | `@resultsafe/core-fp-result` | ✅ implemented | — |
| Python | — | 🔧 planned | — |
