from __future__ import annotations

import json
import re
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Any

from tools.automation.infrastructure.filesystem import list_markdown_files, read_text
from tools.automation.infrastructure.markdown import is_empty_value, parse_frontmatter


ENTITY_CATALOG_JSON_RELATIVE = Path("docs/_generated/identifier-registry/MONOREPO-ENTITY-CATALOG.json")
IDENTIFIER_REGISTRY_JSON_RELATIVE = Path("docs/_generated/identifier-registry/MONOREPO-IDENTIFIER-REGISTRY.json")
SEMANTIC_REGISTRY_JSON_RELATIVE = Path("docs/_generated/identifier-registry/SEMANTIC-FP-RESULT-REGISTRY.json")
PYTHON_PARITY_REGISTRY_JSON_RELATIVE = Path("docs/_generated/identifier-registry/PYTHON-RUST-PARITY-REGISTRY.json")

ROOT_DOCUMENT_FILES: tuple[str, ...] = ("README.md", "AI_CONTEXT.md", "TASK_CONTEXT.md")
ROOT_DOCUMENT_IDENTIFIER_PATTERN = re.compile(r"\|\s*ID документа\s*\|\s*`([A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+)`\s*\|")

ENTITY_IDENTIFIER_PATTERN = re.compile(r"^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$")
IGNORED_LINK_PREFIXES: tuple[str, ...] = ("R-", "CP-", "TASK-")
IGNORED_LINK_IDENTIFIERS: set[str] = {"AI_CONTEXT", "TASK_CONTEXT"}


# DDD Aggregate: итог синхронизации machine-readable entity-каталога.
@dataclass(frozen=True)
class EntityCatalogSyncReport:
    documents_count: int
    packages_count: int
    methods_count: int
    semantic_modules_count: int
    semantic_methods_count: int
    python_packages_count: int
    python_methods_count: int
    rust_methods_count: int
    relations_count: int
    unresolved_relations_count: int
    registry_json_file: str

    def to_dict(self) -> dict[str, Any]:
        return {
            "documents_count": self.documents_count,
            "packages_count": self.packages_count,
            "methods_count": self.methods_count,
            "semantic_modules_count": self.semantic_modules_count,
            "semantic_methods_count": self.semantic_methods_count,
            "python_packages_count": self.python_packages_count,
            "python_methods_count": self.python_methods_count,
            "rust_methods_count": self.rust_methods_count,
            "relations_count": self.relations_count,
            "unresolved_relations_count": self.unresolved_relations_count,
            "registry_json_file": self.registry_json_file,
        }


