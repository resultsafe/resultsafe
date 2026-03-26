---
id: ADR-001
uuid: a1b2c3d4-e5f6-7890-abcd-000000000020
title: "TDD as the mandatory development standard"
status: accepted
layer: authored
lang: en
scope: monorepo
owner: Denis
created: 2026-03-26
updated: 2026-03-26
links: [SPEC-001]
---

# ADR-001: TDD as the mandatory development standard

## Status

`accepted` — 2026-03-26

## Context

resultsafe publishes functional primitives (`Result<T,E>`, codecs, refiners,
pipelines) as public npm packages. The public API is a contract — consumers
depend on exact behavior, types, and edge cases.

Several forces drive the need for a formal development standard:

**Public API stability.** Once published, behavior is a promise.
Regressions are breaking changes even when types are unchanged.

**Type-level correctness.** TypeScript generics and discriminated unions
can be structurally valid but semantically wrong. Tests at the type level
catch this before release.

**AI-assisted development.** When an AI agent writes or refactors code,
the test suite is the only reliable signal that behavior is preserved.
Without tests, agent changes cannot be verified.

**Explicit error paths.** The library's core design principle is making
failure explicit. The test suite must reflect this — Err branches need
the same coverage as Ok branches.

**Multiple output formats.** ESM, CJS, UMD, and type declarations must
behave identically. Tests verify cross-format consistency.

**Cross-language expansion.** As resultsafe expands to Python and other
languages, tests are the executable specification that guides implementation.

## Considered options

### Option A: TDD — test first, always

Write the failing test before any production code.
Red → Green → Refactor is mandatory, not optional.

**Pros:**
- Forces explicit thinking about the contract before implementation
- Prevents "write code, add tests later" which leads to tests that
  mirror implementation rather than specification
- AI agent has a clear target: make the test pass
- Regressions caught immediately
- Edge cases considered upfront
- Tests serve as executable specification for other language implementations

**Cons:**
- Higher upfront time investment
- Requires discipline under time pressure

### Option B: Test-after — code first, tests when done

Write implementation first, add tests when complete.

**Pros:**
- Faster to start
- Less friction for exploratory code

**Cons:**
- Tests tend to mirror implementation rather than the contract
- Edge cases discovered late or not at all
- AI agents have no verification signal during generation
- "Add tests later" becomes "no tests"

### Option C: Test-optional — tests where it makes sense

Write tests for complex logic, skip for simple cases.

**Pros:**
- Maximum flexibility

**Cons:**
- "Simple" is subjective — every developer draws the line differently
- Library code has no "simple" — even a one-line function is a public contract
- AI agents cannot distinguish "makes sense" without explicit rules
- Inconsistent coverage makes the test suite unreliable as a safety net

## Decision

**Option A: TDD — test first, always.**

Every line of production code in `src/` is written in response to a
failing test. No exceptions. The complete rules are in
[SPEC-001](../specs/SPEC-001-tdd-development-standard.md).

Applies to all packages under `packages/` without exception.

## Consequences

**Positive:**
- Test suite is the executable specification of the library
- AI agent tasks have a verifiable completion signal: all tests pass
- Public API behavior is guaranteed by tests before any release
- Regressions caught at commit time, not at consumer's runtime
- New language implementations have a test-driven specification to follow
- Clear process for both human developers and AI agents

**Negative / risks:**
- Initial velocity on new packages is slower
- Type-level tests require `expect-type` familiarity
- Exploratory spikes must be explicitly marked as non-production
  and deleted or converted before merging

**What needs to change:**
- `SPEC-001` — complete TDD rules (created alongside this ADR)
- `docs/core/CONTEXT.md` — TDD constraint documented
- `docs/core/DOMAIN.md` — Red/Green/Refactor/type-test terms added
- `docs/_templates/task.md` — TDD completion criteria in every task
- `docs/_templates/spec.md` — "Test contract" section in every spec
