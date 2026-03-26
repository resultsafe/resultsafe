---
id: TASK-001
uuid: a3b9c469-6d39-448a-99b7-b1b39f89f60f
title: 'Исправить self-consistency стандартов docs/obsidian'
type: task
status: done
kb_lifecycle: archive
phase: 0
parent: PHASE-0
depends_on: [ADR-001]
priority: high
assignee: 'codex'
created: 2026-03-22
updated: 2026-03-23
links: [DOC-001, DOC-004, DOC-002, DOC-003]
tags: [documentation, standards, consistency]
ai_source: null
lang: ru
translation_of: docs/tasks/done/TASK-001-fix-obsidian-standards-self-consistency.md
translation_status: outdated
---

# TASK-001: Исправить self-consistency стандартов docs/obsidian

## Контекст

Стандарты описывали правила, но часть правил не была выполнена самими же документами.

## Что сделать

- [x] Добавить frontmatter в `DOC-001` и `DOC-004`.
- [x] Ввести документы `DOC-002`, `DOC-003`, `DOC-COUNTERS`.
- [x] Обновить индекс `docs/obsidian/index.md`.

## Acceptance Criteria

- [x] Ключевые docs self-consistent.
- [x] Базовые cross-reference не висят в воздухе.

## Проверки

```bash
rg -n "^---$|^id: DOC-00[1-4]|DOC-COUNTERS" docs/obsidian/specs/*.md
```

## Риски

- Возможна неполная синхронизация с legacy-документами в `docs/`.

## Результат

Базовая консистентность стандартов восстановлена.
