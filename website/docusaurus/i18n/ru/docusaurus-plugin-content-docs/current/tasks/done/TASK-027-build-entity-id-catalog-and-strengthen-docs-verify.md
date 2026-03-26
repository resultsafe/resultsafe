---
id: TASK-027
uuid: 1ce3405c-d6d2-4e7d-9f22-a1cd3422384d
title: 'Построить единый entity-id каталог и усилить docs verify'
type: task
status: done
kb_lifecycle: archive
priority: high
assignee: 'codex'
created: 2026-03-23
updated: 2026-03-23
links: [DOC-004, DOC-005, DOC-006, DOC-007, SPEC-004, SPEC-008]
tags: [documentation, identifiers, database, automation, verify]
ai_source: null
lang: ru
translation_of: docs/tasks/done/TASK-027-build-entity-id-catalog-and-strengthen-docs-verify.md
translation_status: outdated
---

# TASK-027: Построить единый entity-id каталог и усилить docs verify

## Контекст

Требовалась полная проверяемая связка между документацией, package/method ID, semantic layer и Python parity для надежного управления сущностями в базе данных.

## Что реализовано

### ST-027-01: Новый machine-readable entity catalog

- [x] Добавлен use-case `tools/automation/application/sync_entity_catalog.py`.
- [x] Реализован артефакт `docs/obsidian/specs/identifier-registry/MONOREPO-ENTITY-CATALOG.json`.
- [x] В каталог включены:
  - документы `docs/obsidian` и root documents (`README`, `AI_CONTEXT`, `TASK_CONTEXT`);
  - TS package/method registry;
  - semantic modules/methods/types;
  - Python parity packages/methods;
  - Rust baseline method IDs.
- [x] Добавлен relation-слой со статусами `resolved/unresolved/ignored`.

### ST-027-02: Усиление governance-проверок

- [x] `docs verify` теперь проверяет:
  - уникальность `frontmatter.id`;
  - формат `frontmatter.id`;
  - резолвинг `frontmatter.links` в известные ID сущностей.
- [x] Добавлен учет root-document IDs и registry IDs при проверке ссылок.

### ST-027-03: Оркестрация и CLI

- [x] Добавлена команда `docs sync-entity-catalog`.
- [x] Обновлен оркестратор `docs sync-registries`:
  - `identifiers -> semantic -> python-parity -> entity-catalog`.
- [x] Добавлен npm script `docs:sync-entity-catalog`.

### ST-027-04: Тесты

- [x] Добавлен тест `tools/automation/tests/test_sync_entity_catalog.py`.
- [x] Расширены:
  - `test_verify_docs.py`;
  - `test_sync_registries.py`.

## Acceptance Criteria

- [x] Единый entity-catalog генерируется детерминированно.
- [x] `docs verify` выявляет дубли/битые ссылки по ID.
- [x] Оркестратор реестров включает новый слой.
- [x] Unit-тесты automation проходят.

## Проверки

```bash
python -m unittest tools.automation.tests.test_verify_docs tools.automation.tests.test_sync_entity_catalog tools.automation.tests.test_sync_registries -v
python -m tools.automation docs sync-registries --root .
python -m tools.automation docs verify --root .
python -m tools.automation docs check-links --root . --fail-on-missing true
```

## Результат

В проект добавлен production-ready слой `entity-id catalog`, который повышает согласованность документации и ID-сущностей и делает DB-проекцию управляемой и проверяемой.
