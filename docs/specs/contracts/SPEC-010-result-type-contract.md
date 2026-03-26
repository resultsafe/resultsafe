---
id: SPEC-010
uuid: a1b2c3d4-e5f6-7890-abcd-000000000030
title: "Result type — contract"
type: language-neutral-contract
status: canonical
layer: authored
lang: en
scope: monorepo
owner: Denis
created: 2026-03-26
updated: 2026-03-26
symbol: Result
category: type
links: [SPEC-011, SPEC-012, SPEC-002]
tags: [result, type, contract, core]
---

# SPEC-010: `Result` type — contract

> Language-neutral contract. No language syntax.
> Contract writing rules: [SPEC-002](../SPEC-002-language-neutral-contract-standard.md)

## Symbol

| Attribute | Value |
|-----------|-------|
| Name | `Result` |
| Category | type |
| Part of | Result family — the root type |
| Related | [Ok constructor](SPEC-011-ok-constructor-contract.md) · [Err constructor](SPEC-012-err-constructor-contract.md) |

## Signature (language-neutral)

```
Result(value-type, error-type)
```

A Result is a container that represents the outcome of an operation.
It is always in exactly one of two states: the success state or the failure state.

---

## Preconditions

- A Result must be in exactly one state — never in both, never in neither
- A Result cannot be in an intermediate or undefined state

---

## Behavior

### Case: success state — Ok

- The result carries a value
- The value can be of any type, including null
- The error is not accessible in this state
- The state can be determined unambiguously

### Case: failure state — Err

- The result carries an error
- The error can be of any type, including null
- The value is not accessible in this state
- The state can be determined unambiguously

---

## Postconditions

- Every Result is in exactly one state: success or failure
- The state of a Result does not change after creation
- A Result in the success state contains a value; its error is absent
- A Result in the failure state contains an error; its value is absent

---

## Edge cases

| Input | Expected | Notes |
|-------|---------|-------|
| Ok with null value | Valid Result in success state | null is a valid value |
| Err with null error | Valid Result in failure state | null is a valid error |
| Ok with another Result as value | Valid — outer Result is success, inner Result is the value | Results do not auto-flatten |
| Err with another Result as error | Valid — outer Result is failure, inner Result is the error | |

---

## Parity requirements

1. A Result is always in exactly one state — this cannot be deviated from
2. The two states are mutually exclusive — this cannot be deviated from
3. State is immutable after creation — this cannot be deviated from
4. Both null value and null error are valid — this cannot be deviated from

---

## Allowed parity deviations

| Aspect | Notes |
|--------|-------|
| State discrimination mechanism | TypeScript uses a discriminant field; Python may use isinstance or match |
| Type representation | TypeScript discriminated union; Python dataclass variants or sealed class |
| State accessor names | May use `is_ok()` method vs `ok` field depending on language convention |

---

## Implementations

| Language | Package | Status | Impl SPEC |
|----------|---------|--------|-----------|
| TypeScript | `@resultsafe/core-fp-result` | ✅ implemented | [SPEC-001](../../../../packages/core/fp/result/docs/meta/specs/SPEC-001-result-type-ts.md) |
| Python | — | 🔧 planned | — |
