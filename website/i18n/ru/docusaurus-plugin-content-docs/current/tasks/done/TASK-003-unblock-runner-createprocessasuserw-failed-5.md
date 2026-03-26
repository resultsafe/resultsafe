---
id: TASK-003
uuid: 25d61a44-415d-45bf-9854-a37e8964046b
title: 'Разблокировать runner: CreateProcessAsUserW failed: 5'
type: task
status: cancelled
kb_lifecycle: archive
phase: 0
parent: PHASE-0
depends_on: []
priority: critical
assignee: 'codex'
created: 2026-03-22
updated: 2026-03-23
links: [TASK-002, NOTE-001, NOTE-002, TASK-004]
tags: [infrastructure, runner, blocker, cancelled]
ai_source: null
lang: ru
translation_of: docs/tasks/done/TASK-003-unblock-runner-createprocessasuserw-failed-5.md
translation_status: outdated
---

# TASK-003: Разблокировать runner: CreateProcessAsUserW failed: 5

## Контекст

Задача была создана как инфраструктурный блокер shell-runner.

## Симптом

`windows sandbox: runner error: CreateProcessAsUserW failed: 5`

## Причина отмены

В актуальной среде shell-команды исполняются, а фактический блокер оказался в самом скрипте линк-чекера (parser/args/path handling), а не в инфраструктуре runner. Исправление перенесено в [[TASK-004-fix-doc-link-checker-powershell-parser]].

## Что сделано

- [x] Подтверждено, что runner в текущей среде работает.
- [x] Корневая причина перенесена в `TASK-004` и устранена.
- [x] `docs:check-links` и `docs:check-links:report` теперь выполняются успешно.

## Acceptance Criteria

- [x] Shell-команда `Get-Location` выполняется без ошибки runner.
- [x] Скрипт `check-doc-links.ps1` завершает полный проход.

## Результат

Задача закрыта со статусом `cancelled` как неактуальная формулировка первопричины. Фактическое исправление выполнено в [[TASK-004-fix-doc-link-checker-powershell-parser]].
