---
id: TASK-024
uuid: da78e840-c6a5-431b-97ab-85ca190f98e9
title: 'Стандартизировать структуру директорий и наименования __examples__ во всех пакетах'
type: task
status: done
kb_lifecycle: archive
priority: high
assignee: 'codex'
created: 2026-03-22
updated: 2026-03-23
links: [DOC-004, SPEC-006, TASK-022, TASK-023]
tags: [examples, naming, structure, standardization, monorepo]
ai_source: null
lang: ru
translation_of: docs/tasks/done/TASK-024-standardize-examples-directory-structure-and-naming.md
translation_status: outdated
---

# TASK-024: Стандартизировать структуру директорий и наименования `__examples__` во всех пакетах

## Контекст

Examples-слой в пакетах имел неоднородную вложенность и naming:

- смешанные глубины директорий после `__examples__`;
- неоднородные имена файлов и каталогов;
- отсутствовал формальный production-контракт по layout и версии вариантов;
- после миграции структуры оставались точечные path-регрессии в относительных импортах.

Требовалось ввести единый стандарт, применить его ко всем пакетам и синхронизировать docs/obsidian.

## Что реализовано

### ST-024-01: Канонический layout для examples

- [x] Введен единый шаблон: `__examples__/<scope>/<topic>/<variant>/`.
- [x] Для варианта закреплен формат `vNN`.
- [x] Для файлов примера закреплены канонические имена:
  - `example.ts` (обязательный runnable-пример),
  - `example.md` (опциональное описание).

### ST-024-02: Массовая миграция структуры

- [x] Выполнено массовое выравнивание `__examples__` по пакетам с `__examples__` (13 пакетов, 216 перемещений файлов).
- [x] Ассеты и внутренние данные сохранены в `internal/` и `assets/` внутри варианта.
- [x] Устранен выброс по варианту (`refine-result-u` -> `v01` в отдельной topic-директории `refine-result-u`).

### ST-024-03: Исправление path-регрессий после миграции

- [x] Добавлены alias-резолвы для `@resultsafe/core-fp-codec-zod` в `tsconfig.aliases.json`.
- [x] Исправлены сломанные относительные импорты в:
  - `packages/adapter/core/fp/codec/zod/__examples__/scenarios/zod-result-codec/v01/example.ts`
  - `packages/core/fp/union/__examples__/types/discriminated-union/v01/example.ts`
  - `packages/core/fp/union/__examples__/types/discriminated-union/v02/example.ts`
- [x] Автоматической проверкой подтверждено отсутствие битых относительных импортов в `example.ts`.

### ST-024-04: Формализация стандарта в docs/obsidian

- [x] Добавлен отдельный spec-контракт: `SPEC-006`.
- [x] Синхронизированы индексы и счетчики документации (`DOC-COUNTERS`, `specs/index.md`, `tasks/index.md`, `tasks/done/index.md`, `docs/obsidian/index.md`).
- [x] Обновлен backlog-контекст `TASK-022` с ссылкой на канонический стандарт `SPEC-006`.

## Acceptance Criteria

- [x] Во всех пакетах с `__examples__` действует единый шаблон вложенности.
- [x] Все варианты examples нормализованы под `vNN`.
- [x] Относительные импорты в examples не содержат broken paths.
- [x] В `docs/obsidian` есть отдельный formal standard для `__examples__`.

## Проверки

```bash
pnpm run docs:check-links
pnpm run docs:verify
pnpm exec tsc -p packages/core/fp/result/tsconfig.json --noEmit
pnpm exec tsc -p packages/core/fp/task/tsconfig.json --noEmit
pnpm exec tsc -p packages/core/fp/task-result/tsconfig.json --noEmit
```

Дополнительно выполнены специализированные проверки:

- проверка шаблона `__examples__/<scope>/<topic>/<variant>` + `variant=vNN`;
- проверка валидности относительных импортов внутри `example.ts`.

## Результат

Examples-слой приведен к единому production-стандарту структуры и naming, зафиксированному в `SPEC-006`. Навигация по примерам стала предсказуемой, устранен структурный шум, а правила эволюции `__examples__` формализованы в docs governance-контуре.


