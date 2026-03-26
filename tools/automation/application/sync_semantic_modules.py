from __future__ import annotations

import json
import re
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Any

from tools.automation.application.sync_identifiers import (
    REGISTRY_DIR_RELATIVE,
    REGISTRY_JSON_FILE_NAME,
    STATUS_COMPLETED,
    STATUS_IN_ADJUSTMENT,
    STATUS_PLANNED,
)


SEMANTIC_REGISTRY_JSON_RELATIVE = Path("docs/_generated/identifier-registry/SEMANTIC-FP-RESULT-REGISTRY.json")
SEMANTIC_LAYER_MARKDOWN_RELATIVE = Path(
    "docs/archive/legacy-semantic-modules/layers/LAYER-001-semantic-fp-result-machine-registry.md"
)
SEMANTIC_LAYER_MARKDOWN_UUID = "8a2c88d8-a57e-4eb7-8d87-f5fb56f36fa4"


# DDD Entity: модуль semantic-слоя.
@dataclass(frozen=True)
class SemanticModuleDefinition:
    module_id: int
    module_name: str
    purpose: str


# DDD Entity: определение semantic-метода до разрешения через production-реестр.
@dataclass(frozen=True)
class SemanticMethodDefinition:
    local_identifier: str
    module_id: int
    semantic_alias: str
    package_name: str | None
    project_method_name: str | None
    rust_method_name: str | None
    canonical_method_label: str
    default_status: str


# DDD Entity: resolved-состояние semantic-метода.
@dataclass(frozen=True)
class SemanticMethodEntry:
    local_identifier: str
    module_id: int
    semantic_alias: str
    canonical_method_label: str
    method_identifier: str | None
    package_name: str | None
    implementation_status: str
    resolution_state: str
    rust_original_method_identifier: str | None
    rust_original_method_name: str | None
    source_layer: str

    def to_dict(self) -> dict[str, Any]:
        return {
            "local_identifier": self.local_identifier,
            "module_id": self.module_id,
            "semantic_alias": self.semantic_alias,
            "canonical_method_label": self.canonical_method_label,
            "method_identifier": self.method_identifier,
            "package_name": self.package_name,
            "implementation_status": self.implementation_status,
            "resolution_state": self.resolution_state,
            "rust_original_method_identifier": self.rust_original_method_identifier,
            "rust_original_method_name": self.rust_original_method_name,
            "source_layer": self.source_layer,
        }


# DDD Entity: typed-элемент semantic-слоя.
@dataclass(frozen=True)
class SemanticTypeEntry:
    local_identifier: str
    module_id: int
    type_label: str
    path: str
    implementation_status: str

    def to_dict(self) -> dict[str, Any]:
        return {
            "local_identifier": self.local_identifier,
            "module_id": self.module_id,
            "type_label": self.type_label,
            "path": self.path,
            "implementation_status": self.implementation_status,
        }


# DDD Entity: состояние semantic-модуля после агрегации статусов.
@dataclass(frozen=True)
class SemanticModuleEntry:
    module_id: int
    module_name: str
    purpose: str
    implementation_status: str
    primary_methods_count: int
    supplemental_methods_count: int
    types_count: int

    def to_dict(self) -> dict[str, Any]:
        return {
            "module_id": self.module_id,
            "module_name": self.module_name,
            "purpose": self.purpose,
            "implementation_status": self.implementation_status,
            "primary_methods_count": self.primary_methods_count,
            "supplemental_methods_count": self.supplemental_methods_count,
            "types_count": self.types_count,
        }


# DDD Aggregate: финальный результат синхронизации semantic-слоя.
@dataclass(frozen=True)
class SemanticSyncReport:
    semantic_modules_count: int
    primary_methods_count: int
    supplemental_methods_count: int
    type_entries_count: int
    resolved_methods_count: int
    unresolved_methods_count: int
    registry_json_file: str
    layer_markdown_file: str

    def to_dict(self) -> dict[str, Any]:
        return {
            "semantic_modules_count": self.semantic_modules_count,
            "primary_methods_count": self.primary_methods_count,
            "supplemental_methods_count": self.supplemental_methods_count,
            "type_entries_count": self.type_entries_count,
            "resolved_methods_count": self.resolved_methods_count,
            "unresolved_methods_count": self.unresolved_methods_count,
            "registry_json_file": self.registry_json_file,
            "layer_markdown_file": self.layer_markdown_file,
        }


