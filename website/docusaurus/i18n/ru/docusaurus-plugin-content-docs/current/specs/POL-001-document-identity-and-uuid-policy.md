---
id: POL-001
uuid: 32839dd0-3df5-4173-9bd8-0ac82dbbdd03
title: 'Document Identity and UUID Policy'
type: policy
status: active
kb_lifecycle: current
owner: 'core-fp'
source_of_truth: self
version: 1.0
created: 2026-03-23
updated: 2026-03-23
links: [DOC-002, DOC-004, DOC-007, SPEC-014, SPEC-016, RB-005]
tags: [documentation, governance, uuid, identity, lineage, rag]
lang: ru
translation_of: docs/specs/POL-001-document-identity-and-uuid-policy.md
translation_status: actual
---

# POL-001: Document Identity and UUID Policy

## 1. Назначение и статус документа

Настоящая политика определяет обязательные правила идентичности документов и использования UUID в системе управления знаниями проекта.

Политика устанавливает:

- что считается стабильной идентичностью документа;
- как должен назначаться и использоваться UUID;
- как должны связываться документы между `/docs/obsidian/` и `/docs/docusaurus/`;
- как различать один и тот же логический документ и его производные публикационные представления;
- как использовать document identity в knowledge graph, БД знаний, индексах, RAG-пайплайне, системах синхронизации, аудита и публикации.

Настоящая политика является нормативной частью governance knowledge system проекта и обязательна для:

- master knowledge layer;
- publication layer;
- document registry;
- систем индексации и поиска;
- RAG-корпуса;
- knowledge graph;
- процедур аудита, миграции, публикации и синхронизации документации.

## 2. Цели политики

1. Обеспечить стабильную идентичность документа независимо от имени файла, пути, slug, title, структуры каталогов, навигации и редакционного оформления.
2. Обеспечить надежное управление жизненным циклом документа при rename, move, реорганизации каталогов, републикации и изменениях frontmatter.
3. Обеспечить корректную работу knowledge graph, document database, document registry, дедупликации, инкрементальной индексации и синхронизации между контурами.
4. Исключить потерю идентичности документа при rename/move и потерю трассируемой связи между source и publication представлениями.

## 3. Область действия

Политика применяется ко всем значимым документам knowledge base, включая архитектурные документы, API/контракты, data model, runbook, onboarding, ADR/RFC/policy, glossary, reference-материалы, документы в `/docs/obsidian/` и `/docs/docusaurus/`.

Политика не отменяет общие правила documentation governance, а конкретизирует правила document identity.

## 4. Базовые определения

### 4.1 Документ

Документ - это управляемая единица knowledge corpus, имеющая содержание, роль, аудиторию, lifecycle-статус, отношение к source of truth и машинную/человеко-читаемую идентификацию.

### 4.2 Логический документ

Логический документ - это единица знания, сохраняющая идентичность независимо от имени файла, пути, формата и minor editorial changes.

### 4.3 Physical representation

Physical representation - конкретный файл или опубликованное представление документа в определенном контуре, формате или pipeline-стадии.

### 4.4 Master document

Master document - первичное представление логического документа.

### 4.5 Derived document

Derived document - самостоятельное производное представление знания с иной структурой, детализацией, аудиторией или lifecycle.

### 4.6 Document UUID

Document UUID - стабильный машинный идентификатор логического документа.

### 4.7 Derived-from relation

`derived_from_uuid` - машиночитаемая ссылка производного документа на UUID исходного документа.

## 5. Нормативные принципы document identity

### 5.1 Главный принцип идентичности

Истинная идентичность документа определяется UUID, а не именем файла, title, slug или path.

### 5.2 UUID как стабильный технический идентификатор

Для значимых документов стабильным техническим идентификатором считается только UUID. Остальные идентификаторы являются человеко-читаемыми или presentation-level.

### 5.3 Стабильность важнее пути

Путь документа - изменяемое свойство. Rename/move/реорганизация не меняют UUID.

### 5.4 Логическая идентичность и физическое представление

UUID идентифицирует логическую единицу знания, а не конкретный файл.

## 6. Обязательность UUID

### 6.1 Общее правило

