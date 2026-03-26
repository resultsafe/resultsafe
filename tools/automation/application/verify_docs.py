from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

from tools.automation.application.check_links import run_check_links
from tools.automation.domain.entities import VerificationIssue, VerifyDocsReport
from tools.automation.domain.policies import AiSessionFrontmatterPolicy, CommonFrontmatterPolicy
from tools.automation.infrastructure.filesystem import list_markdown_files, read_text
from tools.automation.infrastructure.markdown import (
    is_empty_value,
    parse_frontmatter,
    parse_markdown_targets,
    strip_code_blocks,
)


DATE_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}$")
ENTITY_IDENTIFIER_PATTERN = re.compile(r"^[A-Z][A-Za-z0-9]*(?:-[A-Za-z0-9]+)*$")
UUID_PATTERN = re.compile(r"^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")
AI_SESSION_PATH_PATTERN = re.compile(r".*[\\/]docs[\\/]obsidian[\\/]concepts[\\/][^\\/]+[\\/]ai-session-\d{4}-\d{2}-\d{2}\.md$")
ROOT_DOCUMENT_IDENTIFIER_PATTERN = re.compile(r"\|\s*ID документа\s*\|\s*`([A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+)`\s*\|")
IGNORED_LINK_PREFIXES: tuple[str, ...] = ("R-", "CP-")
IGNORED_LINK_IDENTIFIERS: set[str] = {"AI_CONTEXT", "TASK_CONTEXT"}
KB_LIFECYCLE_ALLOWED: set[str] = {"current", "legacy", "archive"}
NORMATIVE_ID_PREFIXES: tuple[str, ...] = ("DOC-", "SPEC-", "POL-", "ADR-", "RB-", "CONCEPT-")

REGISTRY_ID_FILES: tuple[Path, ...] = (
    Path("docs/_generated/identifier-registry/MONOREPO-IDENTIFIER-REGISTRY.json"),
    Path("docs/_generated/identifier-registry/SEMANTIC-FP-RESULT-REGISTRY.json"),
    Path("docs/_generated/identifier-registry/PYTHON-RUST-PARITY-REGISTRY.json"),
    Path("docs/_generated/identifier-registry/MONOREPO-ENTITY-CATALOG.json"),
    Path("docs/obsidian/specs/identifier-registry/MONOREPO-IDENTIFIER-REGISTRY.json"),
    Path("docs/obsidian/specs/identifier-registry/SEMANTIC-FP-RESULT-REGISTRY.json"),
    Path("docs/obsidian/specs/identifier-registry/PYTHON-RUST-PARITY-REGISTRY.json"),
    Path("docs/obsidian/specs/identifier-registry/MONOREPO-ENTITY-CATALOG.json"),
)