def run_sync_semantic_modules(root: Path) -> SemanticSyncReport:
    repo_root = root.resolve()
    source_registry_path = (repo_root / REGISTRY_DIR_RELATIVE / REGISTRY_JSON_FILE_NAME).resolve()
    if not source_registry_path.exists():
        raise FileNotFoundError(
            f"Missing source registry: {source_registry_path}. Run 'pnpm run docs:sync-identifiers' first."
        )

    source_registry = json.loads(source_registry_path.read_text(encoding="utf-8"))
    methods = source_registry.get("methods", [])
    by_project, by_rust = _build_registry_indexes(methods)

    module_catalog = _build_module_catalog()
    primary_defs = _build_primary_semantic_method_catalog()
    supplemental_defs = _build_supplemental_semantic_method_catalog()
    type_entries = _build_type_entries(repo_root)

    primary_entries = [_resolve_method_definition(definition, by_project, by_rust, "primary") for definition in primary_defs]
    supplemental_entries = [
        _resolve_method_definition(definition, by_project, by_rust, "supplemental") for definition in supplemental_defs
    ]

    module_entries = _build_module_entries(module_catalog, primary_entries, supplemental_entries, type_entries)

    output_registry_path = (repo_root / SEMANTIC_REGISTRY_JSON_RELATIVE).resolve()
    output_registry_path.parent.mkdir(parents=True, exist_ok=True)

    registry_payload = _build_semantic_registry_payload(
        source_registry_path=source_registry_path,
        module_entries=module_entries,
        primary_entries=primary_entries,
        supplemental_entries=supplemental_entries,
        type_entries=type_entries,
    )
    _write_json(output_registry_path, registry_payload)

    layer_markdown_path = (repo_root / SEMANTIC_LAYER_MARKDOWN_RELATIVE).resolve()
    layer_markdown_path.parent.mkdir(parents=True, exist_ok=True)
    created_date = _read_or_default_created_date(layer_markdown_path, date.today().isoformat())
    layer_markdown = _build_semantic_layer_markdown(
        created_date=created_date,
        updated_date=date.today().isoformat(),
        module_entries=module_entries,
        primary_entries=primary_entries,
        supplemental_entries=supplemental_entries,
        type_entries=type_entries,
    )
    layer_markdown_path.write_text(layer_markdown, encoding="utf-8")

    unresolved_methods_count = len(
        [entry for entry in [*primary_entries, *supplemental_entries] if entry.resolution_state == "unresolved"]
    )
    resolved_methods_count = len(primary_entries) + len(supplemental_entries) - unresolved_methods_count

    return SemanticSyncReport(
        semantic_modules_count=len(module_entries),
        primary_methods_count=len(primary_entries),
        supplemental_methods_count=len(supplemental_entries),
        type_entries_count=len(type_entries),
        resolved_methods_count=resolved_methods_count,
        unresolved_methods_count=unresolved_methods_count,
        registry_json_file=str(output_registry_path),
        layer_markdown_file=str(layer_markdown_path),
    )


def _build_registry_indexes(
    methods: list[dict[str, Any]],
) -> tuple[dict[tuple[str, str], dict[str, Any]], dict[tuple[str, str], dict[str, Any]]]:
    by_project: dict[tuple[str, str], dict[str, Any]] = {}
    by_rust: dict[tuple[str, str], dict[str, Any]] = {}

    for row in methods:
        package_name = str(row.get("package_name") or "")
        project_method_name = str(row.get("project_method_name") or "")
        rust_method_name = str(row.get("rust_original_method_name") or "")

        if package_name and project_method_name and (package_name, project_method_name) not in by_project:
            by_project[(package_name, project_method_name)] = row
        if package_name and rust_method_name and (package_name, rust_method_name) not in by_rust:
            by_rust[(package_name, rust_method_name)] = row

    return by_project, by_rust


