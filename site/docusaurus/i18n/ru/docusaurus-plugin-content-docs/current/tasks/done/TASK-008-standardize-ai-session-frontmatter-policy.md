---
id: TASK-008
uuid: 22299673-e415-42f8-9e92-6c8f2b141070
title: 'Стандартизовать политику frontmatter для ai-session файлов'
type: task
status: done
kb_lifecycle: archive
phase: 1
parent: PHASE-1
depends_on: [TASK-007]
priority: medium
assignee: 'codex'
created: 2026-03-22
updated: 2026-03-23
links: [PHASE-1, FEAT-002, DOC-004, CONCEPT-001]
tags: [documentation, ai, frontmatter, standards]
ai_source: null
lang: ru
translation_of: docs/tasks/done/TASK-008-standardize-ai-session-frontmatter-policy.md
translation_status: outdated
---

# TASK-008: Стандартизовать политику frontmatter для ai-session файлов

## Контекст

`DOC-004` задает обязательные поля frontmatter для markdown-документов, но ai-session логи концептов используют отдельный формат и формально выпадают из общего правила.

## Что сделать

- [x] Принять явное правило: ai-session логи подчиняются общему frontmatter или вводится documented exception.
- [x] Обновить `DOC-004` и `CONCEPT-template` под выбранную политику.
- [x] Привести существующие ai-session файлы к новому правилу.
- [x] Добавить проверку этого правила в будущий `docs:verify`.

## Acceptance Criteria

- [x] Нет неоднозначности в стандарте по ai-session frontmatter.
- [x] Все текущие ai-session файлы соответствуют принятой политике.
- [x] Правило покрыто автоматической валидацией или явно исключено из нее.

## Проверки

```bash
rg -n "^---$|^concept:|^date:|^ai_tool:|^model:|^summary:" docs/obsidian/concepts
```

## Риски

- Слишком строгий формат может ухудшить ergonomics ведения AI-логов.

## Результат

Принято documented exception: `ai-session-YYYY-MM-DD.md` используют отдельный frontmatter-контракт (§3.2 `DOC-004`) без обязательных полей §3.1, с обязательными `concept/date/ai_tool/model`. Обновлены `DOC-004`, `CONCEPT-template`, существующий `ai-session` лог и добавлено явное требование в `TASK-010` для `docs:verify`.
