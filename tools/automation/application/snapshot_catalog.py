from __future__ import annotations

import hashlib
import json
import re
import shutil
import uuid
from dataclasses import dataclass
from datetime import UTC, date, datetime
from pathlib import Path
from typing import Any

import pyarrow as pa
import pyarrow.parquet as pq

from tools.automation.shared.noise import is_noise_path, load_noise_patterns

MANDATORY_DATASETS: tuple[str, ...] = (
    "repository_files",
    "modules",
    "packages",
    "code_types",
    "methods",
    "method_parameters",
    "members",
    "domain_entities",
    "documentation",
    "documentation_sections",
    "database_catalog",
    "relations",
    "provenance",
)

RELATION_KINDS: tuple[str, ...] = (
    "domain_entity_to_type",
    "domain_entity_to_method",
    "domain_entity_to_doc",
    "domain_entity_to_database",
    "domain_entity_to_db_table",
    "type_to_db_table",
    "method_to_doc",
    "module_to_database",
    "module_to_doc",
    "method_calls",
    "type_dependencies",
    "documentation_links",
    "aliases",
    "previous_names",
    "external_identifiers",
)

DATASET_PARTITIONS: dict[str, tuple[str, ...]] = {
    "repository_files": ("language",),
    "code_types": ("language",),
    "methods": ("language",),
    "documentation": ("doc_kind",),
    "database_catalog": ("artifact_kind",),
    "relations": ("relation_kind",),
}

DATASET_PRIMARY_KEYS: dict[str, str] = {
    "repository_files": "file_id",
    "modules": "module_id",
    "packages": "package_id",
    "code_types": "type_id",
    "methods": "method_id",
    "method_parameters": "parameter_id",
    "members": "member_id",
    "domain_entities": "domain_entity_id",
    "documentation": "doc_id",
    "documentation_sections": "section_id",
    "database_catalog": "table_id",
    "relations": "relation_id",
    "provenance": "extract_event_id",
}

CATALOG_SQL_FILE_RELATIVE = Path("tools/automation/sql/postgresql/001_create_catalog_projection.sql")


def _timestamp_type() -> pa.DataType:
    return pa.timestamp("us")


# DDD Value Object: схема обязательного parquet dataset.
@dataclass(frozen=True)
class DatasetContract:
    name: str
    schema: pa.Schema


# DDD Entity: входной контракт публикации snapshot.
@dataclass(frozen=True)
class SnapshotPublishRequest:
    root: Path
    storage_root: Path
    repository_id: str
    scan_id: str
    commit_hash: str
    branch_name: str
    snapshot_kind: str
    extractor_version: str
    schema_version: str
    storage_format_version: str
    datasets_json_file: Path | None = None
    lineage_json_file: Path | None = None


# DDD Aggregate: отчет публикации snapshot.
@dataclass(frozen=True)
class SnapshotPublishReport:
    is_success: bool
    snapshot_id: str
    repository_id: str
    storage_root: str
    snapshot_root: str
    reused_existing_snapshot: bool
    validation_issues: tuple[str, ...]
    datasets_count: int
    manifest_file: str
    schema_bundle_file: str
    checksums_file: str
    quality_report_file: str

    def to_dict(self) -> dict[str, Any]:
        return {
            "is_success": self.is_success,
            "snapshot_id": self.snapshot_id,
            "repository_id": self.repository_id,
            "storage_root": self.storage_root,
            "snapshot_root": self.snapshot_root,
            "reused_existing_snapshot": self.reused_existing_snapshot,
            "validation_issues": list(self.validation_issues),
            "datasets_count": self.datasets_count,
            "manifest_file": self.manifest_file,
            "schema_bundle_file": self.schema_bundle_file,
            "checksums_file": self.checksums_file,
            "quality_report_file": self.quality_report_file,
        }


# DDD Aggregate: отчет валидации опубликованного snapshot.
@dataclass(frozen=True)
class SnapshotValidationReport:
    is_success: bool
    snapshot_id: str
    repository_id: str
    manifest_file: str
    issues: tuple[str, ...]

    def to_dict(self) -> dict[str, Any]:
        return {
            "is_success": self.is_success,
            "snapshot_id": self.snapshot_id,
            "repository_id": self.repository_id,
            "manifest_file": self.manifest_file,
            "issues": list(self.issues),
        }


@dataclass(frozen=True)
class SnapshotDiffDatasetReport:
    dataset_name: str
    changed: bool
    added_count: int
    removed_count: int
    changed_count: int

    def to_dict(self) -> dict[str, Any]:
        return {
            "dataset_name": self.dataset_name,
            "changed": self.changed,
            "added_count": self.added_count,
            "removed_count": self.removed_count,
            "changed_count": self.changed_count,
        }


@dataclass(frozen=True)
class SnapshotDiffReport:
    repository_id: str
    from_snapshot_id: str
    to_snapshot_id: str
    datasets: tuple[SnapshotDiffDatasetReport, ...]
    changed_datasets: tuple[str, ...]
    diff_root: str

    def to_dict(self) -> dict[str, Any]:
        return {
            "repository_id": self.repository_id,
            "from_snapshot_id": self.from_snapshot_id,
            "to_snapshot_id": self.to_snapshot_id,
            "datasets": [item.to_dict() for item in self.datasets],
            "changed_datasets": list(self.changed_datasets),
            "diff_root": self.diff_root,
        }


@dataclass(frozen=True)
class SnapshotRetentionReport:
    repository_id: str
    keep_daily: int
    keep_weekly: int
    keep_monthly: int
    snapshots_total: int
    snapshots_kept: int
    snapshots_marked_for_deletion: int
    apply: bool
    deleted_snapshot_ids: tuple[str, ...]
    marked_snapshot_ids: tuple[str, ...]

    def to_dict(self) -> dict[str, Any]:
        return {
            "repository_id": self.repository_id,
            "keep_daily": self.keep_daily,
            "keep_weekly": self.keep_weekly,
            "keep_monthly": self.keep_monthly,
            "snapshots_total": self.snapshots_total,
            "snapshots_kept": self.snapshots_kept,
            "snapshots_marked_for_deletion": self.snapshots_marked_for_deletion,
            "apply": self.apply,
            "deleted_snapshot_ids": list(self.deleted_snapshot_ids),
            "marked_snapshot_ids": list(self.marked_snapshot_ids),
        }


@dataclass(frozen=True)
class SnapshotCompactionCandidate:
    dataset_name: str
    partition_path: str
    files_count: int
    total_size_bytes: int
    small_files_count: int

    def to_dict(self) -> dict[str, Any]:
        return {
            "dataset_name": self.dataset_name,
            "partition_path": self.partition_path,
            "files_count": self.files_count,
            "total_size_bytes": self.total_size_bytes,
            "small_files_count": self.small_files_count,
        }


@dataclass(frozen=True)
class SnapshotCompactionReport:
    repository_id: str
    snapshot_id: str
    min_file_size_mb: int
    candidates: tuple[SnapshotCompactionCandidate, ...]

    def to_dict(self) -> dict[str, Any]:
        return {
            "repository_id": self.repository_id,
            "snapshot_id": self.snapshot_id,
            "min_file_size_mb": self.min_file_size_mb,
            "candidates": [item.to_dict() for item in self.candidates],
        }


@dataclass(frozen=True)
class CatalogDatabaseCreateReport:
    database_name: str
    created: bool

    def to_dict(self) -> dict[str, Any]:
        return {"database_name": self.database_name, "created": self.created}


@dataclass(frozen=True)
class CatalogInitReport:
    dsn: str
    sql_file: str

    def to_dict(self) -> dict[str, Any]:
        return {"dsn": self.dsn, "sql_file": self.sql_file}


@dataclass(frozen=True)
class CatalogRebuildReport:
    repository_id: str
    snapshot_id: str
    loaded_datasets: tuple[str, ...]
    loaded_rows_total: int

    def to_dict(self) -> dict[str, Any]:
        return {
            "repository_id": self.repository_id,
            "snapshot_id": self.snapshot_id,
            "loaded_datasets": list(self.loaded_datasets),
            "loaded_rows_total": self.loaded_rows_total,
        }


@dataclass(frozen=True)
class CatalogIncrementalRefreshReport:
    repository_id: str
    from_snapshot_id: str
    to_snapshot_id: str
    changed_datasets: tuple[str, ...]
    loaded_rows_total: int

    def to_dict(self) -> dict[str, Any]:
        return {
            "repository_id": self.repository_id,
            "from_snapshot_id": self.from_snapshot_id,
            "to_snapshot_id": self.to_snapshot_id,
            "changed_datasets": list(self.changed_datasets),
            "loaded_rows_total": self.loaded_rows_total,
        }


