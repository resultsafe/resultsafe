---
id: TASK-014
uuid: e4c90062-a4f5-42ab-8159-3db1330cb71f
title: 'Консолидировать docs/Методы Result в Rust-ID и progress layers'
type: task
status: done
kb_lifecycle: archive
priority: high
assignee: 'codex'
created: 2026-03-22
updated: 2026-03-23
links: [DOC-003, DOC-004, NOTE-005]
tags: [documentation, result, rust, methods, progress]
ai_source: null
lang: ru
translation_of: docs/tasks/done/TASK-014-consolidate-result-method-docs-rust-id-and-progress-layers.md
translation_status: outdated
---

# TASK-014: Консолидировать docs/Методы Result в Rust-ID и progress layers

## Контекст

В `docs/obsidian/specs/legacy-result-methods` находились 4 пересекающихся таблицы с дублированием и разными версиями имен методов, что мешало видеть фактическое соответствие Rust API и текущей реализации.

## Что сделать

- [x] Проанализировать все файлы в `docs/obsidian/specs/legacy-result-methods`.
- [x] Объединить их в единый канонический формат.
- [x] Вынести `ID + соответствие Rust -> TS` в отдельный слой.
- [x] Вынести прогресс моделей/методов и production-ready evidence в отдельный слой.
- [x] Сохранить исторические материалы в legacy-подслое без удаления.

## Acceptance Criteria

- [x] Есть единая точка входа `docs/obsidian/specs/legacy-result-methods/index.md`.
- [x] Есть `LAYER-001` с Rust ID map.
- [x] Есть `LAYER-002` с progress/readiness (`PR-0..PR-3`).
- [x] Старые таблицы перенесены в `_legacy`.
- [x] Док-проверки проходят.

## Проверки

```bash
pnpm run docs:check-links
pnpm run docs:verify
```

## Результат

Документация по методам Result переведена в двухслойный канонический формат (Rust-ID map + progress layer), при этом legacy-версии сохранены как исторический контекст.
