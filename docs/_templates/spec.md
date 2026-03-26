---
id: SPEC-NNN
uuid: <generate-uuid-v4>
title: "Spec title"
status: draft
layer: authored
lang: en
scope: monorepo | package | cross-package
owner: Denis
created: YYYY-MM-DD
updated: YYYY-MM-DD
links: [ADR-NNN]
tags: []
# If this is an implementation of a language-neutral contract:
# implements: SPEC-NNN
# package: "@resultsafe/core-fp-result"
---

# SPEC-NNN: [Title]

> [One sentence: what this spec defines and why it exists]

## Quick navigation

| § | Section |
|---|---------|
| [1](#1-scope) | Scope |
| [2](#2-requirements) | Requirements |
| [3](#3-contract) | Contract / interface |
| [4](#4-edge-cases) | Edge cases |
| [5](#5-test-contract) | Test contract |
| [6](#6-parity-deviations) | Parity deviations *(if implements a contract)* |

---

## 1. Scope

**In scope:**
- [What this spec covers]

**Out of scope:**
- [What this spec explicitly does not cover]

---

## 2. Requirements

[Requirements expressed as clear, testable statements]

| ID | Requirement | Priority |
|----|-------------|---------|
| R-01 | [statement] | must |
| R-02 | [statement] | should |

---

## 3. Contract / interface

[Formal description of the contract, interface, or schema]

---

## 4. Edge cases

| Input | Expected | Notes |
|-------|---------|-------|

---

## 5. Test contract

Every implementation must have tests covering:
- [ ] [Requirement R-01]
- [ ] [Requirement R-02]
- [ ] Edge cases from §4
- [ ] Both Ok and Err paths (if Result-returning)

---

## 6. Parity deviations *(only if `implements:` is set)*

| Aspect | Contract (SPEC-NNN) | This implementation | Reason |
|--------|--------------------|--------------------|--------|
| [aspect] | [contract says] | [impl does] | [why] |
