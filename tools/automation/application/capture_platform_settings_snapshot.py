from __future__ import annotations

import json
import os
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


DEFAULT_POLICY_FILE = Path("config/docs-platform-live-evidence-policy.json")
DEFAULT_API_BASE_URL = "https://api.github.com"
DEFAULT_TOKEN_ENV = "GITHUB_TOKEN"
DEFAULT_RAW_EXPORT_DIR = Path("dist/docs-governance/platform-enforcement/raw")
DEFAULT_SOURCE_TYPE = "github-rest-api"
PLACEHOLDER_MARKERS = ("OWNER/REPO", "EXAMPLE", "TODO")


# DDD Aggregate: результат атомарного capture live platform settings.
@dataclass(frozen=True)
class PlatformSettingsSnapshotCaptureReport:
    status: str
    repository: str
    captured_at: str
    source_type: str
    rulesets_count: int
    required_checks_count: int
    release_required_checks_count: int
    snapshot_file: str
    raw_rulesets_file: str
    evidence_warnings: tuple[str, ...]

    @property
    def report_kind(self) -> str:
        return "platform-settings-snapshot-capture"

    @property
    def is_success(self) -> bool:
        return self.status != "fail"

    def to_dict(self) -> dict[str, Any]:
        return {
            "status": self.status,
            "repository": self.repository,
            "captured_at": self.captured_at,
            "source_type": self.source_type,
            "rulesets_count": self.rulesets_count,
            "required_checks_count": self.required_checks_count,
            "release_required_checks_count": self.release_required_checks_count,
            "snapshot_file": self.snapshot_file,
            "raw_rulesets_file": self.raw_rulesets_file,
            "evidence_warnings": list(self.evidence_warnings),
        }


