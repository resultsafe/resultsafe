---
id: DOC-004
uuid: 830be8b1-dee7-417a-8f45-98cc6c812cf6
title: 'Стандарт оформления документации'
status: draft
layer: authored
lang: ru
translation_available: ru
created: 2026-03-23
updated: 2026-03-23
translation_of: docs/specs/DOC-004-documentation-standards.md
translation_status: actual
---

# Стандарт оформления документации

**Status:** draft — canonical English version pending authoring.
Russian version available at:
site/docusaurus/i18n/ru/docusaurus-plugin-content-docs/current/specs/DOC-004-documentation-standards.md

## Поля frontmatter для мультиязычности

Для canonical (английских) документов:

| Поле                  | Обязательное | Значение          |
| --------------------- | ------------ | ----------------- |
| lang                  | да           | en                |
| translation_available | нет          | список языков: ru |

Для переводов:

| Поле               | Обязательное | Значение                  |
| ------------------ | ------------ | ------------------------- |
| lang               | да           | код языка: ru, de, fr     |
| translation_of     | да           | путь к canonical файлу    |
| translation_status | да           | actual / outdated / draft |
