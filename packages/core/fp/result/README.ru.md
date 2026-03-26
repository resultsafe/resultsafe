# @resultsafe/core-fp-result

<a id="top"></a>

[![npm version](https://img.shields.io/npm/v/@resultsafe/core-fp-result.svg)](https://www.npmjs.com/package/@resultsafe/core-fp-result)
[![npm downloads](https://img.shields.io/npm/dm/@resultsafe/core-fp-result.svg)](https://www.npmjs.com/package/@resultsafe/core-fp-result)
[![license](https://img.shields.io/npm/l/@resultsafe/core-fp-result.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://www.typescriptlang.org/)
[![docs](https://img.shields.io/badge/docs-api-informational.svg)](./docs/api/README.md)
[![build status](https://img.shields.io/badge/build-local%20verified-success.svg)](./package.json)
[![monorepo](https://img.shields.io/badge/monorepo-resultsafe%2Fmonorepo-0A0A0A.svg)](https://github.com/resultsafe/monorepo)

Rust-inspired Result-пакет для явных, композиционных и типобезопасных API в TypeScript и JavaScript.

**Язык:** [English](./README.md) | Русский

**Документация:** [API index](./docs/api/README.md) · [Modules](./docs/api/modules.md)

---

## Содержание

- [@resultsafe/core-fp-result](#resultsafecore-fp-result)
  - [Содержание](#содержание)
  - [Зачем нужен этот пакет](#зачем-нужен-этот-пакет)
  - [Контекст monorepo](#контекст-monorepo)
  - [Ключевые возможности](#ключевые-возможности)
  - [Пакет](#пакет)
    - [`@resultsafe/core-fp-result`](#resultsafecore-fp-result-1)
  - [Установка](#установка)
    - [Пакет](#пакет-1)
    - [Monorepo](#monorepo)
  - [Быстрый старт](#быстрый-старт)
    - [Базовый пример `Ok` / `Err`](#базовый-пример-ok--err)
  - [Обзор основного API](#обзор-основного-api)
    - [Constructors](#constructors)
    - [Guards](#guards)
    - [Methods](#methods)
    - [Refiners](#refiners)
    - [Type aliases](#type-aliases)
  - [Форматы сборки и поставки](#форматы-сборки-и-поставки)
  - [Структура monorepo и пакета](#структура-monorepo-и-пакета)
  - [Когда использовать этот проект](#когда-использовать-этот-проект)
  - [Ссылки на документацию](#ссылки-на-документацию)
  - [License](#license)

---

## Зачем нужен этот пакет

`@resultsafe/core-fp-result` предоставляет явные success/error flow вместо скрытых путей управления и exception-first ветвления.

Его основной пакет, [`@resultsafe/core-fp-result`](https://www.npmjs.com/package/@resultsafe/core-fp-result), предоставляет Rust-inspired `Result` API для TypeScript и JavaScript со следующими свойствами:

- явные `Ok` / `Err`
- предсказуемая функциональная композиция
- безопасное ветвление через guards и matching
- дисциплинированные API извлечения значений
- продвинутые refinement utilities для typed variants и strict matching

Цель проекта не в механическом копировании Rust, а в переносе той же ясности намерений в Node.js-библиотеки: явные значения, предсказуемое ветвление и API, организованные для долгосрочного сопровождения.

---

## Контекст monorepo

`@resultsafe/core-fp-result` — это пакет TypeScript/JavaScript внутри мультиязычного `resultsafe/monorepo`.

Монорепозиторий переносит общие Rust-inspired концепции в отдельные language-specific пакеты. Текущий production-трек — TypeScript/JavaScript, а Python планируется как отдельный пакетный трек с той же концептуальной моделью.

---

## Ключевые возможности

- Rust-inspired модель `Result` для TypeScript и JavaScript.
- Явные конструкторы через `Ok` и `Err`.
- Композиционные трансформации через API, такие как `map`, `mapErr`, `andThen` и `orElse`.
- Безопасное ветвление через guards `isOk`, `isErr`, `isOkAnd`, `isErrAnd` и matching helpers.
- Контролируемое извлечение через `unwrap`, `unwrapOr`, `unwrapErr`, `expect` и `expectErr`.
- Продвинутый слой refiners для typed variants, strict matching и сужения результатов.
- Согласованная модульная структура вместо плоского набора утилит.
- Type output для TypeScript-пользователей для лучшего DX и более безопасных интеграций.
- Гибкие форматы поставки: Types, ESM, CJS и UMD.

---

## Пакет

### `@resultsafe/core-fp-result`

Фокусированная Result-библиотека для явной обработки ошибок и FP-style композиции.

Она рассчитана на разработчиков, которым нужны:

- ясное моделирование успеха/ошибки
- предсказуемые трансформации
- явное ветвление и извлечение значений
- лучшая читаемость в error-heavy flow
- структурированная Rust-inspired API surface в TypeScript/JavaScript

---

## Установка

### Пакет

```bash
pnpm add @resultsafe/core-fp-result

# Альтернатива
npm install @resultsafe/core-fp-result
```

### Monorepo

```bash
pnpm install
```

---

## Быстрый старт

Типичный Result flow начинается с явных конструкторов и затем компонуется через функции, а не через неявные пути исключений.

```ts
import { Ok, map, unwrapOr } from '@resultsafe/core-fp-result';

const initial = Ok(21);
const doubled = map(initial, (value) => value * 2);
const finalValue = unwrapOr(doubled, 0);

console.log(finalValue); // 42
```

### Базовый пример `Ok` / `Err`

```ts
import { Ok, Err, match } from '@resultsafe/core-fp-result';

const parsePort = (input: string) => {
  const port = Number(input);
  return Number.isInteger(port) && port > 0 ? Ok(port) : Err('Invalid port');
};

const result = parsePort('3000');
const message = match(
  result,
  (value) => `Port: ${value}`,
  (error) => `Error: ${error}`,
);

console.log(message);
```

---

## Обзор основного API

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

## Форматы сборки и поставки

- Types: `build:types`
- ESM: `build:esm`
- CJS: `build:cjs`
- UMD: `build:umd`

Пакет публикует typed declarations и несколько runtime-форматов модулей для широкой совместимости.

---

## Структура monorepo и пакета

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

## Когда использовать этот проект

Используйте проект, если вам нужны:

- явное моделирование успеха/ошибки
- предсказуемая FP-style композиция
- видимый control flow
- более сильная type-guided обработка результатов в TypeScript
- продвинутые refinement tools для typed variants и строгого result matching

---

## Ссылки на документацию

- [API entry (README)](./docs/api/README.md)
- [API entry (index)](./docs/api/index.md)
- [Modules](./docs/api/modules.md)
- [Constructors module](./docs/api/constructors/index.md)
- [Guards module](./docs/api/guards/index.md)
- [Methods module](./docs/api/methods/index.md)
- [Refiners module](./docs/api/refiners/index.md)
- [Type aliases module](./docs/api/type-aliases/index.md)

---

Наверх: [@resultsafe/core-fp-result](#top)

---

## License

[MIT](./LICENSE)
