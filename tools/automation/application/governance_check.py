from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import date
from fnmatch import fnmatch
from pathlib import Path
from typing import Any

from tools.automation.application.verify_docs import run_verify_docs
from tools.automation.infrastructure.filesystem import list_markdown_files, read_text
from tools.automation.infrastructure.markdown import parse_frontmatter


DEFAULT_POLICY_FILE = Path("config/docs-governance-policy.json")
DEFAULT_CANONICAL_INVENTORY_FILE = Path("config/docs-canonical-inventory.json")
DEFAULT_RAG_ALLOWLIST_FILE = Path("config/docs-rag-allowlist.json")
DEFAULT_WEAK_SIGNAL_RULES_FILE = Path("config/docs-weak-signal-rules.json")
DEFAULT_CLASSIFICATION_FILE = Path("config/docs-corpus-classification.json")


@dataclass(frozen=True)
class GovernanceGateFinding:
    code: str
    path: str
    message: str
    severity: str
    evidence: dict[str, Any] | None = None

    def to_dict(self) -> dict[str, Any]:
        payload: dict[str, Any] = {
            "code": self.code,
            "path": self.path,
            "message": self.message,
            "severity": self.severity,
        }
        if self.evidence is not None:
            payload["evidence"] = self.evidence
        return payload


@dataclass(frozen=True)
class GovernanceGateResult:
    gate_id: str
    name: str
    severity: str
    scope: str
    checked_items: int
    findings: tuple[GovernanceGateFinding, ...]

    @property
    def status(self) -> str:
        if not self.findings:
            return "passed"
        if self.severity == "blocking":
            return "failed"
        if self.severity == "warning":
            return "warning"
        return "informational"

    def to_dict(self) -> dict[str, Any]:
        return {
            "gate_id": self.gate_id,
            "name": self.name,
            "severity": self.severity,
            "scope": self.scope,
            "status": self.status,
            "checked_items": self.checked_items,
            "findings_count": len(self.findings),
            "findings": [item.to_dict() for item in self.findings],
        }


@dataclass(frozen=True)
class GovernanceCheckReport:
    mode: str
    generated_at: str
    gates: tuple[GovernanceGateResult, ...]

    @property
    def blocking_failures(self) -> int:
        return len([gate for gate in self.gates if gate.status == "failed"])

    @property
    def warning_failures(self) -> int:
        return len([gate for gate in self.gates if gate.status == "warning"])

    @property
    def informational_findings(self) -> int:
        return len([gate for gate in self.gates if gate.status == "informational"])

    @property
    def is_success(self) -> bool:
        return self.blocking_failures == 0

    def to_dict(self) -> dict[str, Any]:
        return {
            "version": "1.0",
            "mode": self.mode,
            "generated_at": self.generated_at,
            "status": "ok" if self.is_success else "validation_error",
            "summary": {
                "total_gates": len(self.gates),
                "blocking_failures": self.blocking_failures,
                "warning_failures": self.warning_failures,
                "informational_findings": self.informational_findings,
            },
            "gates": [item.to_dict() for item in self.gates],
        }


