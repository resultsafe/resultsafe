from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any


DEFAULT_POLICY_FILE = Path("config/docs-platform-live-evidence-policy.json")


@dataclass(frozen=True)
class PlatformEvidenceFinding:
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
class PlatformEvidenceReport:
    mode: str
    generated_at: str
    status: str
    score: int
    blocking_failures: int
    warning_failures: int
    sections: dict[str, Any]
    findings: tuple[PlatformEvidenceFinding, ...]

    @property
    def report_kind(self) -> str:
        return "platform-enforcement-evidence"

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
                "informational_findings": 0,
            },
            "sections": self.sections,
            "findings_count": len(self.findings),
            "findings": [item.to_dict() for item in self.findings],
        }


def run_platform_enforcement_evidence_check(
    root: Path,
    mode: str,
    policy_file: Path | None = None,
    snapshot_file: Path | None = None,
    report_file: Path | None = None,
    markdown_file: Path | None = None,
) -> PlatformEvidenceReport:
    repo_root = root.resolve()
    policy_path = (repo_root / (policy_file or DEFAULT_POLICY_FILE)).resolve()
    policy = _load_json(policy_path)
    spec = _load_json((repo_root / Path(policy["inputs"]["ruleset_spec_file"])).resolve())
    required = _load_json((repo_root / Path(policy["inputs"]["required_checks_file"])).resolve())
    schema = _load_json((repo_root / Path(policy["inputs"]["snapshot_schema_file"])).resolve())
    recon = _load_json((repo_root / Path(policy["inputs"]["reconciliation_rules_file"])).resolve())

    configured_snapshot = Path(policy["inputs"]["snapshot_file"])
    effective_snapshot = snapshot_file or configured_snapshot
    snapshot_path = effective_snapshot if effective_snapshot.is_absolute() else (repo_root / effective_snapshot).resolve()

    findings: list[PlatformEvidenceFinding] = []
    snapshot: dict[str, Any] = {}
    if not snapshot_path.exists():
        findings.append(_finding("platform-snapshot-missing", snapshot_path, repo_root, "Live snapshot file is missing.", "blocking"))
    else:
        snapshot = _load_json(snapshot_path)

    findings.extend(_validate_contract(snapshot, schema, snapshot_path, repo_root))
    findings.extend(_reconcile(snapshot, spec, required, recon, snapshot_path, repo_root))
    findings.extend(_validate_evidence(snapshot, policy, snapshot_path, repo_root))
    findings.extend(_validate_recency(snapshot, policy, snapshot_path, repo_root))

    blocking = len([f for f in findings if f.severity == "blocking"])
    warning = len([f for f in findings if f.severity == "warning"])
    status = "fail" if blocking > 0 else ("pass-with-warnings" if warning > 0 else "pass")
    score = max(0, 100 - (blocking * 20) - (warning * 5))

    sections = _build_sections(snapshot, spec, required, findings)
    report = PlatformEvidenceReport(
        mode=mode,
        generated_at=date.today().isoformat(),
        status=status,
        score=score,
        blocking_failures=blocking,
        warning_failures=warning,
        sections=sections,
        findings=tuple(findings),
    )

    if report_file is not None:
        out = report_file if report_file.is_absolute() else (repo_root / report_file).resolve()
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps(report.to_dict(), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if markdown_file is not None:
        out = markdown_file if markdown_file.is_absolute() else (repo_root / markdown_file).resolve()
        out.parent.mkdir(parents=True, exist_ok=True)
        template_file = (repo_root / Path(policy["outputs"]["report_template_file"])).resolve()
        if template_file.exists():
            template = template_file.read_text(encoding="utf-8")
            out.write_text(_render_md(report, template), encoding="utf-8")
        else:
            out.write_text(_render_md(report, None), encoding="utf-8")
    return report


def _load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def _norm(value: Any) -> str:
    return str(value).strip() if value is not None else ""


def _as_list(value: Any) -> list[Any]:
    return value if isinstance(value, list) else []


def _finding(code: str, path: Path, repo_root: Path, message: str, severity: str, evidence: dict[str, Any] | None = None) -> PlatformEvidenceFinding:
    rel = path.as_posix()
    if path.exists():
        rel = path.relative_to(repo_root).as_posix()
    return PlatformEvidenceFinding(code=code, path=rel, message=message, severity=severity, evidence=evidence)


def _validate_contract(snapshot: dict[str, Any], schema: dict[str, Any], snapshot_path: Path, repo_root: Path) -> list[PlatformEvidenceFinding]:
    findings: list[PlatformEvidenceFinding] = []
    for key in _as_list(schema.get("required")):
        name = _norm(key)
        if name and name not in snapshot:
            findings.append(_finding("platform-snapshot-missing-required-field", snapshot_path, repo_root, f"Missing required field '{name}'.", "blocking", {"field": name}))
    return findings


def _reconcile(snapshot: dict[str, Any], spec: dict[str, Any], required: dict[str, Any], recon: dict[str, Any], snapshot_path: Path, repo_root: Path) -> list[PlatformEvidenceFinding]:
    findings: list[PlatformEvidenceFinding] = []
    expected = {(_norm(r.get("ruleset_id")) or _norm(r.get("name"))): r for r in _as_list(spec.get("rulesets")) if isinstance(r, dict)}
    actual = {(_norm(r.get("ruleset_id")) or _norm(r.get("name"))): r for r in _as_list(snapshot.get("rulesets")) if isinstance(r, dict)}
    exact_fields = [str(v) for v in _as_list(recon.get("ruleset", {}).get("exact_match_fields"))]
    for rs_id, rs_spec in expected.items():
        live = actual.get(rs_id)
        if live is None:
            findings.append(_finding("platform-ruleset-missing", snapshot_path, repo_root, f"Missing ruleset '{rs_id}' in snapshot.", "blocking"))
            continue
        for field in exact_fields:
            spec_value = rs_spec.get(field)
            live_value = live.get(field)
            if field == "admin_bypass_allowed":
                spec_value = bool((rs_spec.get("admin_bypass") or {}).get("allowed", rs_spec.get("admin_bypass_allowed")))
                live_value = bool((live.get("admin_bypass") or {}).get("allowed", live.get("admin_bypass_allowed")))
            if spec_value != live_value:
                findings.append(_finding("platform-ruleset-field-mismatch", snapshot_path, repo_root, f"Ruleset '{rs_id}' field '{field}' mismatch.", "blocking", {"field": field, "expected": spec_value, "actual": live_value}))
        req_spec = set(_as_list(rs_spec.get("required_status_checks")))
        req_live = set(_as_list(live.get("required_status_checks")))
        missing = sorted(req_spec - req_live)
        if missing:
            findings.append(_finding("platform-ruleset-missing-required-checks", snapshot_path, repo_root, f"Ruleset '{rs_id}' missing required checks.", "blocking", {"ruleset_id": rs_id, "missing_checks": missing}))

    live_required = {str(v.get("context")) for v in _as_list(snapshot.get("required_checks")) if isinstance(v, dict) and bool(v.get("required", False))}
    expected_merge = [str(v.get("check_context")) for v in _as_list(required.get("required_checks")) if isinstance(v, dict) and bool(v.get("platform_required", False))]
    expected_release = [str(v.get("check_context")) for v in _as_list(required.get("release_required_checks")) if isinstance(v, dict) and bool(v.get("platform_required", False))]
    for ctx in expected_merge:
        if ctx not in live_required:
            findings.append(_finding("platform-required-merge-check-missing", snapshot_path, repo_root, f"Missing required merge context '{ctx}'.", "blocking", {"context": ctx}))
    for ctx in expected_release:
        if ctx not in live_required:
            findings.append(_finding("platform-required-release-check-missing", snapshot_path, repo_root, f"Missing required release context '{ctx}'.", "blocking", {"context": ctx}))
    return findings


def _validate_evidence(snapshot: dict[str, Any], policy: dict[str, Any], snapshot_path: Path, repo_root: Path) -> list[PlatformEvidenceFinding]:
    findings: list[PlatformEvidenceFinding] = []
    evidence = snapshot.get("evidence", {})
    src = snapshot.get("source_of_capture", {})
    repository = _norm(snapshot.get("repository"))
    if not repository:
        findings.append(_finding("platform-repository-missing", snapshot_path, repo_root, "Missing repository field.", "blocking"))
    elif "OWNER/REPO" in repository or "EXAMPLE" in repository or "TODO" in repository:
        findings.append(
            _finding(
                "platform-repository-placeholder",
                snapshot_path,
                repo_root,
                "Repository field contains placeholder value.",
                "blocking",
                {"repository": repository},
            )
        )
    if not isinstance(evidence, dict):
        return [_finding("platform-evidence-section-missing", snapshot_path, repo_root, "Missing evidence section.", "blocking")]
    if not isinstance(src, dict):
        findings.append(_finding("platform-source-of-capture-missing", snapshot_path, repo_root, "Missing source_of_capture section.", "blocking"))
    else:
        allowed = set(_as_list(policy.get("evidence_chain", {}).get("allowed_source_types")))
        if allowed and _norm(src.get("type")) not in allowed:
            findings.append(_finding("platform-source-type-invalid", snapshot_path, repo_root, f"Unsupported source_of_capture.type '{_norm(src.get('type'))}'.", "blocking"))
        capture_ref = _norm(src.get("capture_ref"))
        if not capture_ref:
            findings.append(_finding("platform-capture-ref-missing", snapshot_path, repo_root, "source_of_capture.capture_ref is missing.", "blocking"))
        elif "OWNER/REPO" in capture_ref or "EXAMPLE" in capture_ref or "TODO" in capture_ref:
            findings.append(
                _finding(
                    "platform-capture-ref-placeholder",
                    snapshot_path,
                    repo_root,
                    "source_of_capture.capture_ref has placeholder value.",
                    "blocking",
                    {"capture_ref": capture_ref},
                )
            )
    for key in ("settings_export_files", "workflow_run_urls"):
        values = _as_list(evidence.get(key))
        if not values:
            findings.append(_finding("platform-evidence-list-missing", snapshot_path, repo_root, f"Evidence list '{key}' is empty.", "blocking"))
            continue
        for value in values:
            text = _norm(value)
            if "OWNER/REPO" in text or "EXAMPLE" in text or "TODO" in text:
                findings.append(
                    _finding(
                        "platform-evidence-placeholder-values",
                        snapshot_path,
                        repo_root,
                        f"Evidence list '{key}' has placeholder value.",
                        "blocking",
                        {"field": key, "value": text},
                    )
                )
    for key in ("failing_pr_example", "passing_pr_example"):
        value = _norm(evidence.get(key))
        if not value:
            findings.append(_finding("platform-evidence-field-missing", snapshot_path, repo_root, f"Evidence field '{key}' is missing.", "blocking"))
        elif "OWNER/REPO" in value or "EXAMPLE" in value or "TODO" in value:
            findings.append(_finding("platform-evidence-placeholder-values", snapshot_path, repo_root, f"Evidence field '{key}' has placeholder value.", "blocking", {"field": key, "value": value}))
    return findings


def _validate_recency(snapshot: dict[str, Any], policy: dict[str, Any], snapshot_path: Path, repo_root: Path) -> list[PlatformEvidenceFinding]:
    captured_at = _norm(snapshot.get("captured_at"))
    if not captured_at:
        return [_finding("platform-snapshot-captured-at-missing", snapshot_path, repo_root, "Missing captured_at.", "blocking")]
    try:
        captured = datetime.fromisoformat(captured_at.replace("Z", "+00:00"))
    except ValueError:
        return [_finding("platform-snapshot-captured-at-invalid", snapshot_path, repo_root, f"Invalid captured_at '{captured_at}'.", "blocking")]
    if captured.tzinfo is None:
        captured = captured.replace(tzinfo=timezone.utc)
    max_days = int(policy.get("evidence_chain", {}).get("max_snapshot_age_days", 14))
    age_days = int((datetime.now(timezone.utc) - captured).total_seconds() // 86400)
    if age_days > max_days:
        return [_finding("platform-snapshot-stale", snapshot_path, repo_root, f"Snapshot is stale ({age_days} days > {max_days}).", "warning", {"age_days": age_days, "max_days": max_days})]
    return []


def _build_sections(snapshot: dict[str, Any], spec: dict[str, Any], required: dict[str, Any], findings: list[PlatformEvidenceFinding]) -> dict[str, Any]:
    blocking = [f.to_dict() for f in findings if f.severity == "blocking"]
    warning = [f.to_dict() for f in findings if f.severity == "warning"]
    return {
        "snapshot_summary": {
            "repository": _norm(snapshot.get("repository")),
            "captured_at": _norm(snapshot.get("captured_at")),
            "rulesets_count": len(_as_list(snapshot.get("rulesets"))),
            "required_checks_count": len(_as_list(snapshot.get("required_checks"))),
        },
        "expected_scope": {
            "spec_rulesets_count": len(_as_list(spec.get("rulesets"))),
            "expected_merge_required_checks_count": len(_as_list(required.get("required_checks"))),
            "expected_release_required_checks_count": len(_as_list(required.get("release_required_checks"))),
        },
        "blocking_conditions": blocking,
        "warning_conditions": warning,
    }


def _render_md(report: PlatformEvidenceReport, template: str | None) -> str:
    payload = report.to_dict()
    if template is None:
        return (
            "# Platform Enforcement Evidence Report\n\n"
            f"- Generated at: {payload['generated_at']}\n"
            f"- Mode: {payload['mode']}\n"
            f"- Status: {payload['status']}\n"
            f"- Score: {payload['score']}\n\n"
            "## Snapshot Summary\n\n"
            "```json\n"
            + json.dumps(payload["sections"]["snapshot_summary"], ensure_ascii=False, indent=2)
            + "\n```\n\n## Blocking Conditions\n\n```json\n"
            + json.dumps(payload["sections"]["blocking_conditions"], ensure_ascii=False, indent=2)
            + "\n```\n\n## Warning Conditions\n\n```json\n"
            + json.dumps(payload["sections"]["warning_conditions"], ensure_ascii=False, indent=2)
            + "\n```\n"
        )
    replaced = template
    replacements = {
        "{{generated_at}}": payload["generated_at"],
        "{{mode}}": payload["mode"],
        "{{status}}": payload["status"],
        "{{score}}": str(payload["score"]),
        "{{blocking_failures}}": str(payload["summary"]["blocking_failures"]),
        "{{warning_failures}}": str(payload["summary"]["warning_failures"]),
        "{{snapshot_summary}}": _as_json_block(payload["sections"]["snapshot_summary"]),
        "{{expected_scope}}": _as_json_block(payload["sections"]["expected_scope"]),
        "{{blocking_conditions}}": _as_json_block(payload["sections"]["blocking_conditions"]),
        "{{warning_conditions}}": _as_json_block(payload["sections"]["warning_conditions"]),
    }
    for key, value in replacements.items():
        replaced = replaced.replace(key, value)
    return replaced


def _as_json_block(payload: Any) -> str:
    return "```json\n" + json.dumps(payload, ensure_ascii=False, indent=2) + "\n```"
