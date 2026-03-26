---
id: SPEC-021
uuid: b1c2d3e4-f5a6-7890-bcde-100000000021
title: "match — method contract"
type: language-neutral-contract
status: canonical
layer: authored
lang: en
scope: monorepo
owner: Denis
created: 2026-03-26
updated: 2026-03-26
symbol: match
category: method
links: [SPEC-002, SPEC-010]
tags: [result, method, pattern-matching, contract, core]
---

# SPEC-021: `match` — method contract

> Language-neutral contract. No language syntax.
> Contract writing rules: [SPEC-002](../SPEC-002-language-neutral-contract-standard.md)

## Symbol

| Attribute | Value |
|-----------|-------|
| Name | `match` |
| Category | method |
| Part of | Result family — pattern matching / fold |
| Related contracts | [SPEC-010](SPEC-010-result-type-contract.md) |

## Signature (language-neutral)

```
match(result, okHandler, errHandler) → value
```

Takes a Result and two handler functions: one for the success state and one for the failure state. Calls the appropriate handler with the inner value or error. Returns the value produced by the called handler.

---

## Preconditions

- The input must be a valid Result instance
- Both handlers must be functions
- The okHandler takes one argument (the value) and returns a value
- The errHandler takes one argument (the error) and returns a value
- Both handlers must return the same type

---

## Behavior

### Case: result is in success state (Ok)

- Calls the okHandler with the value
- Returns the value produced by the okHandler
- The errHandler is NOT called
- The original Result is not modified

### Case: result is in failure state (Err)

- Calls the errHandler with the error
- Returns the value produced by the errHandler
- The okHandler is NOT called
- The original Result is not modified

---

## Postconditions

- When success: returns okHandler(value)
- When failure: returns errHandler(error)
- Exactly one handler is called — never both, never neither
- The input Result is unchanged
- The return value is a plain value (not a Result)

---

## Edge cases

| Input | Expected output | Notes |
|-------|----------------|-------|
| `match(Ok(null), okFn, errFn)` | `okFn(null)` | null is passed to okHandler |
| `match(Ok(undefined), okFn, errFn)` | `okFn(undefined)` | undefined is passed to okHandler |
| `match(Err(null), okFn, errFn)` | `errFn(null)` | null is passed to errHandler |
| `match(Err(undefined), okFn, errFn)` | `errFn(undefined)` | undefined is passed to errHandler |
| `match(Ok(value), okFn, errFn)` | `okFn(value)` | errHandler is NOT called |
| `match(Err(error), okFn, errFn)` | `errFn(error)` | okHandler is NOT called |

---

## Parity requirements

1. Exactly one handler is called — never both, never neither — this cannot be deviated from
2. The okHandler is called if and only if the Result is in the success state — this cannot be deviated from
3. The errHandler is called if and only if the Result is in the failure state — this cannot be deviated from
4. The okHandler receives the value as its single argument — this cannot be deviated from
5. The errHandler receives the error as its single argument — this cannot be deviated from
6. The return value is the value produced by the called handler — this cannot be deviated from
7. The input Result is never modified — this cannot be deviated from

---

## Allowed parity deviations

| Aspect | Notes |
|--------|-------|
| Syntax | Method vs function call syntax varies by language |
| Naming | May be named `fold`, `case`, `patternMatch`, `either` in other languages |
| Handler type | Return type of handlers must be the same but type system varies |

---

## Test contract

Every implementation must have tests covering:
- [ ] Case: result is in success state — all clauses
- [ ] Case: result is in failure state — all clauses
- [ ] All edge cases in the table above
- [ ] Exactly one handler is called (never both)
- [ ] Tests reference this contract: `// Verifies: SPEC-021`

---

## Implementations

| Language | Package | Status | Impl SPEC |
|----------|---------|--------|-----------|
| TypeScript | `@resultsafe/core-fp-result` | ✅ implemented | — |
| Python | — | 🔧 planned | — |
