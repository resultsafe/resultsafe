---
id: TASK-019
uuid: dcc513e8-3b63-4244-a868-5f7e82c0597a
title: 'Реализовать обязательный Parquet Snapshot Layer и PostgreSQL Catalog Projection'
type: task
status: done
kb_lifecycle: archive
priority: critical
assignee: 'codex'
created: 2026-03-22
updated: 2026-03-23
links: [SPEC-005, SPEC-004, DOC-005]
tags: [parquet, snapshots, postgresql, lineage, architecture]
ai_source: null
lang: ru
translation_of: docs/tasks/done/TASK-019-implement-parquet-snapshot-layer-and-catalog-projection.md
translation_status: outdated
---

# TASK-019: Реализовать обязательный Parquet Snapshot Layer и PostgreSQL Catalog Projection

## Контекст

Выполнена production-имплементация двухслойной модели:

1. `Parquet` как durable snapshot layer.
2. `PostgreSQL` как serving/catalog projection layer.

Реализована цепочка:

`source-of-truth artifacts -> extraction -> Parquet snapshots -> PostgreSQL catalog`.

## Что реализовано

### ST-019-01: Snapshot Storage Contract

- [x] Зафиксирован root layout snapshot storage (`repository_id/snapshot_date/snapshot_id`).
- [x] Зафиксированы dataset naming conventions (`snake_case`, deterministic contracts).
- [x] Зафиксирована partition strategy (`language/doc_kind/relation_kind/artifact_kind`).
- [x] Зафиксирован storage format/version contract в `snapshot_manifest.json`.

### ST-019-02: Deterministic Snapshot ID + Idempotency

- [x] Реализована deterministic `snapshot_id` генерация.
- [x] Реализовано idempotent behavior на одинаковом `commit/scenario`.
- [x] Реализован dedup strategy (`reuse existing complete snapshot`).

### ST-019-03: Manifest + Schema Bundle

- [x] Реализован `snapshot_manifest.json`.
- [x] Добавлены `dataset list`, `row counts`, `checksums`, `completeness flags`.
- [x] Добавлены `schema_version`, `schema_fingerprint`, `lineage refs`.

### ST-019-04: Core Snapshot Datasets (Repository Structure)

- [x] Реализован writer для `repository_files_snapshot`.
- [x] Реализован writer для `modules_snapshot`.
- [x] Реализован writer для `packages_snapshot`.

### ST-019-05: Code Model Snapshot Datasets

- [x] Реализован writer для `code_types_snapshot`.
- [x] Реализован writer для `methods_snapshot`.
- [x] Реализован writer для `method_parameters_snapshot`.
- [x] Реализован writer для `members_snapshot`.

### ST-019-06: Domain + Docs + DB Snapshot Datasets

- [x] Реализован writer для `domain_entities_snapshot`.
- [x] Реализован writer для `documentation_snapshot`.
- [x] Реализован writer для `documentation_sections_snapshot`.
- [x] Реализован writer для `database_catalog_snapshot`.

### ST-019-07: Relations + Provenance Datasets

- [x] Реализован writer для `relation_snapshots` с `relation_kind`.
- [x] Реализован writer для `provenance_snapshot`.
- [x] Добавлены confidence/evidence/source references.

### ST-019-08: Data Quality + Integrity Guarantees

- [x] Реализованы dataset/file checksums.
- [x] Реализована schema fingerprint verification.
- [x] Реализована manifest completeness validation.
- [x] Реализован quality report artifact.

### ST-019-09: Atomic Publish Workflow

- [x] Реализован staging write path.
- [x] Реализована temp -> finalize strategy.
- [x] Publish блокируется при failed validation.

### ST-019-10: PostgreSQL Projection Loader + Rebuild

- [x] Реализован bulk loader `Parquet -> PostgreSQL`.
- [x] Реализован full rebuild workflow из выбранного `snapshot_id`.
- [x] Реализован audit trail для rebuild и incremental refresh.

### ST-019-11: Diff + Incremental Refresh

- [x] Реализован snapshot manifest/dataset diff.
- [x] Реализован dataset-level diff по stable IDs.
- [x] Реализован relation diff через общий diff-layer.
- [x] Реализован incremental PostgreSQL refresh по diff.

### ST-019-12: Retention + Archive + Compaction

- [x] Реализована retention policy (daily/weekly/monthly/release anchors).
- [x] Реализован cold-archive-friendly deletion/marking workflow.
- [x] Реализована compaction strategy как `compaction-plan` с кандидатами.

## Реализованные команды

### Docker PostgreSQL baseline

```bash
pnpm run db:up
pnpm run db:status
pnpm run db:logs
pnpm run db:psql
pnpm run db:down
pnpm run catalog:create-db
pnpm run catalog:init-schema
```

Хранилище данных PostgreSQL фиксировано рядом с проектом: `./.data/postgres`.

### Direct automation commands

```bash
python -m tools.automation snapshot publish --root . --storage-root dist/snapshot-store --repository-id repo_main --scan-id scan_001 --commit-hash <commit> --branch-name main
python -m tools.automation snapshot validate --storage-root dist/snapshot-store --repository-id repo_main --snapshot-id <snapshot_id>
python -m tools.automation snapshot diff --storage-root dist/snapshot-store --repository-id repo_main --from-snapshot-id <snapshot_a> --to-snapshot-id <snapshot_b>
python -m tools.automation snapshot retention --storage-root dist/snapshot-store --repository-id repo_main --keep-daily 30 --keep-weekly 12 --keep-monthly 24 --apply false
python -m tools.automation snapshot compaction-plan --storage-root dist/snapshot-store --repository-id repo_main --snapshot-id <snapshot_id>

python -m tools.automation catalog create-database --admin-dsn <admin_dsn> --database-name resultsafe_catalog
python -m tools.automation catalog init-schema --dsn <dsn> --sql-file tools/automation/sql/postgresql/001_create_catalog_projection.sql
python -m tools.automation catalog rebuild --dsn <dsn> --storage-root dist/snapshot-store --repository-id repo_main --snapshot-id <snapshot_id>
python -m tools.automation catalog incremental-refresh --dsn <dsn> --storage-root dist/snapshot-store --repository-id repo_main --from-snapshot-id <snapshot_a> --to-snapshot-id <snapshot_b>
```

## Acceptance Criteria

- [x] Все 14 обязательных dataset categories публикуются (`13 parquet datasets + manifest`).
- [x] `snapshot_manifest.json` содержит полный обязательный набор полей.
- [x] Snapshot generation идемпотентна.
- [x] Publish атомарный и валидируемый.
- [x] PostgreSQL может быть rebuilt из Parquet snapshot.
- [x] Реализован diff двух snapshot и incremental refresh.
- [x] Зафиксированы и внедрены retention/compaction policies.

## Проверки

```bash
python -m unittest discover -s tools/automation/tests -v
python -m tools.automation snapshot publish --root . --storage-root dist/snapshot-store --repository-id repo_main --scan-id scan_local --commit-hash local --branch-name main
python -m tools.automation snapshot validate --storage-root dist/snapshot-store --repository-id repo_main --snapshot-id <snapshot_id>
pnpm run docs:check-links
pnpm run docs:verify
```

## Результат

TASK-019 закрыт: в репозитории реализован обязательный Parquet snapshot layer с манифестами, quality/lineage/checksum слоем, diff/retention/compaction и PostgreSQL catalog projection (create/init/rebuild/incremental).
