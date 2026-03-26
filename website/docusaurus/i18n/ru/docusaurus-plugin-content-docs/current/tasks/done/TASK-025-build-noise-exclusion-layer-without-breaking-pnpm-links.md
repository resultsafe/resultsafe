---
id: TASK-025
uuid: e64394b8-89cf-433b-a6af-d200c18b7dbb
title: 'Построить слой шумоподавления без нарушения pnpm link-архитектуры'
type: task
status: done
kb_lifecycle: archive
priority: high
assignee: 'codex'
created: 2026-03-22
updated: 2026-03-23
links: [DOC-004, SPEC-002, SPEC-007]
tags: [noise, tooling, ide, pnpm, reliability]
ai_source: null
lang: ru
translation_of: docs/tasks/done/TASK-025-build-noise-exclusion-layer-without-breaking-pnpm-links.md
translation_status: outdated
---

# TASK-025: Построить слой шумоподавления без нарушения pnpm link-архитектуры

## Контекст

В пакетах присутствуют локальные `node_modules`-пути, которые выглядят как дубли, но фактически являются `pnpm` links/junctions на workspace-пакеты.

Цель задачи: убрать операционный шум для разработки и tooling, не ломая и не упрощая рабочую архитектуру зависимостей.

## Что реализовано

### ST-025-01: Канонический noise-source

- [x] Добавлен единый источник noise-правил: `config/noise-ignore.txt`.
- [x] Зафиксирован минимальный production-набор шумовых артефактов (`node_modules`, `dist`, кеши, coverage).

### ST-025-02: Интеграция в automation tooling

- [x] Добавлен модуль `tools/automation/shared/noise.py` (загрузка/применение noise-паттернов).
- [x] `docs check-links` переведен на канонический noise-layer.
- [x] `sync identifiers` переведен на канонический noise-layer при обходе пакетов.

### ST-025-03: Интеграция в dev-tooling

- [x] Добавлен `.rgignore` для шумоподавления в `rg`.
- [x] Обновлен `.prettierignore`.
- [x] Обновлен `.vscode/settings.json`:
  - `files.watcherExclude`
  - расширенный `search.exclude`.

### ST-025-04: Документация и governance

- [x] Добавлен `SPEC-007` с правилами шумоподавления и запретом на ломку `pnpm` links.
- [x] Синхронизированы индексы и счетчики docs/obsidian.

## Acceptance Criteria

- [x] Шумовые артефакты исключаются из ключевых tooling-контуров.
- [x] `pnpm` link/junction архитектура workspace-зависимостей не изменена.
- [x] Добавление новых noise-паттернов выполняется через единый source-of-truth.
- [x] Документация в `docs/obsidian` отражает production-подход.

## Проверки

```bash
python -m pytest tools/automation/tests -q
pnpm run docs:check-links
pnpm run docs:verify
```

## Результат

В репозитории внедрен надежный и расширяемый слой шумоподавления, который уменьшает шум поиска/наблюдения/сканирования и сохраняет целостность текущей `pnpm`-архитектуры workspace-ссылок.
