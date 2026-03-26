from __future__ import annotations

import json
import re
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Any

from tools.automation.shared.noise import is_noise_path, load_noise_patterns


STATUS_COMPLETED = "выполнено"
STATUS_IN_ADJUSTMENT = "в корректировке"
STATUS_PLANNED = "планируемо"
STATUS_ARCHIVED = "архивировано"

PACKAGE_IDENTIFIER_PREFIX = "PACKAGE-"
METHOD_IDENTIFIER_PREFIX = "METHOD-"
PACKAGE_IDENTIFIER_WIDTH = 4
METHOD_IDENTIFIER_WIDTH = 6

REGISTRY_DIR_RELATIVE = Path("docs/_generated/identifier-registry")
ASSIGNMENTS_FILE_NAME = "MONOREPO-IDENTIFIER-ASSIGNMENTS.json"
REGISTRY_JSON_FILE_NAME = "MONOREPO-IDENTIFIER-REGISTRY.json"
REGISTRY_MARKDOWN_FILE_RELATIVE = Path("docs/specs/DOC-005-monorepo-package-and-method-identifier-registry.md")
REGISTRY_JSON_FILE_RELATIVE = Path("docs/_generated/identifier-registry/MONOREPO-IDENTIFIER-REGISTRY.json")
ASSIGNMENTS_JSON_FILE_RELATIVE = Path("docs/_generated/identifier-registry/MONOREPO-IDENTIFIER-ASSIGNMENTS.json")

DOC_005_UUID = "cb061ff2-5d32-477a-b608-8e8a7a54536a"
DOC_005_OWNER = "core-fp"
DOC_005_VERSION = "2.0"
DOC_005_LINKS = "[DOC-004, DOC-007, SPEC-001, SPEC-004, SPEC-008, POL-001]"

EXCLUDED_PATH_PARTS: tuple[str, ...] = (
    "node_modules",
    ".pnpm",
    "dist",
    "build",
    "coverage",
    ".cache",
    "__pycache__",
)


# DDD Entity: карточка пакета в реестре уникальных идентификаторов.
@dataclass(frozen=True)
class PackageRegistryEntry:
    package_identifier: str
    package_name: str
    package_path: str
    workspace_status: str
    package_status: str
    exported_methods_count: int
    completed_methods_count: int
    in_adjustment_methods_count: int
    planned_methods_count: int

    def to_dict(self) -> dict[str, Any]:
        return {
            "package_identifier": self.package_identifier,
            "package_name": self.package_name,
            "package_path": self.package_path,
            "workspace_status": self.workspace_status,
            "package_status": self.package_status,
            "exported_methods_count": self.exported_methods_count,
            "completed_methods_count": self.completed_methods_count,
            "in_adjustment_methods_count": self.in_adjustment_methods_count,
            "planned_methods_count": self.planned_methods_count,
        }


# DDD Entity: карточка метода в реестре уникальных идентификаторов.
@dataclass(frozen=True)
class MethodRegistryEntry:
    method_identifier: str
    package_identifier: str
    package_name: str
    project_method_name: str
    rust_original_method_identifier: str | None
    rust_original_method_name: str | None
    source_path: str
    implementation_status: str
    test_confirmation: str

    def to_dict(self) -> dict[str, Any]:
        return {
            "method_identifier": self.method_identifier,
            "package_identifier": self.package_identifier,
            "package_name": self.package_name,
            "project_method_name": self.project_method_name,
            "rust_original_method_identifier": self.rust_original_method_identifier,
            "rust_original_method_name": self.rust_original_method_name,
            "source_path": self.source_path,
            "implementation_status": self.implementation_status,
            "test_confirmation": self.test_confirmation,
        }


