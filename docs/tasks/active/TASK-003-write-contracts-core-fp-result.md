---
id: TASK-003
uuid: a1b2c3d4-e5f6-7890-abcd-000000000062
title: "Write language-neutral contracts for core-fp-result symbols"
status: active
layer: authored
lang: en
scope: monorepo
owner: Denis
created: 2026-03-26
updated: 2026-03-26
links: [SPEC-002, ADR-002]
package: "@resultsafe/core-fp-result"
---

# TASK-003: Write language-neutral contracts for core-fp-result symbols

> **Partial execution** — only for modules that exist in `packages/core/fp/result`.
> Based on canonical paths: `packages/core/fp/result/src/<category>/<Symbol>.ts`

## Context

`SPEC-010` (Result type contract) exists as the canonical reference.
`SPEC-002` defines all rules for writing contracts.
`ADR-002` established that contracts are the source of truth — all
language implementations follow contracts, not the other way around.

This task writes language-neutral contracts for **35 exported symbols** of
`@resultsafe/core-fp-result` that exist on disk. No implementations —
contracts only.

**Canonical paths:** `packages/core/fp/result/src/<category>/<Symbol>.ts`

**Categories:**
- `constructors/` — Ok, Err (2 symbols)
- `guards/` — isOk, isOkAnd, isErr, isErrAnd (4 symbols)
- `methods/` — map, mapErr, andThen, orElse, match, unwrap, unwrapOr, unwrapOrElse, unwrapErr, expect, expectErr, flatten, transpose, inspect, inspectErr, tap, tapErr, ok, err (19 symbols)
- `refiners/` — refineResult, refineResultU, refineAsyncResult, refineAsyncResultU, matchVariant, matchVariantStrict, isTypedVariant, isTypedVariantOf, refineVariantMap (9 symbols)

After this task is complete, TASK-004 will create TypeScript implementation
SPECs linking each contract.

Shell: **Windows PowerShell**. Run commands separately.
Monorepo root: `E:\10-projects\lib\resultsafe`

---

## Non-negotiable rules

1. No language syntax in any contract — no TypeScript, no Python
2. Use only vocabulary from `SPEC-002 §4` (see Vocabulary section below)
3. Every contract must cover both Ok and Err cases — no exceptions
4. Every contract must have edge cases including `Ok(null)` and `Err(null)`
5. Contracts describe **what**, never **how**
6. Do not modify any existing file
7. Do not run `git add`, `git commit`, or `git push`
8. Read `SPEC-002` fully before writing the first contract

---

## Before starting — read these files

```powershell
# Rules for writing contracts
Get-Content "E:\10-projects\lib\resultsafe\docs\specs\SPEC-002-language-neutral-contract-standard.md"

# Reference contract (the canonical example)
Get-Content "E:\10-projects\lib\resultsafe\docs\specs\contracts\SPEC-010-result-type-contract.md"

# Contract template
Get-Content "E:\10-projects\lib\resultsafe\docs\_templates\contract.md"

# Domain glossary — use these terms, not others
Get-Content "E:\10-projects\lib\resultsafe\docs\core\DOMAIN.md"

# Source to understand existing behavior
Get-Content "E:\10-projects\lib\resultsafe\packages\core\fp\result\src\index.ts"
```

For each symbol's source file before writing its contract:

```powershell
# Example: read map source
Get-Content "E:\10-projects\lib\resultsafe\packages\core\fp\result\src\methods\map.ts"
```

---

## Vocabulary reference (from SPEC-002 §4)

**Allowed:**

| Term | Meaning |
|------|---------|
| `Ok(value)` | success result carrying value |
| `Err(error)` | failure result carrying error |
| `value` | inner value of an Ok result |
| `error` | inner error of an Err result |
| `fn` | function argument |
| `result` | a Result argument |
| "returns Ok(X)" | output is success with inner X |
| "returns Err(X)" | output is failure with inner X |
| "returns result unchanged" | output identical to input |
| "calls fn exactly once with value" | fn invoked once |
| "does not call fn" | fn is never invoked |

**Forbidden:**