def _build_module_catalog() -> list[SemanticModuleDefinition]:
    return [
        SemanticModuleDefinition(1, "predicates", "Проверки состояния Result"),
        SemanticModuleDefinition(2, "transform", "Преобразование значений"),
        SemanticModuleDefinition(3, "flow", "Цепочки и композиция"),
        SemanticModuleDefinition(4, "match", "Pattern matching"),
        SemanticModuleDefinition(5, "access/safe", "Безопасное извлечение"),
        SemanticModuleDefinition(6, "access/unsafe", "Небезопасный доступ / panic-поведение"),
        SemanticModuleDefinition(7, "effects", "Побочные эффекты"),
        SemanticModuleDefinition(8, "collection", "Коллекции и итерация"),
        SemanticModuleDefinition(9, "comparison", "Сравнение Result"),
        SemanticModuleDefinition(10, "conversion", "Конвертация и flatten"),
        SemanticModuleDefinition(11, "construction", "Конструирование Ok/Err"),
        SemanticModuleDefinition(12, "async", "Async-интеграция"),
        SemanticModuleDefinition(13, "guards", "Type guards и narrowing"),
        SemanticModuleDefinition(14, "types", "Типы Result<T,E>, Ok<T>, Err<E>"),
    ]


def _build_primary_semantic_method_catalog() -> list[SemanticMethodDefinition]:
    result_pkg = "@resultsafe/core-fp-result"
    union_pkg = "@resultsafe/core-fp-union"
    return [
        SemanticMethodDefinition("1", 1, "resIsOk", result_pkg, "isOk", None, "`isOk`", STATUS_PLANNED),
        SemanticMethodDefinition("2", 1, "resIsErr", result_pkg, "isErr", None, "`isErr`", STATUS_PLANNED),
        SemanticMethodDefinition("3", 1, "resIsOkAnd", result_pkg, "isOkAnd", None, "`isOkAnd`", STATUS_PLANNED),
        SemanticMethodDefinition("4", 1, "resIsErrAnd", result_pkg, "isErrAnd", None, "`isErrAnd`", STATUS_PLANNED),
        SemanticMethodDefinition(
            "5", 1, "resContainsOk", result_pkg, None, "contains", "целевой Rust-метод `contains`", STATUS_PLANNED
        ),
        SemanticMethodDefinition(
            "6", 1, "resContainsErr", result_pkg, None, "contains_err", "целевой Rust-метод `contains_err`", STATUS_PLANNED
        ),
        SemanticMethodDefinition("7", 2, "mapResultOk", result_pkg, "map", None, "`map`", STATUS_PLANNED),
        SemanticMethodDefinition("8", 2, "mapResultErr", result_pkg, "mapErr", None, "`mapErr`", STATUS_PLANNED),
        SemanticMethodDefinition(
            "9", 2, "mapResultOr", result_pkg, None, "map_or", "целевой Rust-метод `map_or`", STATUS_PLANNED
        ),
        SemanticMethodDefinition(
            "10",
            2,
            "mapResultOrElse",
            result_pkg,
            None,
            "map_or_else",
            "целевой Rust-метод `map_or_else`",
            STATUS_PLANNED,
        ),
        SemanticMethodDefinition("11", 2, "resBimap", None, None, None, "канонический метод не найден", STATUS_PLANNED),
        SemanticMethodDefinition("12", 3, "resAnd", result_pkg, None, "and", "целевой Rust-метод `and`", STATUS_PLANNED),
        SemanticMethodDefinition("13", 3, "resFlatMap", result_pkg, "andThen", None, "`andThen`", STATUS_PLANNED),
        SemanticMethodDefinition("14", 3, "resOr", result_pkg, None, "or", "целевой Rust-метод `or`", STATUS_PLANNED),
        SemanticMethodDefinition("15", 3, "resOrElse", result_pkg, "orElse", None, "`orElse`", STATUS_PLANNED),
        SemanticMethodDefinition("16", 3, "resSwap", None, None, None, "канонический метод не найден", STATUS_PLANNED),
        SemanticMethodDefinition("17", 4, "resMatch", result_pkg, "match", None, "`match`", STATUS_PLANNED),
        SemanticMethodDefinition("18", 5, "resUnwrapOr", result_pkg, "unwrapOr", None, "`unwrapOr`", STATUS_PLANNED),
        SemanticMethodDefinition("19", 5, "resUnwrapOrElse", result_pkg, "unwrapOrElse", None, "`unwrapOrElse`", STATUS_PLANNED),
        SemanticMethodDefinition(
            "20",
            5,
            "resUnwrapOrDefault",
            result_pkg,
            None,
            "unwrap_or_default",
            "целевой Rust-метод `unwrap_or_default`",
            STATUS_PLANNED,
        ),
        SemanticMethodDefinition("21", 5, "resUnwrapErr", result_pkg, "unwrapErr", None, "`unwrapErr`", STATUS_PLANNED),
        SemanticMethodDefinition("22", 7, "resTapOk", result_pkg, "inspect", None, "`inspect`", STATUS_PLANNED),
        SemanticMethodDefinition("23", 7, "resTapErr", result_pkg, "inspectErr", None, "`inspectErr`", STATUS_PLANNED),
        SemanticMethodDefinition("24", 8, "resToIterable", result_pkg, None, "iter", "целевой Rust-метод `iter`", STATUS_PLANNED),
        SemanticMethodDefinition("25", 8, "resAll", None, None, None, "канонический метод не найден", STATUS_PLANNED),
        SemanticMethodDefinition("26", 8, "resAllSettled", None, None, None, "канонический метод не найден", STATUS_PLANNED),
        SemanticMethodDefinition(
            "27", 9, "resEquals", result_pkg, None, "eq / ==", "целевой Rust-метод `eq / ==`", STATUS_PLANNED
        ),
        SemanticMethodDefinition("28", 10, "resToOption", result_pkg, "ok", None, "`ok`", STATUS_PLANNED),
        SemanticMethodDefinition("29", 10, "resToErrorOption", result_pkg, "err", None, "`err`", STATUS_PLANNED),
        SemanticMethodDefinition("30", 10, "resFlatten", result_pkg, "flatten", None, "`flatten`", STATUS_PLANNED),
        SemanticMethodDefinition("31", 11, "createOk", result_pkg, "Ok", None, "`Ok`", STATUS_PLANNED),
        SemanticMethodDefinition("32", 11, "createErr", result_pkg, "Err", None, "`Err`", STATUS_PLANNED),
        SemanticMethodDefinition("33", 12, "resToPromise", None, None, None, "канонический метод не найден", STATUS_PLANNED),
        SemanticMethodDefinition("34", 12, "resFromPromise", None, None, None, "канонический метод не найден", STATUS_PLANNED),
        SemanticMethodDefinition("35", 12, "resFromAsyncFn", None, None, None, "канонический метод не найден", STATUS_PLANNED),
        SemanticMethodDefinition("36", 12, "resTryCatch", None, None, None, "канонический метод не найден", STATUS_PLANNED),
        SemanticMethodDefinition("37", 13, "isResult", union_pkg, "isResult", None, "`isResult`", STATUS_PLANNED),
        SemanticMethodDefinition("38", 13, "isOk", result_pkg, "isOk", None, "`isOk`", STATUS_PLANNED),
        SemanticMethodDefinition("39", 13, "isErr", result_pkg, "isErr", None, "`isErr`", STATUS_PLANNED),
    ]


