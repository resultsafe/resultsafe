---
id: TASK-021
uuid: 6818d3d0-c004-47cc-b420-a687c26dec1f
title: 'Реализовать нативный динамический import() в JS-монорепозитории по Rust-принципам'
type: task
status: done
kb_lifecycle: archive
priority: high
assignee: 'codex'
created: 2026-03-22
updated: 2026-03-23
links: [CONCEPT-001, ADR-002, SPEC-004, TASK-020]
tags: [javascript, monorepo, dynamic-import, rust-principles, runtime, security]
ai_source: null
lang: ru
translation_of: docs/tasks/done/TASK-021-js-monorepo-native-dynamic-import-rust-principles.md
translation_status: outdated
---

# TASK-021: Реализовать нативный динамический import() в JS-монорепозитории по Rust-принципам

## Контекст

Требовалось внедрить production-контур нативного динамического `import()` с Rust-ориентированными принципами: explicit contracts, Result-style обработка ошибок, policy controls, deterministic cache и observability.

Базовый пример использования:

```js
const module = await import('https://example.com/module.js');
module.someFunction();
```

## Что реализовано

### ST-021-01: Contract и API Surface

- [x] Реализован единый public API: `loadModule`, `loadModuleSafe`, `preloadModule`.
- [x] Зафиксирован explicit contract: safe API возвращает `Result<T, ModuleLoaderError>`.
- [x] Реализована политика specifier handling (local/remote, normalization).

### ST-021-02: Runtime Boundaries и Environment Matrix

- [x] Добавлена matrix-документация для Browser ESM / Node ESM в package README.
- [x] Зафиксированы ограничения для remote URL imports (policy gates).
- [x] Добавлен policy-driven runtime path (remote disabled by default).

### ST-021-03: Rust-Style Error Model

- [x] Реализована Result-style обертка `loadModuleSafe`.
- [x] Введена типизированная taxonomy ошибок:
      `invalid_specifier`, `remote_import_disabled`, `remote_origin_not_allowed`, `remote_origin_blocked`, `import_timeout`, `import_failed`.
- [x] Ошибки мапятся в стабильный `ModuleLoaderError`.

### ST-021-04: Determinism, Caching, Idempotency

- [x] Реализован детерминированный cache key (`createModuleCacheKey`).
- [x] Реализован cache layer и cache hit path.
- [x] Реализовано идемпотентное поведение повторных загрузок.

### ST-021-05: Security и Trust Controls

- [x] Реализованы allowlist/denylist policy для remote imports.
- [x] Реализован policy hook через event callback (`onEvent`) для audit/logging.

### ST-021-06: Observability и Lineage

- [x] Добавлены structured events:
      `import_started`, `import_succeeded`, `import_failed`.
- [x] Добавлен `correlationId` для трассировки.
- [x] Добавлены runtime metrics:
      `started`, `succeeded`, `failed`, `cacheHits`.

### ST-021-07: Testing и Conformance

- [x] Добавлены unit tests для happy/error paths.
- [x] Добавлены проверки cache/idempotent behavior и error mapping.
- [x] Добавлены проверки metrics/events на Result-safe contract.

### ST-021-08: Docs и Adoption

- [x] Добавлена package-level документация и примеры использования.
- [x] Зафиксирован корректный пример нативного `import()` с URL-строкой.

## Измененные артефакты

- `packages/core/fp/module-loader/*` (новый пакет).
- `pnpm-workspace.yaml` (включен новый workspace package).
- `package.json` (включен новый workspace package).
- `tsconfig.aliases.json` (новые path aliases).
- `vitest.config.ts` (новой alias для тестов).

## Acceptance Criteria

- [x] Нативный `import()` доступен через единый публичный контракт.
- [x] Публичный safe API возвращает Result-style outcome.
- [x] Для remote imports применяются trust/policy ограничения.
- [x] Есть тесты на deterministic cache/idempotent behavior.
- [x] Документация содержит рабочие примеры и ограничения среды.

## Проверки

```bash
pnpm exec vitest run --config vitest.config.ts packages/core/fp/module-loader/__tests__/unit/methods/load-module.v01.test.ts packages/core/fp/module-loader/__tests__/unit/methods/load-module-safe.v01.test.ts
pnpm run docs:check-links
pnpm run docs:verify
```

## Результат

В монорепозитории реализован production-ready dynamic-import layer с explicit Result-style ошибками, security policy controls, кэшем, observability и тестовым покрытием.
