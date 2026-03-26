---
id: TASK-010
uuid: b6b97b29-1378-43b2-a137-8f4e1e4ae5ba
title: 'Добавить smoke-check pipeline для governance-документации'
type: task
status: done
kb_lifecycle: archive
phase: 1
parent: PHASE-1
depends_on: [TASK-004, TASK-005, TASK-006, TASK-007, TASK-008, TASK-009]
priority: high
assignee: 'codex'
created: 2026-03-22
updated: 2026-03-23
links: [PHASE-1, FEAT-002, DOC-004, RB-001]
tags: [documentation, validation, automation, governance]
ai_source: null
lang: ru
translation_of: docs/tasks/done/TASK-010-add-documentation-governance-smoke-check-pipeline.md
translation_status: outdated
---

# TASK-010: Добавить smoke-check pipeline для governance-документации

## Контекст

Документация развивается, но без автоматизированного smoke-check легко повторно получить дрейф статусов, индексов и базовых правил frontmatter/ссылок.

## Что сделать

- [x] Ввести проверочный сценарий `docs:verify` (скрипт + npm script).
- [x] Включить в проверку минимум:
  - целостность ссылок;
  - обязательные поля frontmatter (с учетом принятой политики ai-session);
  - отдельную валидацию `ai-session-*.md` по правилу §3.2 (`concept`, `date`, `ai_tool`, `model`);
  - базовую полноту индексов разделов.
- [x] Обновить `RB-001` с обязательным запуском `docs:verify` перед переводом TASK в `done`.
- [x] Добавить запуск `docs:verify` в CI (или подготовить готовый CI-snippet).

## Acceptance Criteria

- [x] `pnpm run docs:verify` стабильно запускается локально.
- [x] Набор проверок ловит ключевые типы документного дрейфа.
- [x] Процедура запуска и интерпретации результата описана в runbook.

## Проверки

```bash
pnpm run docs:verify
```

## Риски

- Избыточно строгие проверки могут замедлить поток мелких документационных правок.

## Результат

Добавлен root script `docs:verify` с frontmatter-проверками (включая ai-session exception), базовой полнотой section-index и строгим link-check. Обновлен `RB-001` как обязательный docs gate перед `TASK -> done`, добавлен CI workflow `.github/workflows/docs-verify.yml`, а README/AI_CONTEXT/TASK_CONTEXT синхронизированы с baseline. Реализация перенесена в канонический Python CLI-контур в рамках `TASK-011`.