def run_capture_platform_settings_snapshot(
    root: Path,
    repository: str,
    captured_by: str,
    *,
    policy_file: Path | None = None,
    output_file: Path | None = None,
    raw_rulesets_file: Path | None = None,
    raw_export_file: Path | None = None,
    source_type: str = DEFAULT_SOURCE_TYPE,
    captured_from: str | None = None,
    capture_ref: str | None = None,
    token: str | None = None,
    token_env: str = DEFAULT_TOKEN_ENV,
    api_base_url: str = DEFAULT_API_BASE_URL,
    timeout_seconds: int = 30,
    settings_export_files: tuple[str, ...] = (),
    workflow_run_urls: tuple[str, ...] = (),
    failing_pr_example: str = "",
    passing_pr_example: str = "",
    audit_notes: str = "",
    allow_incomplete_evidence: bool = False,
) -> PlatformSettingsSnapshotCaptureReport:
    repo_root = root.resolve()
    policy_path = (repo_root / (policy_file or DEFAULT_POLICY_FILE)).resolve()
    policy = _load_json(policy_path)
    normalized_repository = _normalize_repository(repository)

    output_snapshot_path = _resolve_output_snapshot_path(repo_root, policy, output_file)
    output_raw_export_path = _resolve_raw_export_path(repo_root, raw_export_file)
    output_raw_export_path.parent.mkdir(parents=True, exist_ok=True)
    output_snapshot_path.parent.mkdir(parents=True, exist_ok=True)

    effective_captured_from = captured_from or api_base_url
    access_token = token or os.environ.get(token_env, "")

    rulesets_payload = _load_or_fetch_rulesets(
        repository=normalized_repository,
        raw_rulesets_file=raw_rulesets_file,
        token=access_token,
        api_base_url=api_base_url,
        timeout_seconds=timeout_seconds,
    )
    output_raw_export_path.write_text(
        json.dumps(rulesets_payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    normalized_rulesets = _normalize_rulesets_for_snapshot(rulesets_payload)
    if not normalized_rulesets:
        raise ValueError("No rulesets found in live capture payload.")

    required_checks, release_required_checks = _collect_required_checks(normalized_rulesets)

    captured_at = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    raw_export_rel = _to_repo_relative_str(output_raw_export_path, repo_root)
    snapshot_rel = _to_repo_relative_str(output_snapshot_path, repo_root)
    capture_ref_value = capture_ref or raw_export_rel

    evidence_export_files = _dedupe_non_empty((*settings_export_files, raw_export_rel))
    evidence_workflow_urls = _dedupe_non_empty(workflow_run_urls)
    evidence_warnings = _validate_evidence_fields(
        workflow_run_urls=evidence_workflow_urls,
        failing_pr_example=failing_pr_example,
        passing_pr_example=passing_pr_example,
    )

    if evidence_warnings and not allow_incomplete_evidence:
        raise ValueError("Incomplete or placeholder evidence fields: " + ", ".join(evidence_warnings))

    policy_linkage = {
        "ruleset_spec_file": str(policy["inputs"]["ruleset_spec_file"]),
        "required_checks_file": str(policy["inputs"]["required_checks_file"]),
        "policy_file": _to_repo_relative_str(policy_path, repo_root),
        "spec_version": str(policy.get("version", "1.0")),
    }

    snapshot = {
        "version": "1.0",
        "captured_at": captured_at,
        "platform": "github",
        "repository": normalized_repository,
        "captured_by": captured_by,
        "source_of_capture": {
            "type": source_type,
            "captured_from": effective_captured_from,
            "capture_ref": capture_ref_value,
            "tool_version": "automation-cli",
        },
        "policy_linkage": policy_linkage,
        "rulesets": normalized_rulesets,
        "required_checks": required_checks,
        "release_required_checks": release_required_checks,
        "evidence": {
            "settings_export_files": list(evidence_export_files),
            "workflow_run_urls": list(evidence_workflow_urls),
            "failing_pr_example": failing_pr_example,
            "passing_pr_example": passing_pr_example,
            "audit_notes": audit_notes or "Live platform settings capture.",
        },
    }
    output_snapshot_path.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    status = "pass-with-warnings" if evidence_warnings else "pass"
    return PlatformSettingsSnapshotCaptureReport(
        status=status,
        repository=normalized_repository,
        captured_at=captured_at,
        source_type=source_type,
        rulesets_count=len(normalized_rulesets),
        required_checks_count=len(required_checks),
        release_required_checks_count=len(release_required_checks),
        snapshot_file=snapshot_rel,
        raw_rulesets_file=raw_export_rel,
        evidence_warnings=evidence_warnings,
    )


def _load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def _normalize_repository(value: str) -> str:
    trimmed = value.strip()
    parts = [part for part in trimmed.split("/") if part]
    if len(parts) != 2:
        raise ValueError("Repository must be formatted as OWNER/REPO.")
    return f"{parts[0]}/{parts[1]}"


def _resolve_output_snapshot_path(repo_root: Path, policy: dict[str, Any], output_file: Path | None) -> Path:
    configured = Path(str(policy["inputs"]["snapshot_file"]))
    chosen = output_file or configured
    return chosen if chosen.is_absolute() else (repo_root / chosen).resolve()


def _resolve_raw_export_path(repo_root: Path, raw_export_file: Path | None) -> Path:
    if raw_export_file is not None:
        return raw_export_file if raw_export_file.is_absolute() else (repo_root / raw_export_file).resolve()
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    return (repo_root / DEFAULT_RAW_EXPORT_DIR / f"platform-rulesets-live-{stamp}.json").resolve()


def _load_or_fetch_rulesets(
    *,
    repository: str,
    raw_rulesets_file: Path | None,
    token: str,
    api_base_url: str,
    timeout_seconds: int,
) -> list[dict[str, Any]]:
    if raw_rulesets_file is not None:
        payload = json.loads(raw_rulesets_file.read_text(encoding="utf-8"))
        if isinstance(payload, dict):
            if isinstance(payload.get("rulesets"), list):
                return [item for item in payload["rulesets"] if isinstance(item, dict)]
            if isinstance(payload.get("items"), list):
                return [item for item in payload["items"] if isinstance(item, dict)]
        if isinstance(payload, list):
            return [item for item in payload if isinstance(item, dict)]
        raise ValueError("raw_rulesets_file must contain JSON array or object with rulesets/items list.")
    return _fetch_rulesets_from_api(
        repository=repository,
        token=token,
        api_base_url=api_base_url,
        timeout_seconds=timeout_seconds,
    )


def _fetch_rulesets_from_api(
    *,
    repository: str,
    token: str,
    api_base_url: str,
    timeout_seconds: int,
) -> list[dict[str, Any]]:
    if not token:
        raise ValueError("GitHub token is required for API capture. Pass --token or set GITHUB_TOKEN.")
    query = urlencode([("targets", "branch"), ("targets", "tag"), ("per_page", "100")], doseq=True)
    url = f"{api_base_url.rstrip('/')}/repos/{repository}/rulesets?{query}"
    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {token}",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "resultsafe-docs-governance/1.0",
    }
    request = Request(url=url, headers=headers, method="GET")
    try:
        with urlopen(request, timeout=timeout_seconds) as response:  # noqa: S310 - trusted GitHub API host from policy/args
            payload = json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise ValueError(f"GitHub API error {exc.code}: {body}") from exc
    except URLError as exc:
        raise ValueError(f"GitHub API connection error: {exc.reason}") from exc
    if not isinstance(payload, list):
        raise ValueError("GitHub rulesets API response is not a JSON array.")
    return [item for item in payload if isinstance(item, dict)]


def _normalize_rulesets_for_snapshot(rulesets_payload: list[dict[str, Any]]) -> list[dict[str, Any]]:
    normalized: list[dict[str, Any]] = []
    for item in rulesets_payload:
        target = str(item.get("target", "branch"))
        name = str(item.get("name") or item.get("id") or "").strip()
        if not name:
            continue
        conditions = item.get("conditions", {})
        ref_name = conditions.get("ref_name", {}) if isinstance(conditions, dict) else {}
        include_patterns = _normalize_ref_patterns(ref_name.get("include", []))
        branch_patterns = [v for v in include_patterns if not v.startswith("v") and not v.startswith("refs/tags/")]
        tag_patterns = [v for v in include_patterns if v.startswith("v") or v.startswith("tags/")]

        rules = item.get("rules", [])
        status_checks, strict_required_status_checks = _extract_status_checks(rules)
        pull_request_requirements = _extract_pull_request_requirements(rules)

        rule_types = {str(rule.get("type", "")).strip() for rule in rules if isinstance(rule, dict)}
        restrict_direct_pushes = "update" in rule_types or "creation" in rule_types
        allow_force_pushes = "non_fast_forward" not in rule_types
        allow_deletions = "deletion" not in rule_types

        bypass_actors = item.get("bypass_actors", [])
        admin_bypass_allowed = isinstance(bypass_actors, list) and len(bypass_actors) > 0

        if target == "tag" and not tag_patterns:
            tag_patterns = include_patterns
        if target == "branch" and not branch_patterns:
            branch_patterns = include_patterns

        normalized.append(
            {
                "ruleset_id": name,
                "name": name,
                "target": target,
                "branch_patterns": branch_patterns,
                "tag_patterns": tag_patterns,
                "enforcement": str(item.get("enforcement", "active")),
                "required_status_checks": status_checks,
                "strict_status_checks": strict_required_status_checks,
                "require_up_to_date_branch": strict_required_status_checks,
                "restrict_direct_pushes": restrict_direct_pushes,
                "allow_force_pushes": allow_force_pushes,
                "allow_deletions": allow_deletions,
                "admin_bypass_allowed": admin_bypass_allowed,
                "pull_request_requirements": pull_request_requirements,
            }
        )
    return normalized


def _extract_status_checks(rules: Any) -> tuple[list[str], bool]:
    contexts: list[str] = []
    strict_required_status_checks = False
    if not isinstance(rules, list):
        return contexts, strict_required_status_checks
    for rule in rules:
        if not isinstance(rule, dict):
            continue
        if str(rule.get("type", "")).strip() != "required_status_checks":
            continue
        params = rule.get("parameters", {})
        if isinstance(params, dict):
            strict_required_status_checks = bool(params.get("strict_required_status_checks_policy", False))
            raw_checks = params.get("required_status_checks", [])
            if isinstance(raw_checks, list):
                for item in raw_checks:
                    if isinstance(item, dict):
                        context = str(item.get("context", "")).strip()
                    else:
                        context = str(item).strip()
                    if context:
                        contexts.append(context)
    return sorted(set(contexts)), strict_required_status_checks


def _extract_pull_request_requirements(rules: Any) -> dict[str, Any]:
    required = False
    require_conversation_resolution = False
    required_approving_review_count = 0
    if not isinstance(rules, list):
        return {
            "required": required,
            "require_conversation_resolution": require_conversation_resolution,
            "required_approving_review_count": required_approving_review_count,
        }

    for rule in rules:
        if not isinstance(rule, dict):
            continue
        rule_type = str(rule.get("type", "")).strip()
        params = rule.get("parameters", {})
        if rule_type == "required_pull_request_reviews":
            required = True
            if isinstance(params, dict):
                required_approving_review_count = int(params.get("required_approving_review_count", 0))
                require_conversation_resolution = bool(params.get("require_last_push_approval", False)) or bool(
                    params.get("required_review_thread_resolution", False)
                )
        if rule_type == "required_review_thread_resolution":
            require_conversation_resolution = True
    return {
        "required": required,
        "require_conversation_resolution": require_conversation_resolution,
        "required_approving_review_count": required_approving_review_count,
    }


def _normalize_ref_patterns(values: Any) -> list[str]:
    if not isinstance(values, list):
        return []
    normalized: list[str] = []
    for raw in values:
        value = str(raw).strip()
        if not value:
            continue
        if value == "~DEFAULT_BRANCH":
            normalized.append("main")
            continue
        if value.startswith("refs/heads/"):
            normalized.append(value.removeprefix("refs/heads/"))
            continue
        if value.startswith("refs/tags/"):
            normalized.append(value.removeprefix("refs/tags/"))
            continue
        normalized.append(value)
    return sorted(set(normalized))


def _collect_required_checks(rulesets: list[dict[str, Any]]) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    required_index: dict[str, set[str]] = {}
    release_index: dict[str, set[str]] = {}

    for ruleset in rulesets:
        patterns = [
            *[str(v) for v in ruleset.get("branch_patterns", []) if str(v).strip()],
            *[f"refs/tags/{v}" for v in ruleset.get("tag_patterns", []) if str(v).strip()],
        ]
        if not patterns:
            patterns = [str(ruleset.get("target", "branch"))]
        contexts = [str(v) for v in ruleset.get("required_status_checks", []) if str(v).strip()]
        is_release_scope = any(_is_release_pattern(pattern) for pattern in patterns)
        for context in contexts:
            required_index.setdefault(context, set()).update(patterns)
            if is_release_scope:
                release_index.setdefault(context, set()).update(patterns)

    required_checks = [
        {"context": context, "required": True, "enforced_on": sorted(paths)}
        for context, paths in sorted(required_index.items())
    ]
    release_required_checks = [
        {"context": context, "required": True, "enforced_on": sorted(paths)}
        for context, paths in sorted(release_index.items())
    ]
    return required_checks, release_required_checks


def _is_release_pattern(value: str) -> bool:
    normalized = value.strip().lower()
    return (
        normalized.startswith("release/")
        or normalized.startswith("refs/heads/release/")
        or normalized.startswith("refs/tags/v")
        or normalized.startswith("v")
    )


def _validate_evidence_fields(
    *,
    workflow_run_urls: tuple[str, ...],
    failing_pr_example: str,
    passing_pr_example: str,
) -> tuple[str, ...]:
    warnings: list[str] = []
    if not workflow_run_urls:
        warnings.append("missing-workflow-run-urls")
    if not failing_pr_example.strip():
        warnings.append("missing-failing-pr-example")
    if not passing_pr_example.strip():
        warnings.append("missing-passing-pr-example")
    if _contains_placeholder(failing_pr_example):
        warnings.append("placeholder-failing-pr-example")
    if _contains_placeholder(passing_pr_example):
        warnings.append("placeholder-passing-pr-example")
    if any(_contains_placeholder(url) for url in workflow_run_urls):
        warnings.append("placeholder-workflow-run-url")
    return tuple(warnings)


def _contains_placeholder(value: str) -> bool:
    text = value.strip()
    if not text:
        return False
    upper = text.upper()
    return any(marker in upper for marker in PLACEHOLDER_MARKERS)


def _dedupe_non_empty(values: tuple[str, ...]) -> tuple[str, ...]:
    seen: set[str] = set()
    ordered: list[str] = []
    for raw in values:
        value = str(raw).strip()
        if not value or value in seen:
            continue
        seen.add(value)
        ordered.append(value)
    return tuple(ordered)


def _to_repo_relative_str(path: Path, repo_root: Path) -> str:
    try:
        return path.relative_to(repo_root).as_posix()
    except ValueError:
        return path.as_posix()