# DDD Aggregate: итог синхронизации идентификаторов.
@dataclass(frozen=True)
class IdentifierSyncReport:
    packages_count: int
    methods_count: int
    completed_methods_count: int
    in_adjustment_methods_count: int
    planned_methods_count: int
    assignments_file: str
    registry_json_file: str
    registry_markdown_file: str

    def to_dict(self) -> dict[str, Any]:
        return {
            "packages_count": self.packages_count,
            "methods_count": self.methods_count,
            "completed_methods_count": self.completed_methods_count,
            "in_adjustment_methods_count": self.in_adjustment_methods_count,
            "planned_methods_count": self.planned_methods_count,
            "assignments_file": self.assignments_file,
            "registry_json_file": self.registry_json_file,
            "registry_markdown_file": self.registry_markdown_file,
        }


# Value Object: минимальный срез package-контракта.
@dataclass(frozen=True)
class PackageContract:
    package_name: str
    package_path: Path
    package_path_relative: str
    in_workspace: bool


# Value Object: экспортированный метод публичного API.
@dataclass(frozen=True)
class ExportedMethod:
    method_name: str
    source_file_relative: str


class _SequentialIdentifierAllocator:
    def __init__(self, mapping: dict[str, str], prefix: str, width: int) -> None:
        self._mapping = mapping
        self._prefix = prefix
        self._width = width
        self._next_number = self._compute_next_number()

    def get_or_create(self, key: str) -> str:
        existing = self._mapping.get(key)
        if existing:
            return existing
        identifier = f"{self._prefix}{self._next_number:0{self._width}d}"
        self._mapping[key] = identifier
        self._next_number += 1
        return identifier

    def _compute_next_number(self) -> int:
        max_number = 0
        for value in self._mapping.values():
            if not value.startswith(self._prefix):
                continue
            number_part = value[len(self._prefix) :]
            if number_part.isdigit():
                max_number = max(max_number, int(number_part))
        return max_number + 1


