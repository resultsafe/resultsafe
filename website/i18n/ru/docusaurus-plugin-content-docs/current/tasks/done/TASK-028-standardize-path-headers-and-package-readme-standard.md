---
id: TASK-028
uuid: 827c2af0-507f-4fc8-a385-243401c6c77e
title: 'Нормализовать path-заголовки в коде и зафиксировать стандарт package README'
type: task
status: done
kb_lifecycle: archive
priority: high
assignee: 'codex'
created: 2026-03-23
updated: 2026-03-23
links: [DOC-004, SPEC-009]
tags: [standards, path-header, readme, packages, governance]
ai_source: null
lang: ru
translation_of: docs/tasks/done/TASK-028-standardize-path-headers-and-package-readme-standard.md
translation_status: outdated
---

# TASK-028: Нормализовать path-заголовки в коде и зафиксировать стандарт package README

## Контекст

Требовалось:

- формально закрепить единый формат path-комментариев в начале code-файлов;
- удалить старые неактуальные форматы path-комментариев;
- зафиксировать отдельный production-стандарт содержимого package README.

## Что реализовано

### ST-028-01: Стандарт path-заголовков

- [x] В `DOC-004` добавлен контракт path-заголовков (`§9.6`).
- [x] Зафиксирован канон: `// path: <relative/path/from-repo-root>`.
- [x] Форматы вида `// @resultsafe-...` и иные legacy-варианты объявлены неканоническими.

### ST-028-02: Нормализация кода

- [x] Выполнена массовая замена старых path-заголовков в code-файлах.
- [x] Удалены неактуальные/ошибочные варианты path-комментариев на первой строке файлов.
- [x] Приведено к единому формату `// path: ...`.

### ST-028-03: Стандарт package README

- [x] Добавлен отдельный `SPEC-009` со структурой и критериями качества README для всех пакетов.
- [x] Стандарт связан с действующим governance-контуром.

## Acceptance Criteria

- [x] В стандарте документации есть явный контракт path-заголовков.
- [x] В коде не осталось legacy-format path-комментариев в целевом контуре.
- [x] Для package README существует отдельный formal SPEC.

## Проверки

```bash
python -m tools.automation docs verify --root .
python -m tools.automation docs check-links --root . --fail-on-missing true
```

## Результат

Контракты по path-заголовкам и package README переведены в канонический production-формат, а кодовая база очищена от старых форматов path-комментариев.