Каждый значимый документ knowledge base обязан иметь стабильный UUID в frontmatter.

### 6.2 UUID обязателен для документов, которые

- входят в managed knowledge corpus;
- участвуют в RAG и knowledge graph;
- индексируются retrieval/search системами;
- хранятся в document registry;
- важны для архитектуры, эксплуатации, API, инфраструктуры, security и onboarding;
- синхронизируются между `/docs/obsidian/` и `/docs/docusaurus/`;
- выступают source of truth или производными от source of truth;
- подлежат governance и аудиту.

### 6.3 Исключения

Исключения возможны только для явно второстепенных временных материалов, не входящих в индексируемый и управляемый knowledge corpus.

### 6.4 Governance-правило

Отсутствие UUID у значимого документа считается дефектом governance и зрелости knowledge system.

## 7. Требования к размещению UUID

### 7.1 UUID в frontmatter

UUID должен храниться отдельным полем `uuid` в frontmatter.

```yaml
---
uuid: 8d5d9c7e-6d7f-4a6c-9d8d-2d6b2f9a1c41
title: 'Database Schema Overview'
status: current
owner: platform-team
---
```

### 7.2 UUID не пользовательский идентификатор

UUID не должен использоваться в имени файла, title, slug и пользовательской навигации.

### 7.3 Машиночитаемость

Поле `uuid` должно быть предсказуемым, единообразным и валидируемым automation-пайплайнами.

## 8. Требования к стабильности UUID

1. UUID создается один раз при создании логического документа.
2. UUID не меняется при rename/move/title/slug/frontmatter updates.
3. Новый UUID допускается только при создании нового логического документа.
4. Запрещено генерировать новый UUID для 1:1 публикации того же документа.

## 9. UUID и логическая идентичность документа

### 9.1 Тот же документ

Документ считается тем же логическим документом, если сохраняются предмет знания, смысловые границы, назначение и source meaning.

### 9.2 Что не меняет логическую идентичность

Rename, move, смена title/slug, minor restructuring, редакционные правки и 1:1 публикация в другом контуре сами по себе не создают новый логический документ.

### 9.3 Что может менять логическую идентичность

Существенная переработка границ, агрегация/декомпозиция, смена целевой аудитории и превращение в самостоятельный knowledge object.

## 10. Связь `/docs/obsidian/` и `/docs/docusaurus/`

1. Для одного логического документа в двух контурах обязателен identity linkage по UUID.
2. Учитываются разные роли контуров: master knowledge layer и publication layer.
3. Для derived publication обязательно фиксировать происхождение через `derived_from_uuid` (или эквивалентный lineage-механизм).

## 11. Рекомендуемая hybrid identity model

1. В `/docs/obsidian/` - обязательный `uuid`.
2. В `/docs/docusaurus/`:

- тот же `uuid`, если это тот же логический документ;
- отдельный `uuid` + `derived_from_uuid`, если это производная публикационная версия.

## 12. Когда использовать тот же UUID

Тот же UUID обязателен для 1:1 representation, где изменены только расположение, MDX-обвязка, навигация и minor stylistic правки без смены смысловых границ.

## 13. Когда использовать новый UUID и `derived_from_uuid`

Новый UUID обязателен для сокращенной, агрегированной, структурно переработанной и аудиториально адаптированной publication-версии. В таком случае обязателен `derived_from_uuid` (или `derived_from_uuids` для множественных источников).

## 14. Целевая модель управления

- same logical document -> общий `uuid`;
- derived publication document -> отдельный `uuid` + `derived_from_uuid`.

Эта модель является целевой для production-grade knowledge system.

## 15. Рекомендуемые схемы frontmatter

### 15.1 Master document (`/docs/obsidian/`)

```yaml
---
uuid: 8d5d9c7e-6d7f-4a6c-9d8d-2d6b2f9a1c41
title: 'Database Schema Overview'
status: current
owner: platform-team
document_role: reference
source_of_truth: self
---
```

### 15.2 1:1 publication representation (`/docs/docusaurus/`)

