from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import date
from fnmatch import fnmatch
from pathlib import Path
from typing import Any

from tools.automation.infrastructure.filesystem import list_markdown_files, read_text
from tools.automation.infrastructure.markdown import parse_frontmatter


DEFAULT_POLICY_FILE = Path("config/docs-rag-metadata-policy.json")


@dataclass(frozen=True)
class RagGateFinding:
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
class RagGateResult:
    gate_id: str
    name: str
    scope: str
    severity: str
    checked_items: int
    findings: tuple[RagGateFinding, ...]

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
            "scope": self.scope,
            "severity": self.severity,
            "status": self.status,
            "checked_items": self.checked_items,
            "findings_count": len(self.findings),
            "findings": [item.to_dict() for item in self.findings],
        }


@dataclass(frozen=True)
class RagGovernanceReport:
    mode: str
    generated_at: str
    gates: tuple[RagGateResult, ...]
    sections: dict[str, Any]

    @property
    def report_kind(self) -> str:
        return "rag-governance"

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
    def status(self) -> str:
        if self.blocking_failures > 0:
            return "fail"
        if self.warning_failures > 0:
            return "pass-with-warnings"
        return "pass"

    @property
    def is_success(self) -> bool:
        return self.status != "fail"

    def to_dict(self) -> dict[str, Any]:
        return {
            "version": "2.0",
            "mode": self.mode,
            "generated_at": self.generated_at,
            "status": self.status,
            "summary": {
                "total_gates": len(self.gates),
                "blocking_failures": self.blocking_failures,
                "warning_failures": self.warning_failures,
                "informational_findings": self.informational_findings,
            },
            "gates": [item.to_dict() for item in self.gates],
            "sections": self.sections,
        }


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
    category: str
    frontmatter: dict[str, str]
    classification: dict[str, Any]
    resolved: dict[str, str]
    default_profile_match: bool
    historical_profile_match: bool


