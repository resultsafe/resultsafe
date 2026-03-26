---
id: TASK-002
uuid: 067827b1-10d0-4a3e-a736-d0fabfa6dce9
title: 'Нормализовать legacy docs и индексы'
type: task
status: done
kb_lifecycle: archive
phase: 0
parent: PHASE-0
depends_on: [TASK-001]
priority: high
assignee: 'codex'
created: 2026-03-22
updated: 2026-03-23
links: [DOC-003, DOC-004, DOC-README-001]
tags: [documentation, legacy, normalization]
ai_source: null
lang: ru
translation_of: docs/tasks/done/TASK-002-normalize-legacy-docs-and-indexes.md
translation_status: outdated
---

# TASK-002: Нормализовать legacy docs и индексы

## Контекст

Документы в `docs/` содержат дубли и неформализованные статусы.

## Что сделать

- [x] Создать реестр `DOC-003`.
- [x] Добавить индекс `docs/index.md` с навигацией и статусами.
- [x] Привести legacy-файлы к единообразному статусному прологу.
- [x] Синхронизировать ссылки в `README.md` на актуальные документы в `docs/`.

## Acceptance Criteria

- [x] `docs/index.md` создан и отражает фактический статус всех legacy-файлов.
- [x] Явно указан canonical mapping legacy -> active docs.

## Проверки

```bash
rg --files docs -g "*.md"
```

## Риски

- Возможна потеря контекста при слишком агрессивной правке legacy-текстов.

## Результат

Завершено.
