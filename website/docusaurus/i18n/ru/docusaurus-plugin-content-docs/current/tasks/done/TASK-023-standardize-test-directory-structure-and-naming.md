---
id: TASK-023
uuid: b11c4780-a848-46d4-a406-50dc8a4d265e
title: 'Стандартизировать структуру директорий и наименования тестов во всех пакетах'
type: task
status: done
kb_lifecycle: archive
priority: high
assignee: 'codex'
created: 2026-03-22
updated: 2026-03-23
links: [DOC-004, SPEC-001, TASK-022]
tags: [tests, naming, structure, standardization, monorepo]
ai_source: null
lang: ru
translation_of: docs/tasks/done/TASK-023-standardize-test-directory-structure-and-naming.md
translation_status: outdated
---

# TASK-023: Стандартизировать структуру директорий и наименования тестов во всех пакетах

## Контекст

В пакетах монорепозитория тестовые директории и имена файлов были оформлены неоднородно:

- смешанный стиль `camelCase`/`PascalCase`/`kebab-case`;
- часть файлов имела нестандартные суффиксы;
- встречалась дополнительная вложенность в `__tests__` (`types/Task/Task.test.ts`);
- в документации и отдельных `index.ts` оставались ссылки на устаревшие имена.

Требовалось ввести единый production-стандарт и применить его ко всем тестовым пакетам.

## Что реализовано

### ST-023-01: Канонический стандарт структуры тестов

- [x] Зафиксирована единая структура: `__tests__/<unit|integration>/<scope>/<test-file>.test.ts`.
- [x] Убрана лишняя вложенность; глубина тестовых директорий выровнена.

### ST-023-02: Канонический стандарт имен файлов тестов

- [x] Введен единый стиль имен: `lowercase-kebab-case`.
- [x] Версионные файлы сохранены в формате `<name>.vNN.test.ts`.
- [x] Нормализованы имена с `camelCase`/`PascalCase` и legacy-паттернами.
- [x] Нестандартный файл `fromNullable.v01.ts` приведен к `from-nullable.v01.test.ts`.

### ST-023-03: Массовая миграция по всем пакетам

- [x] Выполнен массовый rename тестовых файлов во всех пакетах с `__tests__`.
- [x] Обработаны case-only rename на Windows через безопасную двухфазную схему (temp -> final).
- [x] Удалена лишняя поддиректория `__tests__/unit/types/Task` после выравнивания структуры.

### ST-023-04: Пост-миграционная синхронизация ссылок

- [x] Обновлены `index.ts` в тестовых типах:
  - `packages/core/fp/effect/__tests__/unit/types/index.ts`
  - `packages/core/fp/task-result/__tests__/unit/types/index.ts`
- [x] Обновлены ссылки на старые тестовые пути в документации:
  - `docs/obsidian/tasks/done/TASK-021-js-monorepo-native-dynamic-import-rust-principles.md`
  - `docs/obsidian/specs/legacy-result-methods/layers/LAYER-002-result-models-and-methods-progress.md`

## Acceptance Criteria

- [x] Во всех пакетах с `__tests__` действует единый шаблон вложенности.
- [x] Имена тестовых файлов нормализованы и единообразны.
- [x] Нет ссылок на старые имена тестов в обновленных технических документах.
- [x] TypeScript-проверки для затронутых ключевых пакетов проходят после миграции.

## Проверки

```bash
pnpm exec tsc -p packages/core/fp/result/tsconfig.json --noEmit
pnpm exec tsc -p packages/core/fp/task-result/tsconfig.json --noEmit
pnpm run docs:check-links
pnpm run docs:verify
```

## Результат

Тестовый слой монорепозитория приведен к единому стандарту структуры и именования: вложенность и нейминг стали предсказуемыми и одинаковыми во всех пакетах, что снижает шум в навигации, упрощает поддержку и устраняет дрейф naming-конвенций.
