from __future__ import annotations

import json
import re
from dataclasses import dataclass
from datetime import date, datetime
from fnmatch import fnmatch
from pathlib import Path
from typing import Any

from tools.automation.application.governance_check import run_governance_check
from tools.automation.application.verify_docs import run_verify_docs
from tools.automation.infrastructure.filesystem import list_markdown_files, read_text
from tools.automation.infrastructure.markdown import parse_frontmatter


DEFAULT_POLICY_FILE = Path("config/docs-release-registry-report-policy.json")
NORMATIVE_ID_PREFIXES: tuple[str, ...] = ("DOC-", "SPEC-", "POL-", "ADR-", "RB-", "CONCEPT-")


@dataclass(frozen=True)
class _DocRecord:
    path: str
    document_id: str
    uuid: str
    owner: str
    backup_owner: str
    source_of_truth: str
    source_of_truth_status: str
    rag_status: str
    kb_lifecycle: str
    status: str
    doc_type: str
    updated: str


@dataclass(frozen=True)
class RegistryConsistencyReport:
    mode: str
    generated_at: str
    status: str
    score: int
    blocking_failures: int
    warning_failures: int
    informational_findings: int
    sections: dict[str, Any]
    blocking_conditions: list[dict[str, Any]]
    warning_conditions: list[dict[str, Any]]

    @property
    def is_success(self) -> bool:
        return self.status != "fail"

    def to_dict(self) -> dict[str, Any]:
        return {
            "version": "1.0",
            "mode": self.mode,
            "generated_at": self.generated_at,
            "status": self.status,
            "score": self.score,
            "summary": {
                "blocking_failures": self.blocking_failures,
                "warning_failures": self.warning_failures,
                "informational_findings": self.informational_findings,
            },
            "sections": self.sections,
            "blocking_conditions": self.blocking_conditions,
            "warning_conditions": self.warning_conditions,
        }