def _build_supplemental_semantic_method_catalog() -> list[SemanticMethodDefinition]:
    result_pkg = "@resultsafe/core-fp-result"
    return [
        SemanticMethodDefinition("6-U1", 6, "unwrap", result_pkg, "unwrap", None, "`unwrap`", STATUS_PLANNED),
        SemanticMethodDefinition("6-U2", 6, "expect", result_pkg, "expect", None, "`expect`", STATUS_PLANNED),
        SemanticMethodDefinition(
            "6-U3",
            6,
            "unsafeUnwrap",
            result_pkg,
            None,
            "unwrap_unchecked",
            "целевой Rust-метод `unwrap_unchecked`",
            STATUS_PLANNED,
        ),
    ]


def _build_type_entries(repo_root: Path) -> list[SemanticTypeEntry]:
    candidates = [
        ("14-T1", "Result<T, E>", "packages/core/fp/result-shared/src/types/Result.ts"),
        ("14-T2", "Ok<T>", "packages/core/fp/result-shared/src/types/Ok.ts"),
        ("14-T3", "Err<E>", "packages/core/fp/result-shared/src/types/Err.ts"),
    ]
    entries: list[SemanticTypeEntry] = []
    for local_id, type_label, path in candidates:
        full_path = (repo_root / path).resolve()
        status = STATUS_COMPLETED if full_path.exists() else STATUS_PLANNED
        entries.append(
            SemanticTypeEntry(
                local_identifier=local_id,
                module_id=14,
                type_label=type_label,
                path=path,
                implementation_status=status,
            )
        )
    return entries


