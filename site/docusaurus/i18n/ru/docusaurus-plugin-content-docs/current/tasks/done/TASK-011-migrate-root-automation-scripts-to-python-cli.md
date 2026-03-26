---
id: TASK-011
uuid: d00e87e3-ab60-4f6a-8e34-ac98053163a3
title: 'Мигрировать root automation scripts на Python CLI'
type: task
status: done
kb_lifecycle: archive
priority: high
assignee: 'codex'
created: 2026-03-22
updated: 2026-03-23
links: [ADR-002, SPEC-002, RB-002, DOC-004]
tags: [automation, python, cli, docs]
ai_source: null
lang: ru
translation_of: docs/tasks/done/TASK-011-migrate-root-automation-scripts-to-python-cli.md
translation_status: outdated
---

# TASK-011: Мигрировать root automation scripts на Python CLI

## Контекст

Канонические scripts в root были реализованы через PowerShell/TS-скрипты, что создавало platform coupling и ухудшало переносимость.

## Что сделать

- [x] Зафиксировать Python как канон automation через ADR/SPEC.
- [x] Реализовать `tools/automation` с DDD+FP decomposition.
- [x] Переписать `docs:check-links`, `docs:verify`, `readme:create` на Python CLI.
- [x] Добавить unit-тесты для automation use-cases.
- [x] Обновить CI workflow на cross-platform Python execution.

## Acceptance Criteria

- [x] Канонические automation scripts запускаются через `python -m tools.automation`.
- [x] В package scripts нет зависимости от PowerShell для docs automation.
- [x] Есть unit-тесты и успешный локальный прогон.
- [x] Документация обновлена и синхронизирована.

## Проверки

```bash
python -m unittest discover -s tools/automation/tests -v
pnpm run docs:verify
pnpm run docs:check-links:report
```

## Результат

PowerShell/TS root-скрипты мигрированы в Python CLI-контур `tools/automation`, введен единый I/O контракт, обновлены CI и docs governance документы (`ADR-002`, `SPEC-002`, `RB-002`, `DOC-004`).