`result.ok` · `result.value` · `<T, E>` · `.map(fn)` · `async/await` ·
`Promise` · `Option` · `None` · `undefined` · implementation details

---

## Contracts to write

All files go in: `E:\10-projects\lib\resultsafe\docs\specs\contracts\`

**Total: 35 contracts** for existing symbols in `packages/core/fp/result/src/`

### Group 1 — Constructors (SPEC-011, SPEC-012)

| ID | File | Symbol | Source |
|----|------|--------|--------|
| SPEC-011 | `SPEC-011-ok-constructor-contract.md` | `Ok` | `src/constructors/Ok.ts` |
| SPEC-012 | `SPEC-012-err-constructor-contract.md` | `Err` | `src/constructors/Err.ts` |

---

### Group 2 — Guards (SPEC-013..016)

| ID | File | Symbol | Source |
|----|------|--------|--------|
| SPEC-013 | `SPEC-013-is-ok-contract.md` | `isOk` | `src/guards/isOk.ts` |
| SPEC-014 | `SPEC-014-is-ok-and-contract.md` | `isOkAnd` | `src/guards/isOkAnd.ts` |
| SPEC-015 | `SPEC-015-is-err-contract.md` | `isErr` | `src/guards/isErr.ts` |
| SPEC-016 | `SPEC-016-is-err-and-contract.md` | `isErrAnd` | `src/guards/isErrAnd.ts` |

---

### Group 3 — Transformation methods (SPEC-017..020)

| ID | File | Symbol | Source |
|----|------|--------|--------|
| SPEC-017 | `SPEC-017-map-contract.md` | `map` | `src/methods/map.ts` |
| SPEC-018 | `SPEC-018-map-err-contract.md` | `mapErr` | `src/methods/mapErr.ts` |
| SPEC-019 | `SPEC-019-and-then-contract.md` | `andThen` | `src/methods/andThen.ts` |
| SPEC-020 | `SPEC-020-or-else-contract.md` | `orElse` | `src/methods/orElse.ts` |

---

### Group 4 — Match (SPEC-021)

| ID | File | Symbol | Source |
|----|------|--------|--------|
| SPEC-021 | `SPEC-021-match-contract.md` | `match` | `src/methods/match.ts` |

---

### Group 5 — Unwrap family (SPEC-022..027)

| ID | File | Symbol | Source |
|----|------|--------|--------|
| SPEC-022 | `SPEC-022-unwrap-contract.md` | `unwrap` | `src/methods/unwrap.ts` |
| SPEC-023 | `SPEC-023-unwrap-or-contract.md` | `unwrapOr` | `src/methods/unwrapOr.ts` |
| SPEC-024 | `SPEC-024-unwrap-or-else-contract.md` | `unwrapOrElse` | `src/methods/unwrapOrElse.ts` |
| SPEC-025 | `SPEC-025-unwrap-err-contract.md` | `unwrapErr` | `src/methods/unwrapErr.ts` |
| SPEC-026 | `SPEC-026-expect-contract.md` | `expect` | `src/methods/expect.ts` |
| SPEC-027 | `SPEC-027-expect-err-contract.md` | `expectErr` | `src/methods/expectErr.ts` |

---

### Group 6 — Structure methods (SPEC-028, SPEC-029)

| ID | File | Symbol | Source |
|----|------|--------|--------|
| SPEC-028 | `SPEC-028-flatten-contract.md` | `flatten` | `src/methods/flatten.ts` |
| SPEC-029 | `SPEC-029-transpose-contract.md` | `transpose` | `src/methods/transpose.ts` |

---

### Group 7 — Side-effect methods (SPEC-030..033)

| ID | File | Symbol | Source |
|----|------|--------|--------|
| SPEC-030 | `SPEC-030-inspect-contract.md` | `inspect` | `src/methods/inspect.ts` |
| SPEC-031 | `SPEC-031-inspect-err-contract.md` | `inspectErr` | `src/methods/inspectErr.ts` |
| SPEC-032 | `SPEC-032-tap-contract.md` | `tap` | `src/methods/tap.ts` |
| SPEC-033 | `SPEC-033-tap-err-contract.md` | `tapErr` | `src/methods/tapErr.ts` |

> Note: `inspect`/`tap` are aliases. `inspectErr`/`tapErr` are aliases.

---

### Group 8 — Conversion methods (SPEC-034, SPEC-035)

| ID | File | Symbol | Source |
|----|------|--------|--------|
| SPEC-034 | `SPEC-034-ok-method-contract.md` | `ok` | `src/methods/ok.ts` |
| SPEC-035 | `SPEC-035-err-method-contract.md` | `err` | `src/methods/err.ts` |

---

### Group 9 — Refiners (SPEC-036..044)

| ID | File | Symbol | Source |
|----|------|--------|--------|
| SPEC-036 | `SPEC-036-refine-result-contract.md` | `refineResult` | `src/refiners/refineResult.ts` |
| SPEC-037 | `SPEC-037-refine-result-u-contract.md` | `refineResultU` | `src/refiners/refineResultU.ts` |
| SPEC-038 | `SPEC-038-refine-async-result-contract.md` | `refineAsyncResult` | `src/refiners/refineAsyncResult.ts` |
| SPEC-039 | `SPEC-039-refine-async-result-u-contract.md` | `refineAsyncResultU` | `src/refiners/refineAsyncResultU.ts` |
| SPEC-040 | `SPEC-040-match-variant-contract.md` | `matchVariant` | `src/refiners/matchVariant.ts` |
| SPEC-041 | `SPEC-041-match-variant-strict-contract.md` | `matchVariantStrict` | `src/refiners/matchVariantStrict.ts` |
| SPEC-042 | `SPEC-042-is-typed-variant-contract.md` | `isTypedVariant` | `src/refiners/isTypedVariant.ts` |
| SPEC-043 | `SPEC-043-is-typed-variant-of-contract.md` | `isTypedVariantOf` | `src/refiners/isTypedVariantOf.ts` |
| SPEC-044 | `SPEC-044-refine-variant-map-contract.md` | `refineVariantMap` | `src/refiners/refineVariantMap.ts` |

---

## Steps

### Step 1: Read all required files

Read in order:
1. `docs/specs/SPEC-002-language-neutral-contract-standard.md` — full
2. `docs/specs/contracts/SPEC-010-result-type-contract.md` — full (reference)
3. `docs/_templates/contract.md` — full
4. `docs/core/DOMAIN.md` — full
5. `packages/core/fp/result/src/index.ts` — to understand the full export surface

### Step 2: Write contracts Group 1 (constructors)

Create SPEC-011 and SPEC-012.

```powershell
Get-Content "E:\10-projects\lib\resultsafe\packages\core\fp\result\src\constructors\Ok.ts"
Get-Content "E:\10-projects\lib\resultsafe\packages\core\fp\result\src\constructors\Err.ts"
```

### Step 3: Write contracts Group 2 (guards)

Create SPEC-013 through SPEC-016.

```powershell
Get-ChildItem "E:\10-projects\lib\resultsafe\packages\core\fp\result\src\guards" |
  ForEach-Object { Get-Content $_.FullName }
