# AI-Agent Rules for @resultsafe/core-fp-result

> Quick reference for AI agents and developers working on this package.
> Read this before modifying any code in `src/`.

---

## Quick Reference

| Task | Command |
|------|---------|
| Run tests | `pnpm test` |
| Run lint | `pnpm lint` |
| Auto-fix lint | `pnpm lint:fix` |
| TypeDoc check | `pnpm docs:api:check` |
| Build all | `pnpm build:all` |
| Verify release | `pnpm verify:release` |
| Add changeset | `pnpm changeset:add:result` (from root) |

---

## @since Rules

**ALL exported symbols MUST have `@since` tag.**

```typescript
/**
 * Represents the result of an operation.
 *
 * @typeParam T - The success type.
 * @typeParam E - The error type.
 * @since 0.1.8
 * @public
 */
export type Result<T, E> = ...
```

**ESLint auto-adds `@since`** with current version from `package.json` (currently `0.1.8`).

**Workflow:**
```bash
# 1. Write export with JSDoc
export const myFn = () => {};

# 2. Run auto-fix
pnpm lint:fix

# 3. Verify @since was added
pnpm lint  # should pass
```

---

## File Structure

```
src/
├── types/                    ← Type definitions
│   ├── core/
│   │   ├── Result.ts        # Main Result type
│   │   └── Option.ts        # Option type
│   └── refiners/
│       ├── VariantConfig.ts
│       ├── PayloadKeys.ts
│       ├── ValidatorFn.ts
│       └── AsyncValidatorFn.ts
├── constructors/
│   ├── Ok.ts                # Success constructor
│   └── Err.ts               # Error constructor
├── guards/
│   ├── isOk.ts              # Success type guard
│   ├── isErr.ts             # Error type guard
│   ├── isOkAnd.ts           # Success + predicate
│   └── isErrAnd.ts          # Error + predicate
├── methods/
│   ├── map.ts               # Transform success
│   ├── mapErr.ts            # Transform error
│   ├── andThen.ts           # Chain computations
│   ├── orElse.ts            # Recover from error
│   ├── match.ts             # Pattern matching
│   ├── tap.ts               # Side effect (success)
│   ├── tapErr.ts            # Side effect (error)
│   ├── flatten.ts           # Flatten nested Result
│   ├── inspect.ts           # Debug (success)
│   ├── inspectErr.ts        # Debug (error)
│   ├── unwrap.ts            # Extract or throw
│   ├── unwrapOr.ts          # Extract or default
│   ├── unwrapOrElse.ts      # Extract or compute
│   ├── unwrapErr.ts         # Extract error or throw
│   ├── expect.ts            # Extract or custom message
│   ├── expectErr.ts         # Extract error or message
│   ├── ok.ts                # To Option (success)
│   ├── err.ts               # To Option (error)
│   └── transpose.ts         # Result<Option> → Option<Result>
└── refiners/
    ├── refineResult.ts      # Synchronous refiner
    ├── refineAsyncResult.ts # Asynchronous refiner
    ├── refineVariantMap.ts  # Variant refinement
    └── types/               # Refiner type definitions
```

---

## Type Safety

### Local Type Definitions

`Result` and `Option` are defined **locally** in `src/types/core/`:

- `src/types/core/Result.ts` — main type definition
- `src/types/core/Option.ts` — option type definition

These are **not re-exports** — they are full definitions with complete JSDoc.
This ensures:
- Type safety for guard functions
- Complete documentation in TypeDoc output
- AI agents see full context without cross-package navigation

### Guard Functions

Guard functions must preserve TypeScript type narrowing:

```typescript
// ✅ Correct
export const isOk = <T, E>(
  result: Result<T, E>,
): result is { ok: true; value: T } => result.ok === true;

// ❌ Wrong — loses type narrowing
export const isOk = <T, E>(result: Result<T, E>): boolean => result.ok === true;
```

---

## JSDoc Requirements

Per [SPEC-003](../../../../docs/specs/SPEC-003-typedoc-documentation-standard.md):

| Element | Required |
|---------|----------|
| Summary (1-3 sentences) | ✅ |
| @typeParam (for generics) | ✅ |
| @param (for functions) | ✅ |
| @returns (for functions) | ✅ |
| @throws (if applicable) | ✅ |
| @since | ✅ (auto-added) |
| @example | ✅ |
| @public | ✅ |

**Language:** English only. No Russian, Chinese, or other languages.

---

## Testing Requirements

Per [SPEC-001](../../../../docs/specs/SPEC-001-tdd-development-standard.md):

- **TDD mandatory**: Write failing test first
- **Both branches**: Test Ok AND Err cases
- **Type-level tests**: For generic functions and guards
- **Contract compliance**: Reference SPEC-NNN in test comments

**Test structure:**
```
__tests__/
├── unit/
│   ├── constructors/
│   ├── guards/
│   ├── methods/
│   └── types/
└── integration/
    └── types/
```

---

## Signal Markers

Use these markers when human review is needed:

```markdown
<!-- @since-MISSING: export 'transform' has no @since tag -->
  Use when: ESLint rule is disabled or auto-fix failed

<!-- @since-OUTDATED: @since 0.1.0 but package is 0.1.8 -->
  Use when: Existing @since is older (DO NOT FIX — historical record)

<!-- TDD-VIOLATION: wrote implementation before test -->
  Use when: TDD sequence was broken

<!-- CONTRACT-MISSING: no SPEC for symbol X -->
  Use when: Implementing but no language-neutral contract exists

<!-- PARITY-VIOLATION: impl deviates from SPEC-NNN -->
  Use when: Implementation doesn't match contract
```

---

## Common Tasks

### Add new method

```bash
# 1. Create test file
touch __tests__/unit/methods/myMethod.test.ts

# 2. Write failing test (RED)
# 3. Write implementation (GREEN)
# 4. Run lint:fix (adds @since)
# 5. Run tests
pnpm test

# 6. Create changeset
cd ../../../../  # to monorepo root
pnpm changeset:add:result
```

### Update existing method

```bash
# 1. Update test
# 2. Update implementation
# 3. Update JSDoc (if signature changed)
# 4. Run all checks
pnpm test && pnpm lint && pnpm docs:api:check
```

### Debug type issues

```bash
# Check TypeDoc validation
pnpm docs:api:check

# Check TypeScript types
pnpm build:types

# Check exports
pnpm test __tests__/unit/exports/
```

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [SPEC-001](../../../../docs/specs/SPEC-001-tdd-development-standard.md) | TDD development standard |
| [SPEC-003](../../../../docs/specs/SPEC-003-typedoc-documentation-standard.md) | TypeDoc documentation rules |
| [AI_DOC_FRAMEWORK.md](../../../../AI_DOC_FRAMEWORK.md) | Monorepo documentation system |
| [DOMAIN.md](../../../../docs/core/DOMAIN.md) | Domain terminology |

---

## Package Context

**Purpose:** Functional programming Result type for error handling without exceptions.

**Core concept:** `Result<T, E>` is a discriminated union:
- `{ ok: true, value: T }` — success case
- `{ ok: false, error: E }` — error case

**Design principle:** Explicit error handling — caller MUST handle both cases.

**Inspired by:** Rust's `std::result::Result`
