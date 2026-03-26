---
id: SPEC-NNN
uuid: <generate-uuid-v4>
title: "<symbol-name> — contract"
type: language-neutral-contract
status: draft
layer: authored
lang: en
scope: monorepo
owner: Denis
created: YYYY-MM-DD
updated: YYYY-MM-DD
symbol: <symbol-name>
category: type | constructor | method | refiner | guard
links: [SPEC-010, SPEC-002]
tags: [result, contract]
---

# SPEC-NNN: `<symbol>` — contract

> Language-neutral contract. No language syntax.
> Contract writing rules: [SPEC-002](../SPEC-002-language-neutral-contract-standard.md)

## Symbol

| Attribute | Value |
|-----------|-------|
| Name | `<symbol>` |
| Category | type / constructor / method / refiner / guard |
| Part of | Result family |
| Related contracts | [SPEC-NNN](SPEC-NNN-related.md) |

## Signature (language-neutral)

```
<symbol>(parameters) → return-description
```

[Parameters and return in plain English — no syntax]

---

## Preconditions

- [What must be true before calling this]
- [Parameter constraints]

---

## Behavior

### Case: <descriptive name>

- [Observable outcome 1]
- [Observable outcome 2]

### Case: <descriptive name>

- [Observable outcome]

---

## Postconditions

- [What is guaranteed after calling]
- [Return value properties]

---

## Edge cases

| Input | Expected output | Notes |
|-------|----------------|-------|
| Ok(null) | [expected] | null is a valid value |
| Err(null) | [expected] | null is a valid error |
| [other edge case] | [expected] | [note] |

---

## Parity requirements

[What every implementation MUST satisfy — non-negotiable, no deviation allowed]

1. [Requirement 1]
2. [Requirement 2]

---

## Allowed parity deviations

| Aspect | Notes |
|--------|-------|
| Syntax | [what can vary] |
| Naming | [what can vary] |

---

## Test contract

Every implementation must have tests covering:
- [ ] Case: [name] — all clauses
- [ ] Case: [name] — all clauses
- [ ] All edge cases in the table above
- [ ] Tests reference this contract: `// Verifies: SPEC-NNN`

---

## Implementations

| Language | Package | Status | Impl SPEC |
|----------|---------|--------|-----------|
| TypeScript | `@resultsafe/core-fp-result` | 🔧 pending | — |
| Python | — | 🔧 planned | — |
