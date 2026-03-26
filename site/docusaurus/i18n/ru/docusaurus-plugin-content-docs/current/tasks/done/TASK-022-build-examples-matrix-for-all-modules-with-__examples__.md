---
id: TASK-022
uuid: ada9bc02-75c2-4b61-ae3a-00e024c6e605
title: 'Построить полную examples-матрицу по всем модулям с __examples__'
type: task
status: done
kb_lifecycle: archive
priority: high
assignee: 'codex'
created: 2026-03-22
updated: 2026-03-23
links:
  [
    SPEC-001,
    SPEC-002,
    SPEC-004,
    SPEC-006,
    DOC-004,
    NOTE-010,
    TASK-020,
    TASK-021,
    TASK-024,
  ]
tags: [examples, modules, monorepo, fp, usage, documentation]
ai_source: null
lang: ru
translation_of: docs/tasks/done/TASK-022-build-examples-matrix-for-all-modules-with-__examples__.md
translation_status: outdated
---

# TASK-022: Построить полную examples-матрицу по всем модулям с **examples**

## Контекст

Требовалось завершить production-слой examples для всех модулей с `__examples__` и зафиксировать единую верифицируемую матрицу покрытия:

- где и как используется каждый модуль;
- какие варианты сценариев реализованы;
- какие `scope/topic/variant` присутствуют фактически.

## Что реализовано

### ST-022-00: Общий стандарт examples-матрицы

- [x] Зафиксирован единый layout examples по `SPEC-006`: `__examples__/<scope>/<topic>/<variant>/example.ts`.
- [x] Зафиксирован runnable-контракт examples (`example.ts`) и пояснительный слой (`example.md`, где применимо).
- [x] Зафиксирована трассируемая coverage-матрица для всех модулей в `NOTE-010`.

### ST-022-01..ST-022-14: Реализация и покрытие по модулям

- [x] `result`: реализованы `refiners/integrations/scenarios`, включая recovery и boundary-кейсы.
- [x] `task`: покрыты `constructors/methods/scenarios/types`, включая concurrency/race/unwrap-family.
- [x] `task-result`: реализованы integration/recovery/match/all-settled сценарии.
- [x] `effect`: покрыты context-provision/error-observability/types-variants.
- [x] `context`: покрыты composition/boundary/projection сценарии.
- [x] `layer`: покрыты composition/runtime/partial-provide сценарии.
- [x] `pipe`: покрыты `pipe2..pipe6` и scenario-варианты линейной композиции.
- [x] `flow`: покрыты composable-functions и boundary/result-interop сценарии.
- [x] `do`: покрыты bind/chain/control-flow сценарии.
- [x] `codec`: покрыты constructors/methods/scenarios/types с decode/compose/fallback.
- [x] `codec-zod` (adapter): покрыты bridge/validation сценарии.
- [x] `union`: покрыты guards/scenarios/types с refinement и matching.
- [x] `void`: покрыты сценарии интеграции с `Task/TaskResult/Result`.
- [x] Межмодульный слой фиксирован в coverage-матрице и сценарных топиках.

### ST-022-15: Документация и проверяемость

- [x] Добавлена и актуализирована сводная таблица покрытия: `NOTE-010`.
- [x] Матрица синхронизирована со стандартом `SPEC-006`.
- [x] Проверено отсутствие пустых `example.ts` в coverage-модулях.
- [x] Документация проходит проверки ссылок/структуры (`docs:check-links`, `docs:verify`).

## Acceptance Criteria

- [x] Для всех модулей с `__examples__` есть структурированный набор примеров по типам сценариев.
- [x] Примеры покрывают ключевые сущности, ошибки, границы и интеграционные обстоятельства.
- [x] Есть межмодульные и интеграционные сценарии в examples-слое.
- [x] Существует единая таблица покрытия «модуль -> варианты использования -> реализованные примеры».
- [x] Examples синхронизированы с документацией и не противоречат текущему API-контракту.

## Фактический coverage-итог

- Модулей с `__examples__`: `13`
- `example.ts`: `167`
- `example.md`: `47`
- Пустых `example.ts`: `0`

Источник фиксации: `docs/obsidian/notes/NOTE-010-examples-matrix-coverage-2026-03-22.md`.

## Проверки

```bash
pnpm run docs:check-links
pnpm run docs:verify
```

## Результат

TASK-022 закрыт: examples-слой по всем модулям с `__examples__` приведен к единой production-матрице покрытия с документированной трассировкой сценариев и проверяемыми количественными метриками.