def run_sync_entity_catalog(root: Path) -> EntityCatalogSyncReport:
    repo_root = root.resolve()
    docs_root = (repo_root / "docs").resolve()
    if not docs_root.exists():
        raise FileNotFoundError(f"Missing docs directory: {docs_root}")

    document_entities = _collect_document_entities(repo_root, docs_root)
    root_document_entities = _collect_root_document_entities(repo_root)

    identifier_registry = _load_json_or_empty((repo_root / IDENTIFIER_REGISTRY_JSON_RELATIVE).resolve())
    semantic_registry = _load_json_or_empty((repo_root / SEMANTIC_REGISTRY_JSON_RELATIVE).resolve())
    python_parity_registry = _load_json_or_empty((repo_root / PYTHON_PARITY_REGISTRY_JSON_RELATIVE).resolve())

    package_entities = _build_package_entities(identifier_registry.get("packages", []))
    method_entities = _build_method_entities(identifier_registry.get("methods", []))
    semantic_module_entities = _build_semantic_module_entities(semantic_registry.get("modules", []))
    semantic_method_entities = _build_semantic_method_entities(
        semantic_registry.get("primary_methods", []),
        semantic_registry.get("supplemental_methods", []),
    )
    semantic_type_rows = semantic_registry.get("types", semantic_registry.get("type_entries", []))
    semantic_type_entities = _build_semantic_type_entities(semantic_type_rows)
    python_package_entities = _build_python_package_entities(python_parity_registry.get("packages", []))
    python_method_entities = _build_python_method_entities(python_parity_registry.get("methods", []))
    rust_method_entities, rust_entity_by_rust_identifier = _build_rust_method_entities(
        method_entities,
        semantic_method_entities,
        python_method_entities,
    )

    all_entities = [
        *document_entities,
        *root_document_entities,
        *package_entities,
        *method_entities,
        *semantic_module_entities,
        *semantic_method_entities,
        *semantic_type_entities,
        *python_package_entities,
        *python_method_entities,
        *rust_method_entities,
    ]
    known_entity_identifiers = {str(item["entity_identifier"]) for item in all_entities}

    relations = _build_relations(
        documents=[*document_entities, *root_document_entities],
        known_entity_identifiers=known_entity_identifiers,
        package_entities=package_entities,
        method_entities=method_entities,
        semantic_module_entities=semantic_module_entities,
        semantic_method_entities=semantic_method_entities,
        python_package_entities=python_package_entities,
        python_method_entities=python_method_entities,
        rust_entity_by_rust_identifier=rust_entity_by_rust_identifier,
    )
    unresolved_relations_count = len([relation for relation in relations if relation["resolution_state"] == "unresolved"])

    payload = {
        "version": "1.0",
        "generated_at": date.today().isoformat(),
        "schema_version": "1.0",
        "status_catalog": {
            "resolved": "Связь корректно резолвится в существующий entity_identifier.",
            "unresolved": "Связь зафиксирована, но цель не найдена в текущем каталоге.",
            "ignored": "Ссылка исключена политикой (например, R-/CP- governance ref).",
        },
        "source_artifacts": {
            "docs_root": "docs",
            "identifier_registry_json": IDENTIFIER_REGISTRY_JSON_RELATIVE.as_posix(),
            "semantic_registry_json": SEMANTIC_REGISTRY_JSON_RELATIVE.as_posix(),
            "python_parity_registry_json": PYTHON_PARITY_REGISTRY_JSON_RELATIVE.as_posix(),
        },
        "summary": {
            "documents_count": len(document_entities) + len(root_document_entities),
            "packages_count": len(package_entities),
            "methods_count": len(method_entities),
            "semantic_modules_count": len(semantic_module_entities),
            "semantic_methods_count": len(semantic_method_entities),
            "semantic_types_count": len(semantic_type_entities),
            "python_packages_count": len(python_package_entities),
            "python_methods_count": len(python_method_entities),
            "rust_methods_count": len(rust_method_entities),
            "relations_count": len(relations),
            "unresolved_relations_count": unresolved_relations_count,
        },
        "entities": {
            "documents": _sort_entities(document_entities),
            "root_documents": _sort_entities(root_document_entities),
            "packages": _sort_entities(package_entities),
            "methods": _sort_entities(method_entities),
            "semantic_modules": _sort_entities(semantic_module_entities),
            "semantic_methods": _sort_entities(semantic_method_entities),
            "semantic_types": _sort_entities(semantic_type_entities),
            "python_packages": _sort_entities(python_package_entities),
            "python_methods": _sort_entities(python_method_entities),
            "rust_methods": _sort_entities(rust_method_entities),
        },
        "relations": sorted(
            relations,
            key=lambda item: (
                str(item["relation_kind"]),
                str(item["from_entity_identifier"]),
                str(item["to_entity_identifier"]),
            ),
        ),
    }

    output_path = (repo_root / ENTITY_CATALOG_JSON_RELATIVE).resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    return EntityCatalogSyncReport(
        documents_count=len(document_entities) + len(root_document_entities),
        packages_count=len(package_entities),
        methods_count=len(method_entities),
        semantic_modules_count=len(semantic_module_entities),
        semantic_methods_count=len(semantic_method_entities),
        python_packages_count=len(python_package_entities),
        python_methods_count=len(python_method_entities),
        rust_methods_count=len(rust_method_entities),
        relations_count=len(relations),
        unresolved_relations_count=unresolved_relations_count,
        registry_json_file=str(output_path),
    )


