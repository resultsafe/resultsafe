---
id: TASK-016
uuid: 74de5d95-0910-494e-b178-9db914adad12
title: 'Нормализовать и интегрировать semantic-модули fp-result из legacy-директории'
type: task
status: done
kb_lifecycle: archive
priority: high
assignee: 'codex'
created: 2026-03-22
updated: 2026-03-23
links: [DOC-003, DOC-005, SPEC-004, NOTE-007]
tags: [documentation, semantics, fp-result, legacy, normalization]
ai_source: null
lang: ru
translation_of: docs/tasks/done/TASK-016-normalize-and-integrate-semantic-modules-fp-result.md
translation_status: outdated
---

# TASK-016: Нормализовать и интегрировать semantic-модули fp-result из legacy-директории

## Контекст

В директории `docs/obsidian/specs/legacy-semantic-modules` находились два пересекающихся документа с дублированием и конфликтом нумерации ID в модуле `flow`, что мешало надежно использовать semantic-слой как часть production-документации.

## Что сделать

- [x] Провести аудит содержимого `docs/obsidian/specs/legacy-semantic-modules`.
- [x] Сохранить исходные материалы в archive-слое без удаления данных.
- [x] Сформировать единый канонический semantic-документ.
- [x] Добавить индекс директории semantic-слоя.
- [x] Привязать semantic-методы к production ID (`METHOD-*`) из `DOC-005`.
- [x] Синхронизировать `docs/obsidian` индексы, реестры и счетчики.

## Acceptance Criteria

- [x] Есть единый канонический документ semantic-слоя по `fp-result`.
- [x] Legacy-источники перенесены в `docs/obsidian/specs/legacy-semantic-modules/_legacy/`.
- [x] Исправлен конфликт нумерации: `resSwap` = `ID 16`, `resMatch` = `ID 17`.
- [x] `DOC-003` отражает subtree `docs/obsidian/specs/legacy-semantic-modules`.
- [x] Проверки ссылок и структуры документации проходят.

## Проверки

```bash
pnpm run docs:check-links
pnpm run docs:verify
```

## Результат

Semantic-слой `fp-result` интегрирован в монорепозиторий в нормализованном формате с прозрачной трассировкой к production-реестру идентификаторов и зафиксирован в governance-контуре `docs/obsidian`.