def run_rag_governance_check(
    root: Path,
    mode: str,
    changed_files_file: Path | None = None,
    policy_file: Path | None = None,
    report_file: Path | None = None,
    markdown_file: Path | None = None,
) -> RagGovernanceReport:
    repo_root = root.resolve()
    policy_path = (repo_root / (policy_file or DEFAULT_POLICY_FILE)).resolve()
    policy = _load_json(policy_path)

    classification_payload = _load_optional_json((repo_root / Path(policy["inputs"]["classification_file"])).resolve())
    field_requirements = _load_json((repo_root / Path(policy["inputs"]["field_requirements_file"])).resolve())
    eligibility_rules = _load_json((repo_root / Path(policy["inputs"]["index_eligibility_rules_file"])).resolve())
    default_profile = _load_json((repo_root / Path(policy["inputs"]["default_profile_file"])).resolve())
    historical_profile = _load_json((repo_root / Path(policy["inputs"]["historical_profile_file"])).resolve())

    changed_paths = _load_changed_paths(repo_root, changed_files_file)
    docs = _collect_docs(
        repo_root=repo_root,
        classification_payload=classification_payload,
        field_requirements=field_requirements,
        eligibility_rules=eligibility_rules,
        default_profile=default_profile,
        historical_profile=historical_profile,
    )

    gates: list[RagGateResult] = []
    for gate_cfg in policy["gates"]:
        gate_id = str(gate_cfg["gate_id"])
        gate_name = str(gate_cfg["name"])
        gate_scope = str(gate_cfg.get("scope", "global"))
        gate_severity = str(gate_cfg["severity_by_mode"][mode])

        if gate_id == "metadata-completeness":
            findings, checked = _gate_metadata_completeness(
                docs=docs,
                mode=mode,
                changed_paths=changed_paths,
                scope=gate_scope,
                field_requirements=field_requirements,
                eligibility_rules=eligibility_rules,
            )
        elif gate_id == "lifecycle-eligibility":
            findings, checked = _gate_lifecycle_eligibility(docs=docs)
        elif gate_id == "source-of-truth-clarity":
            findings, checked = _gate_source_of_truth_clarity(
                docs=docs,
                mode=mode,
                changed_paths=changed_paths,
                scope=gate_scope,
                policy=policy,
            )
        elif gate_id == "default-profile-contamination":
            findings, checked = _gate_default_profile_contamination(docs=docs)
        elif gate_id == "historical-profile-eligibility":
            findings, checked = _gate_historical_profile_eligibility(
                docs=docs,
                field_requirements=field_requirements,
                eligibility_rules=eligibility_rules,
            )
        elif gate_id == "excluded-doc-leak":
            findings, checked = _gate_excluded_doc_leak(docs=docs)
        elif gate_id == "weak-signal-exclusion":
            findings, checked = _gate_weak_signal_exclusion(docs=docs, policy=policy)
        elif gate_id == "profile-separation":
            findings, checked = _gate_profile_separation(docs=docs)
        elif gate_id == "retrieval-readiness":
            findings, checked = _gate_retrieval_readiness(docs=docs)
        elif gate_id == "report-generation":
            findings, checked = _gate_report_generation(report_file=report_file, markdown_file=markdown_file)
        else:
            findings, checked = (), 0

        gates.append(
            RagGateResult(
                gate_id=gate_id,
                name=gate_name,
                scope=gate_scope,
                severity=gate_severity,
                checked_items=checked,
                findings=tuple(
                    RagGateFinding(
                        code=item.code,
                        path=item.path,
                        message=item.message,
                        severity=gate_severity,
                        evidence=item.evidence,
                    )
                    for item in findings
                ),
            )
        )

    sections = _build_report_sections(docs=docs, gates=tuple(gates))
    report = RagGovernanceReport(
        mode=mode,
        generated_at=date.today().isoformat(),
        gates=tuple(gates),
        sections=sections,
    )

    if report_file is not None:
        json_target = report_file if report_file.is_absolute() else (repo_root / report_file).resolve()
        json_target.parent.mkdir(parents=True, exist_ok=True)
        json_target.write_text(json.dumps(report.to_dict(), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    if markdown_file is not None:
        template_path = (repo_root / "templates" / "rag-consistency-report.md").resolve()
        if template_path.exists():
            rendered = _render_markdown_report(template_path.read_text(encoding="utf-8"), report)
            md_target = markdown_file if markdown_file.is_absolute() else (repo_root / markdown_file).resolve()
            md_target.parent.mkdir(parents=True, exist_ok=True)
            md_target.write_text(rendered, encoding="utf-8")

    return report


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
    file_path = changed_files_file if changed_files_file.is_absolute() else (repo_root / changed_files_file).resolve()
    if not file_path.exists():
        return set()
    return {
        line.strip().replace("\\", "/")
        for line in file_path.read_text(encoding="utf-8").splitlines()
        if line.strip()
    }


def _resolve_docs_root(repo_root: Path) -> Path:
    primary = (repo_root / "docs").resolve()
    if primary.exists():
        return primary
    return (repo_root / "docs" / "obsidian").resolve()


def _collect_docs(
    repo_root: Path,
    classification_payload: dict[str, Any],
    field_requirements: dict[str, Any],
    eligibility_rules: dict[str, Any],
    default_profile: dict[str, Any],
    historical_profile: dict[str, Any],
) -> list[_DocRecord]:
    docs_root = _resolve_docs_root(repo_root)
    class_map: dict[str, dict[str, Any]] = {}
    for item in classification_payload.get("entries", []):
        path = str(item.get("path", "")).replace("\\", "/")
        if not path:
            continue
        class_map[path] = item

    docs: list[_DocRecord] = []
    for markdown in list_markdown_files(docs_root):
        rel = markdown.relative_to(repo_root).as_posix()
        parsed = parse_frontmatter(read_text(markdown))
        fields = parsed.fields if parsed.has_frontmatter and parsed.is_valid else {}
        class_entry = class_map.get(rel, {})
        class_name = _resolve_class_name(rel, class_entry)
        resolved = _resolve_metadata(rel, fields, class_entry, class_name, field_requirements)
        category = _categorize_doc(rel, class_name, resolved, eligibility_rules)
        default_match = _matches_profile(rel, default_profile)
        historical_match = _matches_profile(rel, historical_profile)

        docs.append(
            _DocRecord(
                path=rel,
                class_name=class_name,
                category=category,
                frontmatter=fields,
                classification=class_entry,
                resolved=resolved,
                default_profile_match=default_match,
                historical_profile_match=historical_match,
            )
        )
    return docs


def _resolve_class_name(path: str, class_entry: dict[str, Any]) -> str:
    normalized = path.replace("\\", "/")
    if "/_templates/" in f"/{normalized}/" or fnmatch(normalized, "docs/**/ai-session-*.md"):
        return "excluded"
    explicit = _normalize_text(class_entry.get("class"))
    if explicit:
        return explicit.lower()
    if "/notes/" in f"/{normalized}/" or "/tasks/done/" in f"/{normalized}/":
        return "historical"
    if "/specs/legacy-" in f"/{normalized}/" or "/roadmap/" in f"/{normalized}/":
        return "historical"
    if fnmatch(normalized, "docs/specs/*.md"):
        return "canonical"
    if fnmatch(normalized, "docs/decisions/*.md"):
        return "canonical"
    if fnmatch(normalized, "docs/runbooks/*.md"):
        return "canonical"
    if fnmatch(normalized, "docs/concepts/CONCEPT-*.md"):
        return "canonical"
    value = _normalize_text(class_entry.get("class"))
    if value:
        return value
    return "supporting"


def _resolve_metadata(
    path: str,
    fields: dict[str, str],
    class_entry: dict[str, Any],
    class_name: str,
    field_requirements: dict[str, Any],
) -> dict[str, str]:
    resolved: dict[str, str] = {}
    for key in (
        "id",
        "uuid",
        "title",
        "kb_lifecycle",
        "owner",
        "source_of_truth",
        "source_of_truth_status",
        "document_role",
        "rag_status",
        "status",
        "updated",
        "derived_from_uuid",
        "aliases",
        "domain",
        "type",
    ):
        direct = _normalize_text(fields.get(key))
        classification = _normalize_text(class_entry.get(key))
        resolved[key] = direct or classification

    type_value = resolved.get("type") or _normalize_text(fields.get("type"))
    if not resolved["document_role"]:
        mapping = field_requirements.get("derived_metadata_rules", {}).get("document_role_by_type", {})
        resolved["document_role"] = _normalize_text(mapping.get(type_value, ""))
    id_value = resolved.get("id", "")
    if id_value.endswith("-INDEX"):
        resolved["document_role"] = "index"

    if not resolved["rag_status"]:
        mapping = field_requirements.get("derived_metadata_rules", {}).get("rag_status_by_class_default", {})
        resolved["rag_status"] = _normalize_text(mapping.get(class_name, "excluded"))

    normalized_path = path.replace("\\", "/")
    if class_name == "historical" and resolved["rag_status"] == "optional":
        resolved["rag_status"] = "historical-opt-in"
    if "/tasks/" in f"/{normalized_path}/" and "/tasks/done/" not in f"/{normalized_path}/":
        resolved["rag_status"] = "excluded"

    resolved["source_of_truth_status"] = _resolve_source_of_truth_status(
        source_of_truth_status_value=resolved["source_of_truth_status"],
        source_of_truth_value=resolved["source_of_truth"],
        class_name=class_name,
        field_requirements=field_requirements,
    )

    if not resolved["domain"]:
        path_parts = path.split("/")
        resolved["domain"] = path_parts[1] if len(path_parts) > 1 else "docs"

    resolved["kb_lifecycle"] = resolved["kb_lifecycle"].lower()
    resolved["status"] = resolved["status"].lower()
    resolved["rag_status"] = resolved["rag_status"].lower()
    resolved["source_of_truth_status"] = resolved["source_of_truth_status"].lower()
    resolved["document_role"] = resolved["document_role"].lower()
    return resolved


def _resolve_source_of_truth_status(
    source_of_truth_status_value: str,
    source_of_truth_value: str,
    class_name: str,
    field_requirements: dict[str, Any],
) -> str:
    if source_of_truth_status_value:
        normalized = source_of_truth_status_value.lower()
        if normalized in {"explicit", "declared", "primary"}:
            if source_of_truth_value and source_of_truth_value.lower() == "self":
                return "canonical-self"
            if source_of_truth_value and source_of_truth_value.startswith("docs/"):
                return "canonical-derived"
        if class_name == "historical" and normalized in {"supporting", "supporting-non-canonical"}:
            return "historical-pointer"
        if normalized == "supporting":
            return "supporting-non-canonical"
        if normalized != "missing":
            return source_of_truth_status_value
    rules = field_requirements.get("derived_metadata_rules", {}).get("source_of_truth_status_derivation", {})
    if source_of_truth_value:
        if source_of_truth_value.lower() == "self":
            return str(rules.get("self_value", "canonical-self"))
        if source_of_truth_value.startswith("docs/"):
            return str(rules.get("path_reference_value", "canonical-derived"))
    if class_name == "supporting":
        return str(rules.get("supporting_default", "supporting-non-canonical"))
    if class_name == "historical":
        return str(rules.get("historical_default", "historical-pointer"))
    if class_name == "excluded":
        return str(rules.get("excluded_default", "excluded"))
    return str(rules.get("empty_value", "missing"))


def _categorize_doc(path: str, class_name: str, resolved: dict[str, str], eligibility_rules: dict[str, Any]) -> str:
    categories = eligibility_rules.get("categories", {})
    for category in eligibility_rules.get("category_order", []):
        category_rules = categories.get(category, {})
        criteria = category_rules.get("eligibility_criteria", {})
        if not _matches_criteria(path, class_name, resolved, criteria):
            continue
        return category
    return "excluded-from-index"


def _matches_criteria(path: str, class_name: str, resolved: dict[str, str], criteria: dict[str, Any]) -> bool:
    include_globs = [str(item) for item in criteria.get("include_globs", [])]
    exclude_globs = [str(item) for item in criteria.get("exclude_globs", [])]
    if include_globs and not any(fnmatch(path, glob) for glob in include_globs):
        return False
    if exclude_globs and any(fnmatch(path, glob) for glob in exclude_globs):
        return False

    checks: list[tuple[str, str]] = [
        ("allowed_classes", class_name),
        ("allowed_lifecycle_values", resolved.get("kb_lifecycle", "")),
        ("allowed_rag_status_values", resolved.get("rag_status", "")),
        ("allowed_document_roles", resolved.get("document_role", "")),
        ("allowed_source_of_truth_status", resolved.get("source_of_truth_status", "")),
    ]
    for key, value in checks:
        allowed = [str(item).lower() for item in criteria.get(key, [])]
        if allowed and value.lower() not in allowed:
            return False
    return True


def _matches_profile(path: str, profile: dict[str, Any]) -> bool:
    include_globs = [str(item) for item in profile.get("include_globs", [])]
    exclude_globs = [str(item) for item in profile.get("exclude_globs", [])]
    if include_globs and not any(fnmatch(path, glob) for glob in include_globs):
        return False
    if exclude_globs and any(fnmatch(path, glob) for glob in exclude_globs):
        return False
    return True


def _scope_docs(docs: list[_DocRecord], mode: str, changed_paths: set[str], scope: str) -> list[_DocRecord]:
    if mode != "pr" or not changed_paths:
        return docs
    if scope in {"changed-indexable-or-full", "changed-or-full"}:
        subset = [doc for doc in docs if doc.path in changed_paths]
        if subset:
            return subset
    return docs


def _gate_metadata_completeness(
    docs: list[_DocRecord],
    mode: str,
    changed_paths: set[str],
    scope: str,
    field_requirements: dict[str, Any],
    eligibility_rules: dict[str, Any],
) -> tuple[tuple[_InternalFinding, ...], int]:
    scoped_docs = _scope_docs(docs, mode, changed_paths, scope)
    categories = eligibility_rules.get("categories", {})
    findings: list[_InternalFinding] = []
    checked = 0

    for doc in scoped_docs:
        if doc.category not in {"default-indexable", "optional-indexable", "historical-opt-in-only"}:
            continue
        checked += 1
        contract_name = str(categories.get(doc.category, {}).get("required_metadata_contract", ""))
        contract = field_requirements.get("contracts", {}).get(contract_name, {})
        mandatory = [str(item) for item in contract.get("mandatory_fields", [])]
        blocking = {str(item) for item in contract.get("blocking_missing_fields", [])}
        warning = {str(item) for item in contract.get("warning_missing_fields", [])}

        missing = [field for field in mandatory if not _normalize_text(doc.resolved.get(field))]
        for field in missing:
            level = "blocking" if field in blocking else "warning"
            if field in warning:
                level = "warning"
            findings.append(
                _InternalFinding(
                    code=f"rag-metadata-missing-{level}",
                    path=doc.path,
                    message=f"Missing metadata field '{field}' for contract '{contract_name}'.",
                    evidence={"category": doc.category, "contract": contract_name, "field": field},
                )
            )
    return tuple(findings), checked


def _gate_lifecycle_eligibility(docs: list[_DocRecord]) -> tuple[tuple[_InternalFinding, ...], int]:
    findings: list[_InternalFinding] = []
    for doc in docs:
        lifecycle = doc.resolved.get("kb_lifecycle", "")
        if doc.category in {"default-indexable", "optional-indexable"} and lifecycle != "current":
            findings.append(
                _InternalFinding(
                    code="rag-lifecycle-not-current",
                    path=doc.path,
                    message=f"Category '{doc.category}' requires kb_lifecycle=current.",
                    evidence={"category": doc.category, "kb_lifecycle": lifecycle},
                )
            )
        if doc.category == "historical-opt-in-only" and lifecycle not in {"legacy", "archive"}:
            findings.append(
                _InternalFinding(
                    code="rag-historical-lifecycle-invalid",
                    path=doc.path,
                    message="Historical opt-in document must have kb_lifecycle legacy/archive.",
                    evidence={"kb_lifecycle": lifecycle},
                )
            )
    return tuple(findings), len(docs)


def _gate_source_of_truth_clarity(
    docs: list[_DocRecord],
    mode: str,
    changed_paths: set[str],
    scope: str,
    policy: dict[str, Any],
) -> tuple[tuple[_InternalFinding, ...], int]:
    scoped_docs = _scope_docs(docs, mode, changed_paths, scope)
    ambiguous_values = {str(item).lower() for item in policy["metadata_gating"]["ambiguous_source_of_truth_values"]}
    findings: list[_InternalFinding] = []
    checked = 0

    for doc in scoped_docs:
        if doc.category not in {"default-indexable", "optional-indexable"}:
            continue
        checked += 1
        sot = _normalize_text(doc.resolved.get("source_of_truth"))
        status = _normalize_text(doc.resolved.get("source_of_truth_status")).lower()
        if status in {"missing", ""}:
            findings.append(
                _InternalFinding(
                    code="rag-source-of-truth-missing",
                    path=doc.path,
                    message="Indexable document has missing source_of_truth_status.",
                )
            )
            continue
        if sot.lower() in ambiguous_values:
            findings.append(
                _InternalFinding(
                    code="rag-source-of-truth-ambiguous",
                    path=doc.path,
                    message=f"Ambiguous source_of_truth value '{sot}'.",
                    evidence={"source_of_truth": sot},
                )
            )
            continue
        if not sot and doc.category == "default-indexable":
            findings.append(
                _InternalFinding(
                    code="rag-source-of-truth-empty-default",
                    path=doc.path,
                    message="Default-indexable document must define source_of_truth.",
                )
            )
            continue
        if sot and sot != "self" and sot.startswith("docs/"):
            if not Path(sot).exists():
                findings.append(
                    _InternalFinding(
                        code="rag-source-of-truth-target-missing",
                        path=doc.path,
                        message=f"source_of_truth target does not exist: '{sot}'.",
                        evidence={"source_of_truth": sot},
                    )
                )
    return tuple(findings), checked


def _gate_default_profile_contamination(docs: list[_DocRecord]) -> tuple[tuple[_InternalFinding, ...], int]:
    findings: list[_InternalFinding] = []
    checked = 0
    for doc in docs:
        if not doc.default_profile_match:
            continue
        checked += 1
        if doc.category != "default-indexable":
            findings.append(
                _InternalFinding(
                    code="rag-default-profile-contamination",
                    path=doc.path,
                    message=f"Document category '{doc.category}' leaked into default profile.",
                    evidence={"category": doc.category},
                )
            )
            continue
        if doc.resolved.get("kb_lifecycle") != "current":
            findings.append(
                _InternalFinding(
                    code="rag-default-profile-lifecycle-invalid",
                    path=doc.path,
                    message="Default profile document must have kb_lifecycle=current.",
                    evidence={"kb_lifecycle": doc.resolved.get("kb_lifecycle", "")},
                )
            )
    return tuple(findings), checked


def _gate_historical_profile_eligibility(
    docs: list[_DocRecord],
    field_requirements: dict[str, Any],
    eligibility_rules: dict[str, Any],
) -> tuple[tuple[_InternalFinding, ...], int]:
    findings: list[_InternalFinding] = []
    checked = 0
    categories = eligibility_rules.get("categories", {})
    contract_name = str(categories.get("historical-opt-in-only", {}).get("required_metadata_contract", "historical-opt-in-docs"))
    contract = field_requirements.get("contracts", {}).get(contract_name, {})
    mandatory = [str(item) for item in contract.get("mandatory_fields", [])]

    for doc in docs:
        if not doc.historical_profile_match:
            continue
        checked += 1
        if doc.category != "historical-opt-in-only":
            findings.append(
                _InternalFinding(
                    code="rag-historical-profile-contamination",
                    path=doc.path,
                    message=f"Document category '{doc.category}' is not eligible for historical profile.",
                    evidence={"category": doc.category},
                )
            )
            continue
        missing = [field for field in mandatory if not _normalize_text(doc.resolved.get(field))]
        for field in missing:
            findings.append(
                _InternalFinding(
                    code="rag-historical-metadata-missing",
                    path=doc.path,
                    message=f"Historical profile document missing field '{field}'.",
                    evidence={"field": field, "contract": contract_name},
                )
            )
    return tuple(findings), checked


def _gate_excluded_doc_leak(docs: list[_DocRecord]) -> tuple[tuple[_InternalFinding, ...], int]:
    findings: list[_InternalFinding] = []
    checked = 0
    for doc in docs:
        if doc.category != "excluded-from-index":
            continue
        checked += 1
        if doc.default_profile_match or doc.historical_profile_match:
            findings.append(
                _InternalFinding(
                    code="rag-excluded-doc-leak",
                    path=doc.path,
                    message="Excluded document leaked into retrieval profile.",
                    evidence={
                        "default_profile_match": doc.default_profile_match,
                        "historical_profile_match": doc.historical_profile_match,
                    },
                )
            )
    return tuple(findings), checked


def _gate_weak_signal_exclusion(
    docs: list[_DocRecord],
    policy: dict[str, Any],
) -> tuple[tuple[_InternalFinding, ...], int]:
    findings: list[_InternalFinding] = []
    checked = 0
    deny_reasons = {str(item).lower() for item in policy.get("metadata_gating", {}).get("weak_signal_blocking_reasons", [])}
    for doc in docs:
        if not doc.default_profile_match:
            continue
        checked += 1
        reason = _normalize_text(doc.classification.get("weak_signal_reason")).lower()
        if not reason:
            continue
        if reason == "missing-source-of-truth" and doc.resolved.get("source_of_truth_status", "") not in {"missing", ""}:
            continue
        if deny_reasons and reason not in deny_reasons:
            continue
        findings.append(
            _InternalFinding(
                code="rag-weak-signal-in-default",
                path=doc.path,
                message="Default profile contains document marked with weak_signal_reason.",
                evidence={"weak_signal_reason": reason},
            )
        )
    return tuple(findings), checked


def _gate_profile_separation(docs: list[_DocRecord]) -> tuple[tuple[_InternalFinding, ...], int]:
    findings: list[_InternalFinding] = []
    overlap = [doc for doc in docs if doc.default_profile_match and doc.historical_profile_match]
    for doc in overlap:
        findings.append(
            _InternalFinding(
                code="rag-profile-overlap",
                path=doc.path,
                message="Document is included in both default and historical profiles.",
            )
        )
    return tuple(findings), len(overlap)


def _gate_retrieval_readiness(docs: list[_DocRecord]) -> tuple[tuple[_InternalFinding, ...], int]:
    findings: list[_InternalFinding] = []
    checked = 0
    for doc in docs:
        if doc.resolved.get("kb_lifecycle") != "current":
            continue
        rag_status = doc.resolved.get("rag_status", "")
        if rag_status not in {"default-include", "optional"}:
            continue
        checked += 1
        if doc.category not in {"default-indexable", "optional-indexable"}:
            findings.append(
                _InternalFinding(
                    code="rag-current-doc-ineligible",
                    path=doc.path,
                    message="Current retrieval-intended document is not eligible by policy.",
                    evidence={"category": doc.category, "rag_status": rag_status},
                )
            )
    return tuple(findings), checked


def _gate_report_generation(
    report_file: Path | None,
    markdown_file: Path | None,
) -> tuple[tuple[_InternalFinding, ...], int]:
    findings: list[_InternalFinding] = []
    if report_file is None:
        findings.append(
            _InternalFinding(
                code="rag-report-json-missing",
                path="dist/docs-governance",
                message="Missing JSON report output path.",
            )
        )
    if markdown_file is None:
        findings.append(
            _InternalFinding(
                code="rag-report-markdown-missing",
                path="dist/docs-governance",
                message="Missing markdown report output path.",
            )
            )
    return tuple(findings), 1


def _build_report_sections(docs: list[_DocRecord], gates: tuple[RagGateResult, ...]) -> dict[str, Any]:
    gate_map = {gate.gate_id: gate for gate in gates}
    default_candidates = [doc for doc in docs if doc.default_profile_match]
    default_eligible = [doc for doc in default_candidates if doc.category == "default-indexable"]
    historical_candidates = [doc for doc in docs if doc.historical_profile_match]
    historical_eligible = [doc for doc in historical_candidates if doc.category == "historical-opt-in-only"]

    metadata_gate = gate_map.get("metadata-completeness")
    lifecycle_gate = gate_map.get("lifecycle-eligibility")
    sot_gate = gate_map.get("source-of-truth-clarity")
    contamination_gate = gate_map.get("default-profile-contamination")
    excluded_gate = gate_map.get("excluded-doc-leak")
    weak_signal_gate = gate_map.get("weak-signal-exclusion")
    readiness_gate = gate_map.get("retrieval-readiness")

    return {
        "default_profile_eligibility_summary": {
            "default_candidates_count": len(default_candidates),
            "default_eligible_count": len(default_eligible),
            "default_ineligible_count": len(default_candidates) - len(default_eligible),
        },
        "missing_required_metadata_summary": {
            "findings_count": 0 if metadata_gate is None else len(metadata_gate.findings),
            "findings": [] if metadata_gate is None else [item.to_dict() for item in metadata_gate.findings],
        },
        "ineligible_current_docs_summary": {
            "findings_count": 0 if readiness_gate is None else len(readiness_gate.findings),
            "findings": [] if readiness_gate is None else [item.to_dict() for item in readiness_gate.findings],
        },
        "historical_profile_candidate_summary": {
            "historical_candidates_count": len(historical_candidates),
            "historical_eligible_count": len(historical_eligible),
            "historical_ineligible_count": len(historical_candidates) - len(historical_eligible),
        },
        "excluded_doc_leakage_summary": {
            "findings_count": 0 if excluded_gate is None else len(excluded_gate.findings),
            "findings": [] if excluded_gate is None else [item.to_dict() for item in excluded_gate.findings],
        },
        "contamination_summary": {
            "findings_count": 0 if contamination_gate is None else len(contamination_gate.findings),
            "findings": [] if contamination_gate is None else [item.to_dict() for item in contamination_gate.findings],
        },
        "source_of_truth_ambiguity_summary": {
            "findings_count": 0 if sot_gate is None else len(sot_gate.findings),
            "findings": [] if sot_gate is None else [item.to_dict() for item in sot_gate.findings],
        },
        "lifecycle_mismatch_summary": {
            "findings_count": 0 if lifecycle_gate is None else len(lifecycle_gate.findings),
            "findings": [] if lifecycle_gate is None else [item.to_dict() for item in lifecycle_gate.findings],
        },
        "weak_signal_contamination_summary": {
            "findings_count": 0 if weak_signal_gate is None else len(weak_signal_gate.findings),
            "findings": [] if weak_signal_gate is None else [item.to_dict() for item in weak_signal_gate.findings],
        },
    }


def _render_markdown_report(template: str, report: RagGovernanceReport) -> str:
    payload = report.to_dict()
    replacements = {
        "{{generated_at}}": payload["generated_at"],
        "{{mode}}": payload["mode"],
        "{{status}}": payload["status"],
        "{{policy_owner}}": "core-fp",
        "{{total_gates}}": str(payload["summary"]["total_gates"]),
        "{{blocking_failures}}": str(payload["summary"]["blocking_failures"]),
        "{{warning_failures}}": str(payload["summary"]["warning_failures"]),
        "{{informational_findings}}": str(payload["summary"]["informational_findings"]),
        "{{default_profile_eligibility_summary}}": _json_block(payload["sections"]["default_profile_eligibility_summary"]),
        "{{missing_required_metadata_summary}}": _json_block(payload["sections"]["missing_required_metadata_summary"]),
        "{{ineligible_current_docs_summary}}": _json_block(payload["sections"]["ineligible_current_docs_summary"]),
        "{{historical_profile_candidate_summary}}": _json_block(payload["sections"]["historical_profile_candidate_summary"]),
        "{{excluded_doc_leakage_summary}}": _json_block(payload["sections"]["excluded_doc_leakage_summary"]),
        "{{contamination_summary}}": _json_block(payload["sections"]["contamination_summary"]),
        "{{source_of_truth_ambiguity_summary}}": _json_block(payload["sections"]["source_of_truth_ambiguity_summary"]),
        "{{lifecycle_mismatch_summary}}": _json_block(payload["sections"]["lifecycle_mismatch_summary"]),
        "{{weak_signal_contamination_summary}}": _json_block(payload["sections"]["weak_signal_contamination_summary"]),
        "{{gate_results}}": _json_block(payload["gates"]),
    }
    rendered = template
    for key, value in replacements.items():
        rendered = rendered.replace(key, value)
    return rendered


def _json_block(value: Any) -> str:
    return "```json\n" + json.dumps(value, ensure_ascii=False, indent=2) + "\n```"


def _normalize_text(value: Any) -> str:
    if value is None:
        return ""
    text = str(value).strip()
    if text.startswith('"') and text.endswith('"'):
        text = text[1:-1].strip()
    if text.startswith("'") and text.endswith("'"):
        text = text[1:-1].strip()
    return text