def _resolve_method_definition(
    definition: SemanticMethodDefinition,
    by_project: dict[tuple[str, str], dict[str, Any]],
    by_rust: dict[tuple[str, str], dict[str, Any]],
    source_layer: str,
) -> SemanticMethodEntry:
    resolved: dict[str, Any] | None = None

    if definition.package_name and definition.project_method_name:
        resolved = by_project.get((definition.package_name, definition.project_method_name))

    if resolved is None and definition.package_name and definition.rust_method_name:
        resolved = by_rust.get((definition.package_name, definition.rust_method_name))

    if resolved is None:
        return SemanticMethodEntry(
            local_identifier=definition.local_identifier,
            module_id=definition.module_id,
            semantic_alias=definition.semantic_alias,
            canonical_method_label=definition.canonical_method_label,
            method_identifier=None,
            package_name=definition.package_name,
            implementation_status=definition.default_status,
            resolution_state="unresolved",
            rust_original_method_identifier=None,
            rust_original_method_name=definition.rust_method_name,
            source_layer=source_layer,
        )

    return SemanticMethodEntry(
        local_identifier=definition.local_identifier,
        module_id=definition.module_id,
        semantic_alias=definition.semantic_alias,
        canonical_method_label=definition.canonical_method_label,
        method_identifier=str(resolved.get("method_identifier") or ""),
        package_name=str(resolved.get("package_name") or definition.package_name or ""),
        implementation_status=str(resolved.get("implementation_status") or definition.default_status),
        resolution_state="resolved",
        rust_original_method_identifier=_normalize_optional(resolved.get("rust_original_method_identifier")),
        rust_original_method_name=_normalize_optional(resolved.get("rust_original_method_name")),
        source_layer=source_layer,
    )


def _build_module_entries(
    module_catalog: list[SemanticModuleDefinition],
    primary_entries: list[SemanticMethodEntry],
    supplemental_entries: list[SemanticMethodEntry],
    type_entries: list[SemanticTypeEntry],
) -> list[SemanticModuleEntry]:
    entries: list[SemanticModuleEntry] = []
    for module in module_catalog:
        module_primary = [item for item in primary_entries if item.module_id == module.module_id]
        module_supplemental = [item for item in supplemental_entries if item.module_id == module.module_id]
        module_types = [item for item in type_entries if item.module_id == module.module_id]

        statuses = [item.implementation_status for item in module_primary]
        statuses.extend(item.implementation_status for item in module_supplemental)
        statuses.extend(item.implementation_status for item in module_types)
        module_status = _aggregate_status(statuses)

        entries.append(
            SemanticModuleEntry(
                module_id=module.module_id,
                module_name=module.module_name,
                purpose=module.purpose,
                implementation_status=module_status,
                primary_methods_count=len(module_primary),
                supplemental_methods_count=len(module_supplemental),
                types_count=len(module_types),
            )
        )
    return entries


def _aggregate_status(statuses: list[str]) -> str:
    if not statuses:
        return STATUS_PLANNED
    if STATUS_PLANNED in statuses:
        return STATUS_PLANNED
    if STATUS_IN_ADJUSTMENT in statuses:
        return STATUS_IN_ADJUSTMENT
    if all(status == STATUS_COMPLETED for status in statuses):
        return STATUS_COMPLETED
    return STATUS_IN_ADJUSTMENT