def _sort_entities(entities: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return sorted(entities, key=lambda item: str(item["entity_identifier"]))


def _collect_document_entities(repo_root: Path, docs_root: Path) -> list[dict[str, Any]]:
    entities: list[dict[str, Any]] = []
    for file_path in list_markdown_files(docs_root):
        if "_templates" in file_path.parts:
            continue
        parsed = parse_frontmatter(read_text(file_path))
        if not parsed.has_frontmatter or not parsed.is_valid:
            continue
        identifier = parsed.fields.get("id")
        if is_empty_value(identifier):
            continue
        assert identifier is not None
        entities.append(
            {
                "entity_identifier": identifier.strip(),
                "entity_kind": "document",
                "title": parsed.fields.get("title", ""),
                "document_type": parsed.fields.get("type", ""),
                "status": parsed.fields.get("status", ""),
                "source_path": _to_relative_posix(file_path, repo_root),
                "links": _parse_links_value(parsed.fields.get("links")),
                "source_layer": "docs-frontmatter",
            }
        )
    return entities


def _collect_root_document_entities(repo_root: Path) -> list[dict[str, Any]]:
    entities: list[dict[str, Any]] = []
    for file_name in ROOT_DOCUMENT_FILES:
        file_path = (repo_root / file_name).resolve()
        if not file_path.exists():
            continue
        content = read_text(file_path)
        match = ROOT_DOCUMENT_IDENTIFIER_PATTERN.search(content)
        if not match:
            continue
        entities.append(
            {
                "entity_identifier": match.group(1),
                "entity_kind": "root_document",
                "title": file_name,
                "document_type": "root-doc",
                "status": "active",
                "source_path": _to_relative_posix(file_path, repo_root),
                "links": [],
                "source_layer": "root-management-table",
            }
        )
    return entities


def _build_package_entities(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    entities: list[dict[str, Any]] = []
    for row in rows:
        package_identifier = _to_text(row.get("package_identifier"))
        if not package_identifier:
            continue
        entities.append(
            {
                "entity_identifier": package_identifier,
                "entity_kind": "package",
                "package_name": _to_text(row.get("package_name")),
                "package_path": _to_text(row.get("package_path")),
                "workspace_status": _to_text(row.get("workspace_status")),
                "implementation_status": _to_text(row.get("package_status")),
            }
        )
    return entities


def _build_method_entities(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    entities: list[dict[str, Any]] = []
    for row in rows:
        method_identifier = _to_text(row.get("method_identifier"))
        if not method_identifier:
            continue
        entities.append(
            {
                "entity_identifier": method_identifier,
                "entity_kind": "method",
                "package_identifier": _to_text(row.get("package_identifier")),
                "package_name": _to_text(row.get("package_name")),
                "method_name": _to_text(row.get("project_method_name")),
                "source_path": _to_text(row.get("source_path")),
                "implementation_status": _to_text(row.get("implementation_status")),
                "rust_original_method_identifier": _normalize_optional_text(row.get("rust_original_method_identifier")),
                "rust_original_method_name": _normalize_optional_text(row.get("rust_original_method_name")),
            }
        )
    return entities


def _build_semantic_module_entities(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    entities: list[dict[str, Any]] = []
    for row in rows:
        module_id_text = _to_text(row.get("module_id"))
        if not module_id_text.isdigit():
            continue
        module_identifier = f"SEM-MODULE-{int(module_id_text):03d}"
        entities.append(
            {
                "entity_identifier": module_identifier,
                "entity_kind": "semantic_module",
                "module_id": int(module_id_text),
                "module_name": _to_text(row.get("module_name")),
                "purpose": _to_text(row.get("purpose")),
                "implementation_status": _to_text(row.get("implementation_status")),
            }
        )
    return entities


def _build_semantic_method_entities(
    primary_rows: list[dict[str, Any]],
    supplemental_rows: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    entities: list[dict[str, Any]] = []
    for row in [*primary_rows, *supplemental_rows]:
        source_layer = _to_text(row.get("source_layer")) or "semantic"
        local_identifier = _to_text(row.get("local_identifier"))
        if not local_identifier:
            continue
        semantic_identifier = _build_semantic_method_identifier(source_layer, local_identifier)
        module_id_text = _to_text(row.get("module_id"))
        module_identifier = None
        if module_id_text.isdigit():
            module_identifier = f"SEM-MODULE-{int(module_id_text):03d}"
        entities.append(
            {
                "entity_identifier": semantic_identifier,
                "entity_kind": "semantic_method",
                "source_layer": source_layer,
                "local_identifier": local_identifier,
                "module_identifier": module_identifier,
                "semantic_alias": _to_text(row.get("semantic_alias")),
                "method_identifier": _normalize_optional_text(row.get("method_identifier")),
                "implementation_status": _to_text(row.get("implementation_status")),
                "resolution_state": _to_text(row.get("resolution_state")),
                "rust_original_method_identifier": _normalize_optional_text(row.get("rust_original_method_identifier")),
                "rust_original_method_name": _normalize_optional_text(row.get("rust_original_method_name")),
            }
        )
    return entities


def _build_semantic_type_entities(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    entities: list[dict[str, Any]] = []
    for row in rows:
        local_identifier = _to_text(row.get("local_identifier"))
        if not local_identifier:
            continue
        module_id_text = _to_text(row.get("module_id"))
        module_identifier = None
        if module_id_text.isdigit():
            module_identifier = f"SEM-MODULE-{int(module_id_text):03d}"
        entities.append(
            {
                "entity_identifier": _build_semantic_type_identifier(local_identifier),
                "entity_kind": "semantic_type",
                "local_identifier": local_identifier,
                "module_identifier": module_identifier,
                "type_label": _to_text(row.get("type_label")),
                "source_path": _to_text(row.get("path")),
                "implementation_status": _to_text(row.get("implementation_status")),
            }
        )
    return entities


def _build_python_package_entities(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    entities: list[dict[str, Any]] = []
    for row in rows:
        identifier = _to_text(row.get("package_identifier"))
        if not identifier:
            continue
        entities.append(
            {
                "entity_identifier": identifier,
                "entity_kind": "python_package",
                "package_name": _to_text(row.get("package_name")),
                "module_name": _to_text(row.get("module_name")),
                "source_path": _to_text(row.get("source_path")),
                "implementation_status": _to_text(row.get("implementation_status")),
            }
        )
    return entities


def _build_python_method_entities(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    entities: list[dict[str, Any]] = []
    for row in rows:
        identifier = _to_text(row.get("method_identifier"))
        if not identifier:
            continue
        entities.append(
            {
                "entity_identifier": identifier,
                "entity_kind": "python_method",
                "package_identifier": _to_text(row.get("package_identifier")),
                "module_name": _to_text(row.get("module_name")),
                "method_name": _to_text(row.get("python_method_name")),
                "source_path": _to_text(row.get("source_path")),
                "implementation_status": _to_text(row.get("implementation_status")),
                "rust_original_method_identifier": _normalize_optional_text(row.get("rust_original_method_identifier")),
                "rust_original_method_name": _normalize_optional_text(row.get("rust_original_method_name")),
            }
        )
    return entities


def _build_rust_method_entities(
    method_entities: list[dict[str, Any]],
    semantic_method_entities: list[dict[str, Any]],
    python_method_entities: list[dict[str, Any]],
) -> tuple[list[dict[str, Any]], dict[str, str]]:
    rust_by_identifier: dict[str, dict[str, Any]] = {}

    def include(rust_identifier: str | None, rust_method_name: str | None, source_kind: str) -> None:
        if not rust_identifier:
            return
        if rust_identifier not in rust_by_identifier:
            rust_by_identifier[rust_identifier] = {
                "entity_identifier": _build_rust_method_identifier(rust_identifier),
                "entity_kind": "rust_method",
                "rust_method_identifier": rust_identifier,
                "rust_method_name": rust_method_name,
                "source_layers": [source_kind],
            }
            return
        source_layers = rust_by_identifier[rust_identifier]["source_layers"]
        if source_kind not in source_layers:
            source_layers.append(source_kind)
        if not rust_by_identifier[rust_identifier].get("rust_method_name") and rust_method_name:
            rust_by_identifier[rust_identifier]["rust_method_name"] = rust_method_name

    for entity in method_entities:
        include(
            entity.get("rust_original_method_identifier"),
            entity.get("rust_original_method_name"),
            "ts-method-registry",
        )
    for entity in semantic_method_entities:
        include(
            entity.get("rust_original_method_identifier"),
            entity.get("rust_original_method_name"),
            "semantic-registry",
        )
    for entity in python_method_entities:
        include(
            entity.get("rust_original_method_identifier"),
            entity.get("rust_original_method_name"),
            "python-parity-registry",
        )

    mapping = {key: value["entity_identifier"] for key, value in rust_by_identifier.items()}
    return (list(rust_by_identifier.values()), mapping)


def _build_relations(
    documents: list[dict[str, Any]],
    known_entity_identifiers: set[str],
    package_entities: list[dict[str, Any]],
    method_entities: list[dict[str, Any]],
    semantic_module_entities: list[dict[str, Any]],
    semantic_method_entities: list[dict[str, Any]],
    python_package_entities: list[dict[str, Any]],
    python_method_entities: list[dict[str, Any]],
    rust_entity_by_rust_identifier: dict[str, str],
) -> list[dict[str, Any]]:
    relations: list[dict[str, Any]] = []

    package_identifiers = {entity["entity_identifier"] for entity in package_entities}
    semantic_module_identifiers = {entity["entity_identifier"] for entity in semantic_module_entities}
    python_package_identifiers = {entity["entity_identifier"] for entity in python_package_entities}

    for document in documents:
        from_identifier = str(document["entity_identifier"])
        for target in document.get("links", []):
            if _is_ignored_reference(target):
                relations.append(
                    {
                        "relation_kind": "document_link",
                        "from_entity_identifier": from_identifier,
                        "to_entity_identifier": target,
                        "resolution_state": "ignored",
                    }
                )
                continue
            relation_state = "resolved" if target in known_entity_identifiers else "unresolved"
            relations.append(
                {
                    "relation_kind": "document_link",
                    "from_entity_identifier": from_identifier,
                    "to_entity_identifier": target,
                    "resolution_state": relation_state,
                }
            )

    for method in method_entities:
        package_identifier = str(method.get("package_identifier") or "")
        if package_identifier:
            relations.append(
                {
                    "relation_kind": "package_contains_method",
                    "from_entity_identifier": package_identifier,
                    "to_entity_identifier": str(method["entity_identifier"]),
                    "resolution_state": "resolved" if package_identifier in package_identifiers else "unresolved",
                }
            )

        rust_identifier = method.get("rust_original_method_identifier")
        if rust_identifier:
            rust_entity_identifier = rust_entity_by_rust_identifier.get(str(rust_identifier))
            relations.append(
                {
                    "relation_kind": "method_to_rust_method",
                    "from_entity_identifier": str(method["entity_identifier"]),
                    "to_entity_identifier": rust_entity_identifier or str(rust_identifier),
                    "resolution_state": "resolved" if rust_entity_identifier else "unresolved",
                }
            )

    for semantic_method in semantic_method_entities:
        module_identifier = semantic_method.get("module_identifier")
        if module_identifier:
            relations.append(
                {
                    "relation_kind": "semantic_module_contains_semantic_method",
                    "from_entity_identifier": str(module_identifier),
                    "to_entity_identifier": str(semantic_method["entity_identifier"]),
                    "resolution_state": "resolved"
                    if module_identifier in semantic_module_identifiers
                    else "unresolved",
                }
            )

        method_identifier = semantic_method.get("method_identifier")
        if method_identifier:
            relations.append(
                {
                    "relation_kind": "semantic_method_maps_to_method",
                    "from_entity_identifier": str(semantic_method["entity_identifier"]),
                    "to_entity_identifier": str(method_identifier),
                    "resolution_state": "resolved" if method_identifier in known_entity_identifiers else "unresolved",
                }
            )

        rust_identifier = semantic_method.get("rust_original_method_identifier")
        if rust_identifier:
            rust_entity_identifier = rust_entity_by_rust_identifier.get(str(rust_identifier))
            relations.append(
                {
                    "relation_kind": "semantic_method_to_rust_method",
                    "from_entity_identifier": str(semantic_method["entity_identifier"]),
                    "to_entity_identifier": rust_entity_identifier or str(rust_identifier),
                    "resolution_state": "resolved" if rust_entity_identifier else "unresolved",
                }
            )

    for python_method in python_method_entities:
        package_identifier = str(python_method.get("package_identifier") or "")
        if package_identifier:
            relations.append(
                {
                    "relation_kind": "python_package_contains_method",
                    "from_entity_identifier": package_identifier,
                    "to_entity_identifier": str(python_method["entity_identifier"]),
                    "resolution_state": "resolved"
                    if package_identifier in python_package_identifiers
                    else "unresolved",
                }
            )

        rust_identifier = python_method.get("rust_original_method_identifier")
        if rust_identifier:
            rust_entity_identifier = rust_entity_by_rust_identifier.get(str(rust_identifier))
            relations.append(
                {
                    "relation_kind": "python_method_to_rust_method",
                    "from_entity_identifier": str(python_method["entity_identifier"]),
                    "to_entity_identifier": rust_entity_identifier or str(rust_identifier),
                    "resolution_state": "resolved" if rust_entity_identifier else "unresolved",
                }
            )

    return relations


def _parse_links_value(value: str | None) -> list[str]:
    if value is None or is_empty_value(value):
        return []
    text = value.strip()
    if text.startswith("[") and text.endswith("]"):
        raw_items = [item.strip() for item in text[1:-1].split(",")]
    else:
        raw_items = [text]
    result: list[str] = []
    for raw in raw_items:
        cleaned = raw.strip().strip("`").strip('"').strip("'")
        if not cleaned:
            continue
        if ENTITY_IDENTIFIER_PATTERN.match(cleaned):
            result.append(cleaned)
    return result


def _is_ignored_reference(identifier: str) -> bool:
    if identifier in IGNORED_LINK_IDENTIFIERS:
        return True
    return any(identifier.startswith(prefix) for prefix in IGNORED_LINK_PREFIXES)


def _build_semantic_method_identifier(source_layer: str, local_identifier: str) -> str:
    normalized = _normalize_identifier_part(f"{source_layer}-{local_identifier}")
    return f"SEM-METHOD-{normalized}"


def _build_semantic_type_identifier(local_identifier: str) -> str:
    normalized = _normalize_identifier_part(local_identifier)
    return f"SEM-TYPE-{normalized}"


def _build_rust_method_identifier(rust_identifier: str) -> str:
    if rust_identifier.isdigit():
        return f"RUST-METHOD-{int(rust_identifier):04d}"
    return f"RUST-METHOD-{_normalize_identifier_part(rust_identifier)}"


def _normalize_identifier_part(value: str) -> str:
    normalized = re.sub(r"[^A-Za-z0-9]+", "-", value).strip("-").upper()
    return normalized or "UNKNOWN"


def _to_text(value: Any) -> str:
    if value is None:
        return ""
    return str(value)


def _normalize_optional_text(value: Any) -> str | None:
    text = _to_text(value).strip()
    if text in ("", "—", "-"):
        return None
    return text


def _to_relative_posix(path: Path, repo_root: Path) -> str:
    try:
        return path.resolve().relative_to(repo_root).as_posix()
    except ValueError:
        return path.resolve().as_posix()


def _load_json_or_empty(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}
    return payload if isinstance(payload, dict) else {}
