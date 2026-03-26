---
id: TASK-015
uuid: 866e42cc-ef4a-4c15-86b9-fe4a31a21e1a
title: 'Построить production-слой уникальных идентификаторов пакетов и методов'
type: task
status: done
kb_lifecycle: archive
priority: high
assignee: 'codex'
created: 2026-03-22
updated: 2026-03-23
links: [DOC-005, SPEC-004, NOTE-006]
tags: [identifiers, packages, methods, automation, production]
ai_source: null
lang: ru
translation_of: docs/tasks/done/TASK-015-build-monorepo-identifier-layer-for-packages-and-methods.md
translation_status: outdated
---

# TASK-015: Построить production-слой уникальных идентификаторов пакетов и методов

## Контекст

Требовалась надежная система, где каждому пакету и методу монорепозитория присваивается уникальный идентификатор, а текущий статус реализации отображается в таблицах и древовидной структуре.

## Что сделать

- [x] Спроектировать формат и правила стабильных идентификаторов для пакетов и методов.
- [x] Реализовать автоматическую синхронизацию реестра.
- [x] Вынести machine-readable слой и человекочитаемый слой.
- [x] Добавить статусную модель (`выполнено`, `в корректировке`, `планируемо`, `архивировано`).
- [x] Зафиксировать governance-контракт в `SPEC-004`.
- [x] Обновить индексы и счетчики документации.

## Acceptance Criteria

- [x] У каждого пакета есть уникальный `PACKAGE-*`.
- [x] У каждого метода есть уникальный `METHOD-*`.
- [x] Реестр содержит таблицы и дерево с текущими статусами.
- [x] Идентификаторы стабильны при повторной генерации.
- [x] Есть каноническая команда синхронизации.

## Проверки

```bash
pnpm run docs:sync-identifiers
pnpm run automation:test
pnpm run docs:check-links
pnpm run docs:verify
```

## Результат

Внедрен production-слой идентификаторов пакетов и методов с автоматической синхронизацией, стабильным назначением ID и полной визуализацией состояния через таблицы и дерево.
