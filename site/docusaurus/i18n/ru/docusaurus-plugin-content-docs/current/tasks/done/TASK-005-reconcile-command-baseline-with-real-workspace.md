---
id: TASK-005
uuid: e90c4b44-8ae7-4fc8-8ded-ee78a0565c21
title: 'Согласовать командный baseline документации с реальным workspace'
type: task
status: done
kb_lifecycle: archive
phase: 1
parent: PHASE-1
depends_on: [TASK-004]
priority: critical
assignee: 'codex'
created: 2026-03-22
updated: 2026-03-23
links: [PHASE-1, FEAT-002, DOC-002, DOC-README-001, DOC-AI-001, DOC-AI-002]
tags: [documentation, scripts, workspace, reliability]
ai_source: null
lang: ru
translation_of: docs/tasks/done/TASK-005-reconcile-command-baseline-with-real-workspace.md
translation_status: outdated
---

# TASK-005: Согласовать командный baseline документации с реальным workspace

## Контекст

Текущие команды из `README.md`, `AI_CONTEXT.md`, `TASK_CONTEXT.md` частично не исполняются в текущем состоянии репозитория (`lint/test/build`), что делает workflow недостоверным.

## Что сделать

- [x] Зафиксировать truth table по root-командам: что работает, что нет, почему.
- [x] Обновить baseline-команды в `README.md`, `AI_CONTEXT.md`, `TASK_CONTEXT.md` на исполнимые.
- [x] Обновить root `package.json` scripts (`workspace:list`, `smoke:docs`, `smoke:docs:report`) и зафиксировать package-targeted запуск для quality.
- [x] Выравнять команду проверки workspace: `pnpm -r list --depth -1 --json` как canonical.

## Acceptance Criteria

- [x] Все команды из разделов "Базовые команды"/"Команды проверки" либо исполняются, либо явно помечены как ограниченные.
- [x] Нет расхождений между README, AI_CONTEXT и TASK_CONTEXT по базовому workflow.
- [x] Минимальный smoke-run задокументированных команд завершается ожидаемо.

## Проверки

```bash
pnpm run workspace:list
pnpm run smoke:docs
pnpm run smoke:docs:report
```

## Риски

- Выявление проблем в scripts может вывести задачу за пределы документационного scope.

## Результат

### Truth table (root commands, 2026-03-22)

| Команда                          | Статус  | Комментарий                                                                            |
| -------------------------------- | ------- | -------------------------------------------------------------------------------------- |
| `pnpm -w list --depth -1 --json` | limited | Показывает только root-пакет, не подходит как workspace inventory                      |
| `pnpm -r list --depth -1 --json` | ok      | Канонический список root + workspace-пакетов                                           |
| `pnpm lint`                      | limited | Non-canonical root script в migration-state (конфиг-пути/скрипты пакетов не выровнены) |
| `pnpm test`                      | limited | Non-canonical root script в migration-state                                            |
| `pnpm build`                     | limited | Non-canonical root script в migration-state                                            |
| `pnpm run workspace:list`        | ok      | Новый стабильный root baseline                                                         |
| `pnpm run smoke:docs`            | ok      | Root smoke-check документации                                                          |
| `pnpm run smoke:docs:report`     | ok      | Root report-режим без fail-gate                                                        |

### Изменения

- Обновлены root scripts в `package.json`: `workspace:list`, `smoke:docs`, `smoke:docs:report`.
- Обновлены baseline-команды в `README.md`, `AI_CONTEXT.md`, `TASK_CONTEXT.md`.
- Зафиксирован migration-статус для root `lint/test/build` и правило package-targeted запуска.

### Проверки

- `pnpm run workspace:list` -> OK
- `pnpm run smoke:docs` -> OK (`Missing links: 0`)
- `pnpm run smoke:docs:report` -> OK (`Missing links: 0`)
