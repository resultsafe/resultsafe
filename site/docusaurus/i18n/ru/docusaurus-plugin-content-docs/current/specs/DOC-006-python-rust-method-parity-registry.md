---
id: DOC-006
uuid: 0bd7b8bd-a5d8-4fdf-8de0-8a6dd8e23516
title: 'Python Rust Method Parity Registry'
type: doc
status: active
kb_lifecycle: current
owner: 'core-fp'
version: 1.0
created: 2026-03-22
updated: 2026-03-23
source_of_truth: self
links: [DOC-004, DOC-005, SPEC-004, TASK-020]
tags: [python, rust, parity, registry, fp]
lang: ru
translation_of: docs/specs/DOC-006-python-rust-method-parity-registry.md
translation_status: actual
---

# DOC-006: Python Rust Method Parity Registry

## Назначение

- Документ фиксирует соответствие Python API и Rust-оригинальных методов в рамках TASK-020.
- Machine-readable артефакт: `docs/obsidian/specs/identifier-registry/PYTHON-RUST-PARITY-REGISTRY.json`.
- Обновление выполняется командой: `python -m tools.automation docs sync-python-parity --root .`.

## Сводка

- Пакетов: `6`.
- Методов: `24`.
- Выполнено: `24`.
- В корректировке: `0`.
- Планируемо: `0`.

## Таблица пакетов

| Package ID        | Package                          | Module                           | Source Path                                             | Status    |
| ----------------- | -------------------------------- | -------------------------------- | ------------------------------------------------------- | --------- |
| `PY-PACKAGE-0001` | `resultsafe.core.fp.result`      | `resultsafe.core.fp.result`      | `packages/python/src/resultsafe/core/fp/result.py`      | выполнено |
| `PY-PACKAGE-0002` | `resultsafe.core.fp.option`      | `resultsafe.core.fp.option`      | `packages/python/src/resultsafe/core/fp/option.py`      | выполнено |
| `PY-PACKAGE-0003` | `resultsafe.core.fp.either`      | `resultsafe.core.fp.either`      | `packages/python/src/resultsafe/core/fp/either.py`      | выполнено |
| `PY-PACKAGE-0004` | `resultsafe.core.fp.task`        | `resultsafe.core.fp.task`        | `packages/python/src/resultsafe/core/fp/task.py`        | выполнено |
| `PY-PACKAGE-0005` | `resultsafe.core.fp.task_result` | `resultsafe.core.fp.task_result` | `packages/python/src/resultsafe/core/fp/task_result.py` | выполнено |
| `PY-PACKAGE-0006` | `resultsafe.core.fp.effect`      | `resultsafe.core.fp.effect`      | `packages/python/src/resultsafe/core/fp/effect.py`      | выполнено |

## Таблица методов