```yaml
---
uuid: 8d5d9c7e-6d7f-4a6c-9d8d-2d6b2f9a1c41
title: 'Database Schema Overview'
status: current
owner: platform-team
document_role: reference
source_of_truth: /docs/obsidian/data/database-schema-overview.md
publication_layer: docusaurus
---
```

### 15.3 Derived publication document (`/docs/docusaurus/`)

```yaml
---
uuid: b1b3c8d0-2f8a-4f0b-9f93-4f760b9f2d11
derived_from_uuid: 8d5d9c7e-6d7f-4a6c-9d8d-2d6b2f9a1c41
title: 'Database Schema Overview (Guide)'
status: current
owner: platform-team
document_role: guide
source_of_truth: /docs/obsidian/data/database-schema-overview.md
publication_layer: docusaurus
---
```

## 16. UUID как основа систем управления знаниями

UUID должен быть каноническим техническим ключом в:

- document registry;
- knowledge graph;
- document database;
- incremental indexing;
- rename/move tracking;
- synchronization;
- audit/governance.

## 17. UUID и инкрементальная индексация

Если документ сохранил UUID, система должна трактовать изменения path/title/navigation как обновление того же документа, без ложных дубликатов.

## 18. UUID и chunk identifiers

`document_uuid` и `chunk_id` - разные сущности.

Рекомендуется формировать `chunk_id` как производный ключ, например:

- `document_uuid + heading_path`;
- `document_uuid + stable_fragment_id`;
- `document_uuid + content_hash`.

## 19. Ограничения и запреты

Запрещается:

- использовать path/title/slug как canonical identity;
- генерировать новый UUID при rename/move;
- использовать один UUID для логически независимых документов;
- смешивать `document_uuid` и `chunk_id`;
- терять lineage для derived publication документов.

## 20. Migration и lifecycle правила

1. Existing documents без UUID приводятся к политике через controlled migration.
2. Миграция должна обеспечивать одноразовое присвоение UUID и сохранение при дальнейших rename/move.
3. Lifecycle-события `current -> legacy -> archive` не меняют UUID.
4. UUID изменяется только при создании нового логического документа.

## 21. Audit rules

При аудите:

1. Значимый документ без UUID считается governance-дефектом.
2. Path не должен использоваться как canonical identity.
3. Rename/move не создают новый logical document.
4. Source/publication связь должна иметь identity linkage.
5. Потеря lineage считается дефектом зрелости системы.

## 22. Production implementation guidance

### 22.1 Обязательно внедрить

- UUID validation;
- duplicate UUID detection;
- missing UUID detection;
- lineage validation для `derived_from_uuid`;
- document registry;
- identity consistency checks;
- UUID-based indexing pipeline.

### 22.2 Желательно внедрить

- migration tooling;
- rename/move detection с registry update;
- lineage visualization в knowledge graph;
- policy checks в CI;
- orphan/unresolved lineage reports.

### 22.3 Для long-term scale

- не зависеть от file path как identity anchor;
- не терять source-publication lineage;
- не смешивать logical sameness и editorial derivation;
- не строить RAG на path-based identity.

## 23. Критерии соответствия политике

Документ соответствует политике, если:

- имеет `uuid` в frontmatter;
- UUID стабилен при rename/move;
- identity не завязана на path/title/slug;
- publication/source связь выражена явно;
- для derived publication указан `derived_from_uuid` (или эквивалент).

## 24. Краткая нормативная версия

1. Каждый значимый документ knowledge base обязан иметь стабильный UUID в frontmatter.
2. UUID не изменяется после создания и не зависит от path/title/slug.
3. Для same logical document в двух контурах используется общий UUID.
4. Для derived publication используется отдельный UUID + `derived_from_uuid`.
5. UUID - основной технический ключ для registry, graph, indexing, sync и audit.

## 25. Финальная нормативная формулировка

В проекте стабильная идентичность документа определяется исключительно UUID.

Для production-grade knowledge system используется UUID-based identity model с обязательной поддержкой source-publication linkage, lineage tracking и инкрементальной индексации на основе `document_uuid`.

Целевая hybrid identity model:

- master documents имеют обязательный UUID;
- 1:1 publication representations используют тот же UUID;
- derived publication documents используют собственный UUID и `derived_from_uuid`.