def _build_semantic_registry_payload(
    source_registry_path: Path,
    module_entries: list[SemanticModuleEntry],
    primary_entries: list[SemanticMethodEntry],
    supplemental_entries: list[SemanticMethodEntry],
    type_entries: list[SemanticTypeEntry],
) -> dict[str, Any]:
    unresolved_methods = [item for item in [*primary_entries, *supplemental_entries] if item.resolution_state == "unresolved"]
    return {
        "version": "1.0",
        "generated_at": date.today().isoformat(),
        "source_registry": str(source_registry_path),
        "status_catalog": {
            STATUS_COMPLETED: "Реализация присутствует и подтверждена фактами из production-реестра.",
            STATUS_IN_ADJUSTMENT: "Реализация присутствует, но требует усиления/уточнения подтверждения.",
            STATUS_PLANNED: "Элемент зафиксирован в semantic-каталоге как целевой, но не реализован или не резолвится.",
        },
        "summary": {
            "modules_count": len(module_entries),
            "primary_methods_count": len(primary_entries),
            "supplemental_methods_count": len(supplemental_entries),
            "type_entries_count": len(type_entries),
            "resolved_methods_count": len(primary_entries) + len(supplemental_entries) - len(unresolved_methods),
            "unresolved_methods_count": len(unresolved_methods),
        },
        "modules": [item.to_dict() for item in module_entries],
        "primary_methods": [item.to_dict() for item in primary_entries],
        "supplemental_methods": [item.to_dict() for item in supplemental_entries],
        "types": [item.to_dict() for item in type_entries],
    }