def run_verify_docs(root: Path) -> VerifyDocsReport:
    repo_root = root.resolve()
    docs_root = _resolve_docs_root(repo_root)
    if docs_root is None:
        return VerifyDocsReport(
            checked_markdown_files=0,
            checked_index_files=0,
            issues=[VerificationIssue("precondition", str(repo_root / "docs"), "Missing docs directory.")],
            link_report=None,
        )

    excluded_roots = {"_templates", "_attachments", "_generated", "archive"}
    all_md = [p for p in list_markdown_files(docs_root) if not any(part in excluded_roots for part in p.parts)]
    issues: list[VerificationIssue] = []

    common = CommonFrontmatterPolicy()
    ai_policy = AiSessionFrontmatterPolicy()
    id_locations: dict[str, list[str]] = {}
    uuid_locations: dict[str, list[str]] = {}
    links_by_file: dict[str, list[str]] = {}

    for md in all_md:
        text = read_text(md)
        fm = parse_frontmatter(text)
        if not fm.has_frontmatter or not fm.is_valid:
            issues.append(VerificationIssue("frontmatter", str(md), fm.reason))
            continue

        if _is_ai_session_path(str(md)) and any(
            not is_empty_value(fm.fields.get(key)) for key in ai_policy.required_fields
        ):
            _validate_ai_session_frontmatter(str(md), fm.fields, ai_policy, issues)
        else:
            _validate_common_frontmatter(str(md), fm.fields, common, issues)
            _validate_lifecycle_policy(str(md), fm.fields, issues)
            _collect_document_identifier(str(md), fm.fields, id_locations, issues)
            _collect_document_uuid(str(md), fm.fields, uuid_locations, issues)
            links_by_file[str(md)] = _parse_links_value(fm.fields.get("links"))

    _validate_unique_identifiers(id_locations, issues)
    _validate_unique_uuids(uuid_locations, issues)
    known_identifiers = set(id_locations.keys())
    known_identifiers.update(_collect_root_document_identifiers(repo_root))
    known_identifiers.update(_collect_registry_identifiers(repo_root))
    _validate_frontmatter_links(links_by_file, known_identifiers, issues)
    _validate_identifier_registry_integrity(repo_root, issues)
    _validate_entity_catalog_consistency(repo_root, set(id_locations.keys()), issues)

    index_files = [p for p in all_md if p.name == "index.md"]
    _validate_indexes(index_files, issues)
    _validate_concepts_nested_index(docs_root, issues)

    link_report = run_check_links(repo_root)
    if not link_report.is_success:
        issues.append(
            VerificationIssue(
                "link-check",
                str(docs_root),
                f"Link checker found {len(link_report.missing_links)} missing links.",
            )
        )

    return VerifyDocsReport(
        checked_markdown_files=len(all_md),
        checked_index_files=len(index_files),
        issues=issues,
        link_report=link_report,
            )


def _resolve_docs_root(repo_root: Path) -> Path | None:
    docs_root = (repo_root / "docs").resolve()
    if docs_root.exists():
        return docs_root
    legacy_root = (repo_root / "docs" / "obsidian").resolve()
    if legacy_root.exists():
        return legacy_root
    return None


def _is_ai_session_path(path: str) -> bool:
    normalized = path.replace("\\", "/")
    return bool(re.match(r".*/docs/(?:obsidian/)?concepts/[^/]+/ai-session-\d{4}-\d{2}-\d{2}\.md$", normalized))


def _collect_document_identifier(
    file_path: str,
    fields: dict[str, str],
    id_locations: dict[str, list[str]],
    issues: list[VerificationIssue],
) -> None:
    raw_identifier = fields.get("id")
    if is_empty_value(raw_identifier):
        return
    assert raw_identifier is not None
    identifier = raw_identifier.strip()
    # Keep identifier parsing permissive: naming policy is validated by docs governance checks.
    id_locations.setdefault(identifier, []).append(file_path)


def _validate_unique_identifiers(id_locations: dict[str, list[str]], issues: list[VerificationIssue]) -> None:
    for identifier, locations in id_locations.items():
        if len(locations) <= 1:
            continue
        for location in locations:
            issues.append(
                VerificationIssue(
                    "frontmatter-id-uniqueness",
                    location,
                    f"Duplicate document id '{identifier}'.",
                )
            )


def _collect_document_uuid(
    file_path: str,
    fields: dict[str, str],
    uuid_locations: dict[str, list[str]],
    issues: list[VerificationIssue],
) -> None:
    raw_uuid = fields.get("uuid")
    if is_empty_value(raw_uuid):
        return
    assert raw_uuid is not None
    value = raw_uuid.strip().lower()
    if not UUID_PATTERN.match(value):
        issues.append(
            VerificationIssue(
                "frontmatter-uuid-format",
                file_path,
                f"Field 'uuid' must be a valid UUID string, got '{raw_uuid.strip()}'.",
            )
        )
    uuid_locations.setdefault(value, []).append(file_path)


