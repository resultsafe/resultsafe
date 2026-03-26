---
id: TASK-013
uuid: 52075a06-2352-4025-9f17-476d5078b12c
title: 'Нормализовать legacy namespace в описаниях пакетов'
type: task
status: done
kb_lifecycle: archive
priority: medium
assignee: 'codex'
created: 2026-03-22
updated: 2026-03-23
links: [DOC-003, DOC-004, SPEC-003, NOTE-004]
tags: [documentation, legacy, namespace, normalization]
ai_source: null
lang: ru
translation_of: docs/tasks/done/TASK-013-normalize-legacy-package-namespaces.md
translation_status: outdated
---

# TASK-013: Нормализовать legacy namespace в описаниях пакетов

## Контекст

После структурной нормализации legacy-карточек в `docs/obsidian/specs/legacy-package-descriptions-core` оставались исторические namespace в исследовательских материалах: `@monorepa/*` и `@resultsafe-fp-*`.

## Что сделать

- [x] Найти все legacy namespace в subtree `docs/obsidian/specs/legacy-package-descriptions-core`.
- [x] Перевести их в актуальный формат `@resultsafe-core-fp-*`.
- [x] Проверить отсутствие старых namespace после замены.
- [x] Зафиксировать результат в `NOTE-004`.

## Acceptance Criteria

- [x] В `docs/obsidian/specs/legacy-package-descriptions-core` отсутствуют `@monorepa/*`.
- [x] В `docs/obsidian/specs/legacy-package-descriptions-core` отсутствуют `@resultsafe-fp-*`.
- [x] Namespace-соглашение унифицировано до `@resultsafe-core-fp-*`.

## Проверки

```bash
rg -n "@monorepa/|@resultsafe-fp-" docs/obsidian/specs/legacy-package-descriptions-core -g "*.md"
pnpm run docs:check-links
pnpm run docs:verify
```

## Результат

Legacy namespace в package-документации нормализованы, остаточный дрейф по scope-именам устранен.