```

### Step 4: Write contracts Groups 3–8 (methods)

Create SPEC-017 through SPEC-035.

```powershell
Get-ChildItem "E:\10-projects\lib\resultsafe\packages\core\fp\result\src\methods" |
  Select-Object Name
```

### Step 5: Write contracts Group 9 (refiners)

Create SPEC-036 through SPEC-044.

```powershell
Get-ChildItem "E:\10-projects\lib\resultsafe\packages\core\fp\result\src\refiners" |
  Select-Object Name
```

### Step 6: Update COUNTERS.md

```powershell
Get-Content "E:\10-projects\lib\resultsafe\docs\registry\COUNTERS.md"
```

Update the contract ID range row:
- `SPEC-010+ contracts` → next number is `045`

### Step 7: Update MANIFEST.md contracts table

Open `docs/MANIFEST.md`.
In the "API Contracts" table, update all rows from `— draft in progress`
to `canonical` with links to the created files.

### Step 8: Update CHANGELOG.md

Add entry:

```markdown
## [YYYY-MM-DD] — Language-neutral contracts written for core-fp-result

- Created SPEC-011..044: contracts for 35 exported symbols
- All contracts are language-neutral, no TypeScript syntax
- ref: TASK-003-write-contracts-core-fp-result
```

---

## Quality check for each contract before saving

Before saving any contract file, verify:

- [ ] No TypeScript syntax: no `<T>`, no `.property`, no `result.ok`
- [ ] No Python syntax: no `Result[T]`, no `Optional`
- [ ] Both Ok and Err cases covered in Behavior section
- [ ] Edge case table includes `Ok(null)` and `Err(null)`
- [ ] Parity requirements section is non-empty
- [ ] Implementations table lists TypeScript as `✅ implemented` or `🔧 pending`
- [ ] `uuid:` is unique and non-empty
- [ ] `symbol:` frontmatter field is set
- [ ] `category:` frontmatter field is set
- [ ] `links:` includes at minimum `[SPEC-002]`

---

## Do not touch

| Path | Reason |
|------|--------|
| `packages/*/src/` | source code — read only |
| `docs/RULES.md` | protected |
| `docs/specs/SPEC-001.md` | already complete |
| `docs/specs/SPEC-002.md` | already complete |
| `docs/specs/contracts/SPEC-010-*.md` | already complete |

---

## Completion criteria

### Constructors (2)
- [ ] SPEC-011 `Ok` — canonical
- [ ] SPEC-012 `Err` — canonical

### Guards (4)
- [ ] SPEC-013 `isOk` — canonical
- [ ] SPEC-014 `isOkAnd` — canonical
- [ ] SPEC-015 `isErr` — canonical
- [ ] SPEC-016 `isErrAnd` — canonical

### Transformation methods (4)
- [ ] SPEC-017 `map` — canonical
- [ ] SPEC-018 `mapErr` — canonical
- [ ] SPEC-019 `andThen` — canonical
- [ ] SPEC-020 `orElse` — canonical

### Match (1)
- [ ] SPEC-021 `match` — canonical

### Unwrap family (6)
- [ ] SPEC-022 `unwrap` — canonical
- [ ] SPEC-023 `unwrapOr` — canonical
- [ ] SPEC-024 `unwrapOrElse` — canonical
- [ ] SPEC-025 `unwrapErr` — canonical
- [ ] SPEC-026 `expect` — canonical
- [ ] SPEC-027 `expectErr` — canonical

### Structure methods (2)
- [ ] SPEC-028 `flatten` — canonical
- [ ] SPEC-029 `transpose` — canonical

### Side-effect methods (4)
- [ ] SPEC-030 `inspect` — canonical
- [ ] SPEC-031 `inspectErr` — canonical
- [ ] SPEC-032 `tap` — canonical
- [ ] SPEC-033 `tapErr` — canonical

### Conversion methods (2)
- [ ] SPEC-034 `ok` — canonical
- [ ] SPEC-035 `err` — canonical

### Refiners (9)
- [ ] SPEC-036 `refineResult` — canonical
- [ ] SPEC-037 `refineResultU` — canonical
- [ ] SPEC-038 `refineAsyncResult` — canonical
- [ ] SPEC-039 `refineAsyncResultU` — canonical
- [ ] SPEC-040 `matchVariant` — canonical
- [ ] SPEC-041 `matchVariantStrict` — canonical
- [ ] SPEC-042 `isTypedVariant` — canonical
- [ ] SPEC-043 `isTypedVariantOf` — canonical
- [ ] SPEC-044 `refineVariantMap` — canonical

### Quality checks
- [ ] All 35 contracts: no language syntax (no TypeScript, no Python)
- [ ] All 35 contracts: unique UUID
- [ ] All 35 contracts: Ok AND Err cases covered
- [ ] All 35 contracts: edge case table with null values
- [ ] `docs/registry/COUNTERS.md` contract range updated to 045
- [ ] `docs/MANIFEST.md` contracts table updated
- [ ] `docs/CHANGELOG.md` entry added
- [ ] This task moved to `docs/tasks/done/TASK-003-write-contracts-core-fp-result.md`
