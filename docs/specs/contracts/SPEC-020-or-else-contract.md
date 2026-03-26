---
id: SPEC-020
uuid: b1c2d3e4-f5a6-7890-bcde-100000000020
title: "orElse — transformation method contract"
type: language-neutral-contract
status: canonical
layer: authored
lang: en
scope: monorepo
owner: Denis
created: 2026-03-26
updated: 2026-03-26
symbol: orElse
category: method
links: [SPEC-002, SPEC-010, SPEC-019]
tags: [result, method, transformation, recovery, contract, core]
---

# SPEC-020: `orElse` — transformation method contract

> Language-neutral contract. No language syntax.
> Contract writing rules: [SPEC-002](../SPEC-002-language-neutral-contract-standard.md)

## Symbol

| Attribute | Value |
|-----------|-------|
| Name | `orElse` |
| Category | method |
| Part of | Result family — error recovery / fallback |
| Related contracts | [SPEC-010](SPEC-010-result-type-contract.md) · [SPEC-019](SPEC-019-and-then-contract.md) |

## Signature (language-neutral)

```
orElse(result, fn) → Result
```

Takes a Result and a function that returns a Result. Applies the function to the error if the Result is in the failure state. Returns the Result produced by the function for recovery. Preserves the success state unchanged.

---

## Preconditions

- The input must be a valid Result instance
- The function must return a Result
- The function takes one argument (the error) and returns a Result

---

## Behavior

### Case: result is in failure state (Err)

- Calls the function with the error
- Returns the Result produced by the function directly (no additional wrapping)
- The original Result is not modified

### Case: result is in success state (Ok)

- Does not call the function
- Returns a Result in the success state with the same value
- The original Result is not modified

---

## Postconditions

- When failure: returns fn(error) — the Result returned by fn
- When success: returns Ok(value) unchanged
- The input Result is unchanged
- The return value is always a Result

---

## Edge cases

| Input | Expected output | Notes |
|-------|----------------|-------|
| `orElse(Err(null), fn)` | `fn(null)` | null is passed to fn |
| `orElse(Err(undefined), fn)` | `fn(undefined)` | undefined is passed to fn |
| `orElse(Err(0), fn)` | `fn(0)` | 0 is passed to fn |
| `orElse(Ok(value), fn)` | `Ok(value)` | fn is NOT called |
| `orElse(Ok(null), fn)` | `Ok(null)` | fn is NOT called |
| `orElse(Err(error), Ok)` | `Ok(error)` | fn returns Ok — recovery succeeds |
| `orElse(Err(error), Err)` | `Err(error)` | fn returns Err — new error from fn |

---

## Parity requirements

1. The function is called if and only if the Result is in the failure state — this cannot be deviated from
2. The function receives the error as its single argument — this cannot be deviated from
3. The Result returned by fn is returned directly — no auto-wrapping — this cannot be deviated from
4. When Result is success, the value is preserved unchanged — this cannot be deviated from
5. The input Result is never modified — this cannot be deviated from

---

## Allowed parity deviations

| Aspect | Notes |
|--------|-------|
| Syntax | Method vs function call syntax varies by language |
| Naming | May be named `recover`, `recoverWith`, `catch`, `rescue` in other languages |
| Currying | Function may be curried or uncurried |

---

## Test contract

Every implementation must have tests covering:
- [ ] Case: result is in success state — all clauses
- [ ] Case: result is in failure state — all clauses
- [ ] All edge cases in the table above
- [ ] Function is NOT called for Ok case
- [ ] fn returns Ok — recovery succeeds
- [ ] fn returns Err — new error from fn
- [ ] Tests reference this contract: `// Verifies: SPEC-020`

---

## Implementations

| Language | Package | Status | Impl SPEC |
|----------|---------|--------|-----------|
| TypeScript | `@resultsafe/core-fp-result` | ✅ implemented | — |
| Python | — | 🔧 planned | — |
