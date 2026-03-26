---
id: SPEC-011
uuid: b1c2d3e4-f5a6-7890-bcde-100000000011
title: "Ok — constructor contract"
type: language-neutral-contract
status: canonical
layer: authored
lang: en
scope: monorepo
owner: Denis
created: 2026-03-26
updated: 2026-03-26
symbol: Ok
category: constructor
links: [SPEC-002, SPEC-010, SPEC-012]
tags: [result, constructor, contract, core]
---

# SPEC-011: `Ok` — constructor contract

> Language-neutral contract. No language syntax.
> Contract writing rules: [SPEC-002](../SPEC-002-language-neutral-contract-standard.md)

## Symbol

| Attribute | Value |
|-----------|-------|
| Name | `Ok` |
| Category | constructor |
| Part of | Result family — constructor for success state |
| Related contracts | [SPEC-010](SPEC-010-result-type-contract.md) · [SPEC-012](SPEC-012-err-constructor-contract.md) |

## Signature (language-neutral)

```
Ok(value) → Result
```

Takes a value of any type and returns a Result in the success state carrying that value.

---

## Preconditions

- The value can be of any type, including null
- No constraints on the value type — it is unconstrained input

---

## Behavior

### Case: value is provided

- Returns a Result in the success state
- The Result carries the provided value as its inner payload
- The Result is immutable after creation
- The success state is unambiguously determinable

### Case: value is null

- Returns a valid Result in the success state
- null is a valid value — the Result does not fail

### Case: value is another Result

- Returns a Result in the success state
- The inner Result becomes the value (no auto-flattening)
- Outer Result is success; inner Result is the value

---

## Postconditions

- The returned Result is always in the success state
- The value is accessible from the returned Result
- The Result does not change state after creation
- Calling Ok twice with the same value returns two independent Result instances

---

## Edge cases

| Input | Expected output | Notes |
|-------|----------------|-------|
| `Ok(null)` | Valid Result in success state with null value | null is a valid value |
| `Ok(undefined)` | Valid Result in success state with undefined value | undefined is a valid value |
| `Ok(0)` | Valid Result in success state with value 0 | 0 is falsy but valid |
| `Ok(false)` | Valid Result in success state with value false | false is falsy but valid |
| `Ok("")` | Valid Result in success state with empty string | empty string is valid |
| `Ok(Ok(v))` | Valid Result — outer is success, inner Result is the value | no auto-flattening |
| `Ok(Err(e))` | Valid Result — outer is success, inner Result is the value | no auto-flattening |

---

## Parity requirements

1. Ok always returns a Result in the success state — this cannot be deviated from
2. The value is always accessible from the returned Result — this cannot be deviated from
3. null and undefined are valid values — this cannot be deviated from
4. The Result is immutable after creation — this cannot be deviated from
5. No auto-flattening: `Ok(Ok(v))` is a nested Result, not flattened — this cannot be deviated from

---

## Allowed parity deviations

| Aspect | Notes |
|--------|-------|
| Syntax | Constructor call syntax varies by language |
| Naming | May be named `Success`, `success`, `makeOk` in other languages |
| Type inference | Generic type parameters may be explicit or inferred |

---

## Test contract

Every implementation must have tests covering:
- [ ] Case: value is provided — all clauses
- [ ] Case: value is null — all clauses
- [ ] Case: value is another Result — all clauses
- [ ] All edge cases in the table above
- [ ] Tests reference this contract: `// Verifies: SPEC-011`

---

## Implementations

| Language | Package | Status | Impl SPEC |
|----------|---------|--------|-----------|
| TypeScript | `@resultsafe/core-fp-result` | ✅ implemented | — |
| Python | — | 🔧 planned | — |
