---
id: NOTE-010
uuid: 7fb98b74-b10a-4db4-8736-03d8ab1e6124
title: 'Examples Matrix Coverage for Modules with __examples__'
type: note
status: active
kb_lifecycle: legacy
created: 2026-03-22
updated: 2026-03-23
links: [TASK-022, SPEC-001, SPEC-006, DOC-004]
tags: [examples, coverage, modules, fp, note]
lang: ru
translation_of: docs/notes/NOTE-010-examples-matrix-coverage-2026-03-22.md
translation_status: actual
---

# NOTE-010: Examples Matrix Coverage for Modules with `__examples__`

## Scope

Документ фиксирует фактическую coverage-матрицу examples-слоя по всем модулям репозитория, где присутствует `__examples__`.

## Matrix (fact-based)

| Module                            | Examples Path                                     | `example.ts` | `example.md` | Scope Coverage                                  | Scenario Types Coverage                                          |
| --------------------------------- | ------------------------------------------------- | -----------: | -----------: | ----------------------------------------------- | ---------------------------------------------------------------- |
| `@resultsafe/core-fp-result`      | `packages/core/fp/result/__examples__`            |           13 |            0 | `integrations`, `refiners`, `scenarios`         | happy-path, error-path, boundary, integration                    |
| `@resultsafe/core-fp-task`        | `packages/core/fp/task/__examples__`              |           75 |            3 | `constructors`, `methods`, `scenarios`, `types` | happy-path, error-path, boundary, integration, performance/scale |
| `@resultsafe/core-fp-task-result` | `packages/core/fp/task-result/__examples__`       |           10 |            8 | `constructors`, `methods`, `scenarios`, `types` | happy-path, error-path, boundary, integration                    |
| `@resultsafe/core-fp-effect`      | `packages/core/fp/effect/__examples__`            |           10 |            8 | `constructors`, `methods`, `scenarios`, `types` | happy-path, error-path, boundary, integration, security/policy   |
| `@resultsafe/core-fp-context`     | `packages/core/fp/context/__examples__`           |            6 |            4 | `constructors`, `methods`, `scenarios`, `types` | happy-path, error-path, boundary, integration                    |
| `@resultsafe/core-fp-layer`       | `packages/core/fp/layer/__examples__`             |            6 |            4 | `constructors`, `methods`, `scenarios`, `types` | happy-path, error-path, boundary, integration                    |
| `@resultsafe/core-fp-pipe`        | `packages/core/fp/pipe/__examples__`              |           10 |            8 | `constructors`, `methods`, `scenarios`, `types` | happy-path, boundary, integration                                |
| `@resultsafe/core-fp-flow`        | `packages/core/fp/flow/__examples__`              |            6 |            4 | `constructors`, `methods`, `scenarios`, `types` | happy-path, boundary, integration                                |
| `@resultsafe/core-fp-do`          | `packages/core/fp/do/__examples__`                |            6 |            4 | `constructors`, `methods`, `scenarios`, `types` | happy-path, error-path, boundary, integration                    |
| `@resultsafe/core-fp-codec`       | `packages/core/fp/codec/__examples__`             |            6 |            4 | `constructors`, `methods`, `scenarios`, `types` | happy-path, error-path, boundary, integration                    |
| `@resultsafe/core-fp-union`       | `packages/core/fp/union/__examples__`             |           15 |            0 | `guards`, `scenarios`, `types`                  | happy-path, error-path, boundary, integration                    |
| `@resultsafe/core-fp-void`        | `packages/core/fp/void/__examples__`              |            2 |            0 | `scenarios`                                     | happy-path, integration                                          |
| `@resultsafe/core-fp-codec-zod`   | `packages/adapter/core/fp/codec/zod/__examples__` |            2 |            0 | `scenarios`                                     | happy-path, error-path, boundary, integration                    |

## Totals

- Modules with `__examples__`: `13`
- `example.ts` files: `167`
- `example.md` files: `47`
- Empty `example.ts`: `0`

## Methodology

- Coverage считалась по фактическому дереву `packages/**/__examples__`.
- `Scope Coverage` построена по сегментам `__examples__/<scope>/<topic>/<variant>/example.ts`.
- `Scenario Types Coverage` определена по содержанию scope/topic и реальным сценариям в `example.ts`.

## Related Standards

- `SPEC-006` фиксирует канонический layout и naming examples.
- `TASK-022` использует эту матрицу как evidence для закрытия.


