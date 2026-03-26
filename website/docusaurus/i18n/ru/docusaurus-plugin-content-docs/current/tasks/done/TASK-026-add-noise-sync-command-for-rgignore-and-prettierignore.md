---
id: TASK-026
uuid: be10b40a-e570-4691-9b3a-590bae22c052
title: 'Добавить команду синхронизации noise-ignore для .rgignore и .prettierignore'
type: task
status: done
kb_lifecycle: archive
priority: high
assignee: 'codex'
created: 2026-03-22
updated: 2026-03-23
links: [DOC-004, SPEC-002, SPEC-007, TASK-025]
tags: [noise, automation, cli, rgignore, prettierignore]
ai_source: null
lang: ru
translation_of: docs/tasks/done/TASK-026-add-noise-sync-command-for-rgignore-and-prettierignore.md
translation_status: outdated
---

# TASK-026: Добавить команду синхронизации noise-ignore для `.rgignore` и `.prettierignore`

## Контекст

После внедрения noise-layer возник риск дрейфа между:

- `config/noise-ignore.txt`;
- `.rgignore`;
- `.prettierignore`.

Нужна была каноническая команда, которая детерминированно синхронизирует ignore-файлы из одного source-of-truth.

## Что реализовано

### ST-026-01: Новый use-case в automation CLI

- [x] Добавлен application-слой: `tools/automation/application/sync_noise_ignores.py`.
- [x] Добавлена команда CLI: `docs sync-noise-ignores`.
- [x] Добавлен npm-скрипт: `docs:sync-noise`.

### ST-026-02: Детерминированный контракт генерации

- [x] Источник входа: `config/noise-ignore.txt`.
- [x] Выход: `.rgignore` и `.prettierignore` перегенерируются детерминированно.
- [x] Для `.prettierignore` сохранены базовые tool-specific паттерны:
  - `.env`
  - `*.env.*`
  - `**/out/`

### ST-026-03: Тестирование и интеграция

- [x] Добавлены тесты:
  - `tools/automation/tests/test_sync_noise_ignores.py`
  - расширен `tools/automation/tests/test_check_links.py`
- [x] Подтверждена идемпотентность синхронизации.

## Acceptance Criteria

- [x] Ignore-файлы синхронизируются одной командой без ручных правок.
- [x] Источник правил единственный и документирован в `SPEC-007`.
- [x] Команда не ломает текущую `pnpm` link/junction архитектуру.

## Проверки

```bash
python -m pytest tools/automation/tests -q
pnpm run docs:sync-noise
pnpm run docs:check-links
pnpm run docs:verify
```

## Результат

Введена production-команда синхронизации noise-исключений, которая устраняет рассинхрон `.rgignore/.prettierignore` и делает процесс расширяемым и предсказуемым.
