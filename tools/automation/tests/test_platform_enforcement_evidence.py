from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from tools.automation.application.platform_enforcement_evidence import run_platform_enforcement_evidence_check


class PlatformEnforcementEvidenceTests(unittest.TestCase):
    def test_platform_evidence_check_passes_with_matching_snapshot(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self._write_fixture(root, missing_release_context=False)
            report = run_platform_enforcement_evidence_check(
                root=root,
                mode="release",
                policy_file=root / "config" / "policy.json",
                report_file=root / "dist" / "report.json",
                markdown_file=root / "dist" / "report.md",
            )
            self.assertEqual(report.status, "pass")
            self.assertTrue(report.is_success)
            self.assertEqual(report.blocking_failures, 0)

    def test_platform_evidence_check_fails_on_missing_release_context(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self._write_fixture(root, missing_release_context=True)
            report = run_platform_enforcement_evidence_check(
                root=root,
                mode="release",
                policy_file=root / "config" / "policy.json",
            )
            self.assertEqual(report.status, "fail")
            self.assertGreater(report.blocking_failures, 0)
            codes = {item.code for item in report.findings}
            self.assertIn("platform-required-release-check-missing", codes)

    def test_platform_evidence_check_fails_on_placeholder_repository(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self._write_fixture(root, missing_release_context=False)
            snapshot_path = root / "config" / "snapshot.json"
            snapshot = json.loads(snapshot_path.read_text(encoding="utf-8"))
            snapshot["repository"] = "OWNER/REPO"
            snapshot_path.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

            report = run_platform_enforcement_evidence_check(
                root=root,
                mode="release",
                policy_file=root / "config" / "policy.json",
            )
            self.assertEqual(report.status, "fail")
            codes = {item.code for item in report.findings}
            self.assertIn("platform-repository-placeholder", codes)

    def _write_fixture(self, root: Path, *, missing_release_context: bool) -> None:
        (root / "config").mkdir(parents=True, exist_ok=True)
        (root / "templates").mkdir(parents=True, exist_ok=True)

        policy = {
            "inputs": {
                "snapshot_file": "config/snapshot.json",
                "snapshot_schema_file": "config/schema.json",
                "ruleset_spec_file": "config/spec.json",
                "required_checks_file": "config/required.json",
                "reconciliation_rules_file": "config/recon.json",
            },
            "outputs": {"report_template_file": "templates/report.md"},
            "evidence_chain": {
                "allowed_source_types": ["gh-cli-export"],
                "max_snapshot_age_days": 365,
            },
        }
        schema = {
            "required": [
                "version",
                "captured_at",
                "platform",
                "repository",
                "captured_by",
                "source_of_capture",
                "policy_linkage",
                "rulesets",
                "required_checks",
                "release_required_checks",
                "evidence",
            ]
        }
        spec = {
            "rulesets": [
                {
                    "ruleset_id": "main-protect",
                    "target": "branch",
                    "enforcement": "active",
                    "strict_status_checks": True,
                    "require_up_to_date_branch": True,
                    "restrict_direct_pushes": True,
                    "allow_force_pushes": False,
                    "allow_deletions": False,
                    "admin_bypass_allowed": False,
                    "required_status_checks": ["wf / a"],
                }
            ]
        }
        required = {
            "required_checks": [{"check_context": "wf / a", "platform_required": True}],
            "release_required_checks": [{"check_context": "wf-release / b", "platform_required": True}],
        }
        recon = {
            "ruleset": {
                "exact_match_fields": [
                    "target",
                    "enforcement",
                    "strict_status_checks",
                    "require_up_to_date_branch",
                    "restrict_direct_pushes",
                    "allow_force_pushes",
                    "allow_deletions",
                    "admin_bypass_allowed",
                ]
            }
        }
        snapshot = {
            "version": "1.0",
            "captured_at": "2026-03-23T10:00:00Z",
            "platform": "github",
            "repository": "org/repo",
            "captured_by": "core-fp",
            "source_of_capture": {
                "type": "gh-cli-export",
                "captured_from": "github.com",
                "capture_ref": "artifacts/live-export.json",
            },
            "policy_linkage": {
                "ruleset_spec_file": "config/spec.json",
                "required_checks_file": "config/required.json",
                "policy_file": "config/policy.json",
            },
            "rulesets": [
                {
                    "ruleset_id": "main-protect",
                    "name": "main-protect",
                    "target": "branch",
                    "branch_patterns": ["main"],
                    "tag_patterns": [],
                    "enforcement": "active",
                    "required_status_checks": ["wf / a"],
                    "strict_status_checks": True,
                    "require_up_to_date_branch": True,
                    "restrict_direct_pushes": True,
                    "allow_force_pushes": False,
                    "allow_deletions": False,
                    "admin_bypass_allowed": False,
                }
            ],
            "required_checks": [
                {"context": "wf / a", "required": True, "enforced_on": ["main"]},
                {"context": "wf-release / b", "required": True, "enforced_on": ["release/*", "refs/tags/v*"]},
            ],
            "release_required_checks": [{"context": "wf-release / b", "required": True, "enforced_on": ["release/*"]}],
            "evidence": {
                "settings_export_files": ["artifacts/live-export.json"],
                "workflow_run_urls": ["https://github.com/org/repo/actions/runs/123"],
                "failing_pr_example": "https://github.com/org/repo/pull/10",
                "passing_pr_example": "https://github.com/org/repo/pull/11",
                "audit_notes": "live evidence",
            },
        }
        if missing_release_context:
            snapshot["required_checks"] = [{"context": "wf / a", "required": True, "enforced_on": ["main"]}]

        self._write_json(root / "config" / "policy.json", policy)
        self._write_json(root / "config" / "schema.json", schema)
        self._write_json(root / "config" / "spec.json", spec)
        self._write_json(root / "config" / "required.json", required)
        self._write_json(root / "config" / "recon.json", recon)
        self._write_json(root / "config" / "snapshot.json", snapshot)
        (root / "templates" / "report.md").write_text(
            "# report\n{{generated_at}}\n{{mode}}\n{{status}}\n{{score}}\n{{snapshot_summary}}\n{{expected_scope}}\n{{blocking_conditions}}\n{{warning_conditions}}\n",
            encoding="utf-8",
        )

    def _write_json(self, path: Path, payload: dict) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    unittest.main()
