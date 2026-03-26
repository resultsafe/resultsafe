# @resultsafe/core-fp-result
<a id="top"></a>

![ResultSafe Logo](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/docs/assets/logo.svg)

[![npm version](https://img.shields.io/npm/v/@resultsafe/core-fp-result.svg)](https://www.npmjs.com/package/@resultsafe/core-fp-result)
[![npm downloads](https://img.shields.io/npm/dm/@resultsafe/core-fp-result.svg)](https://www.npmjs.com/package/@resultsafe/core-fp-result)
[![license](https://img.shields.io/npm/l/@resultsafe/core-fp-result.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://www.typescriptlang.org/)
[![docs](https://img.shields.io/badge/docs-api-informational.svg)](https://unpkg.com/@resultsafe/core-fp-result@latest/docs/api/README.md)
[![build status](https://img.shields.io/badge/build-local%20verified-success.svg)](./package.json)
[![monorepo](https://img.shields.io/badge/monorepo-resultsafe%2Fmonorepo-0A0A0A.svg)](https://github.com/Livooon/resultsafe)

A Rust-inspired Result package for explicit, composable, and type-friendly APIs in TypeScript and JavaScript.

**Language:** English | [Русский](https://github.com/resultsafe/monorepo/blob/main/packages/core/fp/result/README.ru.md)

**Documentation:** [API index](https://unpkg.com/@resultsafe/core-fp-result@latest/docs/api/README.md) · [Modules](https://unpkg.com/@resultsafe/core-fp-result@latest/docs/api/modules.md)

---
## Contents

- [Why this package](#why-this-package)
- [Monorepo context](#monorepo-context)
- [Key features](#key-features)
- [Package](#package)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Core API overview](#core-api-overview)
- [Build and distribution formats](#build-and-distribution-formats)
- [Monorepo and package structure](#monorepo-and-package-structure)
- [When to use this project](#when-to-use-this-project)
- [Documentation links](#documentation-links)
- [License](#license)

---

## Why this package

`@resultsafe/core-fp-result` provides explicit success/error flows instead of hidden control paths and exception-first branching.

Its core package, [`@resultsafe/core-fp-result`](https://www.npmjs.com/package/@resultsafe/core-fp-result), provides a Rust-inspired `Result` API for TypeScript and JavaScript with:

- explicit `Ok` / `Err`
- predictable functional composition
- safe branching through guards and matching
- disciplined extraction APIs
- advanced refinement utilities for typed variants and strict matching

The goal is not to imitate Rust mechanically, but to bring the same clarity of intent to Node.js libraries: explicit values, predictable branching, and APIs organized for long-term maintenance.

---

## Monorepo context

`@resultsafe/core-fp-result` is the TypeScript/JavaScript package inside the multilingual `resultsafe/monorepo`.

The monorepo applies shared Rust-inspired design concepts across language-specific packages. TypeScript/JavaScript is the current production package track, while Python is planned as a separate package track with the same conceptual model.

---

## Key features

- Rust-inspired `Result` model for TypeScript and JavaScript.
- Explicit constructors via `Ok` and `Err`.
- Composable transformations with APIs such as `map`, `mapErr`, `andThen`, and `orElse`.
- Safe branching through guards like `isOk`, `isErr`, `isOkAnd`, `isErrAnd`, and matching helpers.
- Controlled extraction with `unwrap`, `unwrapOr`, `unwrapErr`, `expect`, and `expectErr`.
- Advanced refinement layer for typed variants, strict matching, and result narrowing.
- Coherent module structure instead of a flat utility dump.
- Type output for TypeScript users for better DX and safer integrations.
- Flexible distribution formats with Types, ESM, CJS, and UMD builds.

---

## Package

### `@resultsafe/core-fp-result`

A focused Result library for explicit error handling and FP-style composition.

It is designed for developers who want:

- clear success/error modeling
- predictable transformations
- explicit branching and extraction
- better readability in error-heavy flows
- a structured Rust-inspired API surface in TypeScript/JavaScript

---

## Installation

### Package

```bash
pnpm add @resultsafe/core-fp-result

# Alternative
npm install @resultsafe/core-fp-result
```

### Monorepo

```bash
pnpm install
```

---

## Quick start

A typical Result flow starts with explicit constructors and then composes through functions rather than implicit exception paths.

```ts
import {
  Ok,
  map,
  unwrapOr,
} from "@resultsafe/core-fp-result";

const initial = Ok(21);
const doubled = map(initial, (value) => value * 2);
const finalValue = unwrapOr(doubled, 0);

console.log(finalValue); // 42
```

### Basic `Ok` / `Err` example

```ts
import { Ok, Err, match } from "@resultsafe/core-fp-result";

const parsePort = (input: string) => {
  const port = Number(input);
  return Number.isInteger(port) && port > 0
    ? Ok(port)
    : Err("Invalid port");
};

const result = parsePort("3000");
const message = match(result, (value) => `Port: ${value}`, (error) => `Error: ${error}`);

console.log(message);
```

---

<!-- AI-AGENT: Each function has 3 links: Source (GitHub UI), Raw (direct code), Code (new UI) -->
<!-- Raw links are best for automated code analysis and parsing -->

## Core API overview

### Core Types

- [`Result<T, E>`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/types/core/Result.ts) — Success/failure container [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/types/core/Result.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/types/core/Result.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/types/core/Result.ts "Open in Code view")
- [`Option<T>`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/types/core/Option.ts) — Optional value container [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/types/core/Option.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/types/core/Option.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/types/core/Option.ts "Open in Code view")

### Type Helpers

- [`VariantConfig`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/types/refiners/VariantConfig.ts) — Variant configuration [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/types/refiners/VariantConfig.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/types/refiners/VariantConfig.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/types/refiners/VariantConfig.ts "Open in Code view")
- [`PayloadKeys<T>`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/types/refiners/PayloadKeys.ts) — Extract payload keys [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/types/refiners/PayloadKeys.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/types/refiners/PayloadKeys.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/types/refiners/PayloadKeys.ts "Open in Code view")
- [`ValidatorFn<T>`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/types/refiners/ValidatorFn.ts) — Sync validator function [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/types/refiners/ValidatorFn.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/types/refiners/ValidatorFn.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/types/refiners/ValidatorFn.ts "Open in Code view")
- [`AsyncValidatorFn`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/types/refiners/AsyncValidatorFn.ts) — Async validator function [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/types/refiners/AsyncValidatorFn.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/types/refiners/AsyncValidatorFn.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/types/refiners/AsyncValidatorFn.ts "Open in Code view")

### Constructors

- [`Ok`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/constructors/Ok.ts) — Create success result [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/constructors/Ok.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/constructors/Ok.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/constructors/Ok.ts "Open in Code view")
- [`Err`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/constructors/Err.ts) — Create error result [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/constructors/Err.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/constructors/Err.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/constructors/Err.ts "Open in Code view")

### Guards

- [`isOk`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/guards/isOk.ts) — Check if success [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/guards/isOk.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/guards/isOk.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/guards/isOk.ts "Open in Code view")
- [`isErr`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/guards/isErr.ts) — Check if error [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/guards/isErr.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/guards/isErr.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/guards/isErr.ts "Open in Code view")
- [`isOkAnd`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/guards/isOkAnd.ts) — Check success with predicate [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/guards/isOkAnd.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/guards/isOkAnd.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/guards/isOkAnd.ts "Open in Code view")
- [`isErrAnd`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/guards/isErrAnd.ts) — Check error with predicate [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/guards/isErrAnd.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/guards/isErrAnd.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/guards/isErrAnd.ts "Open in Code view")

### Methods

#### Transformation

- [`map`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/map.ts) — Transform success value [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/map.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/methods/map.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/methods/map.ts "Open in Code view")
- [`mapErr`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/mapErr.ts) — Transform error value [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/mapErr.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/methods/mapErr.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/methods/mapErr.ts "Open in Code view")

#### Chaining

- [`andThen`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/andThen.ts) — Chain computations returning Result [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/andThen.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/methods/andThen.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/methods/andThen.ts "Open in Code view")
- [`orElse`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/orElse.ts) — Recover from error [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/orElse.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/methods/orElse.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/methods/orElse.ts "Open in Code view")

#### Extraction

- [`unwrap`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/unwrap.ts) — Extract value or throw [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/unwrap.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/methods/unwrap.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/methods/unwrap.ts "Open in Code view")
- [`unwrapOr`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/unwrapOr.ts) — Extract value or default [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/unwrapOr.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/methods/unwrapOr.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/methods/unwrapOr.ts "Open in Code view")
- [`unwrapOrElse`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/unwrapOrElse.ts) — Extract value or compute default [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/unwrapOrElse.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/methods/unwrapOrElse.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/methods/unwrapOrElse.ts "Open in Code view")
- [`unwrapErr`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/unwrapErr.ts) — Extract error or throw [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/unwrapErr.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/methods/unwrapErr.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/methods/unwrapErr.ts "Open in Code view")
- [`expect`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/expect.ts) — Extract value or throw with message [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/expect.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/methods/expect.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/methods/expect.ts "Open in Code view")
- [`expectErr`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/expectErr.ts) — Extract error or throw with message [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/expectErr.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/methods/expectErr.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/methods/expectErr.ts "Open in Code view")

#### Side Effects

- [`tap`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/tap.ts) — Side effect on success [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/tap.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/methods/tap.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/methods/tap.ts "Open in Code view")
- [`tapErr`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/tapErr.ts) — Side effect on error [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/tapErr.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/methods/tapErr.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/methods/tapErr.ts "Open in Code view")
- [`inspect`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/inspect.ts) — Debug on success [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/inspect.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/methods/inspect.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/methods/inspect.ts "Open in Code view")
- [`inspectErr`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/inspectErr.ts) — Debug on error [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/inspectErr.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/methods/inspectErr.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/methods/inspectErr.ts "Open in Code view")

#### Advanced

- [`match`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/match.ts) — Pattern matching [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/match.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/methods/match.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/methods/match.ts "Open in Code view")
- [`flatten`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/flatten.ts) — Flatten nested Result [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/flatten.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/methods/flatten.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/methods/flatten.ts "Open in Code view")
- [`transpose`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/transpose.ts) — Result<Option> → Option<Result> [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/transpose.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/methods/transpose.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/methods/transpose.ts "Open in Code view")
- [`ok`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/ok.ts) — Convert to Option (success) [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/ok.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/methods/ok.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/methods/ok.ts "Open in Code view")
- [`err`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/err.ts) — Convert to Option (error) [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/methods/err.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/methods/err.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/methods/err.ts "Open in Code view")

### Refiners

- [`isTypedVariant`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/isTypedVariant.ts) — Type guard for variant [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/isTypedVariant.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/refiners/isTypedVariant.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/refiners/isTypedVariant.ts "Open in Code view")
- [`isTypedVariantOf`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/isTypedVariantOf.ts) — Type guard with variant map [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/isTypedVariantOf.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/refiners/isTypedVariantOf.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/refiners/isTypedVariantOf.ts "Open in Code view")
- [`matchVariant`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/matchVariant.ts) — Match variant with handlers [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/matchVariant.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/refiners/matchVariant.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/refiners/matchVariant.ts "Open in Code view")
- [`matchVariantStrict`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/matchVariantStrict.ts) — Strict variant matching [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/matchVariantStrict.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/refiners/matchVariantStrict.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/refiners/matchVariantStrict.ts "Open in Code view")
- [`refineAsyncResult`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/refineAsyncResult.ts) — Async result refinement [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/refineAsyncResult.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/refiners/refineAsyncResult.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/refiners/refineAsyncResult.ts "Open in Code view")
- [`refineAsyncResultU`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/refineAsyncResultU.ts) — Async refinement (uncurried) [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/refineAsyncResultU.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/refiners/refineAsyncResultU.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/refiners/refineAsyncResultU.ts "Open in Code view")
- [`refineResult`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/refineResult.ts) — Synchronous result refinement [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/refineResult.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/refiners/refineResult.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/refiners/refineResult.ts "Open in Code view")
- [`refineResultU`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/refineResultU.ts) — Synchronous refinement (uncurried) [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/refineResultU.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/refiners/refineResultU.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/refiners/refineResultU.ts "Open in Code view")
- [`refineVariantMap`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/refineVariantMap.ts) — Refine variant map [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/refineVariantMap.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/refiners/refineVariantMap.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/refiners/refineVariantMap.ts "Open in Code view")

### Type aliases

- [`Handler`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/types/Handler.ts) — Match handler type [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/types/Handler.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/refiners/types/Handler.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/refiners/types/Handler.ts "Open in Code view")
- [`MatchBuilder`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/types/MatchBuilder.ts) — Match builder type [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/types/MatchBuilder.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/refiners/types/MatchBuilder.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/refiners/types/MatchBuilder.ts "Open in Code view")
- [`Matcher`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/types/Matcher.ts) — Matcher function type [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/types/Matcher.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/refiners/types/Matcher.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/refiners/types/Matcher.ts "Open in Code view")
- [`SyncRefinedResult`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/types/SyncRefinedResult.ts) — Synchronous refined result [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/types/SyncRefinedResult.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/refiners/types/SyncRefinedResult.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/refiners/types/SyncRefinedResult.ts "Open in Code view")
- [`SyncRefinedResultUnion`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/types/SyncRefinedResultUnion.ts) — Union of refined results [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/types/SyncRefinedResultUnion.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/refiners/types/SyncRefinedResultUnion.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/refiners/types/SyncRefinedResultUnion.ts "Open in Code view")
- [`SyncValidatorMap`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/types/SyncValidatorMap.ts) — Validator map type [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/types/SyncValidatorMap.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/refiners/types/SyncValidatorMap.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/refiners/types/SyncValidatorMap.ts "Open in Code view")
- [`UniversalAsyncRefinedResult`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/types/UniversalAsyncRefinedResult.ts) — Async refined result [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/types/UniversalAsyncRefinedResult.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/refiners/types/UniversalAsyncRefinedResult.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/refiners/types/UniversalAsyncRefinedResult.ts "Open in Code view")
- [`UniversalRefinedResult`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/types/UniversalRefinedResult.ts) — Universal refined result [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/types/UniversalRefinedResult.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/refiners/types/UniversalRefinedResult.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/refiners/types/UniversalRefinedResult.ts "Open in Code view")
- [`VariantOf`](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/types/VariantOf.ts) — Variant type helper [📄](https://github.com/Livooon/resultsafe/blob/main/packages/core/fp/result/src/refiners/types/VariantOf.ts "View on GitHub") · [🔗](https://raw.githubusercontent.com/Livooon/resultsafe/main/packages/core/fp/result/src/refiners/types/VariantOf.ts "View raw code") · [💻](https://github.com/Livooon/resultsafe/code/main/packages/core/fp/result/src/refiners/types/VariantOf.ts "Open in Code view")

---

## Build and distribution formats

- Types: `build:types`
- ESM: `build:esm`
- CJS: `build:cjs`
- UMD: `build:umd`

This package ships typed declarations and multiple runtime module formats for broad compatibility.

---

## Monorepo and package structure

```txt
src/
  constructors/
  guards/
  methods/
  refiners/
    types/
    utils/
  internal/
  index.ts
```

---

## When to use this project

Use this project when you want:

- explicit success/error modeling
- predictable FP-style composition
- visible control flow
- stronger type-guided result handling in TypeScript
- advanced refinement tools for typed variants and strict result matching

---

## Documentation links

- [API entry (README)](https://unpkg.com/@resultsafe/core-fp-result@latest/docs/api/README.md)
- [API entry (index)](https://unpkg.com/@resultsafe/core-fp-result@latest/docs/api/index.md)
- [Modules](https://unpkg.com/@resultsafe/core-fp-result@latest/docs/api/modules.md)
- [Constructors module](https://unpkg.com/@resultsafe/core-fp-result@latest/docs/api/constructors/index.md)
- [Guards module](https://unpkg.com/@resultsafe/core-fp-result@latest/docs/api/guards/index.md)
- [Methods module](https://unpkg.com/@resultsafe/core-fp-result@latest/docs/api/methods/index.md)
- [Refiners module](https://unpkg.com/@resultsafe/core-fp-result@latest/docs/api/refiners/index.md)
- [Type aliases module](https://unpkg.com/@resultsafe/core-fp-result@latest/docs/api/type-aliases/index.md)

---
Back to top: [@resultsafe/core-fp-result](#top)

---
## Author

Denis Savasteev

---

## License

[MIT](./LICENSE)