def run_sync_identifiers(root: Path) -> IdentifierSyncReport:
    repo_root = root.resolve()
    registry_dir = (repo_root / REGISTRY_DIR_RELATIVE).resolve()
    registry_dir.mkdir(parents=True, exist_ok=True)

    assignments_path = registry_dir / ASSIGNMENTS_FILE_NAME
    registry_json_path = registry_dir / REGISTRY_JSON_FILE_NAME
    registry_markdown_path = (repo_root / REGISTRY_MARKDOWN_FILE_RELATIVE).resolve()

    assignments = _load_assignments(assignments_path)
    package_allocator = _SequentialIdentifierAllocator(
        assignments["package_identifiers"],
        PACKAGE_IDENTIFIER_PREFIX,
        PACKAGE_IDENTIFIER_WIDTH,
    )
    method_allocator = _SequentialIdentifierAllocator(
        assignments["method_identifiers"],
        METHOD_IDENTIFIER_PREFIX,
        METHOD_IDENTIFIER_WIDTH,
    )

    workspace_paths = _load_workspace_paths(repo_root)
    noise_patterns = load_noise_patterns(repo_root)
    packages = _discover_packages(repo_root, workspace_paths, noise_patterns)

    package_entries: list[PackageRegistryEntry] = []
    method_entries: list[MethodRegistryEntry] = []

    # Отдельная карта Rust-ID для Result, чтобы слой "планируемо" был фактическим.
    rust_result_catalog = _build_rust_result_method_catalog()
    rust_mapping_project_to_rust = {
        item["project_method_name"]: item for item in rust_result_catalog if item["project_method_name"] is not None
    }
    rust_result_package_name = "@resultsafe/core-fp-result"
    rust_implemented_ids: set[int] = set()

    for package in packages:
        package_identifier = package_allocator.get_or_create(package.package_name)
        exported_methods = _discover_exported_methods(package.package_path, repo_root)
        test_probe = _build_test_probe(package.package_path)

        package_method_entries: list[MethodRegistryEntry] = []
        for method in exported_methods:
            method_key = f"{package.package_name}::{method.method_name}"
            method_identifier = method_allocator.get_or_create(method_key)
            has_test_confirmation = _has_test_confirmation(test_probe, method.method_name)
            status = STATUS_COMPLETED if has_test_confirmation else STATUS_IN_ADJUSTMENT
            test_confirmation = "есть подтверждение тестами" if has_test_confirmation else "нет подтверждения тестами"

            rust_identifier: str | None = None
            rust_name: str | None = None
            if package.package_name == rust_result_package_name and method.method_name in rust_mapping_project_to_rust:
                rust_item = rust_mapping_project_to_rust[method.method_name]
                rust_implemented_ids.add(rust_item["rust_method_id"])
                rust_identifier = str(rust_item["rust_method_id"])
                rust_name = rust_item["rust_method_name"]

            package_method_entries.append(
                MethodRegistryEntry(
                    method_identifier=method_identifier,
                    package_identifier=package_identifier,
                    package_name=package.package_name,
                    project_method_name=method.method_name,
                    rust_original_method_identifier=rust_identifier,
                    rust_original_method_name=rust_name,
                    source_path=method.source_file_relative,
                    implementation_status=status,
                    test_confirmation=test_confirmation,
                )
            )

        if package.package_name == rust_result_package_name:
            planned_entries = _build_planned_rust_result_methods(
                package_identifier=package_identifier,
                package_name=package.package_name,
                rust_result_catalog=rust_result_catalog,
                rust_implemented_ids=rust_implemented_ids,
                method_allocator=method_allocator,
            )
            package_method_entries.extend(planned_entries)

        method_entries.extend(package_method_entries)

        completed_count = len([m for m in package_method_entries if m.implementation_status == STATUS_COMPLETED])
        in_adjustment_count = len([m for m in package_method_entries if m.implementation_status == STATUS_IN_ADJUSTMENT])
        planned_count = len([m for m in package_method_entries if m.implementation_status == STATUS_PLANNED])

        package_status = (
            STATUS_COMPLETED
            if package.in_workspace and len(exported_methods) > 0
            else STATUS_IN_ADJUSTMENT
        )
        workspace_status = "подключен к workspace" if package.in_workspace else "не подключен к workspace"

        package_entries.append(
            PackageRegistryEntry(
                package_identifier=package_identifier,
                package_name=package.package_name,
                package_path=package.package_path_relative.replace("\\", "/"),
                workspace_status=workspace_status,
                package_status=package_status,
                exported_methods_count=len(exported_methods),
                completed_methods_count=completed_count,
                in_adjustment_methods_count=in_adjustment_count,
                planned_methods_count=planned_count,
            )
        )

    _assert_unique_identifier_entries(
        kind="package",
        identifier_getter=lambda item: item.package_identifier,
        entries=package_entries,
    )
    _assert_unique_identifier_entries(
        kind="method",
        identifier_getter=lambda item: item.method_identifier,
        entries=method_entries,
    )

    package_entries_sorted = sorted(package_entries, key=lambda item: item.package_identifier)
    method_entries_sorted = sorted(method_entries, key=lambda item: item.method_identifier)
    _assert_registry_cleanliness(package_entries_sorted, method_entries_sorted)

    assignments["updated"] = date.today().isoformat()
    _write_json(assignments_path, assignments)

    registry_payload = {
        "version": "1.0",
        "generated_at": date.today().isoformat(),
        "status_catalog": {
            "выполнено": "Реализация присутствует в публичном API и имеет подтверждение тестами.",
            "в корректировке": "Реализация присутствует, но требуется усиление подтверждения (например, прямые тесты).",
            "планируемо": "Метод зафиксирован в каталоге соответствия, но отсутствует в реализации.",
            "архивировано": "Элемент выведен из активного контура (зарезервированный статус).",
        },
        "packages": [item.to_dict() for item in package_entries_sorted],
        "methods": [item.to_dict() for item in method_entries_sorted],
    }
    _write_json(registry_json_path, registry_payload)

    created_date = _read_or_default_created_date(registry_markdown_path, date.today().isoformat())
    markdown = _build_registry_markdown(
        created_date=created_date,
        updated_date=date.today().isoformat(),
        package_entries=package_entries_sorted,
        method_entries=method_entries_sorted,
    )
    registry_markdown_path.parent.mkdir(parents=True, exist_ok=True)
    registry_markdown_path.write_text(markdown, encoding="utf-8")

    completed_methods = len([m for m in method_entries_sorted if m.implementation_status == STATUS_COMPLETED])
    in_adjustment_methods = len([m for m in method_entries_sorted if m.implementation_status == STATUS_IN_ADJUSTMENT])
    planned_methods = len([m for m in method_entries_sorted if m.implementation_status == STATUS_PLANNED])

    return IdentifierSyncReport(
        packages_count=len(package_entries_sorted),
        methods_count=len(method_entries_sorted),
        completed_methods_count=completed_methods,
        in_adjustment_methods_count=in_adjustment_methods,
        planned_methods_count=planned_methods,
        assignments_file=str(assignments_path),
        registry_json_file=str(registry_json_path),
        registry_markdown_file=str(registry_markdown_path),
    )


