---
id: SPEC-003
uuid: a1b2c3d4-e5f6-7890-abcd-000000000051
title: "TypeDoc Documentation Standard"
status: review
layer: authored
lang: en
scope: monorepo
owner: Denis
created: 2026-03-26
updated: 2026-03-26
---

# TypeDoc Documentation Standard

> Single source of truth for all JSDoc documentation in the resultsafe monorepo.
> Applies to ALL packages without exception.
> All documentation MUST be in English only.

## Table of Contents

| § | Section |
|---|---------|
| [1](#1-scope) | Scope |
| [2](#2-comment-structure) | Comment Structure |
| [3](#3-summary) | Summary |
| [4](#4-markdown-not-html) | Markdown, Not HTML |
| [5](#5-typeparam) | @typeParam |
| [6](#7-see-and-link) | @see and {@link} |
| [7](#8-example) | @example |
| [8](#9-remarks) | @remarks |
| [9](#10-deprecated) | @deprecated |
| [10](#11-since) | @since |
| [11](#12-typography) | Typography |
| [12](#13-canonical-example) | Canonical Example |
| [13](#14-typedoc-configuration) | TypeDoc Configuration |
| [14](#15-ci-enforcement) | CI Enforcement |
| [15](#16-language-rule) | Language Rule |

---

## 1. Scope

These rules apply to every **exported** symbol: types, interfaces, functions, constants, classes, and enums. Internal utilities (not exported or marked `@internal`) require only a single-line summary.

Re-exports (`export { X } from "./module"`) do not need their own comment if the original symbol is documented.

---

## 2. Comment Structure

A JSDoc comment has two regions: the **summary** (all text before the first block tag) and the **block tags** (everything from the first `@tag` onward). This distinction matters because TypeDoc uses the summary text on module index pages.

TypeDoc does not enforce tag order — tags can appear in any sequence and the output is determined by the theme, not by comment order. However, for consistency across the codebase, use this convention:

```
1. Summary          all text before the first block tag
2. @typeParam       (only if the symbol has generics)
3. @remarks         extended explanation, edge cases, constraints (if needed)
4. @param           (functions only, one per parameter)
5. @returns         (functions only)
6. @throws          (functions only, if applicable)
7. @defaultValue    (optional properties or parameters with defaults)
8. @deprecated      (if applicable)
9. @since           version when the symbol was introduced
10. @see            cross-references to related symbols
11. @example        runnable code block
12. @public | @internal | @alpha | @beta | @experimental (modifier tag)
```

Modifier tags (`@public`, `@internal`, etc.) have no associated content and can appear anywhere in the comment. Placing them at the end keeps the summary visually prominent.

### Tags you must NOT use in TypeScript files

Do not use `@type`, `@typedef`, `@callback` — the TypeScript compiler infers these from code. Using them creates redundancy and risks drift between comment and actual type.

Do not use `@description` — it is not in TypeDoc's default recognized block tags and will produce a warning. The summary paragraph (text before the first block tag) is the description.

Do not use `@template` — it is a JSDoc alias for `@typeParam`. TypeDoc documentation states: "For TypeScript projects, the TSDoc standard `@typeParam` tag should be preferred."

Note: `@property`/`@prop` is a supported TypeDoc block tag, but only use it with `@interface` or `@namespace` where there is no convenient place to document each member directly.

---

## 3. Summary

The summary is all text before the first block tag.

On module index pages, the `@summary` block tag controls what text appears. If no `@summary` tag is present but `useFirstParagraphOfCommentAsSummary` is enabled in `typedoc.json`, TypeDoc uses only the first paragraph. The exact behavior depends on this option and the theme.

Rules:

- One to three sentences for the first paragraph. Keep it scannable.
- Start with a verb in third person: "Represents…", "Creates…", "Transforms…".
- Do not repeat the symbol name. The reader already sees it.
- Wrap type parameter names in backticks: `` `T` ``, `` `E` ``.
- No HTML in the summary. Some consumers (VS Code hover, npm README) may not render HTML as expected.

---

## 4. Markdown, Not HTML

TypeDoc parses comments through markdown-it. Use Markdown for all formatting:

- **Bold**: `**text**` — not `<b>`.
- *Italic*: `*text*` — not `<i>`.
- Code: `` `code` `` — not `<code>`.
- Paragraphs: blank line between blocks — not `<br/>`.
- Links: `{@link SymbolName}` for internal, `[text](url)` for external.

Avoid raw HTML (`<br/>`, `<p>`, `<table>`) in comments. It renders in TypeDoc HTML output but may not render as expected in VS Code hover, GitHub preview, and other non-HTML consumers.

---

## 5. @typeParam

Use `@typeParam` (the TSDoc standard) for all type parameter documentation. Do not use `@template` in TypeScript projects.

Format: `@typeParam T - Description starting with capital letter, ending with period.`

Always describe the constraint if one exists:

```ts
/**
 * @typeParam T - The input type. Must be serializable.
 * @typeParam E - The error type. Defaults to `Error`.
 */
```

---

## 6. @see and {@link}

`@see` is a block tag — it goes on its own line and creates a list of references to related resources:

```ts
/**
 * @see {@link Ok} — Constructs a successful result.
 * @see {@link Err} — Constructs an error result.
 */
```

`{@link}` is an inline tag — use it inside sentences:

```ts
/**
 * This is the inverse of {@link encode}.
 */
```

Use `{@link SymbolName | display text}` when the symbol name alone is unclear:

```ts
/**
 * @see {@link Result | The Result type} for the full union.
 */
```

TypeDoc resolves `{@link}` using TypeScript's own resolution by default (controlled by `useTsLinkResolution`). TypeDoc does not support JSDoc namepaths in `@link` tags — an explicit `{@link}` is always required inside `@see`.

---

## 7. @example

Every exported function, class, type alias, and interface must have at least one `@example` block. Simple constants and enum members do not require `@example` unless the usage is non-obvious.

Use a fenced code block with the `ts` language tag:

```ts
/**
 * @example
 * ```ts
 * const result: Result<number, string> = Ok(42);
 *
 * if (result.ok) {
 *   console.log(result.value); // 42
 * }
 * ```
 */
```

Rules:

- The code must compile.
- Show the import if the symbol comes from a different module.
- Show expected output in a comment after the expression.
- One example per `@example` tag. Multiple scenarios get separate `@example` blocks.
- Always use a fenced code block. Without one, TypeDoc's JSDoc compatibility mode (`jsDocCompatibility.exampleTag`) treats the entire tag content as code, which may produce unexpected rendering.

---

## 8. @remarks

Use `@remarks` to separate a short summary from extended details. The default TypeDoc theme renders `@remarks` content under a "Remarks" heading on the symbol's page. The default theme does **not** split content between an index page and a detail page based on this tag — it simply renders the block with a heading.

```ts
/**
 * Transforms the success value of a result using the provided function.
 *
 * @remarks
 * If the result is an `Err`, the function is not called and the error
 * passes through unchanged. This is equivalent to `flatMap` when the
 * mapping function always returns `Ok`.
 *
 * Complexity: O(1).
 */
```

If the comment fits in three sentences, skip `@remarks` and put everything in the summary.

---

## 9. @deprecated

Mark deprecated symbols with `@deprecated` and always state what to use instead:

```ts
/**
 * @deprecated Use {@link Result} instead. Will be removed in v3.0.
 */
```

TypeDoc renders members marked with `@deprecated` with a line through their name. VS Code also shows strikethrough.

---

## 10. @since

Tag new public API additions with the version they were introduced:

```ts
/**
 * @since 1.2.0
 */
```

---

## 11. Typography

- Use an em dash `—` (not a hyphen `-` or en dash `–`) for parenthetical remarks and after `@see` labels.
- Wrap type parameter names, values, and code references in backticks.
- End all tag descriptions with a period.
- No trailing whitespace on any line.

---

## 12. Canonical Example

```ts
/**
 * Represents the result of an operation that can either succeed with a
 * value of type `T` or fail with an error of type `E`.
 *
 * @typeParam T - The type of the success value.
 * @typeParam E - The type of the error.
 *
 * @remarks
 * `Result` is the core type of this library. Pattern match on the `ok`
 * field to narrow the union, then access `value` or `error` safely.
 *
 * Unlike exceptions, `Result` makes the failure path explicit in the
 * type signature, forcing the caller to handle both outcomes.
 *
 * @see {@link Ok} — Constructs a successful result.
 * @see {@link Err} — Constructs an error result.
 * @see {@link isOk} — Type guard for the success case.
 * @see {@link isErr} — Type guard for the error case.
 *
 * @example
 * ```ts
 * import { Result, Ok, Err } from "@monorepa/fp-result";
 *
 * function divide(a: number, b: number): Result<number, string> {
 *   if (b === 0) return Err("Division by zero");
 *   return Ok(a / b);
 * }
 *
 * const result = divide(10, 2);
 *
 * if (result.ok) {
 *   console.log(result.value); // 5
 * } else {
 *   console.error(result.error);
 * }
 * ```
 *
 * @public
 */
export type Result<T, E> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };
```

---

## 13. TypeDoc Configuration

Recommended `typedoc.json`:

```json
{
  "$schema": "https://typedoc.org/schema.json",
  "entryPoints": ["src/index.ts"],
  "out": "docs/api",
  "excludeInternal": true,
  "excludePrivate": true,
  "categorizeByGroup": true,
  "useFirstParagraphOfCommentAsSummary": true,
  "sort": ["source-order"],
  "validation": {
    "notExported": true,
    "invalidLink": true,
    "invalidPath": true,
    "rewrittenLink": true,
    "notDocumented": true,
    "unusedMergeModuleWith": true
  },
  "requiredToBeDocumented": [
    "Enum",
    "EnumMember",
    "Variable",
    "Function",
    "Class",
    "Interface",
    "Property",
    "Method",
    "Accessor",
    "TypeAlias"
  ],
  "treatValidationWarningsAsErrors": true,
  "jsDocCompatibility": {
    "exampleTag": true,
    "defaultTag": true,
    "inheritDocTag": true,
    "ignoreUnescapedBraces": false
  }
}
```

To generate Markdown output instead of HTML, add the third-party plugin:

```json
{
  "plugin": ["typedoc-plugin-markdown"]
}
```

Key settings:

- `validation.notDocumented: true` — warns on any exported symbol missing a doc comment. Off by default — must be explicitly enabled.
- `validation.invalidLink: true` — catches broken `{@link}` references at build time.
- `validation.invalidPath: true` — warns on relative links that do not resolve to a file.
- `validation.rewrittenLink: true` — warns when a `{@link}` target has no unique URL and gets rewritten.
- `requiredToBeDocumented` — controls which symbol kinds trigger `notDocumented` warnings. The list above matches TypeDoc's defaults.
- `excludeInternal: true` — symbols marked `@internal` are stripped from output.
- `useFirstParagraphOfCommentAsSummary: true` — uses only the first paragraph on module index pages instead of the entire summary text.
- `treatValidationWarningsAsErrors: true` — makes validation warnings fail the build in CI.

---

## 14. CI Enforcement

Add these checks to CI:

**Mandatory (blocks merge):**

- `typedoc --emit none` — runs TypeDoc in validation-only mode. Converts the project and runs all validation checks without generating output files. Combined with `treatValidationWarningsAsErrors: true`, this fails on missing docs, broken links, and unknown tags.
- ESLint with `eslint-plugin-jsdoc` — enforces tag presence, order, and format. Key rules: `jsdoc/require-description`, `jsdoc/require-example`, `jsdoc/check-tag-names`, `jsdoc/require-param-description`.

**Recommended (warning, does not block):**

- Custom script that checks all `@example` blocks compile (extract fenced blocks, run `tsc --noEmit`).
- Spell checker on doc comments (cspell or similar).

---

## 15. Language Rule

**All TypeDoc documentation MUST be in English only.**

- No Russian, Chinese, Spanish, or other languages allowed in JSDoc comments.
- This rule applies to all packages in the monorepo without exception.
- The summary, all block tags, and all descriptions must be written in English.
- This ensures consistency across the codebase and enables international collaboration.

**Rationale:**

- English is the lingua franca of software development.
- TypeDoc output is often consumed by international users.
- Mixed-language documentation creates confusion and maintenance burden.
- Tooling (spell checkers, linters) works best with a single language.

**Enforcement:**

- ESLint with `eslint-plugin-jsdoc` can be configured with custom rules to detect non-English text.
- Code review should reject any JSDoc comments containing non-English text.
- TypeDoc validation may include language detection in the future.

---

## 16. @since Automation

### 16.1 ESLint Rule

The monorepo uses a custom ESLint plugin `@resultsafe/eslint-plugin` with the
`require-since-version` rule to automate `@since` tag management.

**What it does:**
- Checks all exported symbols have `@since` tag
- Auto-fixes by adding `@since {version}` from package.json
- Validates version format (semver)
- Allows `@since Next` for unreleased changes

**Configuration:**
```javascript
// eslint.config.mjs
'@resultsafe/require-since-version': 'error'
```

**Auto-fix behavior:**
```bash
# Run lint with auto-fix
pnpm lint:fix

# Before:
/**
 * My function.
 * @returns Something.
 */
export const myFn = () => {};

# After:
/**
 * My function.
 * @returns Something.
 * @since 0.1.8
 */
export const myFn = () => {};
```

### 16.2 Migration Script

For existing code without `@since` tags, use the migration script:

```bash
# Dry run (preview changes)
node scripts/migrate-since-tags.mjs --dry-run

# Apply changes
node scripts/migrate-since-tags.mjs
```

The script:
- Scans all TypeScript files in `src/`
- Finds exports without `@since`
- Adds `@since {version}` before `@public` or closing `*/`
- Preserves existing JSDoc structure

### 16.3 Changesets Integration

When creating a changeset for API changes:

```bash
# From monorepo root
pnpm changeset:add:result
```

The changeset system:
- Tracks which packages have API changes
- Bumps version according to semver (major/minor/patch)
- Updates CHANGELOG.md automatically
- On release, replaces `@since Next` with actual version

### 16.4 Developer Workflow

```bash
# 1. Write new export with JSDoc
/**
 * Transforms the success value.
 * @typeParam T - Input type.
 * @typeParam U - Output type.
 * @param result - The Result to transform.
 * @param fn - Transform function.
 * @returns Transformed Result.
 */
export const transform = <T, U, E>(...) => {...};

# 2. Run lint (auto-adds @since)
pnpm lint --fix

# 3. Verify
pnpm lint  # should pass
pnpm test   # should pass
```

### 16.5 AI-Agent Rules

When writing or modifying exports, AI agents must follow these rules:

**MANDATORY:**
- ✅ Add `@since` tag to all new exports
- ✅ Use current package version from package.json (e.g., `@since 0.1.8`)
- ✅ Use `@since Next` for unreleased features in development branches
- ✅ Run `pnpm lint:fix` to auto-add missing `@since` tags

**FORBIDDEN:**
- ❌ Export without `@since` tag
- ❌ `@since` version less than current package version
- ❌ Manual version updates (let automation handle it)
- ❌ Remove or modify existing `@since` tags (they are immutable)

**SIGNAL MARKERS:**
```markdown
<!-- @since-MISSING: export 'transform' has no @since tag -->
  Use when: ESLint rule is disabled or auto-fix failed

<!-- @since-OUTDATED: @since 0.1.0 but package is 0.1.8 -->
  Use when: Existing @since is older than current version
  Action: Do not fix — existing @since is correct (historical record)

<!-- @since-NEXT-REPLACED: replaced Next with 0.1.8 on release -->
  Use when: Changeset hook replaces @since Next with actual version
```

### 16.6 Version Synchronization

| Source | Version | Updated by |
|--------|---------|------------|
| `package.json` | `0.1.8` | `changeset version` |
| `@since` tag | `0.1.8` | ESLint auto-fix / migration script |
| CHANGELOG.md | `[0.1.8]` | `changeset version` |
| Git tag | `v0.1.8` | Release script |

All versions must be synchronized before release. The release script validates this.

---

## 17. When to Update Documentation

A doc comment must be updated in the same PR that changes:

- The symbol's type signature.
- The symbol's behavior (even if the signature is unchanged).
- The symbol's deprecation status.

Reviewers should treat an outdated doc comment as a blocking issue, same as a failing test.
