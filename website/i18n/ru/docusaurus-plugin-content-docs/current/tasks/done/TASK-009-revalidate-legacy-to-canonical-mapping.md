---
id: TASK-009
uuid: 2c1384c9-d427-4bfa-95ae-60a1bc535b39
title: 'Пере-проверить legacy->canonical mapping и убрать мертвые ссылки'
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
links: [PHASE-1, FEAT-002, DOC-003, CONCEPT-001]
tags: [documentation, legacy, mapping, links]
ai_source: null
lang: ru
translation_of: docs/tasks/done/TASK-009-revalidate-legacy-to-canonical-mapping.md
translation_status: outdated
---

# TASK-009: Пере-проверить legacy->canonical mapping и убрать мертвые ссылки

## Контекст

Legacy-слой уже формализован в `DOC-003`, но в активных документах встречаются устаревшие/несуществующие legacy-пути и текстовые ссылки, не соответствующие реестру.

## Что сделать

- [x] Сверить все упоминания legacy-файлов в `README.md`, `docs/obsidian/*`, `docs/index.md` с `DOC-003`.
- [x] Исправить несуществующие legacy-ссылки (включая `CONCEPT-001`).
- [x] Добавить правило для текстовых legacy-упоминаний: только через реестр `DOC-003`.
- [x] При необходимости обновить статусы и canonical mapping в `DOC-003`.

## Acceptance Criteria

- [x] В active docs нет ссылок на несуществующие legacy-файлы.
- [x] `DOC-003` отражает полный фактический список legacy-документов.
- [x] Для каждого legacy-файла указан актуальный canonical mapping.

## Проверки

```bash
rg -n "docs/.*\\.md|legacy" docs/obsidian docs README.md
pnpm run docs:check-links:report
```

## Риски

- Возможна потеря исторического контекста при агрессивной чистке упоминаний.

## Результат

Исправлена несуществующая legacy-отсылка в `CONCEPT-001`, правило legacy-упоминаний закреплено в `DOC-003` (через реестр без прямых file-links в active docs), а `README.md` дополнен явной ссылкой на canonical registry `DOC-003`.