DATASET_CONTRACTS: dict[str, DatasetContract] = {
    "repository_files": DatasetContract(
        name="repository_files",
        schema=pa.schema(
            [
                pa.field("snapshot_id", pa.string(), nullable=False),
                pa.field("repository_id", pa.string(), nullable=False),
                pa.field("scan_id", pa.string(), nullable=False),
                pa.field("file_id", pa.string(), nullable=False),
                pa.field("normalized_path", pa.string(), nullable=False),
                pa.field("canonical_path", pa.string(), nullable=False),
                pa.field("module_id", pa.string()),
                pa.field("package_id", pa.string()),
                pa.field("language", pa.string()),
                pa.field("file_kind", pa.string(), nullable=False),
                pa.field("content_hash", pa.string(), nullable=False),
                pa.field("path_hash", pa.string(), nullable=False),
                pa.field("size_bytes", pa.int64(), nullable=False),
                pa.field("line_count", pa.int64(), nullable=False),
                pa.field("is_deleted", pa.bool_(), nullable=False),
                pa.field("is_generated", pa.bool_(), nullable=False),
                pa.field("created_at", _timestamp_type(), nullable=False),
            ]
        ),
    ),
    "modules": DatasetContract(
        name="modules",
        schema=pa.schema(
            [
                pa.field("snapshot_id", pa.string(), nullable=False),
                pa.field("module_id", pa.string(), nullable=False),
                pa.field("module_name", pa.string(), nullable=False),
                pa.field("root_path", pa.string(), nullable=False),
                pa.field("ownership_team", pa.string()),
                pa.field("bounded_context", pa.string()),
                pa.field("status", pa.string()),
                pa.field("flags", pa.list_(pa.string())),
                pa.field("created_at", _timestamp_type(), nullable=False),
            ]
        ),
    ),
    "packages": DatasetContract(
        name="packages",
        schema=pa.schema(
            [
                pa.field("snapshot_id", pa.string(), nullable=False),
                pa.field("package_id", pa.string(), nullable=False),
                pa.field("namespace", pa.string()),
                pa.field("package_name", pa.string(), nullable=False),
                pa.field("package_path", pa.string(), nullable=False),
                pa.field("status", pa.string()),
                pa.field("flags", pa.list_(pa.string())),
                pa.field("created_at", _timestamp_type(), nullable=False),
            ]
        ),
    ),
    "code_types": DatasetContract(
        name="code_types",
        schema=pa.schema(
            [
                pa.field("snapshot_id", pa.string(), nullable=False),
                pa.field("type_id", pa.string(), nullable=False),
                pa.field("module_id", pa.string()),
                pa.field("package_id", pa.string()),
                pa.field("type_name", pa.string(), nullable=False),
                pa.field("kind", pa.string(), nullable=False),
                pa.field("signature", pa.string()),
                pa.field("language", pa.string(), nullable=False),
                pa.field("source_ref", pa.string()),
                pa.field("status", pa.string()),
                pa.field("created_at", _timestamp_type(), nullable=False),
            ]
        ),
    ),
    "methods": DatasetContract(
        name="methods",
        schema=pa.schema(
            [
                pa.field("snapshot_id", pa.string(), nullable=False),
                pa.field("method_id", pa.string(), nullable=False),
                pa.field("owner_type_id", pa.string()),
                pa.field("module_id", pa.string()),
                pa.field("package_id", pa.string()),
                pa.field("method_name", pa.string(), nullable=False),
                pa.field("signature", pa.string()),
                pa.field("return_type", pa.string()),
                pa.field("is_async", pa.bool_(), nullable=False),
                pa.field("visibility", pa.string()),
                pa.field("language", pa.string(), nullable=False),
                pa.field("source_file_path", pa.string(), nullable=False),
                pa.field("source_line_start", pa.int64()),
                pa.field("source_line_end", pa.int64()),
                pa.field("source_ref", pa.string()),
                pa.field("status", pa.string()),
                pa.field("created_at", _timestamp_type(), nullable=False),
            ]
        ),
    ),
    "method_parameters": DatasetContract(
        name="method_parameters",
        schema=pa.schema(
            [
                pa.field("snapshot_id", pa.string(), nullable=False),
                pa.field("parameter_id", pa.string(), nullable=False),
                pa.field("method_id", pa.string(), nullable=False),
                pa.field("position", pa.int64(), nullable=False),
                pa.field("param_name", pa.string(), nullable=False),
                pa.field("param_type", pa.string()),
                pa.field("default_value", pa.string()),
                pa.field("is_optional", pa.bool_(), nullable=False),
                pa.field("is_variadic", pa.bool_(), nullable=False),
                pa.field("created_at", _timestamp_type(), nullable=False),
            ]
        ),
    ),
    "members": DatasetContract(
        name="members",
        schema=pa.schema(
            [
                pa.field("snapshot_id", pa.string(), nullable=False),
                pa.field("member_id", pa.string(), nullable=False),
                pa.field("owner_type_id", pa.string()),
                pa.field("member_name", pa.string(), nullable=False),
                pa.field("member_kind", pa.string(), nullable=False),
                pa.field("member_type", pa.string()),
                pa.field("visibility", pa.string()),
                pa.field("is_static", pa.bool_(), nullable=False),
                pa.field("source_ref", pa.string()),
                pa.field("created_at", _timestamp_type(), nullable=False),
            ]
        ),
    ),
    "domain_entities": DatasetContract(
        name="domain_entities",
        schema=pa.schema(
            [
                pa.field("snapshot_id", pa.string(), nullable=False),
                pa.field("domain_entity_id", pa.string(), nullable=False),
                pa.field("entity_name", pa.string(), nullable=False),
                pa.field("registry_source", pa.string()),
                pa.field("explicit_marker", pa.bool_(), nullable=False),
                pa.field("inferred_marker", pa.bool_(), nullable=False),
                pa.field("confidence", pa.float64()),
                pa.field("status", pa.string()),
                pa.field("created_at", _timestamp_type(), nullable=False),
            ]
        ),
    ),
    "documentation": DatasetContract(
        name="documentation",
        schema=pa.schema(
            [
                pa.field("snapshot_id", pa.string(), nullable=False),
                pa.field("doc_id", pa.string(), nullable=False),
                pa.field("doc_path", pa.string(), nullable=False),
                pa.field("doc_kind", pa.string(), nullable=False),
                pa.field("title", pa.string()),
                pa.field("language", pa.string()),
                pa.field("content_hash", pa.string(), nullable=False),
                pa.field("line_count", pa.int64(), nullable=False),
                pa.field("status", pa.string()),
                pa.field("updated_at", _timestamp_type()),
                pa.field("created_at", _timestamp_type(), nullable=False),
            ]
        ),
    ),
    "documentation_sections": DatasetContract(
        name="documentation_sections",
        schema=pa.schema(
            [
                pa.field("snapshot_id", pa.string(), nullable=False),
                pa.field("section_id", pa.string(), nullable=False),
                pa.field("doc_id", pa.string(), nullable=False),
                pa.field("section_path", pa.string(), nullable=False),
                pa.field("heading", pa.string(), nullable=False),
                pa.field("level", pa.int64(), nullable=False),
                pa.field("position", pa.int64(), nullable=False),
                pa.field("content_hash", pa.string(), nullable=False),
                pa.field("created_at", _timestamp_type(), nullable=False),
            ]
        ),
    ),
    "database_catalog": DatasetContract(
        name="database_catalog",
        schema=pa.schema(
            [
                pa.field("snapshot_id", pa.string(), nullable=False),
                pa.field("database_id", pa.string(), nullable=False),
                pa.field("schema_id", pa.string(), nullable=False),
                pa.field("table_id", pa.string(), nullable=False),
                pa.field("column_id", pa.string()),
                pa.field("migration_id", pa.string()),
                pa.field("artifact_kind", pa.string(), nullable=False),
                pa.field("name", pa.string(), nullable=False),
                pa.field("data_type", pa.string()),
                pa.field("nullable", pa.bool_()),
                pa.field("default_expr", pa.string()),
                pa.field("source_ref", pa.string()),
                pa.field("created_at", _timestamp_type(), nullable=False),
            ]
        ),
    ),
    "relations": DatasetContract(
        name="relations",
        schema=pa.schema(
            [
                pa.field("snapshot_id", pa.string(), nullable=False),
                pa.field("relation_id", pa.string(), nullable=False),
                pa.field("relation_kind", pa.string(), nullable=False),
                pa.field("from_entity_id", pa.string(), nullable=False),
                pa.field("to_entity_id", pa.string(), nullable=False),
                pa.field("confidence", pa.float64()),
                pa.field("evidence_kind", pa.string()),
                pa.field("source_ref", pa.string()),
                pa.field("is_inferred", pa.bool_(), nullable=False),
                pa.field("created_at", _timestamp_type(), nullable=False),
            ]
        ),
    ),
    "provenance": DatasetContract(
        name="provenance",
        schema=pa.schema(
            [
                pa.field("snapshot_id", pa.string(), nullable=False),
                pa.field("parser_run_id", pa.string(), nullable=False),
                pa.field("extract_event_id", pa.string(), nullable=False),
                pa.field("extractor_name", pa.string(), nullable=False),
                pa.field("extractor_version", pa.string(), nullable=False),
                pa.field("event_time", _timestamp_type(), nullable=False),
                pa.field("confidence", pa.float64()),
                pa.field("evidence_kind", pa.string()),
                pa.field("source_ref", pa.string()),
                pa.field("trace_id", pa.string()),
                pa.field("created_at", _timestamp_type(), nullable=False),
            ]
        ),
    ),
}


def build_snapshot_id(
    repository_id: str,
    scan_id: str,
    commit_hash: str,
    snapshot_kind: str,
    extractor_version: str,
    schema_version: str,
) -> str:
    payload = "|".join(
        [
            repository_id.strip(),
            scan_id.strip(),
            commit_hash.strip(),
            snapshot_kind.strip(),
            extractor_version.strip(),
            schema_version.strip(),
        ]
    )
    return f"snp_{hashlib.sha256(payload.encode('utf-8')).hexdigest()[:24]}"


