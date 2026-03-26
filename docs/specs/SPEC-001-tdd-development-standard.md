---
id: SPEC-001
uuid: a1b2c3d4-e5f6-7890-abcd-000000000010
title: "TDD Development Standard"
status: canonical
layer: authored
lang: en
scope: monorepo
owner: Denis
created: 2026-03-26
updated: 2026-03-26
links: [ADR-001]
tags: [tdd, testing, vitest, standard]
---

# SPEC-001: TDD Development Standard

> Source of truth for all testing rules across the monorepo.
> Decision basis: [ADR-001](../decisions/ADR-001-tdd-as-development-standard.md)

## Quick navigation

| § | Section |
|---|---------|
| [1](#1-core-rule) | Core rule |
| [2](#2-tdd-cycle) | TDD cycle |
| [3](#3-test-types) | Test types |
| [4](#4-folder-structure) | Folder structure |
| [5](#5-naming-conventions) | Naming conventions |
| [6](#6-what-to-test) | What to test |
| [7](#7-error-path-coverage) | Error path coverage |
| [8](#8-type-level-tests) | Type-level tests |
| [9](#9-contract-compliance-tests) | Contract compliance tests |
| [10](#10-tooling) | Tooling |
| [11](#11-ci-contract) | CI contract |
| [12](#12-spikes-and-exploration) | Spikes |
| [13](#13-agent-tdd-rules) | Agent TDD rules |
| [14](#14-violations) | Violations |

---

## 1. Core rule

**Every line of production code in `src/` is written in response to
a failing test. No exceptions.**

If there is no test for a behavior, that behavior does not exist as
far as the library contract is concerned.

---

## 2. TDD cycle

```
RED      Write a failing test that specifies the desired behavior.
         The test must fail for the right reason.

GREEN    Write the minimum code to make the test pass.
         No more code than necessary.

REFACTOR Improve the code without breaking the test.
         Extract, rename, deduplicate — no new behavior.
```

This cycle repeats for every new behavior, every bug fix, every edge case.

---

## 3. Test types

### Unit tests — `__tests__/unit/`

Test a single exported function or type in isolation.
No external I/O. No cross-package imports beyond the package under test.

- One function or class per test file
- Must complete in milliseconds
- Mock external dependencies

### Integration tests — `__tests__/integration/`

Test the interaction of multiple functions or the package's public API
as a whole.

- End-to-end flows through `src/index.ts`
- Pipeline tests: `Ok(x) → andThen(f) → map(g) → match(handlers)`
- Cross-module composition tests
- Refiner pipeline tests

### Type-level tests — `__tests__/types/`

Assert that TypeScript types are exactly correct — not just structurally
compatible but semantically correct. Run at compile time.

- Generic constraints
- Discriminated union narrowing
- Return type correctness
- Guard type narrowing

---

## 4. Folder structure

```
packages/core/fp/result/
└── __tests__/
    ├── unit/
    │   ├── constructors/
    │   │   ├── Ok.test.ts
    │   │   └── Err.test.ts
    │   ├── guards/
    │   │   └── guards.test.ts
    │   ├── methods/
    │   │   ├── transformers.test.ts
    │   │   ├── unwrapping.test.ts
    │   │   └── effects-and-option.test.ts
    │   ├── refiners/
    │   │   ├── refine-pipeline.test.ts
    │   │   └── variant-matching.test.ts
    │   ├── internal/
    │   │   └── internal.test.ts
    │   └── exports/
    │       └── index-exports.test.ts
    ├── integration/
    │   └── types/
    │       ├── Result.Ok.integration.test.ts
    │       ├── Result.Err.integration.test.ts
    │       ├── Result.integration.full.v01.test.ts
    │       └── Result.integration.maximal.test.ts
    └── types/
        └── Result.test.ts
```

### Why `__tests__/` not `test/`

The monorepo uses Vitest. `__tests__/` follows the Jest/Meta convention
where double-underscores signal "not part of public API" — consistent
with `__examples__/` and `__scripts__/` throughout the monorepo.
See [ADR-001](../decisions/ADR-001-tdd-as-development-standard.md).

---

## 5. Naming conventions

### File names

| Test type | Pattern | Example |
|-----------|---------|---------|
| Unit | `<subject>.test.ts` | `map.test.ts` |
| Unit (grouped) | `<group>.test.ts` | `transformers.test.ts` |
| Integration | `<subject>.integration.test.ts` | `Result.integration.full.v01.test.ts` |
| Type-level | `<subject>.test.ts` in `types/` | `Result.test.ts` |
| Export check | `index-exports.test.ts` | fixed name |

### Test description rules

```typescript
describe("map", () => {
  // it: behavior in plain English — what, not how
  it("transforms the Ok value using the provided function", () => { ... })
  it("returns Err unchanged when result is Err", () => { ... })
  it("does not call the function when result is Err", () => { ... })
})
```

- `describe` → subject name (function, module, concept)
- `it` → observable behavior from caller's perspective
- No `it("should …")` — drop "should", state the fact
- No implementation details in names
- Negative cases are explicitly named

---

## 6. What to test

### Mandatory coverage per exported function

| Case | Required |
|------|---------|
| Happy path (Ok input) | ✅ |
| Error path (Err input) | ✅ |
| Edge cases (null, empty, boundary) | ✅ |
| Type narrowing behavior | ✅ (type test) |
| Return type correctness | ✅ (type test) |
| Does not throw (pure function) | ✅ |

### Export integrity test

Every package must have `__tests__/unit/exports/index-exports.test.ts`
verifying the public API surface:

```typescript
import * as API from "../../src/index"

it("exports all expected symbols", () => {
  expect(typeof API.Ok).toBe("function")
  expect(typeof API.Err).toBe("function")
  expect(typeof API.isOk).toBe("function")
  // ... all public exports listed explicitly
})
```

---

## 7. Error path coverage

This is non-negotiable. The library's core value is explicit error handling —
the test suite must reflect this.

**Rule:** every function returning Result must have tests for both the Ok
and the Err branch.

**Anti-pattern — forbidden:**

```typescript
// Tests only the happy path — insufficient
it("maps the value", () => {
  expect(map(Ok(1), x => x + 1)).toEqual(Ok(2))
})
```

**Correct:**

```typescript
it("transforms the Ok value using the provided function", () => {
  expect(map(Ok(1), x => x + 1)).toEqual(Ok(2))
})

it("returns the Err unchanged without calling the function", () => {
  const fn = vi.fn()
  const result = map(Err("error"), fn)
  expect(result).toEqual(Err("error"))
  expect(fn).not.toHaveBeenCalled()
})
```

---

## 8. Type-level tests

Use `expect-type` (or `tsd` — check `package.json`):

```typescript
import { expectTypeOf } from "expect-type"
import type { Result } from "../../src"
import { Ok, Err, map } from "../../src"

// Constructor output types
expectTypeOf(Ok(42)).toMatchTypeOf<Result<number, never>>()
expectTypeOf(Err("e")).toMatchTypeOf<Result<never, string>>()

// Narrowing after guard
const result: Result<number, string> = Ok(42)
if (result.ok) {
  expectTypeOf(result.value).toEqualTypeOf<number>()
}

// map: Ok type transforms, Err type preserved
expectTypeOf(
  map(Ok(42) as Result<number, string>, x => String(x))
).toEqualTypeOf<Result<string, string>>()
```

### When type tests are mandatory

| Symbol | Required |
|--------|---------|
| Discriminated union types | ✅ |
| Generic functions | ✅ |
| Type guards (`isOk`, `isErr`) | ✅ narrowing assertion |
| `match` / `matchVariant` | ✅ exhaustiveness |
| `refineResult` / `refineVariantMap` | ✅ variant typing |

---

## 9. Contract compliance tests

Every test that verifies a language-neutral contract clause must reference
the contract ID:

```typescript
// __tests__/unit/methods/map.test.ts
// Verifies: SPEC-013 — map contract

describe("map — SPEC-013 compliance", () => {

  // SPEC-013 §Behavior: Case result is Ok(value)
  it("calls fn exactly once with value when result is Ok", () => {
    const fn = vi.fn(x => x + 1)
    map(Ok(41), fn)
    expect(fn).toHaveBeenCalledOnce()
    expect(fn).toHaveBeenCalledWith(41)
  })

  it("returns Ok(fn(value)) when result is Ok", () => {
    expect(map(Ok(41), x => x + 1)).toEqual(Ok(42))
  })

  // SPEC-013 §Behavior: Case result is Err(error)
  it("does not call fn when result is Err", () => {
    const fn = vi.fn()
    map(Err("error"), fn)
    expect(fn).not.toHaveBeenCalled()
  })

  it("returns Err(error) unchanged when result is Err", () => {
    expect(map(Err("original"), x => x)).toEqual(Err("original"))
  })

  // SPEC-013 §Edge cases
  it("returns Ok(null) when Ok(null) and fn is identity", () => {
    expect(map(Ok(null), x => x)).toEqual(Ok(null))
  })

})
```

---

## 10. Tooling

### Test runner: Vitest

Config: `config/vitest.config.ts` in each package.

```typescript
// Reference structure for config/vitest.config.ts
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["__tests__/**/*.test.ts"],
    typecheck: {
      enabled: true,
      tsconfig: "./config/tsconfig.build.json",
    },
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.d.ts", "src/internal/**"],
    },
  },
})
```

### Commands

```powershell
pnpm test                                    # all tests
pnpm test:coverage                           # with coverage
pnpm test:types                              # type tests only
pnpm -C packages/core/fp/result test         # single package
pnpm -C packages/core/fp/result test --watch # watch mode (TDD cycle)
```

### Coverage thresholds (minimum before release)

| Metric | Threshold |
|--------|-----------|
| Statements | 95% |
| Branches | 90% |
| Functions | 100% |
| Lines | 95% |

---

## 11. CI contract

**Blocks merge:**

```
pnpm test           — all unit + integration tests pass
pnpm test:types     — all type-level assertions pass
pnpm test:coverage  — coverage thresholds met
```

---

## 12. Spikes and exploration

Sometimes exploratory code is needed before writing a test. Allowed under
strict conditions:

- File marked `// SPIKE: not production` at top
- Lives in a branch, never in `main`
- Before merging: spike deleted OR converted to TDD
  (test written first, spike code becomes the implementation)
- Never committed to `src/` on `main` without tests

---

## 13. Agent TDD rules

```
MANDATORY SEQUENCE when writing or modifying src/:

  1. Read existing __tests__/ for the module being changed
  2. Write the failing test(s) — RED phase
  3. Confirm the test fails (describe expected failure)
  4. Write minimum implementation — GREEN phase
  5. Verify all tests pass including existing ones
  6. Refactor if needed — REFACTOR phase
  7. Verify tests still pass after refactor

FORBIDDEN for agent:
  ❌ Write src/ code before the test exists
  ❌ Modify tests to make them pass instead of fixing code
  ❌ Delete tests to resolve failures
  ❌ Mark tests as skipped (.skip) without explicit instruction
  ❌ Lower coverage thresholds to make CI pass

AGENT SIGNALS:
  <!-- TDD-VIOLATION: wrote implementation before test — needs review -->
  <!-- TEST-MISSING: no test covers this behavior — TASK incomplete -->
```

---

## 14. Violations

| Violation | Forbidden | Correct |
|-----------|-----------|---------|
| Test after code | `src/fn.ts` committed; tests in follow-up PR | Test file in same commit as `src/fn.ts` |
| Tests mirror implementation | `expect(add(1,2)).toBe(add(1,2))` | `expect(add(1,2)).toBe(3)` |
| Skipping Err branch | Only Ok cases tested | Both Ok and Err tested |
| Commented-out tests | `// it("should…")` | Delete or fix |
| `.skip` without reason | `it.skip("…")` | `it.skip("…", /* blocked: TASK-NNN */)` |
| Implementation details | `expect(internalFn).toHaveBeenCalled()` | Test observable output |
| Coverage exclusions | `/* c8 ignore next */` in production code | Fix the code path |
