---
id: TASK-006
uuid: 23bfd6f4-4979-4960-bcef-8cefe9148118
title: 'Опубликовать канонический inventory пакетов и границ workspace'
type: task
status: done
kb_lifecycle: archive
phase: 1
parent: PHASE-1
depends_on: []
priority: high
assignee: 'codex'
created: 2026-03-22
updated: 2026-03-23
links: [PHASE-1, FEAT-002, DOC-002, DOC-README-001, SPEC-001]
tags: [documentation, packages, workspace, inventory]
ai_source: null
lang: ru
translation_of: docs/tasks/done/TASK-006-publish-canonical-package-inventory-and-boundaries.md
translation_status: outdated
---

# TASK-006: Опубликовать канонический inventory пакетов и границ workspace

## Контекст

В репозитории есть каталоги и `package.json`, которые не полностью отражены в workspace-регистрации и/или текущей карте в документации. Нужна явная классификация.

## Что сделать

- [x] Сформировать таблицу:
  - active workspace packages;
  - пакеты с `package.json`, не включенные в workspace;
  - структурные каталоги без package-контракта.
- [x] Для каждого элемента зафиксировать статус: `active`, `incubating`, `out-of-workspace`, `legacy-structure`.
- [x] Обновить разделы архитектуры в `README.md` и связанные docs так, чтобы не смешивать уровни.
- [x] Явно решить судьбу `@resultsafe/core-shared-naming-convention` (включать в workspace или оставить вне него с documented reason).

## Acceptance Criteria

- [x] Существует канонический документ-инвентарь пакетов с прозрачной классификацией.
- [x] Карта в README не противоречит `pnpm-workspace.yaml`.
- [x] Для пакетов вне workspace указана осознанная причина.

## Проверки

```bash
pnpm -r list --depth -1 --json
rg --files packages -g package.json
```

## Риски

- Изменение статусов пакетов может потребовать отдельного архитектурного решения.

## Результат

Создан канонический inventory:

- `docs/obsidian/specs/SPEC-001-package-inventory-and-workspace-boundaries.md`

Обновлены связанные документы:

- `README.md` (добавлены границы workspace и ссылка на SPEC-001, версия 1.3)
- `docs/obsidian/specs/index.md`
- `docs/obsidian/specs/DOC-COUNTERS.md` (`SPEC-` -> `002`)

Решение по `@resultsafe/core-shared-naming-convention`:

- оставлен в статусе `out-of-workspace` до отдельной интеграции в workspace lifecycle.

Проверки:

- `pnpm run workspace:list` -> OK
- `rg --files packages -g package.json` -> OK
- `pnpm run docs:check-links` -> OK (`Missing links: 0`)


