# @resultsafe/core-fp-result
<a id="top"></a>

![ResultSafe Logo](https://unpkg.com/@resultsafe/core-fp-result@latest/docs/assets/logo.svg)

[![npm version](https://img.shields.io/npm/v/@resultsafe/core-fp-result.svg)](https://www.npmjs.com/package/@resultsafe/core-fp-result)
[![npm downloads](https://img.shields.io/npm/dm/@resultsafe/core-fp-result.svg)](https://www.npmjs.com/package/@resultsafe/core-fp-result)
[![license](https://img.shields.io/npm/l/@resultsafe/core-fp-result.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://www.typescriptlang.org/)
[![docs](https://img.shields.io/badge/docs-api-informational.svg)](https://github.com/resultsafe/monorepo/blob/main/packages/core/fp/result/docs/api/README.md)
[![build status](https://img.shields.io/badge/build-local%20verified-success.svg)](./package.json)
[![monorepo](https://img.shields.io/badge/monorepo-resultsafe%2Fmonorepo-0A0A0A.svg)](https://github.com/resultsafe/monorepo)

A Rust-inspired Result package for explicit, composable, and type-friendly APIs in TypeScript and JavaScript.

**Language:** English | [Русский](https://unpkg.com/@resultsafe/core-fp-result@latest/README.ru.md)

**Documentation:** [API index](https://github.com/resultsafe/monorepo/blob/main/packages/core/fp/result/docs/api/README.md) · [Modules](https://github.com/resultsafe/monorepo/blob/main/packages/core/fp/result/docs/api/modules.md)

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

## Core API overview

### Constructors

- `Ok`
- `Err`

### Guards

- `isOk`
- `isOkAnd`
- `isErr`
- `isErrAnd`

### Methods

- `andThen`
- `err`
- `expect`
- `expectErr`
- `flatten`
- `inspect`
- `inspectErr`
- `map`
- `mapErr`
- `match`
- `ok`
- `orElse`
- `tap`
- `tapErr`
- `transpose`
- `unwrap`
- `unwrapErr`
- `unwrapOr`
- `unwrapOrElse`

### Refiners

- `isTypedVariant`
- `isTypedVariantOf`
- `matchVariant`
- `matchVariantStrict`
- `refineAsyncResult`
- `refineAsyncResultU`
- `refineResult`
- `refineResultU`
- `refineVariantMap`

### Type aliases

- `Handler`
- `MatchBuilder`
- `Matcher`
- `SyncRefinedResult`
- `SyncRefinedResultUnion`
- `SyncValidatorMap`
- `UniversalAsyncRefinedResult`
- `UniversalRefinedResult`
- `VariantOf`

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

- [API entry (README)](https://github.com/resultsafe/monorepo/blob/main/packages/core/fp/result/docs/api/README.md)
- [API entry (index)](https://github.com/resultsafe/monorepo/blob/main/packages/core/fp/result/docs/api/index.md)
- [Modules](https://github.com/resultsafe/monorepo/blob/main/packages/core/fp/result/docs/api/modules.md)
- [Constructors module](https://github.com/resultsafe/monorepo/blob/main/packages/core/fp/result/docs/api/constructors/index.md)
- [Guards module](https://github.com/resultsafe/monorepo/blob/main/packages/core/fp/result/docs/api/guards/index.md)
- [Methods module](https://github.com/resultsafe/monorepo/blob/main/packages/core/fp/result/docs/api/methods/index.md)
- [Refiners module](https://github.com/resultsafe/monorepo/blob/main/packages/core/fp/result/docs/api/refiners/index.md)
- [Type aliases module](https://github.com/resultsafe/monorepo/blob/main/packages/core/fp/result/docs/api/type-aliases/index.md)

---
Back to top: [@resultsafe/core-fp-result](#top)

---
## Author

Denis Savasteev

---

## License

[MIT](./LICENSE)