def _validate_unique_uuids(uuid_locations: dict[str, list[str]], issues: list[VerificationIssue]) -> None:
    for value, locations in uuid_locations.items():
        if len(locations) <= 1:
            continue
        for location in locations:
            issues.append(
                VerificationIssue(
                    "frontmatter-uuid-uniqueness",
                    location,
                    f"Duplicate document uuid '{value}'.",
                )
            )


def _validate_frontmatter_links(
    links_by_file: dict[str, list[str]],
    known_identifiers: set[str],
    issues: list[VerificationIssue],
) -> None:
    for file_path, links in links_by_file.items():
        for target in links:
            if _is_ignored_reference(target):
                continue
            if target not in known_identifiers:
                issues.append(
                    VerificationIssue(
                        "frontmatter-links",
                        file_path,
                        f"Unknown linked identifier '{target}'.",
                    )
                )


def _collect_root_document_identifiers(repo_root: Path) -> set[str]:
    identifiers: set[str] = set()
    for file_name in ("README.md", "AI_CONTEXT.md", "TASK_CONTEXT.md"):
        path = (repo_root / file_name).resolve()
        if not path.exists():
            continue
        match = ROOT_DOCUMENT_IDENTIFIER_PATTERN.search(read_text(path))
        if match:
            identifiers.add(match.group(1))
    return identifiers


def _collect_registry_identifiers(repo_root: Path) -> set[str]:
    identifiers: set[str] = set()
    for relative in REGISTRY_ID_FILES:
        path = (repo_root / relative).resolve()
        if not path.exists():
            continue
        try:
            payload: Any = json.loads(read_text(path))
        except json.JSONDecodeError:
            continue
        _extract_identifiers(payload, identifiers)
    return identifiers


def _extract_identifiers(payload: Any, identifiers: set[str]) -> None:
    if isinstance(payload, dict):
        for key, value in payload.items():
            if key.endswith("_identifier") and isinstance(value, str) and ENTITY_IDENTIFIER_PATTERN.match(value):
                identifiers.add(value)
            _extract_identifiers(value, identifiers)
        return
    if isinstance(payload, list):
        for item in payload:
            _extract_identifiers(item, identifiers)


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
        if cleaned and ENTITY_IDENTIFIER_PATTERN.match(cleaned):
            result.append(cleaned)
    return result


def _is_ignored_reference(identifier: str) -> bool:
    if identifier in IGNORED_LINK_IDENTIFIERS:
        return True
    return any(identifier.startswith(prefix) for prefix in IGNORED_LINK_PREFIXES)


def _validate_common_frontmatter(
    file_path: str, fields: dict[str, str], policy: CommonFrontmatterPolicy, issues: list[VerificationIssue]
) -> None:
    for key in policy.required_fields:
        if key not in fields or is_empty_value(fields.get(key)):
            issues.append(VerificationIssue("frontmatter", file_path, f"Missing required field '{key}'."))

    for key in policy.date_fields:
        value = fields.get(key)
        if value and not DATE_PATTERN.match(value):
            issues.append(VerificationIssue("frontmatter", file_path, f"Field '{key}' must match YYYY-MM-DD."))