def _build_semantic_layer_markdown(
    created_date: str,
    updated_date: str,
    module_entries: list[SemanticModuleEntry],
    primary_entries: list[SemanticMethodEntry],
    supplemental_entries: list[SemanticMethodEntry],
    type_entries: list[SemanticTypeEntry],
) -> str:
    unresolved_methods = [item for item in [*primary_entries, *supplemental_entries] if item.resolution_state == "unresolved"]
    lines = [
        "---",
        "id: LAYER-001",
        f"uuid: {SEMANTIC_LAYER_MARKDOWN_UUID}",
        'title: "Machine registry semantic-modules fp-result"',
        "type: doc",
        "status: active",
        "kb_lifecycle: legacy",
        'owner: "core-fp"',
        "version: 1.0",
        f"created: {created_date}",
        f"updated: {updated_date}",
        "links: [DOC-005, SPEC-004, SPEC-008]",
        "tags: [semantic, registry, fp-result, machine-layer]",
        "---",
        "",
        "# LAYER-001: Machine registry semantic-modules fp-result",
        "",
        "| Поле | Значение |",
        "|---|---|",
        f"| Created | {created_date} |",
        f"| Updated | {updated_date} |",
        "| Source | docs/_generated/identifier-registry/MONOREPO-IDENTIFIER-REGISTRY.json |",
        "| Command | pnpm run docs:sync-semantic-modules |",
        "",
        "## Сводка",
        "",
        f"- Модулей: `{len(module_entries)}`.",
        f"- Primary-методов: `{len(primary_entries)}`.",
        f"- Supplemental-методов: `{len(supplemental_entries)}`.",
        f"- Type-элементов: `{len(type_entries)}`.",
        f"- Разрешено через `METHOD-*`: `{len(primary_entries) + len(supplemental_entries) - len(unresolved_methods)}`.",
        f"- Неразрешено (остается semantic-only): `{len(unresolved_methods)}`.",
        "",
        "## Таблица модулей",
        "",
        "| ID модуля | Название модуля | Назначение | Статус | Primary | Supplemental | Types |",
        "|---|---|---|---|---|---|---|",
    ]
    for module in module_entries:
        lines.append(
            "| "
            + " | ".join(
                [
                    str(module.module_id),
                    f"`{module.module_name}`",
                    module.purpose,
                    module.implementation_status,
                    str(module.primary_methods_count),
                    str(module.supplemental_methods_count),
                    str(module.types_count),
                ]
            )
            + " |"
        )

    lines.extend(
        [
            "",
            "## Таблица методов (Primary: ID 1..39)",
            "",
            "| Local ID | Alias | Канонический метод проекта | METHOD-ID | Пакет | Статус | Resolution |",
            "|---|---|---|---|---|---|---|",
        ]
    )
    for method in primary_entries:
        method_identifier = f"`{method.method_identifier}`" if method.method_identifier else "`—`"
        package_name = f"`{method.package_name}`" if method.package_name else "`—`"
        lines.append(
            "| "
            + " | ".join(
                [
                    method.local_identifier,
                    f"`{method.semantic_alias}`",
                    method.canonical_method_label,
                    method_identifier,
                    package_name,
                    method.implementation_status,
                    method.resolution_state,
                ]
            )
            + " |"
        )

    lines.extend(
        [
            "",
            "## Таблица методов (Supplemental: access/unsafe)",
            "",
            "| Local ID | Alias | Канонический метод проекта | METHOD-ID | Пакет | Статус | Resolution |",
            "|---|---|---|---|---|---|---|",
        ]
    )
    for method in supplemental_entries:
        method_identifier = f"`{method.method_identifier}`" if method.method_identifier else "`—`"
        package_name = f"`{method.package_name}`" if method.package_name else "`—`"
        lines.append(
            "| "
            + " | ".join(
                [
                    method.local_identifier,
                    f"`{method.semantic_alias}`",
                    method.canonical_method_label,
                    method_identifier,
                    package_name,
                    method.implementation_status,
                    method.resolution_state,
                ]
            )
            + " |"
        )

    lines.extend(
        [
            "",
            "## Типовой слой (`types`)",
            "",
            "| Local ID | Элемент типа | Путь | Статус |",
            "|---|---|---|---|",
        ]
    )
    for type_entry in type_entries:
        lines.append(
            "| "
            + " | ".join(
                [
                    f"`{type_entry.local_identifier}`",
                    f"`{type_entry.type_label}`",
                    f"`{type_entry.path}`",
                    type_entry.implementation_status,
                ]
            )
            + " |"
        )

    lines.extend(["", "## Дерево semantic-слоя", "", "```text", "semantic-modules-fp-result-layer"])
    for module in sorted(module_entries, key=lambda item: item.module_id):
        lines.append(f"├── {module.module_id} {module.module_name} | статус: {module.implementation_status}")
        module_primary = [entry for entry in primary_entries if entry.module_id == module.module_id]
        module_supplemental = [entry for entry in supplemental_entries if entry.module_id == module.module_id]
        module_types = [entry for entry in type_entries if entry.module_id == module.module_id]

        for item in module_primary:
            method_identifier = item.method_identifier or "—"
            lines.append(
                f"│   ├── {item.local_identifier} {item.semantic_alias} -> {method_identifier} ({item.implementation_status})"
            )
        for item in module_supplemental:
            method_identifier = item.method_identifier or "—"
            lines.append(
                f"│   ├── {item.local_identifier} {item.semantic_alias} -> {method_identifier} ({item.implementation_status})"
            )
        for item in module_types:
            lines.append(
                f"│   ├── {item.local_identifier} {item.type_label} -> {item.path} ({item.implementation_status})"
            )
    lines.extend(["```", ""])
    return "\n".join(lines)


def _read_or_default_created_date(markdown_path: Path, default_created_date: str) -> str:
    if not markdown_path.exists():
        return default_created_date
    text = markdown_path.read_text(encoding="utf-8")
    match = re.search(r"^created:\s*(\d{4}-\d{2}-\d{2})\s*$", text, flags=re.MULTILINE)
    if match:
        return match.group(1)
    match = re.search(r"^\| Created \| (\d{4}-\d{2}-\d{2}) \|$", text, flags=re.MULTILINE)
    if match:
        return match.group(1)
    return default_created_date


def _write_json(path: Path, payload: dict[str, Any]) -> None:
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def _normalize_optional(value: Any) -> str | None:
    if value is None:
        return None
    normalized = str(value).strip()
    return normalized or None