def run_registry_consistency_report(
    root: Path,
    mode: str,
    policy_file: Path | None = None,
    report_file: Path | None = None,
    markdown_file: Path | None = None,
) -> RegistryConsistencyReport:
    repo_root = root.resolve()
    policy_path = (repo_root / (policy_file or DEFAULT_POLICY_FILE)).resolve()
    policy = _load_json(policy_path)

    matrix = _load_json((repo_root / Path(policy["inputs"]["critical_governance_matrix_file"])).resolve())
    owner_policy = _load_json((repo_root / Path(policy["inputs"]["owner_policy_file"])).resolve())
    sot_policy = _load_json((repo_root / Path(policy["inputs"]["source_of_truth_policy_file"])).resolve())

    governance_policy_path = (repo_root / Path(policy["inputs"]["governance_policy_file"])).resolve()
    governance_mode = "main" if mode == "release" else mode
    governance_report = run_governance_check(
        root=repo_root,
        mode=governance_mode,
        policy_file=governance_policy_path,
    )
    verify_report = run_verify_docs(repo_root)
    docs = _collect_docs(repo_root)
    docs_by_id = {doc.document_id: doc for doc in docs if doc.document_id}

    registry_payload = _load_json((repo_root / Path(policy["inputs"]["identifier_registry_file"])).resolve())
    entity_payload = _load_json((repo_root / Path(policy["inputs"]["entity_catalog_file"])).resolve())

    duplicate_ids_summary = _build_duplicate_ids_summary(docs, registry_payload)
    unresolved_links_summary = _build_unresolved_links_summary(verify_report, governance_report.to_dict())
    unresolved_relations_summary = _build_unresolved_relations_summary(entity_payload)
    missing_normative_ids_summary = _build_missing_normative_ids_summary(docs, entity_payload)
    missing_canonical = _build_missing_canonical_domains_summary(matrix, docs_by_id)
    owner_summary = _build_owner_summary(docs, owner_policy, mode)
    source_summary = _build_source_of_truth_summary(docs, sot_policy, matrix)
    lifecycle_summary = _build_lifecycle_summary(verify_report)
    rag_summary = _build_rag_contamination_summary(governance_report.to_dict())
    drift_summary = _build_registry_drift_summary(verify_report)

    sections: dict[str, Any] = {
        "duplicate_ids_summary": duplicate_ids_summary,
        "unresolved_links_summary": unresolved_links_summary,
        "unresolved_relations_summary": unresolved_relations_summary,
        "missing_normative_ids_summary": missing_normative_ids_summary,
        "missing_canonical_docs_for_critical_domains": missing_canonical,
        "missing_owner_on_critical_docs": owner_summary,
        "missing_source_of_truth_on_critical_docs": source_summary["missing"],
        "conflicting_source_of_truth_cases": source_summary["conflicting"],
        "lifecycle_mismatch_summary": lifecycle_summary,
        "rag_contamination_summary": rag_summary,
        "registry_drift_summary": drift_summary,
    }

    metric_values: dict[str, int] = {
        "duplicate_package_ids": int(duplicate_ids_summary["duplicate_package_ids_count"]),
        "duplicate_method_ids": int(duplicate_ids_summary["duplicate_method_ids_count"]),
        "package_rows_with_node_modules": int(duplicate_ids_summary["package_rows_with_node_modules_count"]),
        "duplicate_document_ids": int(duplicate_ids_summary["duplicate_document_ids_count"]),
        "unresolved_relations_count": int(unresolved_relations_summary["unresolved_relations_count"]),
        "unresolved_critical_links_count": int(unresolved_links_summary["unresolved_critical_links_count"]),
        "missing_normative_ids_count": int(missing_normative_ids_summary["missing_normative_ids_count"]),
        "missing_canonical_critical_domains_count": int(missing_canonical["missing_canonical_critical_domains_count"]),
        "missing_owner_critical_docs_count": int(owner_summary["missing_owner_critical_docs_count"]),
        "missing_owner_supporting_roadmap_docs_count": int(owner_summary["missing_owner_supporting_roadmap_docs_count"]),
        "supporting_roadmap_source_of_truth_status_mismatch_count": int(
            owner_summary["supporting_roadmap_source_of_truth_status_mismatch_count"]
        ),
        "supporting_roadmap_rag_status_mismatch_count": int(owner_summary["supporting_roadmap_rag_status_mismatch_count"]),
        "missing_source_of_truth_critical_docs_count": int(source_summary["missing"]["missing_source_of_truth_critical_docs_count"]),
        "conflicting_source_of_truth_count": int(source_summary["conflicting"]["conflicting_source_of_truth_count"]),
        "lifecycle_mismatch_count": int(lifecycle_summary["lifecycle_mismatch_count"]),
        "rag_contamination_count": int(rag_summary["rag_contamination_count"]),
        "registry_drift_count": int(drift_summary["registry_drift_count"]),
        "stale_critical_docs_count": int(owner_summary["stale_critical_docs_count"]),
        "owner_not_in_allowlist_count": int(owner_summary["owner_not_in_allowlist_count"]),
    }

    blocking_conditions = _evaluate_thresholds(
        metric_values=metric_values,
        thresholds={str(k): int(v) for k, v in policy["blocking_thresholds"].items()},
        severity="blocking",
    )
    warning_conditions = _evaluate_thresholds(
        metric_values=metric_values,
        thresholds={str(k): int(v) for k, v in policy["warning_thresholds"].items()},
        severity="warning",
    )

    blocking_failures = len(blocking_conditions)
    warning_failures = len(warning_conditions)
    informational_findings = 0
    if blocking_failures > 0:
        status = "fail"
    elif warning_failures > 0:
        status = "pass-with-warnings"
    else:
        status = "pass"

    score = _compute_score(blocking_failures=blocking_failures, warning_failures=warning_failures)
    report = RegistryConsistencyReport(
        mode=mode,
        generated_at=date.today().isoformat(),
        status=status,
        score=score,
        blocking_failures=blocking_failures,
        warning_failures=warning_failures,
        informational_findings=informational_findings,
        sections=sections,
        blocking_conditions=blocking_conditions,
        warning_conditions=warning_conditions,
    )

    if report_file is not None:
        json_target = report_file if report_file.is_absolute() else (repo_root / report_file).resolve()
        json_target.parent.mkdir(parents=True, exist_ok=True)
        json_target.write_text(json.dumps(report.to_dict(), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    if markdown_file is not None:
        template_path = (repo_root / Path(policy["artifact"]["template_file"])).resolve()
        template = template_path.read_text(encoding="utf-8")
        markdown_payload = _render_markdown_report(template, report)
        markdown_target = markdown_file if markdown_file.is_absolute() else (repo_root / markdown_file).resolve()
        markdown_target.parent.mkdir(parents=True, exist_ok=True)
        markdown_target.write_text(markdown_payload, encoding="utf-8")

    return report


def _load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def _resolve_docs_root(repo_root: Path) -> Path:
    primary = (repo_root / "docs").resolve()
    if primary.exists():
        return primary
    return (repo_root / "docs" / "obsidian").resolve()


def _collect_docs(repo_root: Path) -> list[_DocRecord]:
    docs_root = _resolve_docs_root(repo_root)
    if not docs_root.exists():
        return []
    docs: list[_DocRecord] = []
    for markdown in list_markdown_files(docs_root):
        rel = markdown.relative_to(repo_root).as_posix()
        parsed = parse_frontmatter(read_text(markdown))
        fields = parsed.fields if parsed.has_frontmatter and parsed.is_valid else {}
        docs.append(
            _DocRecord(
                path=rel,
                document_id=_normalize_text(fields.get("id")),
                uuid=_normalize_text(fields.get("uuid")),
                owner=_normalize_text(fields.get("owner")),
                backup_owner=_normalize_text(fields.get("backup_owner")),
                source_of_truth=_normalize_text(fields.get("source_of_truth")),
                source_of_truth_status=_normalize_text(fields.get("source_of_truth_status")).lower(),
                rag_status=_normalize_text(fields.get("rag_status")).lower(),
                kb_lifecycle=_normalize_text(fields.get("kb_lifecycle")).lower(),
                status=_normalize_text(fields.get("status")).lower(),
                doc_type=_normalize_text(fields.get("type")).lower(),
                updated=_normalize_text(fields.get("updated")),
            )
        )
    return docs


def _normalize_text(value: Any) -> str:
    if value is None:
        return ""
    text = str(value).strip()
    if text.startswith('"') and text.endswith('"'):
        text = text[1:-1].strip()
    if text.startswith("'") and text.endswith("'"):
        text = text[1:-1].strip()
    return text


def _build_duplicate_ids_summary(docs: list[_DocRecord], registry_payload: dict[str, Any]) -> dict[str, Any]:
    doc_counts: dict[str, int] = {}
    for doc in docs:
        if not doc.document_id:
            continue
        doc_counts[doc.document_id] = doc_counts.get(doc.document_id, 0) + 1
    duplicate_document_ids = sorted([item for item, count in doc_counts.items() if count > 1])

    packages = registry_payload.get("packages", [])
    methods = registry_payload.get("methods", [])
    package_counts: dict[str, int] = {}
    method_counts: dict[str, int] = {}
    node_modules_rows = 0

    for row in packages:
        if not isinstance(row, dict):
            continue
        package_id = _normalize_text(row.get("package_identifier"))
        if package_id:
            package_counts[package_id] = package_counts.get(package_id, 0) + 1
        package_path = _normalize_text(row.get("package_path")).replace("\\", "/")
        if "/node_modules/" in f"/{package_path}/":
            node_modules_rows += 1

    for row in methods:
        if not isinstance(row, dict):
            continue
        method_id = _normalize_text(row.get("method_identifier"))
        if method_id:
            method_counts[method_id] = method_counts.get(method_id, 0) + 1

    duplicate_package_ids = sorted([item for item, count in package_counts.items() if count > 1])
    duplicate_method_ids = sorted([item for item, count in method_counts.items() if count > 1])

    return {
        "duplicate_document_ids_count": len(duplicate_document_ids),
        "duplicate_document_ids": duplicate_document_ids,
        "duplicate_package_ids_count": len(duplicate_package_ids),
        "duplicate_package_ids": duplicate_package_ids,
        "duplicate_method_ids_count": len(duplicate_method_ids),
        "duplicate_method_ids": duplicate_method_ids,
        "package_rows_with_node_modules_count": node_modules_rows,
    }


def _build_unresolved_links_summary(verify_report: Any, governance_payload: dict[str, Any]) -> dict[str, Any]:
    unresolved_frontmatter_links_count = len([issue for issue in verify_report.issues if issue.check == "frontmatter-links"])
    missing_links_count = len(verify_report.link_report.missing_links) if verify_report.link_report is not None else 0
    critical_gate = _find_gate(governance_payload, "critical-cross-link-validity")
    unresolved_critical_links_count = int(critical_gate.get("findings_count", 0))
    return {
        "missing_links_count": missing_links_count,
        "unresolved_frontmatter_links_count": unresolved_frontmatter_links_count,
        "unresolved_critical_links_count": unresolved_critical_links_count,
    }


def _build_unresolved_relations_summary(entity_payload: dict[str, Any]) -> dict[str, Any]:
    summary = entity_payload.get("summary", {})
    unresolved = int(summary.get("unresolved_relations_count", 0))
    return {
        "unresolved_relations_count": unresolved,
        "relations_count": int(summary.get("relations_count", 0)),
    }


def _build_missing_normative_ids_summary(docs: list[_DocRecord], entity_payload: dict[str, Any]) -> dict[str, Any]:
    normative_ids = {
        doc.document_id
        for doc in docs
        if (
            doc.document_id
            and doc.document_id.startswith(NORMATIVE_ID_PREFIXES)
            and "XXX" not in doc.document_id
            and "/_templates/" not in f"/{doc.path}/"
            and doc.kb_lifecycle == "current"
        )
    }
    entity_documents = entity_payload.get("entities", {}).get("documents", [])
    entity_ids = {
        _normalize_text(item.get("entity_identifier"))
        for item in entity_documents
        if isinstance(item, dict)
    }
    missing = sorted(item for item in normative_ids if item and item not in entity_ids)
    return {
        "missing_normative_ids_count": len(missing),
        "missing_normative_ids": missing,
    }


def _build_missing_canonical_domains_summary(matrix: dict[str, Any], docs_by_id: dict[str, _DocRecord]) -> dict[str, Any]:
    missing_domains: list[dict[str, Any]] = []
    approved_exceptions: list[dict[str, Any]] = []
    for domain in matrix.get("critical_domains", []):
        domain_name = str(domain.get("domain", "unknown"))
        canonical_documents = domain.get("canonical_documents", [])
        exception = domain.get("exception", {})
        has_approved_exception = isinstance(exception, dict) and bool(exception.get("approved"))
        if not canonical_documents:
            payload = {
                "domain": domain_name,
                "missing_doc_ids": [],
                "reason": "No canonical document declared for critical domain.",
            }
            if has_approved_exception:
                payload["exception"] = exception
                approved_exceptions.append(payload)
            else:
                missing_domains.append(payload)
            continue
        missing_ids: list[str] = []
        for item in canonical_documents:
            if not isinstance(item, dict):
                continue
            doc_id = _normalize_text(item.get("id"))
            if doc_id and doc_id not in docs_by_id:
                missing_ids.append(doc_id)
        if missing_ids:
            payload = {
                "domain": domain_name,
                "missing_doc_ids": sorted(missing_ids),
                "reason": "Declared canonical document ID not found in docs corpus.",
            }
            if has_approved_exception:
                payload["exception"] = exception
                approved_exceptions.append(payload)
            else:
                missing_domains.append(payload)
    return {
        "missing_canonical_critical_domains_count": len(missing_domains),
        "missing_domains": missing_domains,
        "approved_exceptions_count": len(approved_exceptions),
        "approved_exceptions": approved_exceptions,
    }


def _build_owner_summary(docs: list[_DocRecord], owner_policy: dict[str, Any], mode: str) -> dict[str, Any]:
    scope = owner_policy["required_scope"]
    required_paths = [str(item) for item in scope["required_path_globs"]]
    excluded_paths = [str(item) for item in scope["excluded_path_globs"]]
    required_ids = {str(item) for item in scope["required_document_ids"]}
    allowed_owners = {str(item) for item in owner_policy.get("allowed_owner_values", [])}
    owner_regex = re.compile(str(owner_policy["metadata_contract"]["owner_format_regex"]))

    critical_docs = [
        doc
        for doc in docs
        if (
            doc.document_id in required_ids
            or (_matches_any(doc.path, required_paths) and not _matches_any(doc.path, excluded_paths))
        )
    ]

    missing_owner: list[str] = []
    invalid_owner_format: list[dict[str, str]] = []
    owner_not_in_allowlist: list[dict[str, str]] = []

    for doc in critical_docs:
        owner_value = _normalize_text(doc.owner)
        if not owner_value:
            missing_owner.append(doc.path)
            continue
        if owner_regex.match(owner_value) is None:
            invalid_owner_format.append({"path": doc.path, "owner": owner_value})
        if allowed_owners and owner_value not in allowed_owners:
            owner_not_in_allowlist.append({"path": doc.path, "owner": owner_value})

    supporting_scope = owner_policy.get("supporting_roadmap_scope", {})
    supporting_required_paths = [str(item) for item in supporting_scope.get("required_path_globs", [])]
    supporting_allowed_lifecycle = {str(item).lower() for item in supporting_scope.get("allowed_lifecycle", [])}
    supporting_required_sot = {str(item).lower() for item in supporting_scope.get("required_source_of_truth_status", [])}
    supporting_required_rag = {str(item).lower() for item in supporting_scope.get("required_rag_status", [])}

    supporting_docs = [
        doc
        for doc in docs
        if _matches_any(doc.path, supporting_required_paths)
        and (not supporting_allowed_lifecycle or doc.kb_lifecycle in supporting_allowed_lifecycle)
    ]

    missing_owner_supporting: list[str] = []
    supporting_sot_mismatch: list[dict[str, str]] = []
    supporting_rag_mismatch: list[dict[str, str]] = []
    for doc in supporting_docs:
        owner_value = _normalize_text(doc.owner)
        if not owner_value:
            missing_owner_supporting.append(doc.path)
        if supporting_required_sot and doc.source_of_truth_status not in supporting_required_sot:
            supporting_sot_mismatch.append(
                {
                    "path": doc.path,
                    "actual_source_of_truth_status": doc.source_of_truth_status,
                    "expected_one_of": ", ".join(sorted(supporting_required_sot)),
                }
            )
        if supporting_required_rag and doc.rag_status not in supporting_required_rag:
            supporting_rag_mismatch.append(
                {
                    "path": doc.path,
                    "actual_rag_status": doc.rag_status,
                    "expected_one_of": ", ".join(sorted(supporting_required_rag)),
                }
            )

    stale_policy = owner_policy.get("stale_owner_detection", {})
    stale_critical_docs: list[dict[str, Any]] = []
    if stale_policy.get("enabled", False):
        threshold_days = int(stale_policy.get("stale_after_days", 120))
        applicable_statuses = {str(item).lower() for item in stale_policy.get("applies_to_statuses", [])}
        ignore_lifecycle = {str(item).lower() for item in stale_policy.get("ignore_lifecycle", [])}
        today = date.today()
        for doc in critical_docs:
            if doc.kb_lifecycle in ignore_lifecycle:
                continue
            if applicable_statuses and doc.status not in applicable_statuses:
                continue
            if not doc.updated:
                continue
            try:
                updated_at = datetime.strptime(doc.updated, "%Y-%m-%d").date()
            except ValueError:
                continue
            age_days = (today - updated_at).days
            if age_days > threshold_days:
                stale_critical_docs.append({"path": doc.path, "updated": doc.updated, "age_days": age_days})

    return {
        "critical_docs_checked_count": len(critical_docs),
        "missing_owner_critical_docs_count": len(missing_owner),
        "missing_owner_paths": sorted(missing_owner),
        "invalid_owner_format_count": len(invalid_owner_format),
        "invalid_owner_format": invalid_owner_format,
        "owner_not_in_allowlist_count": len(owner_not_in_allowlist),
        "owner_not_in_allowlist": owner_not_in_allowlist,
        "stale_critical_docs_count": len(stale_critical_docs),
        "stale_critical_docs": stale_critical_docs,
        "supporting_roadmap_docs_checked_count": len(supporting_docs),
        "missing_owner_supporting_roadmap_docs_count": len(missing_owner_supporting),
        "missing_owner_supporting_roadmap_paths": sorted(missing_owner_supporting),
        "supporting_roadmap_source_of_truth_status_mismatch_count": len(supporting_sot_mismatch),
        "supporting_roadmap_source_of_truth_status_mismatch": supporting_sot_mismatch,
        "supporting_roadmap_rag_status_mismatch_count": len(supporting_rag_mismatch),
        "supporting_roadmap_rag_status_mismatch": supporting_rag_mismatch,
        "mode": mode,
    }


def _build_source_of_truth_summary(
    docs: list[_DocRecord],
    source_policy: dict[str, Any],
    matrix: dict[str, Any],
) -> dict[str, dict[str, Any]]:
    scope = source_policy["required_scope"]
    required_paths = [str(item) for item in scope["required_path_globs"]]
    excluded_paths = [str(item) for item in scope["excluded_path_globs"]]
    required_ids = {str(item) for item in scope["required_document_ids"]}
    ambiguous_values = {str(item).lower() for item in source_policy["metadata_contract"]["ambiguous_values"]}
    accepted_prefixes = [str(item) for item in source_policy["metadata_contract"]["accepted_path_prefixes"]]
    self_value = str(source_policy["metadata_contract"]["accepted_self_value"]).lower()

    docs_by_id = {doc.document_id: doc for doc in docs if doc.document_id}
    critical_docs = [
        doc
        for doc in docs
        if (
            doc.document_id in required_ids
            or (_matches_any(doc.path, required_paths) and not _matches_any(doc.path, excluded_paths))
        )
    ]

    missing: list[str] = []
    ambiguous: list[dict[str, str]] = []
    unresolved_target: list[dict[str, str]] = []

    for doc in critical_docs:
        value = _normalize_text(doc.source_of_truth)
        if not value:
            missing.append(doc.path)
            continue
        value_lower = value.lower()
        if value_lower in ambiguous_values:
            ambiguous.append({"path": doc.path, "source_of_truth": value})
            continue
        if value_lower == self_value:
            continue
        if not any(value.startswith(prefix) for prefix in accepted_prefixes):
            ambiguous.append({"path": doc.path, "source_of_truth": value})
            continue
        target = value.replace("\\", "/")
        if not target.startswith("docs/"):
            ambiguous.append({"path": doc.path, "source_of_truth": value})
            continue
        # Repo existence is verified at runtime by policy check.
        if not Path(target).suffix:
            ambiguous.append({"path": doc.path, "source_of_truth": value})
            continue
        if target != doc.path and target not in {item.path for item in docs}:
            unresolved_target.append({"path": doc.path, "source_of_truth": value})

    competing: list[dict[str, Any]] = []
    for domain in matrix.get("critical_domains", []):
        canonical = domain.get("canonical_documents", [])
        if len(canonical) <= 1:
            continue
        values: set[str] = set()
        for item in canonical:
            if not isinstance(item, dict):
                continue
            doc_id = _normalize_text(item.get("id"))
            doc = docs_by_id.get(doc_id)
            if doc is None:
                continue
            value = _normalize_text(doc.source_of_truth)
            if value:
                values.add(value.lower())
        if len(values) > 1:
            competing.append(
                {
                    "domain": str(domain.get("domain", "unknown")),
                    "source_of_truth_values": sorted(values),
                }
            )

    missing_payload = {
        "critical_docs_checked_count": len(critical_docs),
        "missing_source_of_truth_critical_docs_count": len(missing),
        "missing_source_of_truth_paths": sorted(missing),
    }
    conflicting_payload = {
        "ambiguous_source_of_truth_count": len(ambiguous),
        "ambiguous_source_of_truth": ambiguous,
        "unresolved_source_of_truth_targets_count": len(unresolved_target),
        "unresolved_source_of_truth_targets": unresolved_target,
        "competing_canonical_source_of_truth_count": len(competing),
        "competing_canonical_source_of_truth": competing,
        "conflicting_source_of_truth_count": len(ambiguous) + len(unresolved_target) + len(competing),
    }
    return {
        "missing": missing_payload,
        "conflicting": conflicting_payload,
    }


def _build_lifecycle_summary(verify_report: Any) -> dict[str, Any]:
    lifecycle_issues = [issue for issue in verify_report.issues if issue.check == "lifecycle-policy"]
    return {
        "lifecycle_mismatch_count": len(lifecycle_issues),
        "lifecycle_mismatch_paths": sorted({_normalize_text(issue.file) for issue in lifecycle_issues}),
    }


def _build_rag_contamination_summary(governance_payload: dict[str, Any]) -> dict[str, Any]:
    rag_gate = _find_gate(governance_payload, "default-rag-contamination")
    return {
        "rag_contamination_count": int(rag_gate.get("findings_count", 0)),
        "gate_status": rag_gate.get("status", "unknown"),
    }


def _build_registry_drift_summary(verify_report: Any) -> dict[str, Any]:
    registry_issues = [issue for issue in verify_report.issues if issue.check == "registry-consistency"]
    return {
        "registry_drift_count": len(registry_issues),
        "registry_drift_messages": [issue.message for issue in registry_issues],
    }


def _find_gate(governance_payload: dict[str, Any], gate_id: str) -> dict[str, Any]:
    for gate in governance_payload.get("gates", []):
        if str(gate.get("gate_id")) == gate_id:
            return gate
    return {"gate_id": gate_id, "status": "missing", "findings_count": 0}


def _matches_any(path: str, globs: list[str]) -> bool:
    return any(fnmatch(path, glob) for glob in globs)


def _evaluate_thresholds(metric_values: dict[str, int], thresholds: dict[str, int], severity: str) -> list[dict[str, Any]]:
    conditions: list[dict[str, Any]] = []
    for key, limit in thresholds.items():
        value = int(metric_values.get(key, 0))
        if value <= int(limit):
            continue
        conditions.append(
            {
                "metric": key,
                "severity": severity,
                "threshold": int(limit),
                "actual": value,
                "status": "breached",
            }
        )
    return conditions


def _compute_score(blocking_failures: int, warning_failures: int) -> int:
    penalty = (blocking_failures * 15) + (warning_failures * 5)
    score = 100 - penalty
    if score < 0:
        return 0
    return score


def _render_markdown_report(template: str, report: RegistryConsistencyReport) -> str:
    payload = report.to_dict()
    replacements = {
        "{{generated_at}}": payload["generated_at"],
        "{{mode}}": payload["mode"],
        "{{status}}": payload["status"],
        "{{report_owner}}": "core-fp",
        "{{blocking_failures}}": str(payload["summary"]["blocking_failures"]),
        "{{warning_failures}}": str(payload["summary"]["warning_failures"]),
        "{{informational_findings}}": str(payload["summary"]["informational_findings"]),
        "{{score}}": str(payload["score"]),
        "{{duplicate_ids_summary}}": _as_json_block(payload["sections"]["duplicate_ids_summary"]),
        "{{unresolved_links_summary}}": _as_json_block(payload["sections"]["unresolved_links_summary"]),
        "{{unresolved_relations_summary}}": _as_json_block(payload["sections"]["unresolved_relations_summary"]),
        "{{missing_normative_ids_summary}}": _as_json_block(payload["sections"]["missing_normative_ids_summary"]),
        "{{missing_canonical_docs_for_critical_domains}}": _as_json_block(
            payload["sections"]["missing_canonical_docs_for_critical_domains"]
        ),
        "{{missing_owner_on_critical_docs}}": _as_json_block(payload["sections"]["missing_owner_on_critical_docs"]),
        "{{missing_source_of_truth_on_critical_docs}}": _as_json_block(
            payload["sections"]["missing_source_of_truth_on_critical_docs"]
        ),
        "{{conflicting_source_of_truth_cases}}": _as_json_block(payload["sections"]["conflicting_source_of_truth_cases"]),
        "{{lifecycle_mismatch_summary}}": _as_json_block(payload["sections"]["lifecycle_mismatch_summary"]),
        "{{rag_contamination_summary}}": _as_json_block(payload["sections"]["rag_contamination_summary"]),
        "{{registry_drift_summary}}": _as_json_block(payload["sections"]["registry_drift_summary"]),
        "{{blocking_conditions}}": _as_json_block(payload["blocking_conditions"]),
        "{{warning_conditions}}": _as_json_block(payload["warning_conditions"]),
    }
    rendered = template
    for key, value in replacements.items():
        rendered = rendered.replace(key, value)
    return rendered


def _as_json_block(payload: Any) -> str:
    return "```json\n" + json.dumps(payload, ensure_ascii=False, indent=2) + "\n```"