| Method ID        | Package ID        | Python Method     | Rust ID | Rust Method      | Source Path                                             | Status    |
| ---------------- | ----------------- | ----------------- | ------- | ---------------- | ------------------------------------------------------- | --------- |
| `PY-METHOD-0001` | `PY-PACKAGE-0001` | `is_ok`           | `1`     | `is_ok`          | `packages/python/src/resultsafe/core/fp/result.py`      | выполнено |
| `PY-METHOD-0002` | `PY-PACKAGE-0001` | `is_err`          | `2`     | `is_err`         | `packages/python/src/resultsafe/core/fp/result.py`      | выполнено |
| `PY-METHOD-0003` | `PY-PACKAGE-0001` | `map_result`      | `7`     | `map`            | `packages/python/src/resultsafe/core/fp/result.py`      | выполнено |
| `PY-METHOD-0004` | `PY-PACKAGE-0001` | `map_err`         | `8`     | `map_err`        | `packages/python/src/resultsafe/core/fp/result.py`      | выполнено |
| `PY-METHOD-0005` | `PY-PACKAGE-0001` | `and_then`        | `12`    | `and_then`       | `packages/python/src/resultsafe/core/fp/result.py`      | выполнено |
| `PY-METHOD-0006` | `PY-PACKAGE-0001` | `or_else`         | `14`    | `or_else`        | `packages/python/src/resultsafe/core/fp/result.py`      | выполнено |
| `PY-METHOD-0007` | `PY-PACKAGE-0001` | `unwrap`          | `15`    | `unwrap`         | `packages/python/src/resultsafe/core/fp/result.py`      | выполнено |
| `PY-METHOD-0008` | `PY-PACKAGE-0001` | `unwrap_or`       | `16`    | `unwrap_or`      | `packages/python/src/resultsafe/core/fp/result.py`      | выполнено |
| `PY-METHOD-0009` | `PY-PACKAGE-0001` | `unwrap_or_else`  | `17`    | `unwrap_or_else` | `packages/python/src/resultsafe/core/fp/result.py`      | выполнено |
| `PY-METHOD-0010` | `PY-PACKAGE-0001` | `expect`          | `20`    | `expect`         | `packages/python/src/resultsafe/core/fp/result.py`      | выполнено |
| `PY-METHOD-0011` | `PY-PACKAGE-0001` | `inspect`         | `24`    | `inspect`        | `packages/python/src/resultsafe/core/fp/result.py`      | выполнено |
| `PY-METHOD-0012` | `PY-PACKAGE-0001` | `inspect_err`     | `25`    | `inspect_err`    | `packages/python/src/resultsafe/core/fp/result.py`      | выполнено |
| `PY-METHOD-0013` | `PY-PACKAGE-0001` | `flatten`         | `33`    | `flatten`        | `packages/python/src/resultsafe/core/fp/result.py`      | выполнено |
| `PY-METHOD-0014` | `PY-PACKAGE-0001` | `transpose`       | `34`    | `transpose`      | `packages/python/src/resultsafe/core/fp/result.py`      | выполнено |
| `PY-METHOD-0015` | `PY-PACKAGE-0001` | `ok`              | `40`    | `Ok(value)`      | `packages/python/src/resultsafe/core/fp/result.py`      | выполнено |
| `PY-METHOD-0016` | `PY-PACKAGE-0001` | `err`             | `41`    | `Err(error)`     | `packages/python/src/resultsafe/core/fp/result.py`      | выполнено |
| `PY-METHOD-0017` | `PY-PACKAGE-0002` | `map_option`      | `—`     | `—`              | `packages/python/src/resultsafe/core/fp/option.py`      | выполнено |
| `PY-METHOD-0018` | `PY-PACKAGE-0002` | `and_then_option` | `—`     | `—`              | `packages/python/src/resultsafe/core/fp/option.py`      | выполнено |
| `PY-METHOD-0019` | `PY-PACKAGE-0002` | `transpose`       | `—`     | `—`              | `packages/python/src/resultsafe/core/fp/option.py`      | выполнено |
| `PY-METHOD-0020` | `PY-PACKAGE-0003` | `map_either`      | `—`     | `—`              | `packages/python/src/resultsafe/core/fp/either.py`      | выполнено |
| `PY-METHOD-0021` | `PY-PACKAGE-0003` | `map_left`        | `—`     | `—`              | `packages/python/src/resultsafe/core/fp/either.py`      | выполнено |
| `PY-METHOD-0022` | `PY-PACKAGE-0003` | `and_then_either` | `—`     | `—`              | `packages/python/src/resultsafe/core/fp/either.py`      | выполнено |
| `PY-METHOD-0023` | `PY-PACKAGE-0005` | `from_async`      | `—`     | `—`              | `packages/python/src/resultsafe/core/fp/task_result.py` | выполнено |
| `PY-METHOD-0024` | `PY-PACKAGE-0006` | `Effect.and_then` | `—`     | `—`              | `packages/python/src/resultsafe/core/fp/effect.py`      | выполнено |

## Дерево

```text
PY-PACKAGE-0001 | resultsafe.core.fp.result | статус: выполнено
  - PY-METHOD-0001 | is_ok | rust_id=1 | статус: выполнено
  - PY-METHOD-0002 | is_err | rust_id=2 | статус: выполнено
  - PY-METHOD-0003 | map_result | rust_id=7 | статус: выполнено
  - PY-METHOD-0004 | map_err | rust_id=8 | статус: выполнено
  - PY-METHOD-0005 | and_then | rust_id=12 | статус: выполнено
  - PY-METHOD-0006 | or_else | rust_id=14 | статус: выполнено
  - PY-METHOD-0007 | unwrap | rust_id=15 | статус: выполнено
  - PY-METHOD-0008 | unwrap_or | rust_id=16 | статус: выполнено
  - PY-METHOD-0009 | unwrap_or_else | rust_id=17 | статус: выполнено
  - PY-METHOD-0010 | expect | rust_id=20 | статус: выполнено
  - PY-METHOD-0011 | inspect | rust_id=24 | статус: выполнено
  - PY-METHOD-0012 | inspect_err | rust_id=25 | статус: выполнено
  - PY-METHOD-0013 | flatten | rust_id=33 | статус: выполнено
  - PY-METHOD-0014 | transpose | rust_id=34 | статус: выполнено
  - PY-METHOD-0015 | ok | rust_id=40 | статус: выполнено
  - PY-METHOD-0016 | err | rust_id=41 | статус: выполнено
PY-PACKAGE-0002 | resultsafe.core.fp.option | статус: выполнено
  - PY-METHOD-0017 | map_option | rust_id=- | статус: выполнено
  - PY-METHOD-0018 | and_then_option | rust_id=- | статус: выполнено
  - PY-METHOD-0019 | transpose | rust_id=- | статус: выполнено
PY-PACKAGE-0003 | resultsafe.core.fp.either | статус: выполнено
  - PY-METHOD-0020 | map_either | rust_id=- | статус: выполнено
  - PY-METHOD-0021 | map_left | rust_id=- | статус: выполнено
  - PY-METHOD-0022 | and_then_either | rust_id=- | статус: выполнено
PY-PACKAGE-0004 | resultsafe.core.fp.task | статус: выполнено
PY-PACKAGE-0005 | resultsafe.core.fp.task_result | статус: выполнено
  - PY-METHOD-0023 | from_async | rust_id=- | статус: выполнено
PY-PACKAGE-0006 | resultsafe.core.fp.effect | статус: выполнено
  - PY-METHOD-0024 | Effect.and_then | rust_id=- | статус: выполнено
```