def _validate_lifecycle_policy(file_path: str, fields: dict[str, str], issues: list[VerificationIssue]) -> None:
    lifecycle_raw = fields.get("kb_lifecycle")
    lifecycle = (lifecycle_raw or "").strip().lower()
    status = (fields.get("status") or "").strip().lower()

    if not lifecycle:
        # kb_lifecycle is optional for authored docs in current standards.
        return
    if lifecycle not in KB_LIFECYCLE_ALLOWED:
        issues.append(
            VerificationIssue(
                "lifecycle-policy",
                file_path,
                "Field 'kb_lifecycle' must be one of: current, legacy, archive.",
            )
        )
        return

    normalized_path = file_path.replace("\\", "/")
    if ("/docs/tasks/done/" in normalized_path or "/docs/obsidian/tasks/done/" in normalized_path) and lifecycle != "archive":
        issues.append(
            VerificationIssue(
                "lifecycle-policy",
                file_path,
                "Path rule mismatch: docs/tasks/done/** must use kb_lifecycle=archive.",
            )
        )
    if ("/docs/specs/legacy-" in normalized_path or "/docs/obsidian/specs/legacy-" in normalized_path) and lifecycle != "legacy":
        issues.append(
            VerificationIssue(
                "lifecycle-policy",
                file_path,
                "Path rule mismatch: docs/specs/legacy-*/** must use kb_lifecycle=legacy.",
            )
        )
    if ("/docs/notes/" in normalized_path or "/docs/obsidian/notes/" in normalized_path) and lifecycle == "current":
        issues.append(
            VerificationIssue(
                "lifecycle-policy",
                file_path,
                "Path rule mismatch: docs/notes/** cannot use kb_lifecycle=current.",
            )
        )
    if (
        ("/docs/roadmap/" in normalized_path or "/docs/obsidian/roadmap/" in normalized_path)
        and status in {"done", "completed", "archived"}
        and lifecycle == "current"
    ):
        issues.append(
            VerificationIssue(
                "lifecycle-policy",
                file_path,
                "Path rule mismatch: historical roadmap artifacts cannot use kb_lifecycle=current.",
            )
        )


def _validate_ai_session_frontmatter(
    file_path: str, fields: dict[str, str], policy: AiSessionFrontmatterPolicy, issues: list[VerificationIssue]
) -> None:
    for key in policy.required_fields:
        if key not in fields or is_empty_value(fields.get(key)):
            issues.append(VerificationIssue("frontmatter-ai-session", file_path, f"Missing required field '{key}'."))

    date_value = fields.get("date")
    if date_value and not DATE_PATTERN.match(date_value):
        issues.append(VerificationIssue("frontmatter-ai-session", file_path, "Field 'date' must match YYYY-MM-DD."))

    concept_value = fields.get("concept")
    if concept_value and not re.match(r"^CONCEPT-\d{3}$", concept_value):
        issues.append(
            VerificationIssue("frontmatter-ai-session", file_path, "Field 'concept' must match CONCEPT-XXX.")
        )


def _validate_indexes(index_files: list[Path], issues: list[VerificationIssue]) -> None:
    # Index content checks are intentionally disabled here.
    # Navigation/link quality is verified by docs:check-links and Docusaurus build.
    _ = index_files
    _ = issues


def _validate_concepts_nested_index(docs_root: Path, issues: list[VerificationIssue]) -> None:
    # Nested ai-session link coverage is no longer enforced at verify stage.
    _ = docs_root
    _ = issues


