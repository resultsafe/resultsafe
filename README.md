---
uuid: 12c4aa39-b00c-474e-a96f-523e4d75de46
---

<a id="top"></a>

# ResultSafe Monorepo — Project Canon

---

## Управление документом

| Поле | Значение |
|------|----------|
| ID документа | `DOC-README-001` |
| Версия | 2.0 |
| Статус | `ACTIVE` |
| Создан | 2026-03-21 |
| Обновлён | 2026-03-23 |
| Владелец | core-fp |
| Проект | `lib-resultsafe-monorepo-8f2c7a1d` |
| Workspace root | `e:\10-projects\lib\resultsafe-monorepo-8f2c7a1d` |
| Источник истины | `packages/` + `package.json` + `pnpm-workspace.yaml` |
| Концепты | `docs/obsidian/` (governance), `docs/docusaurus/` (curated portal), `docs/` (legacy) |

---

<a id="rm-toc"></a>

## Оглавление

| § | Раздел | Статус |
|---|--------|--------|
| [1](#rm-1) | Контекст и границы | STABLE |
| [2](#rm-2) | Архитектура монорепы | STABLE |
| [3](#rm-3) | Сущности и типы ядра | STABLE |
| [4](#rm-4) | Пакеты и ответственность | STABLE |
| [5](#rm-5) | Правила разработки | STABLE |
| [6](#rm-6) | Команды и рабочий цикл | ACTIVE |
| [7](#rm-7) | Тестирование и качество | ACTIVE |
| [8](#rm-8) | Концепты масштабирования | ACTIVE |
| [9](#rm-9) | Гайд для человека и ИИ | STABLE |
| [10](#rm-10) | Ограничения и next steps | ACTIVE |

---

<a id="rm-1"></a>

## 1. Контекст и границы

[↑ к оглавлению](#rm-toc)

Проект — TypeScript/JavaScript монорепа функционального ядра (`Result`, `Option`, `Task`, `Effect`, `Codec`) с модульной архитектурой и адаптерным слоем.

Текущее состояние:
- Реальная рабочая модель определяется структурой `packages/` и workspace-конфигурацией.
- Папка `docs/` содержит первоначальные концепции полиглот-масштабирования.
- Полиглот-часть (Rust/Python/WASM/FFI/codegen) пока концептуальная, не production-контракт текущего runtime.

---

<a id="rm-2"></a>

## 2. Архитектура монорепы

[↑ к оглавлению](#rm-toc)

### 2.1 Основное дерево

```text
packages/
├── core/
│   ├── fp/
│   │   ├── result, option, either
│   │   ├── task, task-result, effect
│   │   ├── pipe, flow, do
│   │   ├── codec, context, layer
│   │   ├── shared, union, void
│   │   ├── result-shared, option-shared
│   └── shared/
│       └── naming-convention
├── adapter/
│   └── core/fp/codec/zod
└── config/
```

### 2.2 Слои

| Слой | Назначение | Пример |
|------|------------|--------|
| `core/fp/*` | Функциональное ядро и композиция | `@resultsafe/core-fp-result` |
| `core/shared/*` | Кросс-доменные утилиты и конвенции | `@resultsafe/core-shared-naming-convention` |
| `adapter/*` | Интеграция с внешними экосистемами | `@resultsafe/core-fp-codec-zod` |

### 2.3 Принцип структуры пакета

Базовый модульный шаблон:
- `constructors/`
- `guards/`
- `methods/`
- `types/`
- `src/index.ts` как публичная точка экспорта

### 2.4 Границы workspace и структурных каталогов

Канонический inventory и статусы контуров ведутся в:
`docs/obsidian/specs/SPEC-001-package-inventory-and-workspace-boundaries.md`.

Правило чтения карты:
- `active` контур пакетов определяется только `pnpm-workspace.yaml` + `pnpm run workspace:list`;
- каталоги вне этого контура не трактуются как активные workspace-пакеты без явной promotion-процедуры.

---

<a id="rm-3"></a>

## 3. Сущности и типы ядра

[↑ к оглавлению](#rm-toc)

### 3.1 Базовые типы

```ts
type Result<T, E> = { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: E };
type Option<T> = { readonly some: true; readonly value: T } | { readonly some: false };
type Task<T> = () => Promise<T>;
type TaskResult<T, E> = () => Promise<Result<T, E>>;
type Effect<R, E, T> = (context: R) => Promise<Result<T, E>>;
```

### 3.2 Сущности проекта

| Сущность | Где | Роль |
|----------|-----|------|
| `Result` | `core/fp/result*` | Явный канал успеха/ошибки |
| `Option` | `core/fp/option*` | Безопасная работа с отсутствием значения |
| `Either` | `core/fp/either` | Симметричная двусторонняя модель |
| `Task` | `core/fp/task` | Асинхронные вычисления |
| `TaskResult` | `core/fp/task-result` | Асинхронный Result |
| `Effect` | `core/fp/effect` | Контекстно-зависимый async Result |
| `Codec` | `core/fp/codec` | Декод/энкод/валидация/парсинг |
| `Context` | `core/fp/context` | Контейнер окружения |
| `Layer` | `core/fp/layer` | Построение/проброс зависимостей |
| `Union` | `core/fp/union` | Типобезопасные refine/validator-инструменты |

---

<a id="rm-4"></a>

## 4. Пакеты и ответственность

[↑ к оглавлению](#rm-toc)

### 4.1 Критическое ядро

| Пакет | Приоритет | Ответственность |
|-------|-----------|-----------------|
| `core-fp-result` | P0 | Главная модель обработки ошибок |
| `core-fp-option` | P0 | Null-safe/absence модель |
| `core-fp-either` | P0 | Симметричная ветвящаяся модель |
| `core-fp-task` | P0 | Async-abstraction |
| `core-fp-task-result` | P0 | Async + error channel |
| `core-fp-pipe` | P0 | Композиция функций |

### 4.2 Расширяющие пакеты

| Пакет | Роль |
|-------|------|
| `core-fp-effect` | Контекст + async + Result |
| `core-fp-flow` | Композиция curried-пайплайнов |
| `core-fp-do` | Do-style композиция |
| `core-fp-layer` | DI/слои зависимостей |
| `core-fp-context` | Контекстные контракты |
| `core-fp-codec` | Схемы и преобразования данных |
| `core-fp-codec-zod` | Адаптер под Zod/OpenAPI |

---

<a id="rm-5"></a>

## 5. Правила разработки

[↑ к оглавлению](#rm-toc)

### 5.1 Правила именования

| Правило | Значение |
|---------|----------|
| Scope пакетов | `@resultsafe-*` |
| Core-паттерн | `@resultsafe-core-{context}-{name}{suffix}` |
| Context values | `fp`, `ds`, `utils`, `algo`, `io` |
| Типовые suffix | `-shared`, `-core`, `-utils`, `-types`, `-abstract` |

### 5.2 Правила контрактов

| Правило | Значение |
|---------|----------|
| Public API | Только через `src/index.ts` |
| Типобезопасность | Предпочтение discriminated unions |
| Ошибки | Через `Result/TaskResult/Effect`, не через hidden throw |
| Комбинаторы | Чистые функции, предсказуемая композиция |
| Совместимость | Не ломать `@resultsafe-*` импорты без отдельной миграции |

### 5.3 Source of truth

| Артефакт | Роль |
|----------|------|
| `package.json` | Root identity, scripts, workspaces |
| `pnpm-workspace.yaml` | Workspace registry |
| `docs/obsidian/specs/SPEC-001-*.md` | Канонический inventory пакетов и границ workspace |
| `docs/obsidian/specs/SPEC-005-*.md` | Обязательная архитектура `Parquet snapshot layer -> PostgreSQL catalog projection` |
| `packages/**/package.json` | Контракты конкретных пакетов |
| `docs/obsidian/*.md` | Governance, решения, roadmap/tasks (второй порядок) |
| `docs/docusaurus/*` | Curated docs portal (пользовательский/навигационный projection-слой) |
| `docs/*.md` (вне `obsidian` и `docusaurus`) | Legacy-концепты, исторические материалы |

---

<a id="rm-6"></a>

## 6. Команды и рабочий цикл

[↑ к оглавлению](#rm-toc)

### 6.1 Базовые команды

```bash
pnpm install
pnpm run workspace:list
pnpm run smoke:docs
pnpm run smoke:docs:report
pnpm run docs:verify
pnpm run docs:sync-registries
pnpm run docs:sync-python-parity
pnpm run docs:sync-entity-catalog
pnpm run docs:sync-semantic-modules
pnpm run automation:test
```

### 6.2 Рабочий процесс

| Шаг | Действие |
|-----|----------|
| 1 | Обновить зависимости: `pnpm install` |
| 2 | Проверить workspace: `pnpm run workspace:list` |
| 3 | Прогнать docs smoke-check: `pnpm run smoke:docs` |
| 4 | Если нужна отчётная проверка без fail-гейта: `pnpm run smoke:docs:report` |
| 5 | Перед финализацией документационных изменений запускать `pnpm run docs:verify` |
| 6 | Для automation-контуров запускать unit-тесты: `pnpm run automation:test` |
| 7 | Синхронизировать все реестры одной командой: `pnpm run docs:sync-registries` |
| 8 | При необходимости запускать точечно: `docs:sync-identifiers`, `docs:sync-semantic-modules`, `docs:sync-python-parity`, `docs:sync-entity-catalog` |
| 9 | Для quality конкретного пакета запускать `pnpm --filter <package-name> run <script>` |
| 10 | Зафиксировать обновление документации при изменении контрактов |

### 6.3 Статус root quality scripts

Команды `pnpm lint`, `pnpm test`, `pnpm build` в root сейчас не являются каноническим baseline и находятся в миграции пакетных конфигов.

Правило до завершения миграции:
- использовать `workspace:list` + `smoke:docs` + `docs:verify` как обязательный root baseline;
- lint/test/build запускать точечно для конкретного пакета через `--filter`.

Automation policy:
- канонический язык automation scripts: Python 3.11+;
- канонический запуск: `python -m tools.automation ...` (через npm wrappers в `package.json`);
- platform-specific shell wrappers не содержат доменной логики.
- единый реестр уникальных идентификаторов пакетов/методов синхронизируется командой `docs:sync-identifiers` (контракты: `DOC-005`, `SPEC-004`).
- machine-readable semantic-layer по `fp-result` синхронизируется командой `docs:sync-semantic-modules`.
- machine-readable parity-слой Python синхронизируется командой `docs:sync-python-parity`.
- единый entity-catalog для DB-проекции синхронизируется командой `docs:sync-entity-catalog`.
- канонический оркестратор синхронизации реестров: `docs:sync-registries` (порядок: `identifiers -> semantic -> python-parity -> entity-catalog`).

### 6.4 PostgreSQL Docker baseline (обязательный)

Правило:
- локальная разработка PostgreSQL выполняется только через Docker Compose;
- данные контейнера хранятся рядом с проектом: `./.data/postgres`;
- запрещены абсолютные пути в compose/скриптах;
- перенос проекта на другой диск не требует ручной правки путей.

Файлы контура:
- `docker-compose.postgres.yml`
- `config/env/.env.postgres.local` (локальный, не в git)
- `config/env/.env.postgres.local.example` (шаблон)
- `__scripts__/postgres/dev-db.ps1` (единая powershell-точка управления)

Команды:

```bash
pnpm run db:up
pnpm run db:status
pnpm run db:logs
pnpm run db:psql
pnpm run db:down
```

DSN и catalog-проекция:

```bash
pnpm run db:dsn
pnpm run db:dsn:admin
pnpm run catalog:create-db
pnpm run catalog:init-schema
```

---

<a id="rm-7"></a>

## 7. Тестирование и качество

[↑ к оглавлению](#rm-toc)

| Категория | Правило |
|-----------|---------|
| Unit tests | Покрывать constructors/guards/methods |
| Integration tests | Покрывать cross-пакетные сценарии (`Result ↔ Option`, `TaskResult ↔ Effect`) |
| Type-level checks | Поддерживать корректность generic-контрактов |
| Regression policy | Любой баг фиксируется тестом до/вместе с исправлением |
| Gate | Изменение API без обновления README и docs не допускается |

---

<a id="rm-8"></a>

## 8. Концепты масштабирования

[↑ к оглавлению](#rm-toc)

### 8.1 Текущая позиция

TS/JS — эталонная рабочая реализация в рамках текущего репозитория.

### 8.2 Документационные слои

| Слой | Назначение | Примеры |
|------|------------|---------|
| `docs/obsidian` | Активные стандарты/процессы/задачи | `DOC-001..004`, `ADR-*`, `TASK-*` |
| `docs/docusaurus` | Curated docs portal, пользовательская навигация | `README.md`, portal pages |
| `docs/` | Legacy-концепты и исторические материалы | `legacy-*.md` (pointer-only формат) |

### 8.3 Принятый принцип

Пользовательская навигация и обучающие маршруты публикуются через `docs/docusaurus`, но нормативный source-of-truth остается в `packages/*` и `docs/obsidian/*`.
Концепты из legacy-слоя (`docs/`) применяются только как directional guidance. Рабочий процесс и управленческие правила ведутся в `docs/obsidian`. Runtime-контракты принимаются только после фиксации в рабочей структуре пакетов и конфигураций.
Полный перечень legacy-файлов и их canonical mapping ведется в `docs/obsidian/specs/DOC-003-legacy-docs-registry.md`.

---

<a id="rm-9"></a>

## 9. Гайд для человека и ИИ

[↑ к оглавлению](#rm-toc)

### 9.1 Для человека

| Делать | Не делать |
|--------|-----------|
| Читать API через `src/index.ts` | Импортировать deep internal paths в обход публичного API |
| Добавлять тесты вместе с поведением | Пушить поведенческие изменения без тестов |
| Фиксировать причины архитектурных решений | Оставлять неявные breaking changes |

### 9.2 Для ИИ-агента

| Делать | Не делать |
|--------|-----------|
| Сначала проверять фактическую структуру `packages/` | Опираться только на концепты из `docs/` |
| Считать `Result` центральной сущностью зависимостей | Ломать `@resultsafe-*` нейминг без явной задачи |
| Разделять изменения по bounded context | Смешивать рефакторинг и функциональные изменения в одном шаге |
| Поддерживать README и docs в актуальном состоянии | Оставлять "скрытые" изменения контракта без документации |

---

<a id="rm-10"></a>

## 10. Ограничения и next steps

[↑ к оглавлению](#rm-toc)

| Область | Текущее состояние | Следующий шаг |
|---------|-------------------|---------------|
| Polyglot runtime | Концепт-фаза | Формализовать отдельные `SPEC-*` на wire-формат и conformance |
| Единый test gate | Частично | Стабилизировать root test-конфиги и команду CI entrypoint |
| Документация пакетов | Неравномерно | Выравнять README/Typedoc policy для всех критических пакетов |
| Архитектурные решения | Частично имплицитны | Ввести ADR-реестр для ключевых изменений |

---

*[↑ к началу документа](#top)*