def _load_assignments(assignments_path: Path) -> dict[str, Any]:
    if not assignments_path.exists():
        return {
            "version": "1.0",
            "created": date.today().isoformat(),
            "updated": date.today().isoformat(),
            "package_identifiers": {},
            "method_identifiers": {},
        }

    try:
        payload = json.loads(assignments_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        payload = {}

    return {
        "version": payload.get("version", "1.0"),
        "created": payload.get("created", date.today().isoformat()),
        "updated": payload.get("updated", date.today().isoformat()),
        "package_identifiers": dict(payload.get("package_identifiers", {})),
        "method_identifiers": dict(payload.get("method_identifiers", {})),
    }


def _write_json(path: Path, payload: dict[str, Any]) -> None:
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def _load_workspace_paths(repo_root: Path) -> set[str]:
    package_json_path = repo_root / "package.json"
    if not package_json_path.exists():
        return set()
    payload = json.loads(package_json_path.read_text(encoding="utf-8"))
    workspaces = payload.get("workspaces", [])
    normalized = {str(Path(item)).replace("\\", "/").strip("/") for item in workspaces if isinstance(item, str)}
    return normalized


def _discover_packages(
    repo_root: Path,
    workspace_paths: set[str],
    noise_patterns: tuple[str, ...],
) -> list[PackageContract]:
    packages_root = repo_root / "packages"
    if not packages_root.exists():
        return []

    package_contracts_by_name: dict[str, PackageContract] = {}
    for package_json in sorted(packages_root.rglob("package.json")):
        if _contains_excluded_path_segment(package_json):
            continue
        if is_noise_path(package_json, repo_root, noise_patterns):
            continue
        package_root = package_json.parent
        if not (package_root / "src").exists():
            continue
        payload = json.loads(package_json.read_text(encoding="utf-8"))
        package_name = payload.get("name")
        if not isinstance(package_name, str) or not package_name.strip():
            continue
        relative = package_root.relative_to(repo_root).as_posix()
        in_workspace = relative in workspace_paths
        candidate = PackageContract(
            package_name=package_name,
            package_path=package_root,
            package_path_relative=relative,
            in_workspace=in_workspace,
        )
        existing = package_contracts_by_name.get(package_name)
        if existing is None:
            package_contracts_by_name[package_name] = candidate
            continue
        package_contracts_by_name[package_name] = _select_preferred_package_contract(existing, candidate)

    return sorted(package_contracts_by_name.values(), key=lambda item: item.package_name)


def _contains_excluded_path_segment(path: Path) -> bool:
    parts_lower = {part.lower() for part in path.parts}
    return any(excluded in parts_lower for excluded in EXCLUDED_PATH_PARTS)


def _select_preferred_package_contract(existing: PackageContract, candidate: PackageContract) -> PackageContract:
    if existing.package_path_relative == candidate.package_path_relative:
        return existing

    if existing.in_workspace and candidate.in_workspace:
        raise ValueError(
            "Duplicate workspace package name detected: "
            f"{existing.package_name} ({existing.package_path_relative}, {candidate.package_path_relative})"
        )

    if existing.in_workspace and not candidate.in_workspace:
        return existing
    if candidate.in_workspace and not existing.in_workspace:
        return candidate

    existing_depth = existing.package_path_relative.count("/")
    candidate_depth = candidate.package_path_relative.count("/")
    if candidate_depth < existing_depth:
        return candidate
    if candidate_depth > existing_depth:
        return existing

    return candidate if candidate.package_path_relative < existing.package_path_relative else existing


def _discover_exported_methods(package_root: Path, repo_root: Path) -> list[ExportedMethod]:
    src_index = package_root / "src" / "index.ts"
    if not src_index.exists():
        return []

    exports_map = _collect_exports_from_module(src_index, set(), {})
    methods: list[ExportedMethod] = []
    for method_name, source_path in sorted(exports_map.items(), key=lambda item: item[0]):
        relative = source_path.relative_to(repo_root).as_posix()
        methods.append(ExportedMethod(method_name=method_name, source_file_relative=relative))
    return methods


def _collect_exports_from_module(
    module_path: Path,
    visiting: set[Path],
    cache: dict[Path, dict[str, Path]],
) -> dict[str, Path]:
    resolved_module = module_path.resolve()
    if resolved_module in cache:
        return cache[resolved_module]
    if resolved_module in visiting or not resolved_module.exists():
        return {}

    visiting.add(resolved_module)
    text = resolved_module.read_text(encoding="utf-8")
    exports: dict[str, Path] = {}

    # Локальные value-экспорты.
    declaration_pattern = re.compile(
        r"^\s*export\s+(?:async\s+)?(?:const|function|class)\s+([A-Za-z_][A-Za-z0-9_]*)",
        re.MULTILINE,
    )
    for match in declaration_pattern.finditer(text):
        exports[match.group(1)] = resolved_module

    # Re-export конкретных имен.
    named_export_pattern = re.compile(
        r"export\s+(type\s+)?\{([^}]*)\}\s+from\s+['\"]([^'\"]+)['\"]",
        re.MULTILINE | re.DOTALL,
    )
    for match in named_export_pattern.finditer(text):
        is_type_only = bool(match.group(1))
        if is_type_only:
            continue

        module_ref = match.group(3).strip()
        target_module = _resolve_ts_module(resolved_module, module_ref)
        if target_module is None:
            continue

        symbols = _split_export_symbols(match.group(2))
        for symbol in symbols:
            if symbol.startswith("type "):
                continue
            alias_name = symbol.split(" as ")[-1].strip()
            if alias_name:
                exports[alias_name] = target_module

    # Export-star цепочки.
    export_star_pattern = re.compile(r"export\s+\*\s+from\s+['\"]([^'\"]+)['\"]", re.MULTILINE)
    for match in export_star_pattern.finditer(text):
        module_ref = match.group(1).strip()
        target_module = _resolve_ts_module(resolved_module, module_ref)
        if target_module is None:
            continue
        nested = _collect_exports_from_module(target_module, visiting, cache)
        for name, path in nested.items():
            if name not in exports:
                exports[name] = path

    # Локальный named export без from.
    local_export_pattern = re.compile(r"export\s+\{([^}]*)\}\s*;", re.MULTILINE | re.DOTALL)
    for match in local_export_pattern.finditer(text):
        symbols = _split_export_symbols(match.group(1))
        for symbol in symbols:
            if symbol.startswith("type "):
                continue
            alias_name = symbol.split(" as ")[-1].strip()
            if alias_name:
                exports[alias_name] = resolved_module

    visiting.remove(resolved_module)
    cache[resolved_module] = exports
    return exports


def _split_export_symbols(symbols_blob: str) -> list[str]:
    tokens = []
    for raw in symbols_blob.split(","):
        token = " ".join(raw.strip().split())
        if token:
            tokens.append(token)
    return tokens


def _resolve_ts_module(current_module: Path, module_ref: str) -> Path | None:
    base_ref = module_ref
    if base_ref.endswith(".js"):
        base_ref = base_ref[:-3]
    candidate = (current_module.parent / base_ref).resolve()

    if candidate.is_file():
        return candidate

    ts_file = candidate.with_suffix(".ts")
    if ts_file.exists():
        return ts_file

    index_ts = candidate / "index.ts"
    if index_ts.exists():
        return index_ts

    return None


def _build_test_probe(package_root: Path) -> dict[str, Any]:
    tests_root = package_root / "__tests__"
    if not tests_root.exists():
        return {"test_files": [], "combined_text": ""}
    test_files = sorted(tests_root.rglob("*.ts"))
    combined_text = "\n".join(path.read_text(encoding="utf-8") for path in test_files)
    return {"test_files": test_files, "combined_text": combined_text}


def _has_test_confirmation(test_probe: dict[str, Any], method_name: str) -> bool:
    test_files: list[Path] = test_probe["test_files"]
    combined_text: str = test_probe["combined_text"]
    method_name_lower = method_name.lower()

    has_named_test_file = any(method_name_lower in file.name.lower() for file in test_files)
    if has_named_test_file:
        return True

    pattern = re.compile(rf"\b{re.escape(method_name)}\b")
    return bool(pattern.search(combined_text))


def _build_rust_result_method_catalog() -> list[dict[str, Any]]:
    # Канонический Rust-базис по legacy-таблицам Result.
    rust_methods = [
        (1, "is_ok"),
        (2, "is_err"),
        (3, "is_ok_and"),
        (4, "is_err_and"),
        (5, "contains"),
        (6, "contains_err"),
        (7, "map"),
        (8, "map_err"),
        (9, "map_or"),
        (10, "map_or_else"),
        (11, "and"),
        (12, "and_then"),
        (13, "or"),
        (14, "or_else"),
        (15, "unwrap"),
        (16, "unwrap_or"),
        (17, "unwrap_or_else"),
        (18, "unwrap_or_default"),
        (19, "unwrap_err"),
        (20, "expect"),
        (21, "expect_err"),
        (22, "unwrap_unchecked"),
        (23, "unwrap_err_unchecked"),
        (24, "inspect"),
        (25, "inspect_err"),
        (26, "iter"),
        (27, "iter_mut"),
        (28, "eq / =="),
        (29, "ne / !="),
        (30, "ok"),
        (31, "err"),
        (32, "transpose"),
        (33, "flatten"),
        (34, "as_ref"),
        (35, "as_mut"),
        (36, "copied"),
        (37, "cloned"),
        (38, "as_deref"),
        (39, "as_deref_mut"),
        (40, "Ok(value)"),
        (41, "Err(error)"),
    ]
    project_name_mapping = {
        "is_ok": "isOk",
        "is_err": "isErr",
        "is_ok_and": "isOkAnd",
        "is_err_and": "isErrAnd",
        "map": "map",
        "map_err": "mapErr",
        "and_then": "andThen",
        "or_else": "orElse",
        "unwrap": "unwrap",
        "unwrap_or": "unwrapOr",
        "unwrap_or_else": "unwrapOrElse",
        "unwrap_err": "unwrapErr",
        "expect": "expect",
        "expect_err": "expectErr",
        "inspect": "inspect",
        "inspect_err": "inspectErr",
        "ok": "ok",
        "err": "err",
        "transpose": "transpose",
        "flatten": "flatten",
        "Ok(value)": "Ok",
        "Err(error)": "Err",
    }
    return [
        {
            "rust_method_id": rust_id,
            "rust_method_name": rust_name,
            "project_method_name": project_name_mapping.get(rust_name),
        }
        for rust_id, rust_name in rust_methods
    ]


def _build_planned_rust_result_methods(
    package_identifier: str,
    package_name: str,
    rust_result_catalog: list[dict[str, Any]],
    rust_implemented_ids: set[int],
    method_allocator: _SequentialIdentifierAllocator,
) -> list[MethodRegistryEntry]:
    planned_entries: list[MethodRegistryEntry] = []
    for item in rust_result_catalog:
        rust_method_id = item["rust_method_id"]
        rust_method_name = item["rust_method_name"]
        if rust_method_id in rust_implemented_ids:
            continue

        method_key = f"{package_name}::planned::rust::{rust_method_id}::{rust_method_name}"
        method_identifier = method_allocator.get_or_create(method_key)
        planned_entries.append(
            MethodRegistryEntry(
                method_identifier=method_identifier,
                package_identifier=package_identifier,
                package_name=package_name,
                project_method_name=f"не определено (цель по Rust: {rust_method_name})",
                rust_original_method_identifier=str(rust_method_id),
                rust_original_method_name=rust_method_name,
                source_path="не реализовано",
                implementation_status=STATUS_PLANNED,
                test_confirmation="не применимо",
            )
        )
    return planned_entries


def _read_or_default_created_date(markdown_path: Path, default_created_date: str) -> str:
    if not markdown_path.exists():
        return default_created_date
    text = markdown_path.read_text(encoding="utf-8")
    match = re.search(r"^created:\s*(\d{4}-\d{2}-\d{2})\s*$", text, flags=re.MULTILINE)
    if match:
        return match.group(1)
    return default_created_date


def _build_registry_markdown(
    created_date: str,
    updated_date: str,
    package_entries: list[PackageRegistryEntry],
    method_entries: list[MethodRegistryEntry],
) -> str:
    completed_methods = len([m for m in method_entries if m.implementation_status == STATUS_COMPLETED])
    in_adjustment_methods = len([m for m in method_entries if m.implementation_status == STATUS_IN_ADJUSTMENT])
    planned_methods = len([m for m in method_entries if m.implementation_status == STATUS_PLANNED])
    methods_by_package: dict[str, list[MethodRegistryEntry]] = {}
    for method in method_entries:
        methods_by_package.setdefault(method.package_identifier, []).append(method)

    lines: list[str] = [
        "---",
        "id: DOC-005",
        f"uuid: {DOC_005_UUID}",
        'title: "Единый реестр уникальных идентификаторов пакетов и методов монорепозитория"',
        "type: doc",
        "status: active",
        "layer: authored",
        "lang: en",
        "kb_lifecycle: current",
        f'owner: "{DOC_005_OWNER}"',
        f"version: {DOC_005_VERSION}",
        f"created: {created_date}",
        f"updated: {updated_date}",
        "source_of_truth: self",
        f"links: {DOC_005_LINKS}",
        "tags: [identifiers, registry, packages, methods, monorepo]",
        "---",
        "",
        '<a id="top"></a>',
        "",
        "# DOC-005: Единый реестр уникальных идентификаторов пакетов и методов монорепозитория",
        "",
        "## Назначение",
        "",
        "- Документ фиксирует canonical-контракт реестра идентификаторов пакетов и методов.",
        "- Подробные machine-readable данные хранятся в JSON-слое реестров, а не в bulk-таблицах этого документа.",
        "- Реестр детерминирован: `PACKAGE-*` и `METHOD-*` уникальны, `node_modules/.pnpm/dist/build/coverage/cache` исключены.",
        "",
        "## Каталог статусов",
        "",
        "| Статус | Значение |",
        "|---|---|",
        f"| `{STATUS_COMPLETED}` | Реализация присутствует в публичном API и подтверждена тестами. |",
        f"| `{STATUS_IN_ADJUSTMENT}` | Реализация присутствует, но требует усиления подтверждения (например, прямые тесты). |",
        f"| `{STATUS_PLANNED}` | Метод зафиксирован как целевой, но еще не реализован в коде. |",
        f"| `{STATUS_ARCHIVED}` | Статус зарезервирован для выведенных из активного контура сущностей. |",
        "",
        "## Сводка",
        "",
        f"- Количество пакетов: `{len(package_entries)}`.",
        f"- Количество методов: `{len(method_entries)}`.",
        f"- Методы со статусом `{STATUS_COMPLETED}`: `{completed_methods}`.",
        f"- Методы со статусом `{STATUS_IN_ADJUSTMENT}`: `{in_adjustment_methods}`.",
        f"- Методы со статусом `{STATUS_PLANNED}`: `{planned_methods}`.",
        "",
        "## KPI качества реестра",
        "",
        "- Уникальных идентификаторов пакетов: "
        f"`{len({item.package_identifier for item in package_entries})}`.",
        "- Уникальных идентификаторов методов: "
        f"`{len({item.method_identifier for item in method_entries})}`.",
        "- Количество строк пакетов с `node_modules` в пути: "
        f"`{len([item for item in package_entries if '/node_modules/' in f'/{item.package_path}/'])}`.",
        "",
        "## Канонические источники machine-readable слоя",
        "",
        "- Реестр идентификаторов: "
        f"`{REGISTRY_JSON_FILE_RELATIVE.as_posix()}`.",
        "- Assignments-слой стабильности ID: "
        f"`{ASSIGNMENTS_JSON_FILE_RELATIVE.as_posix()}`.",
        "- Каталог сущностей и связей: "
        "`docs/_generated/identifier-registry/MONOREPO-ENTITY-CATALOG.json`.",
        "",
        "## Краткая витрина пакетов",
        "",
        "| PACKAGE ID | package_name | package_path | workspace | methods |",
        "|---|---|---|---|---|",
    ]
    for package in package_entries:
        lines.append(
            "| "
            + " | ".join(
                [
                    f"`{package.package_identifier}`",
                    f"`{package.package_name}`",
                    f"`{package.package_path}`",
                    package.workspace_status,
                    str(len(methods_by_package.get(package.package_identifier, []))),
                ]
            )
            + " |"
        )
    lines.extend(
        [
            "",
            "## Правило публикации деталей",
            "",
            "- Bulk-детали методов и полные relation-слои публикуются только в JSON registry layer.",
            "- Этот документ не должен содержать duplicate-heavy машинные выгрузки.",
            "",
            "*[↑ к началу документа](#top)*",
            "",
        ]
    )
    return "\n".join(lines)


def _assert_unique_identifier_entries(
    kind: str,
    identifier_getter: Any,
    entries: list[Any],
) -> None:
    seen: set[str] = set()
    duplicates: set[str] = set()
    for entry in entries:
        identifier = str(identifier_getter(entry))
        if identifier in seen:
            duplicates.add(identifier)
            continue
        seen.add(identifier)
    if duplicates:
        sorted_duplicates = ", ".join(sorted(duplicates))
        raise ValueError(f"Duplicate {kind} identifiers detected: {sorted_duplicates}")


def _assert_registry_cleanliness(
    package_entries: list[PackageRegistryEntry],
    method_entries: list[MethodRegistryEntry],
) -> None:
    contaminated_package_rows = [
        row.package_path
        for row in package_entries
        if "/node_modules/" in f"/{row.package_path}/"
    ]
    if contaminated_package_rows:
        raise ValueError(
            "Package registry contains node_modules-contaminated rows: "
            + ", ".join(sorted(set(contaminated_package_rows)))
        )

    contaminated_method_rows = [
        row.source_path
        for row in method_entries
        if "/node_modules/" in f"/{row.source_path}/"
    ]
    if contaminated_method_rows:
        raise ValueError(
            "Method registry contains node_modules-contaminated rows: "
            + ", ".join(sorted(set(contaminated_method_rows)))
        )


