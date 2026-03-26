from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from tools.automation.application.capture_platform_settings_snapshot import run_capture_platform_settings_snapshot


class CapturePlatformSettingsSnapshotTests(unittest.TestCase):
    def test_capture_snapshot_from_raw_rulesets_file(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self._write_policy(root)
            self._write_raw_rulesets(root)

            report = run_capture_platform_settings_snapshot(
                root=root,
                repository="org/repo",
                captured_by="core-fp",
                policy_file=root / "config" / "policy.json",
                raw_rulesets_file=root / "fixtures" / "rulesets.json",
                output_file=root / "config" / "snapshot.json",
                raw_export_file=root / "dist" / "raw" / "rulesets-captured.json",
                workflow_run_urls=("https://github.com/org/repo/actions/runs/100",),
                failing_pr_example="https://github.com/org/repo/pull/10",
                passing_pr_example="https://github.com/org/repo/pull/11",
                audit_notes="capture test",
            )
            self.assertEqual(report.status, "pass")
            self.assertEqual(report.rulesets_count, 2)
            self.assertEqual(report.required_checks_count, 4)
            self.assertEqual(report.release_required_checks_count, 2)

            snapshot = json.loads((root / "config" / "snapshot.json").read_text(encoding="utf-8"))
            self.assertEqual(snapshot["repository"], "org/repo")
            required_contexts = {item["context"] for item in snapshot["required_checks"]}
            self.assertIn("docs-merge-required-checks / docs-governance-main", required_contexts)
            self.assertIn("docs-registry-release-check / release-eligibility", required_contexts)

    def test_capture_fails_on_incomplete_evidence_when_not_allowed(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self._write_policy(root)
            self._write_raw_rulesets(root)

            with self.assertRaises(ValueError):
                run_capture_platform_settings_snapshot(
                    root=root,
                    repository="org/repo",
                    captured_by="core-fp",
                    policy_file=root / "config" / "policy.json",
                    raw_rulesets_file=root / "fixtures" / "rulesets.json",
                    output_file=root / "config" / "snapshot.json",
                    raw_export_file=root / "dist" / "raw" / "rulesets-captured.json",
                )

    def test_capture_allows_incomplete_evidence_with_warning_mode(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self._write_policy(root)
            self._write_raw_rulesets(root)

            report = run_capture_platform_settings_snapshot(
                root=root,
                repository="org/repo",
                captured_by="core-fp",
                policy_file=root / "config" / "policy.json",
                raw_rulesets_file=root / "fixtures" / "rulesets.json",
                output_file=root / "config" / "snapshot.json",
                raw_export_file=root / "dist" / "raw" / "rulesets-captured.json",
                allow_incomplete_evidence=True,
            )
            self.assertEqual(report.status, "pass-with-warnings")
            self.assertGreater(len(report.evidence_warnings), 0)

    def _write_policy(self, root: Path) -> None:
        payload = {
            "version": "1.0",
            "inputs": {
                "snapshot_file": "config/docs-platform-settings-snapshot.json",
                "ruleset_spec_file": "config/docs-platform-branch-protection-ruleset-spec.json",
                "required_checks_file": "config/docs-platform-required-checks.json",
            },
        }
        self._write_json(root / "config" / "policy.json", payload)

    def _write_raw_rulesets(self, root: Path) -> None:
        payload = [
            {
                "id": 101,
                "name": "docs-governance-main-protection",
                "target": "branch",
                "enforcement": "active",
                "conditions": {
                    "ref_name": {
                        "include": ["refs/heads/main"],
                        "exclude": [],
                    }
                },
                "rules": [
                    {
                        "type": "required_status_checks",
                        "parameters": {
                            "strict_required_status_checks_policy": True,
                            "required_status_checks": [
                                {"context": "docs-merge-required-checks / docs-governance-main"},
                                {"context": "docs-merge-required-checks / registry-integrity"},
                            ],
                        },
                    },
                    {
                        "type": "required_pull_request_reviews",
                        "parameters": {
                            "required_approving_review_count": 1,
                            "required_review_thread_resolution": True,
                        },
                    },
                    {"type": "update"},
                    {"type": "deletion"},
                    {"type": "non_fast_forward"},
                ],
                "bypass_actors": [],
            },
            {
                "id": 102,
                "name": "docs-governance-release-protection",
                "target": "branch",
                "enforcement": "active",
                "conditions": {
                    "ref_name": {
                        "include": ["refs/heads/release/*"],
                        "exclude": [],
                    }
                },
                "rules": [
                    {
                        "type": "required_status_checks",
                        "parameters": {
                            "strict_required_status_checks_policy": True,
                            "required_status_checks": [
                                {"context": "docs-registry-release-check / pre-release-registry-consistency-gate"},
                                {"context": "docs-registry-release-check / release-eligibility"},
                            ],
                        },
                    },
                    {"type": "update"},
                ],
                "bypass_actors": [],
            },
        ]
        self._write_json(root / "fixtures" / "rulesets.json", payload)

    def _write_json(self, path: Path, payload: object) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    unittest.main()
