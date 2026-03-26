---
id: TASK-012
uuid: 7343e4aa-2770-4915-9aac-509d235094ff
title: 'Нормализовать legacy-описания пакетов core'
type: task
status: done
kb_lifecycle: archive
priority: high
assignee: 'codex'
created: 2026-03-22
updated: 2026-03-23
links: [DOC-003, DOC-004, SPEC-001, SPEC-003, NOTE-003]
tags: [documentation, legacy, packages, normalization]
ai_source: null
lang: ru
translation_of: docs/tasks/done/TASK-012-normalize-core-package-legacy-descriptions.md
translation_status: outdated
---

# TASK-012: Нормализовать legacy-описания пакетов core

## Контекст

Каталог `docs/obsidian/specs/legacy-package-descriptions-core` содержал неполные и частично устаревшие структурные описания пакетов (`fp-*`), что создавало drift между документацией и фактической структурой монорепы.

## Что сделать

- [x] Проверить coverage legacy-карточек относительно фактических пакетов.
- [x] Нормализовать существующие `Структура пакета *.md` на основе `package.json` + `src/*`.
- [x] Добавить недостающие карточки (`fp-option-shared`, `fp-result-shared`, `fp-codec-zod`).
- [x] Добавить индекс `docs/obsidian/specs/legacy-package-descriptions-core/index.md`.
- [x] Зафиксировать sync-политику в `SPEC-003`.

## Acceptance Criteria

- [x] В `docs/obsidian/specs/legacy-package-descriptions-core` нет пустых ключевых структурных карточек.
- [x] Каждая карточка содержит canonical package name и package path.
- [x] Build-артефакты (`dist/*`) не включаются в структурные карточки.
- [x] Governance-индексы и счетчики обновлены.

## Проверки

```bash
pnpm run docs:check-links
pnpm run docs:verify
```

## Результат

Legacy-контур структурных описаний пакетов приведен к фактической структуре репозитория и интегрирован в `docs/obsidian` через `SPEC-003` и `NOTE-003`.
