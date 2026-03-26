---
id: TASK-007
uuid: f86a6084-0ea6-4eb7-b320-6d478b11e93e
title: 'Нормализовать индексы docs/obsidian и cross-link покрытие'
type: task
status: done
kb_lifecycle: archive
phase: 1
parent: PHASE-1
depends_on: [TASK-004]
priority: high
assignee: 'codex'
created: 2026-03-22
updated: 2026-03-23
links: [PHASE-1, FEAT-002, DOC-001, DOC-004]
tags: [documentation, index, links, obsidian]
ai_source: null
lang: ru
translation_of: docs/tasks/done/TASK-007-normalize-obsidian-indexes-and-cross-links.md
translation_status: outdated
---

# TASK-007: Нормализовать индексы docs/obsidian и cross-link покрытие

## Контекст

Часть index-файлов расходится с фактическим содержимым разделов (`runbooks`, `notes`, roadmap/indexes), что снижает навигационную достоверность.

## Что сделать

- [x] Выравнять links/body в `index.md` каждого раздела по фактическим документам.
- [x] Проверить, что новые документы всегда добавляются в соответствующий index.
- [x] Добавить простой чеклист в `RB-001`, предотвращающий повторное выпадение документов из индексов.
- [x] Прогнать link-check после нормализации.

## Acceptance Criteria

- [x] Все индексы отражают фактические документы разделов.
- [x] Нет "Пока пусто" в разделах, где уже есть документы.
- [x] После правок нет broken internal links.

## Проверки

```bash
pnpm run docs:check-links:report
```

## Риски

- При массовой синхронизации индексов можно пропустить документ из nested-папок.

## Результат

Нормализованы корневые и агрегирующие индексы (`docs/obsidian/index.md`, `roadmap/index.md`, `tasks/index.md`), добавлено покрытие nested-материалов в `concepts/index.md`, а в `RB-001` закреплен anti-drift чеклист для предотвращения выпадения документов из индексов.
