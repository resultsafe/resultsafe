---
id: TASK-004
uuid: f3d557b1-9ba0-4581-b9e0-9d4183ce3b13
title: 'Исправить parser error в check-doc-links.ps1'
type: task
status: done
kb_lifecycle: archive
phase: 1
parent: PHASE-1
depends_on: []
priority: critical
assignee: 'codex'
created: 2026-03-22
updated: 2026-03-23
links: [PHASE-1, FEAT-002, DOC-004, TASK-003]
tags: [documentation, scripts, powershell, links]
ai_source: null
lang: ru
translation_of: docs/tasks/done/TASK-004-fix-doc-link-checker-powershell-parser.md
translation_status: outdated
---

# TASK-004: Исправить parser error в check-doc-links.ps1

## Контекст

`pnpm run docs:check-links:report` падает не по результату проверки ссылок, а из-за синтаксической ошибки PowerShell в `__scripts__/check-doc-links.ps1`.

## Что сделать

- [x] Исправить синтаксис regex в `Strip-CodeBlocks` (fenced и inline code patterns).
- [x] Нормализовать обработку параметра `-FailOnMissing` для запуска через `pnpm` (`true/false/1/0`).
- [x] Сделать `Resolve-RepoPath` безопасным к invalid path chars (`try/catch` без аварийного падения).
- [x] Исключить `docs/obsidian/_templates/` из link-check (placeholder-шаблоны не должны ломать gate).
- [x] Обновить вызов `docs:check-links:report` в `package.json`.
- [x] Синхронизировать статус `TASK-003` с фактической причиной блокера.

## Acceptance Criteria

- [x] `pnpm run docs:check-links:report` выполняется без parser error.
- [x] Скрипт корректно возвращает результат проверки ссылок и больше не падает на path/parser edge-cases.
- [x] `pnpm run docs:check-links` выполняется успешно (0 missing links).
- [x] Состояние `TASK-003` синхронизировано с новой фактической причиной.

## Проверки

```bash
pnpm run docs:check-links:report
```

## Риски

- Возможны ложноположительные/ложноотрицательные срабатывания regex после правки.

## Результат

- Обновлен `__scripts__/check-doc-links.ps1` (parser/args/path-robustness + ignore templates).
- Обновлен `package.json` (`docs:check-links:report`).
- Проверки:
  - `pnpm run docs:check-links:report` -> `Checked markdown files: 99`, `Missing links: 0`
  - `pnpm run docs:check-links` -> `Checked markdown files: 99`, `Missing links: 0`