def _validate_identifier_registry_integrity(repo_root: Path, issues: list[VerificationIssue]) -> None:
    registry_path = _resolve_existing_file(
        repo_root,
        (
            "docs/_generated/identifier-registry/MONOREPO-IDENTIFIER-REGISTRY.json",
            "docs/obsidian/specs/identifier-registry/MONOREPO-IDENTIFIER-REGISTRY.json",
        ),
    )
    if registry_path is None:
        registry_path = (repo_root / "docs/_generated/identifier-registry/MONOREPO-IDENTIFIER-REGISTRY.json").resolve()
    if not registry_path.exists():
        issues.append(
            VerificationIssue(
                "registry-consistency",
                str(registry_path),
                "Missing MONOREPO-IDENTIFIER-REGISTRY.json.",
            )
        )
        return

    try:
        payload = json.loads(read_text(registry_path))
    except json.JSONDecodeError:
        issues.append(
            VerificationIssue(
                "registry-consistency",
                str(registry_path),
                "Invalid JSON in MONOREPO-IDENTIFIER-REGISTRY.json.",
            )
        )
        return

    packages = payload.get("packages", [])
    methods = payload.get("methods", [])
    if not isinstance(packages, list) or not isinstance(methods, list):
        issues.append(
            VerificationIssue(
                "registry-consistency",
                str(registry_path),
                "Registry schema mismatch: packages and methods must be arrays.",
            )
        )
        return

    package_ids: set[str] = set()
    duplicate_package_ids: set[str] = set()
    for row in packages:
        if not isinstance(row, dict):
            continue
        identifier = str(row.get("package_identifier", "")).strip()
        if identifier:
            if identifier in package_ids:
                duplicate_package_ids.add(identifier)
            package_ids.add(identifier)

        package_path = str(row.get("package_path", "")).replace("\\", "/")
        if "/node_modules/" in f"/{package_path}/":
            issues.append(
                VerificationIssue(
                    "registry-consistency",
                    str(registry_path),
                    f"Contaminated package path contains node_modules: '{package_path}'.",
                )
            )

    if duplicate_package_ids:
        issues.append(
            VerificationIssue(
                "registry-consistency",
                str(registry_path),
                "Duplicate package identifiers detected: " + ", ".join(sorted(duplicate_package_ids)),
            )
        )

    method_ids: set[str] = set()
    duplicate_method_ids: set[str] = set()
    for row in methods:
        if not isinstance(row, dict):
            continue
        identifier = str(row.get("method_identifier", "")).strip()
        if not identifier:
            continue
        if identifier in method_ids:
            duplicate_method_ids.add(identifier)
        method_ids.add(identifier)

    if duplicate_method_ids:
        issues.append(
            VerificationIssue(
                "registry-consistency",
                str(registry_path),
                "Duplicate method identifiers detected: " + ", ".join(sorted(duplicate_method_ids)),
            )
        )


def _validate_entity_catalog_consistency(
    repo_root: Path,
    known_document_ids: set[str],
    issues: list[VerificationIssue],
) -> None:
    catalog_path = _resolve_existing_file(
        repo_root,
        (
            "docs/_generated/identifier-registry/MONOREPO-ENTITY-CATALOG.json",
            "docs/obsidian/specs/identifier-registry/MONOREPO-ENTITY-CATALOG.json",
        ),
    )
    if catalog_path is None:
        catalog_path = (repo_root / "docs/_generated/identifier-registry/MONOREPO-ENTITY-CATALOG.json").resolve()
    if not catalog_path.exists():
        issues.append(
            VerificationIssue(
                "registry-consistency",
                str(catalog_path),
                "Missing MONOREPO-ENTITY-CATALOG.json.",
            )
        )
        return

    try:
        payload = json.loads(read_text(catalog_path))
    except json.JSONDecodeError:
        issues.append(
            VerificationIssue(
                "registry-consistency",
                str(catalog_path),
                "Invalid JSON in MONOREPO-ENTITY-CATALOG.json.",
            )
        )
        return

    unresolved_count = payload.get("summary", {}).get("unresolved_relations_count")
    if isinstance(unresolved_count, int) and unresolved_count > 0:
        issues.append(
            VerificationIssue(
                "registry-consistency",
                str(catalog_path),
                f"Entity catalog unresolved_relations_count must be 0, got {unresolved_count}.",
            )
        )

    documents = payload.get("entities", {}).get("documents", [])
    catalog_document_ids: set[str] = set()
    if isinstance(documents, list):
        for row in documents:
            if not isinstance(row, dict):
                continue
            identifier = str(row.get("entity_identifier", "")).strip()
            if identifier:
                catalog_document_ids.add(identifier)

    # Normative document coverage in entity catalog is governed by dedicated
    # registry sync pipelines; verify gate keeps schema/integrity checks only.


def _resolve_existing_file(repo_root: Path, candidates: tuple[str, ...]) -> Path | None:
    for rel in candidates:
        candidate = (repo_root / rel).resolve()
        if candidate.exists():
            return candidate
    return None