def run_governance_check(
    root: Path,
    mode: str,
    changed_files_file: Path | None = None,
    policy_file: Path | None = None,
    report_file: Path | None = None,
) -> GovernanceCheckReport:
    repo_root = root.resolve()
    policy_path = (repo_root / (policy_file or DEFAULT_POLICY_FILE)).resolve()
    policy = _load_json(policy_path)

    canonical_inventory = _load_json(
        (repo_root / Path(policy["inputs"]["canonical_inventory_file"])).resolve()
    )
    rag_allowlist = _load_json((repo_root / Path(policy["inputs"]["rag_allowlist_file"])).resolve())
    classification = _load_optional_json((repo_root / Path(policy["inputs"]["classification_file"])).resolve())

    changed_paths = _load_changed_paths(repo_root, changed_files_file)
    docs = _collect_docs(repo_root, canonical_inventory, classification)
    verify_report = run_verify_docs(repo_root)

    gates: list[GovernanceGateResult] = []
    for gate_cfg in policy["gates"]:
        gate_id = str(gate_cfg["gate_id"])
        gate_name = str(gate_cfg["name"])
        gate_scope = str(gate_cfg.get("scope", "global"))
        severity = str(gate_cfg["severity_by_mode"][mode])

        if gate_id == "registry-integrity":
            findings, checked_items = _gate_registry_integrity(repo_root, verify_report.issues)
        elif gate_id == "uuid-metadata-completeness":
            findings, checked_items = _gate_metadata_completeness(
                docs=docs,
                mode=mode,
                changed_paths=changed_paths,
                scope=gate_scope,
                policy=policy,
            )
        elif gate_id == "lifecycle-correctness":
            findings, checked_items = _gate_lifecycle_correctness(docs=docs, verify_issues=verify_report.issues)
        elif gate_id == "source-of-truth-clarity":
            findings, checked_items = _gate_source_of_truth_clarity(
                docs=docs,
                mode=mode,
                changed_paths=changed_paths,
                scope=gate_scope,
            )
        elif gate_id == "critical-cross-link-validity":
            findings, checked_items = _gate_cross_link_validity(verify_report.issues)
        elif gate_id == "default-rag-contamination":
            findings, checked_items = _gate_default_rag_contamination(
                repo_root=repo_root,
                policy=policy,
                rag_allowlist=rag_allowlist,
            )
        elif gate_id == "weak-signal-policy":
            findings, checked_items = _gate_weak_signal_policy(
                docs=docs,
                mode=mode,
                changed_paths=changed_paths,
                scope=gate_scope,
            )
        elif gate_id == "classification-metadata-hygiene":
            findings, checked_items = _gate_classification_metadata_hygiene(
                docs=docs,
                classification_payload=classification,
            )
        elif gate_id == "duplicate-overlap-detection":
            findings, checked_items = _gate_duplicate_overlap(docs)
        elif gate_id == "canonical-coverage":
            findings, checked_items = _gate_canonical_coverage(docs, canonical_inventory)
        else:
            findings, checked_items = (), 0

        gates.append(
            GovernanceGateResult(
                gate_id=gate_id,
                name=gate_name,
                severity=severity,
                scope=gate_scope,
                checked_items=checked_items,
                findings=tuple(
                    GovernanceGateFinding(
                        code=item.code,
                        path=item.path,
                        message=item.message,
                        severity=severity,
                        evidence=item.evidence,
                    )
                    for item in findings
                ),
            )
        )

    report = GovernanceCheckReport(
        mode=mode,
        generated_at=date.today().isoformat(),
        gates=tuple(gates),
    )

    if report_file is not None:
        target = report_file if report_file.is_absolute() else (repo_root / report_file).resolve()
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(json.dumps(report.to_dict(), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    return report


@dataclass(frozen=True)
class _InternalFinding:
    code: str
    path: str
    message: str
    evidence: dict[str, Any] | None = None


@dataclass(frozen=True)
class _DocRecord:
    path: str
    class_name: str
    lifecycle: str
    id_value: str | None
    fields: dict[str, str]


def _load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def _load_optional_json(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}


def _load_changed_paths(repo_root: Path, changed_files_file: Path | None) -> set[str]:
    if changed_files_file is None:
        return set()
    path = changed_files_file if changed_files_file.is_absolute() else (repo_root / changed_files_file).resolve()
    if not path.exists():
        return set()
    return {
        line.strip().replace("\\", "/")
        for line in path.read_text(encoding="utf-8").splitlines()
        if line.strip()
    }


def _resolve_docs_root(repo_root: Path) -> Path:
    primary = (repo_root / "docs").resolve()
    if primary.exists():
        return primary
    return (repo_root / "docs" / "obsidian").resolve()


def _collect_docs(
    repo_root: Path,
    canonical_inventory: dict[str, Any],
    classification: dict[str, Any],
) -> list[_DocRecord]:
    docs_root = _resolve_docs_root(repo_root)
    class_map: dict[str, str] = {}
    for item in classification.get("entries", []):
        path = str(item.get("path", "")).replace("\\", "/")
        class_name = str(item.get("class", "")).strip()
        if path and class_name:
            class_map[path] = class_name

    docs: list[_DocRecord] = []
    for markdown in list_markdown_files(docs_root):
        normalized = markdown.relative_to(repo_root).as_posix()
        parsed = parse_frontmatter(read_text(markdown))
        fields = parsed.fields if parsed.has_frontmatter and parsed.is_valid else {}
        lifecycle = str(fields.get("kb_lifecycle", "")).strip().lower()
        class_name = class_map.get(normalized) or _classify_doc_by_path(normalized, canonical_inventory)
        docs.append(
            _DocRecord(
                path=normalized,
                class_name=class_name,
                lifecycle=lifecycle,
                id_value=_normalize_text(fields.get("id")),
                fields=fields,
            )
        )
    return docs


def _classify_doc_by_path(path: str, canonical_inventory: dict[str, Any]) -> str:
    for rule in canonical_inventory.get("path_rules", []):
        glob = str(rule.get("glob", ""))
        if glob and fnmatch(path, glob):
            return str(rule.get("class", "supporting"))
    return "supporting"


def _normalize_text(value: str | None) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    return text or None


def _scope_docs(
    docs: list[_DocRecord],
    mode: str,
    changed_paths: set[str],
    scope: str,
) -> list[_DocRecord]:
    if mode != "pr" or not changed_paths:
        return docs
    if scope.startswith("changed"):
        return [doc for doc in docs if doc.path in changed_paths]
    return docs


def _gate_registry_integrity(repo_root: Path, verify_issues: list[Any]) -> tuple[tuple[_InternalFinding, ...], int]:
    findings: list[_InternalFinding] = []
    registry_candidates = [
        (repo_root / "docs/_generated/identifier-registry/MONOREPO-IDENTIFIER-REGISTRY.json").resolve(),
        (repo_root / "docs/obsidian/specs/identifier-registry/MONOREPO-IDENTIFIER-REGISTRY.json").resolve(),
    ]
    entity_candidates = [
        (repo_root / "docs/_generated/identifier-registry/MONOREPO-ENTITY-CATALOG.json").resolve(),
        (repo_root / "docs/obsidian/specs/identifier-registry/MONOREPO-ENTITY-CATALOG.json").resolve(),
    ]
    registry_path = next((item for item in registry_candidates if item.exists()), registry_candidates[0])
    entity_path = next((item for item in entity_candidates if item.exists()), entity_candidates[0])

    if not registry_path.exists():
        findings.append(_InternalFinding("missing-registry", str(registry_path), "Identifier registry file is missing."))
        return tuple(findings), 0

    payload = _load_json(registry_path)
    packages = payload.get("packages", [])
    methods = payload.get("methods", [])
    checked = len(packages) + len(methods)

    package_ids: set[str] = set()
    method_ids: set[str] = set()
    for row in packages:
        identifier = str(row.get("package_identifier", "")).strip()
        package_path = str(row.get("package_path", "")).replace("\\", "/")
        if identifier in package_ids:
            findings.append(
                _InternalFinding(
                    "duplicate-package-id",
                    registry_path.relative_to(repo_root).as_posix(),
                    f"Duplicate package identifier '{identifier}'.",
                    {"identifier": identifier},
                )
            )
        package_ids.add(identifier)
        if "/node_modules/" in f"/{package_path}/":
            findings.append(
                _InternalFinding(
                    "registry-node-modules-contamination",
                    registry_path.relative_to(repo_root).as_posix(),
                    f"Package path contains node_modules: '{package_path}'.",
                    {"package_path": package_path},
                )
            )

    for row in methods:
        identifier = str(row.get("method_identifier", "")).strip()
        if identifier in method_ids:
            findings.append(
                _InternalFinding(
                    "duplicate-method-id",
                    registry_path.relative_to(repo_root).as_posix(),
                    f"Duplicate method identifier '{identifier}'.",
                    {"identifier": identifier},
                )
            )
        method_ids.add(identifier)

    if entity_path.exists():
        entity_payload = _load_json(entity_path)
        unresolved = int(entity_payload.get("summary", {}).get("unresolved_relations_count", 0))
        if unresolved > 0:
            findings.append(
                _InternalFinding(
                    "entity-catalog-unresolved-relations",
                    entity_path.relative_to(repo_root).as_posix(),
                    f"Unresolved relations must be 0, got {unresolved}.",
                    {"unresolved_relations_count": unresolved},
                )
            )
    else:
        findings.append(_InternalFinding("missing-entity-catalog", str(entity_path), "Entity catalog file is missing."))

    for issue in verify_issues:
        if getattr(issue, "check", "") != "registry-consistency":
            continue
        findings.append(
            _InternalFinding(
                "registry-consistency-verify",
                getattr(issue, "file_path", ""),
                getattr(issue, "message", "Registry consistency issue."),
            )
        )

    return tuple(findings), checked


def _gate_metadata_completeness(
    docs: list[_DocRecord],
    mode: str,
    changed_paths: set[str],
    scope: str,
    policy: dict[str, Any],
) -> tuple[tuple[_InternalFinding, ...], int]:
    required = [str(item) for item in policy["metadata_requirements"]["required_fields_significant"]]
    required_canonical = [str(item) for item in policy["metadata_requirements"]["canonical_required_fields"]]
    significant_classes = {str(item) for item in policy["metadata_requirements"]["significant_classes"]}
    scoped_docs = _scope_docs(docs, mode, changed_paths, scope)

    findings: list[_InternalFinding] = []
    checked = 0
    for doc in scoped_docs:
        if doc.class_name not in significant_classes:
            continue
        if fnmatch(doc.path, policy["metadata_requirements"]["ai_session_exclusion_glob"]):
            continue
        checked += 1
        missing = [field for field in required if not _normalize_text(doc.fields.get(field))]
        if doc.class_name == "canonical":
            missing.extend([field for field in required_canonical if not _normalize_text(doc.fields.get(field))])
        if not missing:
            continue
        findings.append(
            _InternalFinding(
                "metadata-missing-fields",
                doc.path,
                "Missing required metadata fields: " + ", ".join(sorted(set(missing))),
                {"missing_fields": sorted(set(missing)), "class": doc.class_name},
            )
        )
    return tuple(findings), checked


def _gate_lifecycle_correctness(
    docs: list[_DocRecord],
    verify_issues: list[Any],
) -> tuple[tuple[_InternalFinding, ...], int]:
    findings: list[_InternalFinding] = []
    for issue in verify_issues:
        if getattr(issue, "check", "") != "lifecycle-policy":
            continue
        findings.append(
            _InternalFinding(
                "lifecycle-policy-violation",
                getattr(issue, "file_path", ""),
                getattr(issue, "message", ""),
            )
        )
    return tuple(findings), len(docs)


def _gate_source_of_truth_clarity(
    docs: list[_DocRecord],
    mode: str,
    changed_paths: set[str],
    scope: str,
) -> tuple[tuple[_InternalFinding, ...], int]:
    scoped_docs = _scope_docs(docs, mode, changed_paths, scope)
    canonical_docs = [doc for doc in scoped_docs if doc.class_name == "canonical"]
    findings: list[_InternalFinding] = []
    for doc in canonical_docs:
        source_of_truth = _normalize_text(doc.fields.get("source_of_truth"))
        if source_of_truth is None:
            findings.append(
                _InternalFinding(
                    "missing-source-of-truth",
                    doc.path,
                    "Canonical document must define source_of_truth.",
                )
            )
            continue
        if source_of_truth.lower() in {"tbd", "todo", "unknown"}:
            findings.append(
                _InternalFinding(
                    "ambiguous-source-of-truth",
                    doc.path,
                    f"Ambiguous source_of_truth value '{source_of_truth}'.",
                    {"source_of_truth": source_of_truth},
                )
            )
    return tuple(findings), len(canonical_docs)


def _gate_cross_link_validity(verify_issues: list[Any]) -> tuple[tuple[_InternalFinding, ...], int]:
    findings: list[_InternalFinding] = []
    checks = {"frontmatter-links", "link-check"}
    for issue in verify_issues:
        if getattr(issue, "check", "") not in checks:
            continue
        findings.append(
            _InternalFinding(
                "critical-link-invalid",
                getattr(issue, "file_path", ""),
                getattr(issue, "message", ""),
            )
        )
    return tuple(findings), len(verify_issues)


def _gate_default_rag_contamination(
    repo_root: Path,
    policy: dict[str, Any],
    rag_allowlist: dict[str, Any],
) -> tuple[tuple[_InternalFinding, ...], int]:
    findings: list[_InternalFinding] = []
    rag_profile_path = (repo_root / Path(policy["inputs"]["rag_profile_file"])).resolve()
    profile_payload = _load_json(rag_profile_path)

    default_profile_name = str(profile_payload.get("default_profile", ""))
    profiles = profile_payload.get("profiles", {})
    default_profile = profiles.get(default_profile_name, {})
    include_globs = [str(item) for item in default_profile.get("include_globs", [])]
    exclude_globs = [str(item) for item in default_profile.get("exclude_globs", [])]

    allow_default_name = str(rag_allowlist.get("default_profile_id", ""))
    allow_profile = rag_allowlist.get("profiles", {}).get(allow_default_name, {})
    allowed_include = {str(item) for item in allow_profile.get("include_globs", [])}
    required_excludes = {str(item) for item in rag_allowlist.get("default_contamination_denies", [])}

    for glob in include_globs:
        if glob not in allowed_include and glob not in set(allow_profile.get("registry_json_allowlist", [])):
            findings.append(
                _InternalFinding(
                    "rag-default-include-not-allowlisted",
                    rag_profile_path.relative_to(repo_root).as_posix(),
                    f"Default include glob is not allowlisted: '{glob}'.",
                    {"glob": glob},
                )
            )

    for denied in sorted(required_excludes):
        if denied not in exclude_globs:
            findings.append(
                _InternalFinding(
                    "rag-default-missing-deny-rule",
                    rag_profile_path.relative_to(repo_root).as_posix(),
                    f"Default profile must exclude '{denied}'.",
                    {"glob": denied},
                )
            )

    checked = len(include_globs) + len(exclude_globs)
    return tuple(findings), checked


def _gate_weak_signal_policy(
    docs: list[_DocRecord],
    mode: str,
    changed_paths: set[str],
    scope: str,
) -> tuple[tuple[_InternalFinding, ...], int]:
    scoped_docs = _scope_docs(docs, mode, changed_paths, scope)
    findings: list[_InternalFinding] = []
    for doc in scoped_docs:
        if doc.class_name == "excluded" and doc.path.startswith("docs/_templates/"):
            continue
        if doc.class_name in {"historical", "excluded"} and doc.lifecycle == "current":
            findings.append(
                _InternalFinding(
                    "weak-signal-current-lifecycle",
                    doc.path,
                    "Historical/excluded documents cannot use kb_lifecycle=current.",
                    {"class": doc.class_name, "kb_lifecycle": doc.lifecycle},
                )
            )
    return tuple(findings), len(scoped_docs)


def _gate_classification_metadata_hygiene(
    docs: list[_DocRecord],
    classification_payload: dict[str, Any],
) -> tuple[tuple[_InternalFinding, ...], int]:
    findings: list[_InternalFinding] = []
    entries = classification_payload.get("entries", [])
    class_map: dict[str, dict[str, Any]] = {}
    for item in entries:
        path = str(item.get("path", "")).replace("\\", "/")
        if path:
            class_map[path] = item

    doc_map = {doc.path: doc for doc in docs}
    checked_items = len(doc_map)
    ambiguous_values = {"todo", "tbd", "unknown", "n/a", "legacy"}

    for path, doc in doc_map.items():
        entry = class_map.get(path)
        if entry is None:
            findings.append(
                _InternalFinding(
                    "classification-missing-entry",
                    path,
                    "Missing docs-corpus-classification entry for existing markdown document.",
                )
            )
            continue

        field_lifecycle = _normalize_text(doc.fields.get("kb_lifecycle"))
        class_lifecycle = _normalize_text(entry.get("lifecycle"))
        if field_lifecycle and class_lifecycle and field_lifecycle.lower() != class_lifecycle.lower():
            findings.append(
                _InternalFinding(
                    "classification-lifecycle-mismatch",
                    path,
                    "Classification lifecycle differs from frontmatter kb_lifecycle.",
                    {
                        "frontmatter_kb_lifecycle": field_lifecycle.lower(),
                        "classification_lifecycle": class_lifecycle.lower(),
                    },
                )
            )

        source_of_truth = _normalize_text(doc.fields.get("source_of_truth"))
        source_status = _normalize_text(entry.get("source_of_truth_status"))
        weak_reason = _normalize_text(entry.get("weak_signal_reason"))
        entry_action = _normalize_text(entry.get("action"))
        owner_value = _normalize_text(doc.fields.get("owner"))

        if source_status and source_status.lower() == "missing" and source_of_truth and source_of_truth.lower() not in ambiguous_values:
            findings.append(
                _InternalFinding(
                    "classification-stale-missing-sot-marker",
                    path,
                    "source_of_truth_status=missing is stale: frontmatter source_of_truth is already defined.",
                    {
                        "source_of_truth": source_of_truth,
                        "classification_source_of_truth_status": source_status,
                    },
                )
            )

        if weak_reason and weak_reason.lower() == "missing-source-of-truth" and source_of_truth and source_of_truth.lower() not in ambiguous_values:
            findings.append(
                _InternalFinding(
                    "classification-stale-weak-signal-marker",
                    path,
                    "weak_signal_reason=missing-source-of-truth is stale for document with defined source_of_truth.",
                    {
                        "source_of_truth": source_of_truth,
                        "weak_signal_reason": weak_reason,
                    },
                )
            )

        if entry_action and entry_action.lower() == "assign-owner" and owner_value:
            findings.append(
                _InternalFinding(
                    "classification-stale-owner-gap-marker",
                    path,
                    "action=assign-owner is stale: owner is already defined in frontmatter.",
                    {"owner": owner_value},
                )
            )

        if doc.class_name == "canonical":
            expected_status = "missing"
            if source_of_truth:
                if source_of_truth.lower() == "self":
                    expected_status = "canonical-self"
                elif source_of_truth.startswith("docs/"):
                    expected_status = "canonical-derived"
            if source_status and source_status.lower() != expected_status:
                findings.append(
                    _InternalFinding(
                        "classification-canonical-sot-status-mismatch",
                        path,
                        "Canonical classification source_of_truth_status does not match frontmatter source_of_truth semantics.",
                        {
                            "frontmatter_source_of_truth": source_of_truth,
                            "expected_source_of_truth_status": expected_status,
                            "classification_source_of_truth_status": source_status,
                        },
                    )
                )

        normalized_path = path.replace("\\", "/")
        if (
            "/_templates/" in f"/{normalized_path}/"
            or fnmatch(normalized_path, "docs/**/ai-session-*.md")
        ) and _normalize_text(entry.get("class")).lower() != "excluded":
            findings.append(
                _InternalFinding(
                    "classification-path-class-mismatch",
                    path,
                    "Template/transcript path must be class=excluded.",
                    {"classification_class": _normalize_text(entry.get("class")).lower()},
                )
            )

        if (
            "/notes/" in f"/{normalized_path}/"
            or "/tasks/done/" in f"/{normalized_path}/"
            or "/specs/legacy-" in f"/{normalized_path}/"
        ) and _normalize_text(entry.get("class")).lower() != "historical":
            findings.append(
                _InternalFinding(
                    "classification-path-class-mismatch",
                    path,
                    "Historical path must be class=historical.",
                    {"classification_class": _normalize_text(entry.get("class")).lower()},
                )
            )

    for path in sorted(class_map.keys()):
        if path in doc_map:
            continue
        findings.append(
            _InternalFinding(
                "classification-orphan-entry",
                path,
                "Classification entry path is missing in markdown corpus.",
            )
        )

    return tuple(findings), checked_items


def _gate_duplicate_overlap(docs: list[_DocRecord]) -> tuple[tuple[_InternalFinding, ...], int]:
    findings: list[_InternalFinding] = []
    title_map: dict[str, list[str]] = {}
    scoped = [doc for doc in docs if doc.class_name in {"canonical", "supporting"}]
    for doc in scoped:
        title = _normalize_text(doc.fields.get("title"))
        if title is None:
            continue
        normalized = title.strip().lower()
        if normalized == "index":
            continue
        title_map.setdefault(normalized, []).append(doc.path)

    for normalized_title, paths in title_map.items():
        if len(paths) < 2:
            continue
        findings.append(
            _InternalFinding(
                "possible-overlap-by-title",
                paths[0],
                f"Potential overlap: identical title '{normalized_title}' appears in multiple docs.",
                {"paths": sorted(paths)},
            )
        )
    return tuple(findings), len(scoped)


def _gate_canonical_coverage(
    docs: list[_DocRecord],
    canonical_inventory: dict[str, Any],
) -> tuple[tuple[_InternalFinding, ...], int]:
    id_set = {doc.id_value for doc in docs if doc.id_value is not None}
    findings: list[_InternalFinding] = []
    domains = canonical_inventory.get("mandatory_canonical_domains", [])
    for domain in domains:
        domain_id = str(domain.get("domain_id", "unknown-domain"))
        required_ids = {str(item) for item in domain.get("required_doc_ids", [])}
        missing = sorted(required_ids - id_set)
        if not missing:
            continue
        findings.append(
            _InternalFinding(
                "canonical-domain-missing-docs",
                domain_id,
                f"Canonical domain '{domain_id}' is missing required doc IDs.",
                {"missing_doc_ids": missing},
            )
        )
    return tuple(findings), len(domains)
