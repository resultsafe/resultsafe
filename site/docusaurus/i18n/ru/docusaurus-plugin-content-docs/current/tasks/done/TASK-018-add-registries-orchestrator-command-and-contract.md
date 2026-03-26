---
id: TASK-018
uuid: 3a21e579-c56b-4dcf-9ae6-283f50e61a8a
title: 'Добавить оркестратор синхронизации реестров и зафиксировать контракт'
type: task
status: done
kb_lifecycle: archive
priority: high
assignee: 'codex'
created: 2026-03-22
updated: 2026-03-23
links: [DOC-005, SPEC-004, NOTE-009]
tags: [documentation, automation, registries, orchestration]
ai_source: null
lang: ru
translation_of: docs/tasks/done/TASK-018-add-registries-orchestrator-command-and-contract.md
translation_status: outdated
---

# TASK-018: Добавить оркестратор синхронизации реестров и зафиксировать контракт

## Контекст

После появления двух отдельных команд синхронизации (`identifiers` и `semantic`) требовалась единая каноническая команда, которая гарантирует правильный порядок и уменьшает операционные ошибки.

## Что сделать

- [x] Реализовать оркестратор `sync-registries` в automation CLI.
- [x] Добавить npm-wrapper `docs:sync-registries`.
- [x] Добавить unit-тест на оркестрацию.
- [x] Обновить `SPEC-004` и root-контракты (`README`, `AI_CONTEXT`, `TASK_CONTEXT`).
- [x] Прогнать проверки целостности документации.

## Acceptance Criteria

- [x] Команда `pnpm run docs:sync-registries` успешно выполняется.
- [x] Порядок `identifiers -> semantic` зафиксирован в контракте.
- [x] Unit-тесты automation проходят.
- [x] `docs:check-links` и `docs:verify` проходят без ошибок.

## Проверки

```bash
pnpm run automation:test
pnpm run docs:sync-registries
pnpm run docs:check-links
pnpm run docs:verify
```

## Результат

Единая оркестрация синхронизации реестров внедрена и задокументирована как канонический operational path.