def run_snapshot_publish(request: SnapshotPublishRequest) -> SnapshotPublishReport:
    root = request.root.resolve()
    storage_root = request.storage_root.resolve()
    now = datetime.now(tz=UTC)
    snapshot_date = now.date().isoformat()
    snapshot_id = build_snapshot_id(
        repository_id=request.repository_id,
        scan_id=request.scan_id,
        commit_hash=request.commit_hash,
        snapshot_kind=request.snapshot_kind,
        extractor_version=request.extractor_version,
        schema_version=request.schema_version,
    )

    final_snapshot_root = _snapshot_root(storage_root, request.repository_id, snapshot_date, snapshot_id)
    final_manifest_file = final_snapshot_root / "manifest" / "snapshot_manifest.json"

    existing_complete = _load_complete_manifest_if_exists(final_manifest_file)
    if existing_complete is not None:
        return SnapshotPublishReport(
            is_success=True,
            snapshot_id=snapshot_id,
            repository_id=request.repository_id,
            storage_root=str(storage_root),
            snapshot_root=str(final_snapshot_root),
            reused_existing_snapshot=True,
            validation_issues=tuple(),
            datasets_count=len(MANDATORY_DATASETS),
            manifest_file=str(final_manifest_file),
            schema_bundle_file=str(final_snapshot_root / "manifest" / "schema_bundle.json"),
            checksums_file=str(final_snapshot_root / "checksums" / "datasets.sha256.json"),
            quality_report_file=str(final_snapshot_root / "quality" / "validation_report.json"),
        )

    datasets_payload = _load_datasets_payload(request.datasets_json_file)
    if datasets_payload is None:
        datasets_payload = _build_baseline_datasets(root=root, repository_id=request.repository_id, scan_id=request.scan_id)
    else:
        baseline = _build_baseline_datasets(root=root, repository_id=request.repository_id, scan_id=request.scan_id)
        baseline.update(datasets_payload)
        datasets_payload = baseline

    for dataset_name in MANDATORY_DATASETS:
        datasets_payload.setdefault(dataset_name, [])

    staging_root = (
        storage_root
        / "_staging"
        / f"repository_id={request.repository_id}"
        / f"snapshot_id={snapshot_id}"
    )
    if staging_root.exists():
        shutil.rmtree(staging_root)
    (staging_root / "datasets").mkdir(parents=True, exist_ok=True)
    (staging_root / "manifest").mkdir(parents=True, exist_ok=True)
    (staging_root / "checksums").mkdir(parents=True, exist_ok=True)
    (staging_root / "quality").mkdir(parents=True, exist_ok=True)

    dataset_entries: list[dict[str, Any]] = []
    all_file_checksums: dict[str, str] = {}
    schema_bundle_entries: list[dict[str, Any]] = []

    for dataset_name in MANDATORY_DATASETS:
        table = _build_dataset_table(
            dataset_name=dataset_name,
            rows=datasets_payload.get(dataset_name, []),
            snapshot_id=snapshot_id,
            repository_id=request.repository_id,
            scan_id=request.scan_id,
            row_created_at=now,
        )
        write_report = _write_dataset(
            dataset_name=dataset_name,
            table=table,
            datasets_root=staging_root / "datasets",
        )
        dataset_entries.append(write_report)
        all_file_checksums.update(write_report["file_checksums"])
        schema_bundle_entries.append(
            {
                "dataset_name": dataset_name,
                "dataset_schema_version": request.schema_version,
                "schema_fingerprint": write_report["schema_fingerprint"],
                "columns": [
                    {
                        "name": field.name,
                        "type": str(field.type),
                        "nullable": field.nullable,
                    }
                    for field in DATASET_CONTRACTS[dataset_name].schema
                ],
            }
        )

    checksums_file = staging_root / "checksums" / "datasets.sha256.json"
    checksums_payload = {
        "version": "1.0",
        "generated_at": _iso_now(),
        "files": all_file_checksums,
        "datasets": {entry["dataset_name"]: entry["dataset_checksum"] for entry in dataset_entries},
    }
    checksums_file.write_text(json.dumps(checksums_payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lineage_refs = _load_lineage_refs(request.lineage_json_file, request)
    schema_bundle_file = staging_root / "manifest" / "schema_bundle.json"
    schema_bundle_payload = {
        "version": request.schema_version,
        "generated_at": _iso_now(),
        "datasets": schema_bundle_entries,
    }
    schema_bundle_file.write_text(json.dumps(schema_bundle_payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    completeness = {
        "is_complete": True,
        "missing_datasets": [],
    }
    manifest = {
        "storage_format_version": request.storage_format_version,
        "snapshot_id": snapshot_id,
        "repository_id": request.repository_id,
        "scan_id": request.scan_id,
        "snapshot_kind": request.snapshot_kind,
        "commit_hash": request.commit_hash,
        "branch_name": request.branch_name,
        "created_at": _iso_now(),
        "extractor_version": request.extractor_version,
        "schema_version": request.schema_version,
        "storage_root": str(final_snapshot_root),
        "partition_spec": {
            "root": ["repository_id", "snapshot_date", "snapshot_id"],
            "dataset_partitions": {name: list(partitions) for name, partitions in DATASET_PARTITIONS.items()},
        },
        "datasets": [
            {
                "dataset_name": entry["dataset_name"],
                "relative_path": entry["relative_path"],
                "row_count": entry["row_count"],
                "file_count": entry["file_count"],
                "schema_fingerprint": entry["schema_fingerprint"],
                "dataset_checksum": entry["dataset_checksum"],
            }
            for entry in dataset_entries
        ],
        "row_counts": {entry["dataset_name"]: entry["row_count"] for entry in dataset_entries},
        "checksums": {entry["dataset_name"]: entry["dataset_checksum"] for entry in dataset_entries},
        "completeness": completeness,
        "completeness_flags": {
            "required_datasets_present": True,
            "schema_evolution_compatible": True,
            "checksums_generated": True,
        },
        "lineage_refs": lineage_refs,
    }

    schema_issues = _validate_schema_evolution(storage_root, request.repository_id, snapshot_id, schema_bundle_payload)
    quality_issues = list(schema_issues)
    required_missing = [dataset for dataset in MANDATORY_DATASETS if dataset not in {entry["dataset_name"] for entry in dataset_entries}]
    if required_missing:
        quality_issues.append(f"Отсутствуют обязательные datasets: {', '.join(required_missing)}")

    if quality_issues:
        completeness["is_complete"] = False
        completeness["missing_datasets"] = required_missing
        manifest["completeness_flags"]["schema_evolution_compatible"] = False

    quality_report_file = staging_root / "quality" / "validation_report.json"
    quality_report_payload = {
        "version": "1.0",
        "snapshot_id": snapshot_id,
        "repository_id": request.repository_id,
        "created_at": _iso_now(),
        "is_success": not quality_issues,
        "issues": quality_issues,
        "checks": {
            "required_datasets": len(required_missing) == 0,
            "schema_evolution": len(schema_issues) == 0,
            "relation_kind_catalog": list(RELATION_KINDS),
        },
    }
    quality_report_file.write_text(json.dumps(quality_report_payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    manifest_file = staging_root / "manifest" / "snapshot_manifest.json"
    manifest_file.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    if quality_issues:
        return SnapshotPublishReport(
            is_success=False,
            snapshot_id=snapshot_id,
            repository_id=request.repository_id,
            storage_root=str(storage_root),
            snapshot_root=str(staging_root),
            reused_existing_snapshot=False,
            validation_issues=tuple(quality_issues),
            datasets_count=len(dataset_entries),
            manifest_file=str(manifest_file),
            schema_bundle_file=str(schema_bundle_file),
            checksums_file=str(checksums_file),
            quality_report_file=str(quality_report_file),
        )

    final_snapshot_root.parent.mkdir(parents=True, exist_ok=True)
    if final_snapshot_root.exists():
        shutil.rmtree(final_snapshot_root)
    staging_root.rename(final_snapshot_root)

    return SnapshotPublishReport(
        is_success=True,
        snapshot_id=snapshot_id,
        repository_id=request.repository_id,
        storage_root=str(storage_root),
        snapshot_root=str(final_snapshot_root),
        reused_existing_snapshot=False,
        validation_issues=tuple(),
        datasets_count=len(dataset_entries),
        manifest_file=str(final_snapshot_root / "manifest" / "snapshot_manifest.json"),
        schema_bundle_file=str(final_snapshot_root / "manifest" / "schema_bundle.json"),
        checksums_file=str(final_snapshot_root / "checksums" / "datasets.sha256.json"),
        quality_report_file=str(final_snapshot_root / "quality" / "validation_report.json"),
    )


def run_snapshot_validate(storage_root: Path, repository_id: str, snapshot_id: str) -> SnapshotValidationReport:
    snapshot_root = _resolve_snapshot_root(storage_root.resolve(), repository_id, snapshot_id)
    manifest_file = snapshot_root / "manifest" / "snapshot_manifest.json"
    manifest = json.loads(manifest_file.read_text(encoding="utf-8"))

    issues: list[str] = []
    datasets_by_name = {item["dataset_name"]: item for item in manifest.get("datasets", [])}
    for dataset_name in MANDATORY_DATASETS:
        item = datasets_by_name.get(dataset_name)
        if item is None:
            issues.append(f"Dataset отсутствует в manifest: {dataset_name}")
            continue

        dataset_root = snapshot_root / item["relative_path"]
        parquet_files = sorted(dataset_root.rglob("*.parquet"))
        if not parquet_files:
            issues.append(f"Dataset не содержит parquet файлов: {dataset_name}")
            continue

        actual_row_count = 0
        for parquet_file in parquet_files:
            actual_row_count += pq.ParquetFile(parquet_file).metadata.num_rows
        if actual_row_count != int(item["row_count"]):
            issues.append(
                f"Row count mismatch для {dataset_name}: manifest={item['row_count']} actual={actual_row_count}"
            )

        actual_dataset_checksum = _dataset_checksum_from_files(dataset_root)
        if actual_dataset_checksum != item["dataset_checksum"]:
            issues.append(
                f"Checksum mismatch для {dataset_name}: manifest={item['dataset_checksum']} actual={actual_dataset_checksum}"
            )

    return SnapshotValidationReport(
        is_success=not issues,
        snapshot_id=snapshot_id,
        repository_id=repository_id,
        manifest_file=str(manifest_file),
        issues=tuple(issues),
    )


def run_snapshot_diff(
    storage_root: Path,
    repository_id: str,
    from_snapshot_id: str,
    to_snapshot_id: str,
) -> SnapshotDiffReport:
    storage = storage_root.resolve()
    from_root = _resolve_snapshot_root(storage, repository_id, from_snapshot_id)
    to_root = _resolve_snapshot_root(storage, repository_id, to_snapshot_id)

    diff_root = (
        storage
        / "diffs"
        / f"repository_id={repository_id}"
        / f"from_snapshot_id={from_snapshot_id}"
        / f"to_snapshot_id={to_snapshot_id}"
    )
    if diff_root.exists():
        shutil.rmtree(diff_root)
    diff_root.mkdir(parents=True, exist_ok=True)

    dataset_reports: list[SnapshotDiffDatasetReport] = []
    changed_datasets: list[str] = []

    for dataset_name in MANDATORY_DATASETS:
        from_rows = _read_dataset_rows(from_root, dataset_name)
        to_rows = _read_dataset_rows(to_root, dataset_name)
        primary_key = DATASET_PRIMARY_KEYS[dataset_name]

        from_map = {_resolve_entity_id(dataset_name, row, primary_key): _stable_row_repr(row) for row in from_rows}
        to_map = {_resolve_entity_id(dataset_name, row, primary_key): _stable_row_repr(row) for row in to_rows}

        from_keys = set(from_map)
        to_keys = set(to_map)
        added = sorted(to_keys - from_keys)
        removed = sorted(from_keys - to_keys)
        same_keys = sorted(from_keys & to_keys)
        changed = [key for key in same_keys if from_map[key] != to_map[key]]

        changed_flag = bool(added or removed or changed)
        if changed_flag:
            changed_datasets.append(dataset_name)

        dataset_reports.append(
            SnapshotDiffDatasetReport(
                dataset_name=dataset_name,
                changed=changed_flag,
                added_count=len(added),
                removed_count=len(removed),
                changed_count=len(changed),
            )
        )

        diff_rows = [
            {
                "dataset_name": dataset_name,
                "stable_id": stable_id,
                "change_kind": "added",
                "from_snapshot_id": from_snapshot_id,
                "to_snapshot_id": to_snapshot_id,
                "created_at": datetime.now(tz=UTC),
            }
            for stable_id in added
        ]
        diff_rows.extend(
            {
                "dataset_name": dataset_name,
                "stable_id": stable_id,
                "change_kind": "removed",
                "from_snapshot_id": from_snapshot_id,
                "to_snapshot_id": to_snapshot_id,
                "created_at": datetime.now(tz=UTC),
            }
            for stable_id in removed
        )
        diff_rows.extend(
            {
                "dataset_name": dataset_name,
                "stable_id": stable_id,
                "change_kind": "changed",
                "from_snapshot_id": from_snapshot_id,
                "to_snapshot_id": to_snapshot_id,
                "created_at": datetime.now(tz=UTC),
            }
            for stable_id in changed
        )

        diff_table = pa.Table.from_pylist(
            diff_rows,
            schema=pa.schema(
                [
                    pa.field("dataset_name", pa.string(), nullable=False),
                    pa.field("stable_id", pa.string(), nullable=False),
                    pa.field("change_kind", pa.string(), nullable=False),
                    pa.field("from_snapshot_id", pa.string(), nullable=False),
                    pa.field("to_snapshot_id", pa.string(), nullable=False),
                    pa.field("created_at", _timestamp_type(), nullable=False),
                ]
            ),
        )
        dataset_diff_dir = diff_root / "datasets" / dataset_name
        dataset_diff_dir.mkdir(parents=True, exist_ok=True)
        pq.write_table(diff_table, dataset_diff_dir / "part-00000.parquet", compression="zstd")

    return SnapshotDiffReport(
        repository_id=repository_id,
        from_snapshot_id=from_snapshot_id,
        to_snapshot_id=to_snapshot_id,
        datasets=tuple(dataset_reports),
        changed_datasets=tuple(changed_datasets),
        diff_root=str(diff_root),
    )


def run_snapshot_retention(
    storage_root: Path,
    repository_id: str,
    keep_daily: int = 30,
    keep_weekly: int = 12,
    keep_monthly: int = 24,
    apply: bool = False,
) -> SnapshotRetentionReport:
    snapshots = _list_snapshot_manifests(storage_root.resolve(), repository_id)
    if not snapshots:
        return SnapshotRetentionReport(
            repository_id=repository_id,
            keep_daily=keep_daily,
            keep_weekly=keep_weekly,
            keep_monthly=keep_monthly,
            snapshots_total=0,
            snapshots_kept=0,
            snapshots_marked_for_deletion=0,
            apply=apply,
            deleted_snapshot_ids=tuple(),
            marked_snapshot_ids=tuple(),
        )

    snapshots_sorted = sorted(snapshots, key=lambda item: item["created_at"], reverse=True)

    keep_ids: set[str] = set()

    daily_seen: set[str] = set()
    for item in snapshots_sorted:
        day = item["created_at"].date().isoformat()
        if day in daily_seen:
            continue
        if len(daily_seen) >= keep_daily:
            break
        daily_seen.add(day)
        keep_ids.add(item["snapshot_id"])

    weekly_seen: set[str] = set()
    for item in snapshots_sorted:
        iso = item["created_at"].isocalendar()
        week_key = f"{iso.year}-W{iso.week:02d}"
        if week_key in weekly_seen:
            continue
        if len(weekly_seen) >= keep_weekly:
            break
        weekly_seen.add(week_key)
        keep_ids.add(item["snapshot_id"])

    monthly_seen: set[str] = set()
    for item in snapshots_sorted:
        month_key = item["created_at"].strftime("%Y-%m")
        if month_key in monthly_seen:
            continue
        if len(monthly_seen) >= keep_monthly:
            break
        monthly_seen.add(month_key)
        keep_ids.add(item["snapshot_id"])

    for item in snapshots_sorted:
        if "release" in item["snapshot_kind"]:
            keep_ids.add(item["snapshot_id"])

    marked_for_deletion = [item for item in snapshots_sorted if item["snapshot_id"] not in keep_ids]

    deleted: list[str] = []
    if apply:
        for item in marked_for_deletion:
            snapshot_root = item["snapshot_root"]
            if snapshot_root.exists():
                shutil.rmtree(snapshot_root)
                deleted.append(item["snapshot_id"])

    return SnapshotRetentionReport(
        repository_id=repository_id,
        keep_daily=keep_daily,
        keep_weekly=keep_weekly,
        keep_monthly=keep_monthly,
        snapshots_total=len(snapshots_sorted),
        snapshots_kept=len(keep_ids),
        snapshots_marked_for_deletion=len(marked_for_deletion),
        apply=apply,
        deleted_snapshot_ids=tuple(deleted),
        marked_snapshot_ids=tuple(item["snapshot_id"] for item in marked_for_deletion),
    )


def run_snapshot_compaction_plan(
    storage_root: Path,
    repository_id: str,
    snapshot_id: str,
    min_file_size_mb: int = 16,
) -> SnapshotCompactionReport:
    snapshot_root = _resolve_snapshot_root(storage_root.resolve(), repository_id, snapshot_id)
    datasets_root = snapshot_root / "datasets"
    min_bytes = min_file_size_mb * 1024 * 1024

    candidates: list[SnapshotCompactionCandidate] = []
    for dataset_name in MANDATORY_DATASETS:
        dataset_dir = datasets_root / dataset_name
        if not dataset_dir.exists():
            continue

        parquet_files = sorted(dataset_dir.rglob("*.parquet"))
        by_partition: dict[str, list[Path]] = {}
        for parquet_file in parquet_files:
            partition_key = parquet_file.parent.relative_to(dataset_dir).as_posix()
            by_partition.setdefault(partition_key, []).append(parquet_file)

        for partition_key, files in sorted(by_partition.items()):
            if len(files) <= 1:
                continue
            sizes = [file.stat().st_size for file in files]
            small_count = len([size for size in sizes if size < min_bytes])
            if small_count == 0:
                continue
            candidates.append(
                SnapshotCompactionCandidate(
                    dataset_name=dataset_name,
                    partition_path=partition_key,
                    files_count=len(files),
                    total_size_bytes=sum(sizes),
                    small_files_count=small_count,
                )
            )

    return SnapshotCompactionReport(
        repository_id=repository_id,
        snapshot_id=snapshot_id,
        min_file_size_mb=min_file_size_mb,
        candidates=tuple(candidates),
    )


def run_catalog_create_database(admin_dsn: str, database_name: str) -> CatalogDatabaseCreateReport:
    _validate_postgresql_identifier(database_name)
    psycopg = _load_psycopg()
    resolved_dsn = _with_connect_timeout(admin_dsn)

    with psycopg.connect(resolved_dsn, autocommit=True) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (database_name,))
            exists = cur.fetchone() is not None
            if not exists:
                cur.execute(f'CREATE DATABASE "{database_name}"')

    return CatalogDatabaseCreateReport(database_name=database_name, created=not exists)


def run_catalog_init_schema(dsn: str, sql_file: Path | None = None) -> CatalogInitReport:
    psycopg = _load_psycopg()
    sql_path = (sql_file or CATALOG_SQL_FILE_RELATIVE).resolve()
    sql_text = sql_path.read_text(encoding="utf-8")
    resolved_dsn = _with_connect_timeout(dsn)

    with psycopg.connect(resolved_dsn) as conn:
        with conn.cursor() as cur:
            cur.execute(sql_text)
        conn.commit()

    return CatalogInitReport(dsn=dsn, sql_file=str(sql_path))


def run_catalog_rebuild_from_snapshot(
    dsn: str,
    storage_root: Path,
    repository_id: str,
    snapshot_id: str,
) -> CatalogRebuildReport:
    psycopg = _load_psycopg()
    resolved_dsn = _with_connect_timeout(dsn)
    snapshot_root = _resolve_snapshot_root(storage_root.resolve(), repository_id, snapshot_id)
    manifest = json.loads((snapshot_root / "manifest" / "snapshot_manifest.json").read_text(encoding="utf-8"))

    loaded_rows_total = 0
    loaded_datasets: list[str] = []

    with psycopg.connect(resolved_dsn) as conn:
        with conn.cursor() as cur:
            _ensure_catalog_schema(cur)
            audit_id = _insert_rebuild_audit(
                cur=cur,
                repository_id=repository_id,
                snapshot_id=snapshot_id,
                status="running",
                details={"mode": "full_rebuild"},
            )

            _upsert_manifest_index(cur, manifest)

            for dataset_name in MANDATORY_DATASETS:
                rows = _read_dataset_rows(snapshot_root, dataset_name)
                _replace_projection_dataset(cur, dataset_name, snapshot_id, rows)
                loaded_rows_total += len(rows)
                loaded_datasets.append(dataset_name)

            _upsert_active_snapshot(cur, repository_id, snapshot_id)
            _finish_rebuild_audit(cur, audit_id, status="succeeded", details={"loaded_rows_total": loaded_rows_total})
        conn.commit()

    return CatalogRebuildReport(
        repository_id=repository_id,
        snapshot_id=snapshot_id,
        loaded_datasets=tuple(loaded_datasets),
        loaded_rows_total=loaded_rows_total,
    )


def run_catalog_incremental_refresh(
    dsn: str,
    storage_root: Path,
    repository_id: str,
    from_snapshot_id: str,
    to_snapshot_id: str,
) -> CatalogIncrementalRefreshReport:
    diff_report = run_snapshot_diff(
        storage_root=storage_root,
        repository_id=repository_id,
        from_snapshot_id=from_snapshot_id,
        to_snapshot_id=to_snapshot_id,
    )

    if not diff_report.changed_datasets:
        return CatalogIncrementalRefreshReport(
            repository_id=repository_id,
            from_snapshot_id=from_snapshot_id,
            to_snapshot_id=to_snapshot_id,
            changed_datasets=tuple(),
            loaded_rows_total=0,
        )

    psycopg = _load_psycopg()
    resolved_dsn = _with_connect_timeout(dsn)
    to_snapshot_root = _resolve_snapshot_root(storage_root.resolve(), repository_id, to_snapshot_id)
    loaded_rows_total = 0

    with psycopg.connect(resolved_dsn) as conn:
        with conn.cursor() as cur:
            _ensure_catalog_schema(cur)
            cur.execute(
                """
                INSERT INTO catalog.incremental_refresh_audit
                    (repository_id, from_snapshot_id, to_snapshot_id, started_at, status, details_json)
                VALUES (%s, %s, %s, NOW(), %s, %s::jsonb)
                RETURNING audit_id
                """,
                (
                    repository_id,
                    from_snapshot_id,
                    to_snapshot_id,
                    "running",
                    json.dumps({"changed_datasets": list(diff_report.changed_datasets)}),
                ),
            )
            audit_id = int(cur.fetchone()[0])

            for dataset_name in diff_report.changed_datasets:
                rows = _read_dataset_rows(to_snapshot_root, dataset_name)
                _replace_projection_dataset(cur, dataset_name, to_snapshot_id, rows)
                loaded_rows_total += len(rows)

            _upsert_active_snapshot(cur, repository_id, to_snapshot_id)
            cur.execute(
                """
                UPDATE catalog.incremental_refresh_audit
                SET finished_at = NOW(), status = %s, details_json = %s::jsonb
                WHERE audit_id = %s
                """,
                (
                    "succeeded",
                    json.dumps(
                        {
                            "changed_datasets": list(diff_report.changed_datasets),
                            "loaded_rows_total": loaded_rows_total,
                        }
                    ),
                    audit_id,
                ),
            )
        conn.commit()

    return CatalogIncrementalRefreshReport(
        repository_id=repository_id,
        from_snapshot_id=from_snapshot_id,
        to_snapshot_id=to_snapshot_id,
        changed_datasets=diff_report.changed_datasets,
        loaded_rows_total=loaded_rows_total,
    )


def _replace_projection_dataset(cur: Any, dataset_name: str, snapshot_id: str, rows: list[dict[str, Any]]) -> None:
    table_name = f"catalog.projection_{dataset_name}"
    cur.execute(f"DELETE FROM {table_name} WHERE snapshot_id = %s", (snapshot_id,))
    if not rows:
        return

    payload_rows: list[tuple[str, str, str]] = []
    primary_key = DATASET_PRIMARY_KEYS[dataset_name]
    for row in rows:
        entity_id = _resolve_entity_id(dataset_name, row, primary_key)
        payload_rows.append((snapshot_id, entity_id, json.dumps(row, ensure_ascii=False)))

    batch_size = 1000
    for i in range(0, len(payload_rows), batch_size):
        batch = payload_rows[i : i + batch_size]
        values_sql = ",".join(["(%s, %s, %s::jsonb)"] * len(batch))
        flat: list[Any] = []
        for item in batch:
            flat.extend(item)
        cur.execute(
            f"INSERT INTO {table_name} (snapshot_id, entity_id, payload) VALUES {values_sql} "
            f"ON CONFLICT (snapshot_id, entity_id) DO UPDATE SET payload = EXCLUDED.payload",
            tuple(flat),
        )


def _upsert_manifest_index(cur: Any, manifest: dict[str, Any]) -> None:
    cur.execute(
        """
        INSERT INTO catalog.snapshot_manifest_index
            (
                snapshot_id,
                repository_id,
                scan_id,
                commit_hash,
                branch_name,
                created_at,
                snapshot_kind,
                extractor_version,
                schema_version,
                storage_root,
                dataset_count,
                row_counts_json,
                checksums_json,
                is_complete,
                manifest_json
            )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s::jsonb, %s::jsonb, %s, %s::jsonb)
        ON CONFLICT (snapshot_id) DO UPDATE
        SET
            repository_id = EXCLUDED.repository_id,
            scan_id = EXCLUDED.scan_id,
            commit_hash = EXCLUDED.commit_hash,
            branch_name = EXCLUDED.branch_name,
            created_at = EXCLUDED.created_at,
            snapshot_kind = EXCLUDED.snapshot_kind,
            extractor_version = EXCLUDED.extractor_version,
            schema_version = EXCLUDED.schema_version,
            storage_root = EXCLUDED.storage_root,
            dataset_count = EXCLUDED.dataset_count,
            row_counts_json = EXCLUDED.row_counts_json,
            checksums_json = EXCLUDED.checksums_json,
            is_complete = EXCLUDED.is_complete,
            manifest_json = EXCLUDED.manifest_json
        """,
        (
            manifest["snapshot_id"],
            manifest["repository_id"],
            manifest["scan_id"],
            manifest["commit_hash"],
            manifest["branch_name"],
            manifest["created_at"],
            manifest["snapshot_kind"],
            manifest["extractor_version"],
            manifest["schema_version"],
            manifest["storage_root"],
            len(manifest.get("datasets", [])),
            json.dumps(manifest.get("row_counts", {}), ensure_ascii=False),
            json.dumps(manifest.get("checksums", {}), ensure_ascii=False),
            bool(manifest.get("completeness", {}).get("is_complete", False)),
            json.dumps(manifest, ensure_ascii=False),
        ),
    )


def _insert_rebuild_audit(
    cur: Any,
    repository_id: str,
    snapshot_id: str,
    status: str,
    details: dict[str, Any],
) -> int:
    cur.execute(
        """
        INSERT INTO catalog.rebuild_audit
            (repository_id, snapshot_id, started_at, status, details_json)
        VALUES (%s, %s, NOW(), %s, %s::jsonb)
        RETURNING audit_id
        """,
        (repository_id, snapshot_id, status, json.dumps(details, ensure_ascii=False)),
    )
    return int(cur.fetchone()[0])


def _finish_rebuild_audit(cur: Any, audit_id: int, status: str, details: dict[str, Any]) -> None:
    cur.execute(
        """
        UPDATE catalog.rebuild_audit
        SET finished_at = NOW(), status = %s, details_json = %s::jsonb
        WHERE audit_id = %s
        """,
        (status, json.dumps(details, ensure_ascii=False), audit_id),
    )


def _upsert_active_snapshot(cur: Any, repository_id: str, snapshot_id: str) -> None:
    cur.execute(
        """
        INSERT INTO catalog.active_snapshot (repository_id, snapshot_id, updated_at)
        VALUES (%s, %s, NOW())
        ON CONFLICT (repository_id) DO UPDATE
        SET snapshot_id = EXCLUDED.snapshot_id, updated_at = NOW()
        """,
        (repository_id, snapshot_id),
    )


def _ensure_catalog_schema(cur: Any) -> None:
    cur.execute("CREATE SCHEMA IF NOT EXISTS catalog")
    for dataset_name in MANDATORY_DATASETS:
        cur.execute(
            f"""
            CREATE TABLE IF NOT EXISTS catalog.projection_{dataset_name} (
                snapshot_id TEXT NOT NULL,
                entity_id TEXT NOT NULL,
                payload JSONB NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                PRIMARY KEY (snapshot_id, entity_id)
            )
            """
        )
        cur.execute(
            f"CREATE INDEX IF NOT EXISTS projection_{dataset_name}_entity_idx "
            f"ON catalog.projection_{dataset_name}(entity_id)"
        )

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS catalog.snapshot_manifest_index (
            snapshot_id TEXT PRIMARY KEY,
            repository_id TEXT NOT NULL,
            scan_id TEXT NOT NULL,
            commit_hash TEXT NOT NULL,
            branch_name TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL,
            snapshot_kind TEXT NOT NULL,
            extractor_version TEXT NOT NULL,
            schema_version TEXT NOT NULL,
            storage_root TEXT NOT NULL,
            dataset_count INTEGER NOT NULL,
            row_counts_json JSONB NOT NULL,
            checksums_json JSONB NOT NULL,
            is_complete BOOLEAN NOT NULL,
            manifest_json JSONB NOT NULL
        )
        """
    )

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS catalog.active_snapshot (
            repository_id TEXT PRIMARY KEY,
            snapshot_id TEXT NOT NULL,
            updated_at TIMESTAMPTZ NOT NULL
        )
        """
    )

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS catalog.rebuild_audit (
            audit_id BIGSERIAL PRIMARY KEY,
            repository_id TEXT NOT NULL,
            snapshot_id TEXT NOT NULL,
            started_at TIMESTAMPTZ NOT NULL,
            finished_at TIMESTAMPTZ,
            status TEXT NOT NULL,
            details_json JSONB NOT NULL
        )
        """
    )

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS catalog.incremental_refresh_audit (
            audit_id BIGSERIAL PRIMARY KEY,
            repository_id TEXT NOT NULL,
            from_snapshot_id TEXT NOT NULL,
            to_snapshot_id TEXT NOT NULL,
            started_at TIMESTAMPTZ NOT NULL,
            finished_at TIMESTAMPTZ,
            status TEXT NOT NULL,
            details_json JSONB NOT NULL
        )
        """
    )


def _load_psycopg() -> Any:
    try:
        import psycopg
    except Exception as exc:  # noqa: BLE001
        raise RuntimeError(
            "Для PostgreSQL-команд нужен пакет 'psycopg'. Установите: python -m pip install psycopg[binary]"
        ) from exc
    return psycopg


def _validate_postgresql_identifier(name: str) -> None:
    if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", name):
        raise ValueError(f"Недопустимое имя PostgreSQL database: {name}")


def _with_connect_timeout(dsn: str, seconds: int = 5) -> str:
    if "connect_timeout=" in dsn:
        return dsn
    delimiter = "&" if "?" in dsn else "?"
    return f"{dsn}{delimiter}connect_timeout={seconds}"


def _build_dataset_table(
    dataset_name: str,
    rows: list[dict[str, Any]],
    snapshot_id: str,
    repository_id: str,
    scan_id: str,
    row_created_at: datetime,
) -> pa.Table:
    contract = DATASET_CONTRACTS[dataset_name]
    normalized_rows = [
        _normalize_row(
            dataset_name=dataset_name,
            row=row,
            schema=contract.schema,
            snapshot_id=snapshot_id,
            repository_id=repository_id,
            scan_id=scan_id,
            created_at=row_created_at,
        )
        for row in rows
    ]
    if not normalized_rows:
        return pa.Table.from_pylist([], schema=contract.schema)
    return pa.Table.from_pylist(normalized_rows, schema=contract.schema)


def _normalize_row(
    dataset_name: str,
    row: dict[str, Any],
    schema: pa.Schema,
    snapshot_id: str,
    repository_id: str,
    scan_id: str,
    created_at: datetime,
) -> dict[str, Any]:
    payload = dict(row)
    payload.setdefault("snapshot_id", snapshot_id)
    if "repository_id" in {field.name for field in schema}:
        payload.setdefault("repository_id", repository_id)
    if "scan_id" in {field.name for field in schema}:
        payload.setdefault("scan_id", scan_id)
    payload.setdefault("created_at", created_at)

    normalized: dict[str, Any] = {}
    for field in schema:
        value = payload.get(field.name)
        if value is None:
            value = _default_value(field)
        normalized[field.name] = _coerce_value(field, value)

    primary_key = DATASET_PRIMARY_KEYS.get(dataset_name)
    if primary_key and not normalized.get(primary_key):
        normalized[primary_key] = _hash_id(dataset_name, _stable_row_repr(normalized))

    return normalized


def _default_value(field: pa.Field) -> Any:
    if field.nullable:
        return None
    if pa.types.is_boolean(field.type):
        return False
    if pa.types.is_integer(field.type):
        return 0
    if pa.types.is_floating(field.type):
        return 0.0
    if pa.types.is_timestamp(field.type):
        return datetime.now(tz=UTC).replace(tzinfo=None)
    if pa.types.is_list(field.type):
        return []
    return ""


def _coerce_value(field: pa.Field, value: Any) -> Any:
    if value is None:
        return None
    if pa.types.is_boolean(field.type):
        return bool(value)
    if pa.types.is_integer(field.type):
        return int(value)
    if pa.types.is_floating(field.type):
        return float(value)
    if pa.types.is_timestamp(field.type):
        if isinstance(value, datetime):
            if value.tzinfo is None:
                return value
            return value.astimezone(UTC).replace(tzinfo=None)
        if isinstance(value, date):
            return datetime(value.year, value.month, value.day)
        if isinstance(value, str):
            normalized = value.replace("Z", "+00:00")
            parsed = datetime.fromisoformat(normalized)
            if parsed.tzinfo is None:
                return parsed
            return parsed.astimezone(UTC).replace(tzinfo=None)
        return datetime.now(tz=UTC).replace(tzinfo=None)
    if pa.types.is_list(field.type):
        if isinstance(value, list):
            return [str(item) for item in value]
        if value is None:
            return []
        return [str(value)]
    return str(value)


def _write_dataset(dataset_name: str, table: pa.Table, datasets_root: Path) -> dict[str, Any]:
    dataset_root = datasets_root / dataset_name
    dataset_root.mkdir(parents=True, exist_ok=True)

    partition_columns = DATASET_PARTITIONS.get(dataset_name, tuple())
    file_checksums: dict[str, str] = {}
    file_paths: list[Path] = []

    if table.num_rows == 0:
        file_path = dataset_root / "part-00000.parquet"
        pq.write_table(table, file_path, compression="zstd")
        file_paths.append(file_path)
    elif not partition_columns:
        file_path = dataset_root / "part-00000.parquet"
        pq.write_table(table, file_path, compression="zstd")
        file_paths.append(file_path)
    else:
        grouped: dict[tuple[str, ...], list[dict[str, Any]]] = {}
        for row in table.to_pylist():
            key = tuple(_safe_partition_value(row.get(column)) for column in partition_columns)
            grouped.setdefault(key, []).append(row)

        for index, key in enumerate(sorted(grouped.keys())):
            partition_dir = dataset_root
            for column, value in zip(partition_columns, key):
                partition_dir = partition_dir / f"{column}={value}"
            partition_dir.mkdir(parents=True, exist_ok=True)
            part_table = pa.Table.from_pylist(grouped[key], schema=table.schema)
            file_path = partition_dir / f"part-{index:05d}.parquet"
            pq.write_table(part_table, file_path, compression="zstd")
            file_paths.append(file_path)

    for file_path in file_paths:
        relative = file_path.relative_to(datasets_root.parent).as_posix()
        file_checksums[relative] = _sha256_file(file_path)

    schema_fingerprint = hashlib.sha256(table.schema.to_string().encode("utf-8")).hexdigest()
    dataset_checksum = _dataset_checksum_from_files(dataset_root)

    return {
        "dataset_name": dataset_name,
        "relative_path": dataset_root.relative_to(datasets_root.parent).as_posix(),
        "row_count": table.num_rows,
        "file_count": len(file_paths),
        "schema_fingerprint": schema_fingerprint,
        "dataset_checksum": dataset_checksum,
        "file_checksums": file_checksums,
    }


def _dataset_checksum_from_files(dataset_root: Path) -> str:
    parquet_files = sorted(dataset_root.rglob("*.parquet"))
    digest = hashlib.sha256()
    for parquet_file in parquet_files:
        digest.update(parquet_file.relative_to(dataset_root).as_posix().encode("utf-8"))
        digest.update(b"|")
        digest.update(_sha256_file(parquet_file).encode("utf-8"))
        digest.update(b"\n")
    return digest.hexdigest()


def _safe_partition_value(value: Any) -> str:
    if value is None:
        return "unknown"
    token = str(value).strip().lower()
    token = re.sub(r"[^a-z0-9._-]+", "_", token)
    token = token.strip("_")
    return token or "unknown"


def _sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        while True:
            chunk = handle.read(1024 * 1024)
            if not chunk:
                break
            digest.update(chunk)
    return digest.hexdigest()


def _hash_id(prefix: str, value: str) -> str:
    return f"{prefix}_{hashlib.sha256(value.encode('utf-8')).hexdigest()[:24]}"


def _iso_now() -> str:
    return datetime.now(tz=UTC).isoformat().replace("+00:00", "Z")


def _snapshot_root(storage_root: Path, repository_id: str, snapshot_date: str, snapshot_id: str) -> Path:
    return (
        storage_root
        / f"repository_id={repository_id}"
        / f"snapshot_date={snapshot_date}"
        / f"snapshot_id={snapshot_id}"
    )


def _load_complete_manifest_if_exists(manifest_file: Path) -> dict[str, Any] | None:
    if not manifest_file.exists():
        return None
    payload = json.loads(manifest_file.read_text(encoding="utf-8"))
    if bool(payload.get("completeness", {}).get("is_complete", False)):
        return payload
    return None


def _resolve_snapshot_root(storage_root: Path, repository_id: str, snapshot_id: str) -> Path:
    candidates = sorted(
        (
            storage_root
            / f"repository_id={repository_id}"
        ).glob(f"snapshot_date=*/snapshot_id={snapshot_id}")
    )
    if not candidates:
        raise FileNotFoundError(
            f"Snapshot не найден: repository_id={repository_id}, snapshot_id={snapshot_id}, storage_root={storage_root}"
        )
    return candidates[-1]


def _load_datasets_payload(datasets_json_file: Path | None) -> dict[str, list[dict[str, Any]]] | None:
    if datasets_json_file is None:
        return None
    payload = json.loads(datasets_json_file.read_text(encoding="utf-8"))
    if "datasets" in payload and isinstance(payload["datasets"], dict):
        source = payload["datasets"]
    else:
        source = payload

    result: dict[str, list[dict[str, Any]]] = {}
    for dataset_name, rows in source.items():
        if dataset_name not in MANDATORY_DATASETS:
            continue
        if not isinstance(rows, list):
            continue
        valid_rows = [dict(item) for item in rows if isinstance(item, dict)]
        result[dataset_name] = valid_rows
    return result


def _load_lineage_refs(lineage_json_file: Path | None, request: SnapshotPublishRequest) -> dict[str, Any]:
    if lineage_json_file is None:
        return {
            "source_commit_hash": request.commit_hash,
            "domain_registry_version": "unknown",
            "docs_index_version": "unknown",
            "migrations_head": "unknown",
        }
    payload = json.loads(lineage_json_file.read_text(encoding="utf-8"))
    return {
        "source_commit_hash": payload.get("source_commit_hash", request.commit_hash),
        "domain_registry_version": payload.get("domain_registry_version", "unknown"),
        "docs_index_version": payload.get("docs_index_version", "unknown"),
        "migrations_head": payload.get("migrations_head", "unknown"),
    }


def _validate_schema_evolution(
    storage_root: Path,
    repository_id: str,
    current_snapshot_id: str,
    current_schema_bundle: dict[str, Any],
) -> list[str]:
    manifests = _list_snapshot_manifests(storage_root, repository_id)
    previous = [item for item in manifests if item["snapshot_id"] != current_snapshot_id]
    if not previous:
        return []

    previous_latest = sorted(previous, key=lambda item: item["created_at"], reverse=True)[0]
    previous_schema_file = previous_latest["snapshot_root"] / "manifest" / "schema_bundle.json"
    if not previous_schema_file.exists():
        return []

    previous_schema = json.loads(previous_schema_file.read_text(encoding="utf-8"))
    current_by_dataset = {item["dataset_name"]: item for item in current_schema_bundle.get("datasets", [])}
    previous_by_dataset = {item["dataset_name"]: item for item in previous_schema.get("datasets", [])}

    issues: list[str] = []
    for dataset_name, previous_dataset in previous_by_dataset.items():
        current_dataset = current_by_dataset.get(dataset_name)
        if current_dataset is None:
            issues.append(f"Schema evolution violation: dataset удален: {dataset_name}")
            continue

        previous_columns = {column["name"]: column for column in previous_dataset.get("columns", [])}
        current_columns = {column["name"]: column for column in current_dataset.get("columns", [])}

        for column_name, previous_column in previous_columns.items():
            current_column = current_columns.get(column_name)
            if current_column is None:
                issues.append(f"Schema evolution violation: {dataset_name}.{column_name} удален")
                continue
            if current_column["type"] != previous_column["type"]:
                issues.append(
                    f"Schema evolution violation: type mismatch {dataset_name}.{column_name}: "
                    f"{previous_column['type']} -> {current_column['type']}"
                )
            if bool(current_column["nullable"]) != bool(previous_column["nullable"]):
                issues.append(
                    f"Schema evolution violation: nullability mismatch {dataset_name}.{column_name}: "
                    f"{previous_column['nullable']} -> {current_column['nullable']}"
                )

        for column_name, current_column in current_columns.items():
            if column_name in previous_columns:
                continue
            if not bool(current_column["nullable"]):
                issues.append(
                    f"Schema evolution violation: новый столбец должен быть nullable: {dataset_name}.{column_name}"
                )

    return issues


def _list_snapshot_manifests(storage_root: Path, repository_id: str) -> list[dict[str, Any]]:
    repository_root = storage_root / f"repository_id={repository_id}"
    if not repository_root.exists():
        return []

    manifests: list[dict[str, Any]] = []
    for manifest_file in repository_root.glob("snapshot_date=*/snapshot_id=*/manifest/snapshot_manifest.json"):
        payload = json.loads(manifest_file.read_text(encoding="utf-8"))
        created_at_raw = str(payload.get("created_at", "")).replace("Z", "+00:00")
        try:
            created_at = datetime.fromisoformat(created_at_raw)
        except ValueError:
            created_at = datetime.now(tz=UTC)
        if created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=UTC)

        manifests.append(
            {
                "snapshot_id": payload.get("snapshot_id"),
                "snapshot_kind": str(payload.get("snapshot_kind", "")).lower(),
                "created_at": created_at,
                "snapshot_root": manifest_file.parent.parent,
                "manifest": payload,
            }
        )

    return manifests


def _stable_row_repr(row: dict[str, Any]) -> str:
    return json.dumps(_normalize_json_value(row), ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def _normalize_json_value(value: Any) -> Any:
    if isinstance(value, dict):
        return {key: _normalize_json_value(value[key]) for key in sorted(value.keys())}
    if isinstance(value, list):
        return [_normalize_json_value(item) for item in value]
    if isinstance(value, datetime):
        if value.tzinfo is None:
            return value.isoformat() + "Z"
        return value.astimezone(UTC).isoformat().replace("+00:00", "Z")
    return value


def _resolve_entity_id(dataset_name: str, row: dict[str, Any], primary_key: str) -> str:
    if dataset_name == "database_catalog":
        candidate = row.get("column_id") or row.get("table_id") or row.get("migration_id") or row.get("name")
        if candidate:
            return str(candidate)
    candidate = row.get(primary_key)
    if candidate:
        return str(candidate)
    return _hash_id(dataset_name, _stable_row_repr(row))


def _read_dataset_rows(snapshot_root: Path, dataset_name: str) -> list[dict[str, Any]]:
    dataset_dir = snapshot_root / "datasets" / dataset_name
    if not dataset_dir.exists():
        return []
    rows: list[dict[str, Any]] = []
    for parquet_file in sorted(dataset_dir.rglob("*.parquet")):
        table = pq.ParquetFile(parquet_file).read()
        rows.extend(table.to_pylist())
    return rows


def _build_baseline_datasets(root: Path, repository_id: str, scan_id: str) -> dict[str, list[dict[str, Any]]]:
    package_rows = _extract_packages(root)
    package_id_by_path = {entry["package_path"]: entry["package_id"] for entry in package_rows}
    module_rows = _extract_modules(package_rows)
    module_id_by_path = {entry["root_path"]: entry["module_id"] for entry in module_rows}

    repository_files_rows = _extract_repository_files(
        root=root,
        repository_id=repository_id,
        package_id_by_path=package_id_by_path,
        module_id_by_path=module_id_by_path,
    )
    docs_rows, docs_section_rows = _extract_documentation(root)
    types_rows, methods_rows, method_params_rows = _extract_code_model(root, package_id_by_path, module_id_by_path)
    domain_rows = _extract_domain_entities(root)
    database_rows = _extract_database_catalog(root)

    provenance_rows = [
        {
            "parser_run_id": _hash_id("parser_run", f"{repository_id}:{scan_id}"),
            "extract_event_id": _hash_id("extract_event", dataset_name),
            "extractor_name": "tools.automation.snapshot",
            "extractor_version": "1.0.0",
            "event_time": datetime.now(tz=UTC),
            "confidence": 1.0,
            "evidence_kind": "deterministic_baseline",
            "source_ref": dataset_name,
            "trace_id": str(uuid.uuid4()),
        }
        for dataset_name in MANDATORY_DATASETS
    ]

    return {
        "repository_files": repository_files_rows,
        "modules": module_rows,
        "packages": package_rows,
        "code_types": types_rows,
        "methods": methods_rows,
        "method_parameters": method_params_rows,
        "members": [],
        "domain_entities": domain_rows,
        "documentation": docs_rows,
        "documentation_sections": docs_section_rows,
        "database_catalog": database_rows,
        "relations": [],
        "provenance": provenance_rows,
    }


def _extract_packages(root: Path) -> list[dict[str, Any]]:
    packages_root = root / "packages"
    if not packages_root.exists():
        return []

    rows: list[dict[str, Any]] = []
    for package_json in sorted(packages_root.rglob("package.json")):
        payload = json.loads(package_json.read_text(encoding="utf-8"))
        package_name = payload.get("name")
        if not isinstance(package_name, str) or not package_name.strip():
            continue
        package_path = package_json.parent.relative_to(root).as_posix()
        namespace = package_name.split("/")[0] if "/" in package_name else package_name
        rows.append(
            {
                "package_id": _hash_id("pkg", package_name),
                "namespace": namespace,
                "package_name": package_name,
                "package_path": package_path,
                "status": "active",
                "flags": [],
            }
        )
    return rows


def _extract_modules(package_rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    seen: set[str] = set()
    for package in package_rows:
        package_path = str(package["package_path"])
        parts = package_path.split("/")
        module_name = parts[-1] if parts else package_path
        module_key = "/".join(parts[-3:]) if len(parts) >= 3 else package_path
        module_id = _hash_id("mod", module_key)
        if module_id in seen:
            continue
        seen.add(module_id)
        bounded_context = "fp-core" if "/fp/" in f"/{package_path}/" else "general"
        rows.append(
            {
                "module_id": module_id,
                "module_name": module_name,
                "root_path": package_path,
                "ownership_team": "core-platform",
                "bounded_context": bounded_context,
                "status": "active",
                "flags": [],
            }
        )
    return rows


def _extract_repository_files(
    root: Path,
    repository_id: str,
    package_id_by_path: dict[str, str],
    module_id_by_path: dict[str, str],
) -> list[dict[str, Any]]:
    noise_patterns = load_noise_patterns(root)
    rows: list[dict[str, Any]] = []

    for file_path in sorted(root.rglob("*")):
        if not file_path.is_file():
            continue
        if is_noise_path(file_path, root, noise_patterns):
            continue

        relative = file_path.relative_to(root).as_posix()
        if relative.startswith("dist/snapshot-store"):
            continue

        package_id = _resolve_package_id(relative, package_id_by_path)
        module_id = _resolve_package_id(relative, module_id_by_path)

        content = file_path.read_bytes()
        lines = file_path.read_text(encoding="utf-8", errors="ignore").splitlines()

        rows.append(
            {
                "file_id": _hash_id("file", f"{repository_id}:{relative}"),
                "normalized_path": relative,
                "canonical_path": str(file_path.resolve()),
                "module_id": module_id,
                "package_id": package_id,
                "language": _detect_language(file_path),
                "file_kind": _detect_file_kind(relative),
                "content_hash": hashlib.sha256(content).hexdigest(),
                "path_hash": hashlib.sha256(relative.encode("utf-8")).hexdigest(),
                "size_bytes": file_path.stat().st_size,
                "line_count": len(lines),
                "is_deleted": False,
                "is_generated": "/dist/" in f"/{relative}/",
            }
        )

    return rows


def _extract_documentation(root: Path) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    docs_root = root / "docs"
    if not docs_root.exists():
        return [], []

    docs_rows: list[dict[str, Any]] = []
    sections_rows: list[dict[str, Any]] = []

    heading_pattern = re.compile(r"^(#{1,6})\s+(.+?)\s*$")
    for doc_file in sorted(docs_root.rglob("*.md")):
        relative = doc_file.relative_to(root).as_posix()
        text = doc_file.read_text(encoding="utf-8", errors="ignore")
        lines = text.splitlines()

        title = None
        for line in lines:
            if line.startswith("# "):
                title = line[2:].strip()
                break

        doc_id = _hash_id("doc", relative)
        docs_rows.append(
            {
                "doc_id": doc_id,
                "doc_path": relative,
                "doc_kind": _detect_doc_kind(relative),
                "title": title,
                "language": _detect_text_language(text),
                "content_hash": hashlib.sha256(text.encode("utf-8")).hexdigest(),
                "line_count": len(lines),
                "status": "active",
                "updated_at": datetime.fromtimestamp(doc_file.stat().st_mtime, tz=UTC),
            }
        )

        position = 0
        for line in lines:
            match = heading_pattern.match(line)
            if not match:
                continue
            position += 1
            heading = match.group(2).strip()
            level = len(match.group(1))
            sections_rows.append(
                {
                    "section_id": _hash_id("doc_section", f"{relative}:{position}:{heading}"),
                    "doc_id": doc_id,
                    "section_path": f"{relative}#section-{position}",
                    "heading": heading,
                    "level": level,
                    "position": position,
                    "content_hash": hashlib.sha256(heading.encode("utf-8")).hexdigest(),
                }
            )

    return docs_rows, sections_rows


def _extract_code_model(
    root: Path,
    package_id_by_path: dict[str, str],
    module_id_by_path: dict[str, str],
) -> tuple[list[dict[str, Any]], list[dict[str, Any]], list[dict[str, Any]]]:
    type_rows: list[dict[str, Any]] = []
    method_rows: list[dict[str, Any]] = []
    parameter_rows: list[dict[str, Any]] = []

    ts_type_pattern = re.compile(r"^\s*export\s+(?:type|interface|class|enum)\s+([A-Za-z_][A-Za-z0-9_]*)", re.MULTILINE)
    ts_function_pattern = re.compile(
        r"^\s*export\s+(?:async\s+)?function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)"
        r"|^\s*export\s+const\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(?:async\s*)?\(([^)]*)\)",
        re.MULTILINE,
    )
    py_class_pattern = re.compile(r"^\s*class\s+([A-Za-z_][A-Za-z0-9_]*)", re.MULTILINE)
    py_function_pattern = re.compile(r"^\s*(async\s+)?def\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(([^)]*)\)", re.MULTILINE)

    for source_file in sorted(root.rglob("*")):
        if not source_file.is_file() or source_file.suffix.lower() not in {".ts", ".tsx", ".py"}:
            continue
        relative = source_file.relative_to(root).as_posix()
        if "/node_modules/" in f"/{relative}/" or "/dist/" in f"/{relative}/":
            continue

        text = source_file.read_text(encoding="utf-8", errors="ignore")
        language = _detect_language(source_file)
        package_id = _resolve_package_id(relative, package_id_by_path)
        module_id = _resolve_package_id(relative, module_id_by_path)

        if source_file.suffix.lower() in {".ts", ".tsx"}:
            for type_match in ts_type_pattern.finditer(text):
                type_name = type_match.group(1)
                type_rows.append(
                    {
                        "type_id": _hash_id("type", f"{relative}:{type_name}"),
                        "module_id": module_id,
                        "package_id": package_id,
                        "type_name": type_name,
                        "kind": "exported_type",
                        "signature": type_name,
                        "language": language,
                        "source_ref": relative,
                        "status": "active",
                    }
                )

            for function_match in ts_function_pattern.finditer(text):
                method_name = function_match.group(1) or function_match.group(3)
                params_blob = function_match.group(2) or function_match.group(4) or ""
                method_id = _hash_id("method", f"{relative}:{method_name}")
                method_rows.append(
                    {
                        "method_id": method_id,
                        "owner_type_id": None,
                        "module_id": module_id,
                        "package_id": package_id,
                        "method_name": method_name,
                        "signature": f"{method_name}({params_blob})",
                        "return_type": None,
                        "is_async": "async" in function_match.group(0),
                        "visibility": "public",
                        "language": language,
                        "source_file_path": relative,
                        "source_line_start": None,
                        "source_line_end": None,
                        "source_ref": relative,
                        "status": "active",
                    }
                )
                parameter_rows.extend(_extract_method_parameters(method_id, params_blob))

        if source_file.suffix.lower() == ".py":
            for class_match in py_class_pattern.finditer(text):
                type_name = class_match.group(1)
                type_rows.append(
                    {
                        "type_id": _hash_id("type", f"{relative}:{type_name}"),
                        "module_id": module_id,
                        "package_id": package_id,
                        "type_name": type_name,
                        "kind": "class",
                        "signature": f"class {type_name}",
                        "language": language,
                        "source_ref": relative,
                        "status": "active",
                    }
                )

            for function_match in py_function_pattern.finditer(text):
                method_name = function_match.group(2)
                params_blob = function_match.group(3)
                method_id = _hash_id("method", f"{relative}:{method_name}")
                method_rows.append(
                    {
                        "method_id": method_id,
                        "owner_type_id": None,
                        "module_id": module_id,
                        "package_id": package_id,
                        "method_name": method_name,
                        "signature": f"{method_name}({params_blob})",
                        "return_type": None,
                        "is_async": bool(function_match.group(1)),
                        "visibility": "public",
                        "language": language,
                        "source_file_path": relative,
                        "source_line_start": None,
                        "source_line_end": None,
                        "source_ref": relative,
                        "status": "active",
                    }
                )
                parameter_rows.extend(_extract_method_parameters(method_id, params_blob))

    return type_rows, method_rows, parameter_rows


def _extract_method_parameters(method_id: str, params_blob: str) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    if not params_blob.strip():
        return rows

    for position, raw in enumerate(params_blob.split(","), start=1):
        token = raw.strip()
        if not token:
            continue

        is_variadic = token.startswith("...") or token.startswith("*")
        cleaned = token.lstrip(".*")
        default_value = None
        if "=" in cleaned:
            param_name, default_value = [item.strip() for item in cleaned.split("=", 1)]
            is_optional = True
        else:
            param_name = cleaned
            is_optional = "?" in param_name

        if ":" in param_name:
            name_part, type_part = [item.strip() for item in param_name.split(":", 1)]
        else:
            name_part = param_name.replace("?", "").strip()
            type_part = None

        rows.append(
            {
                "parameter_id": _hash_id("param", f"{method_id}:{position}:{name_part}"),
                "method_id": method_id,
                "position": position,
                "param_name": name_part,
                "param_type": type_part,
                "default_value": default_value,
                "is_optional": bool(is_optional),
                "is_variadic": bool(is_variadic),
            }
        )

    return rows


def _extract_domain_entities(root: Path) -> list[dict[str, Any]]:
    registry_path = root / "docs" / "_generated" / "identifier-registry" / "MONOREPO-IDENTIFIER-REGISTRY.json"
    if not registry_path.exists():
        return []

    payload = json.loads(registry_path.read_text(encoding="utf-8"))
    rows: list[dict[str, Any]] = []
    for package in payload.get("packages", []):
        entity_name = str(package.get("package_name", ""))
        if not entity_name:
            continue
        rows.append(
            {
                "domain_entity_id": _hash_id("domain_entity", entity_name),
                "entity_name": entity_name,
                "registry_source": registry_path.relative_to(root).as_posix(),
                "explicit_marker": True,
                "inferred_marker": False,
                "confidence": 1.0,
                "status": str(package.get("package_status", "active")),
            }
        )
    return rows


def _extract_database_catalog(root: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    sql_files = sorted(root.rglob("*.sql"))
    create_table_pattern = re.compile(r"create\s+table\s+(?:if\s+not\s+exists\s+)?([a-zA-Z0-9_.\"-]+)", re.IGNORECASE)

    for sql_file in sql_files:
        relative = sql_file.relative_to(root).as_posix()
        if "/node_modules/" in f"/{relative}/" or "/dist/" in f"/{relative}/":
            continue

        text = sql_file.read_text(encoding="utf-8", errors="ignore")
        matches = list(create_table_pattern.finditer(text))
        if not matches:
            rows.append(
                {
                    "database_id": "db_catalog",
                    "schema_id": "public",
                    "table_id": _hash_id("db_table", f"migration:{relative}"),
                    "column_id": None,
                    "migration_id": _hash_id("migration", relative),
                    "artifact_kind": "migration",
                    "name": relative,
                    "data_type": None,
                    "nullable": None,
                    "default_expr": None,
                    "source_ref": relative,
                }
            )
            continue

        for match in matches:
            raw_name = match.group(1).strip('"')
            if "." in raw_name:
                schema_name, table_name = raw_name.split(".", 1)
            else:
                schema_name, table_name = "public", raw_name
            rows.append(
                {
                    "database_id": "db_catalog",
                    "schema_id": schema_name,
                    "table_id": _hash_id("db_table", f"{schema_name}.{table_name}"),
                    "column_id": None,
                    "migration_id": _hash_id("migration", relative),
                    "artifact_kind": "table",
                    "name": table_name,
                    "data_type": None,
                    "nullable": None,
                    "default_expr": None,
                    "source_ref": relative,
                }
            )

    return rows


def _resolve_package_id(relative_path: str, by_path: dict[str, str]) -> str | None:
    best_match = None
    for package_path, package_id in by_path.items():
        prefix = f"{package_path}/"
        if relative_path == package_path or relative_path.startswith(prefix):
            if best_match is None or len(package_path) > len(best_match[0]):
                best_match = (package_path, package_id)
    if best_match is None:
        return None
    return best_match[1]


def _detect_language(path: Path) -> str:
    suffix = path.suffix.lower()
    mapping = {
        ".ts": "typescript",
        ".tsx": "typescript",
        ".js": "javascript",
        ".mjs": "javascript",
        ".cjs": "javascript",
        ".py": "python",
        ".rs": "rust",
        ".md": "markdown",
        ".json": "json",
        ".sql": "sql",
        ".yaml": "yaml",
        ".yml": "yaml",
        ".toml": "toml",
    }
    return mapping.get(suffix, "unknown")


def _detect_file_kind(relative_path: str) -> str:
    lower = relative_path.lower()
    if "/__tests__/" in lower or lower.endswith(".test.ts") or lower.endswith(".spec.ts"):
        return "test"
    if lower.startswith("docs/"):
        return "doc"
    if "/migrations/" in lower or lower.endswith(".sql"):
        return "database"
    if lower.endswith("package.json") or lower.endswith("pyproject.toml"):
        return "config"
    return "source"


def _detect_doc_kind(relative_path: str) -> str:
    lower = relative_path.lower()
    filename = Path(lower).name
    if filename.startswith("task-"):
        return "task"
    if filename.startswith("spec-"):
        return "spec"
    if filename.startswith("doc-"):
        return "doc"
    if filename.startswith("note-"):
        return "note"
    if filename == "readme.md":
        return "readme"
    return "documentation"


def _detect_text_language(text: str) -> str:
    cyrillic_count = len(re.findall(r"[А-Яа-яЁё]", text))
    latin_count = len(re.findall(r"[A-Za-z]", text))
    if cyrillic_count > latin_count:
        return "ru"
    if latin_count > 0:
        return "en"
    return "unknown"
