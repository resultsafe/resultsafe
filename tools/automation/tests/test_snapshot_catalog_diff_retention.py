from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from tools.automation.application.snapshot_catalog import (
    SnapshotPublishRequest,
    run_snapshot_diff,
    run_snapshot_publish,
    run_snapshot_retention,
)


class SnapshotCatalogDiffRetentionTests(unittest.TestCase):
    def test_diff_and_retention_reports(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self._create_repo_fixture(root)
            storage_root = root / "dist" / "snapshot-store"

            dataset_v1 = root / "dataset-v1.json"
            dataset_v2 = root / "dataset-v2.json"
            dataset_v1.write_text(
                json.dumps(
                    {
                        "methods": [
                            {
                                "method_id": "method_001",
                                "method_name": "map",
                                "language": "typescript",
                                "source_file_path": "packages/core/fp/result/src/index.ts",
                                "signature": "map(value)",
                                "is_async": False,
                            }
                        ]
                    },
                    ensure_ascii=False,
                    indent=2,
                )
                + "\n",
                encoding="utf-8",
            )
            dataset_v2.write_text(
                json.dumps(
                    {
                        "methods": [
                            {
                                "method_id": "method_001",
                                "method_name": "map",
                                "language": "typescript",
                                "source_file_path": "packages/core/fp/result/src/index.ts",
                                "signature": "map(value, mapper)",
                                "is_async": False,
                            }
                        ]
                    },
                    ensure_ascii=False,
                    indent=2,
                )
                + "\n",
                encoding="utf-8",
            )

            report_v1 = run_snapshot_publish(
                SnapshotPublishRequest(
                    root=root,
                    storage_root=storage_root,
                    repository_id="repo_fixture",
                    scan_id="scan_001",
                    commit_hash="abc123",
                    branch_name="main",
                    snapshot_kind="full",
                    extractor_version="1.0.0",
                    schema_version="v1",
                    storage_format_version="1.0",
                    datasets_json_file=dataset_v1,
                )
            )
            report_v2 = run_snapshot_publish(
                SnapshotPublishRequest(
                    root=root,
                    storage_root=storage_root,
                    repository_id="repo_fixture",
                    scan_id="scan_002",
                    commit_hash="def456",
                    branch_name="main",
                    snapshot_kind="full",
                    extractor_version="1.0.0",
                    schema_version="v1",
                    storage_format_version="1.0",
                    datasets_json_file=dataset_v2,
                )
            )

            self.assertTrue(report_v1.is_success)
            self.assertTrue(report_v2.is_success)
            self.assertNotEqual(report_v1.snapshot_id, report_v2.snapshot_id)

            diff_report = run_snapshot_diff(
                storage_root=storage_root,
                repository_id="repo_fixture",
                from_snapshot_id=report_v1.snapshot_id,
                to_snapshot_id=report_v2.snapshot_id,
            )
            self.assertIn("methods", diff_report.changed_datasets)

            retention_report = run_snapshot_retention(
                storage_root=storage_root,
                repository_id="repo_fixture",
                keep_daily=1,
                keep_weekly=0,
                keep_monthly=0,
                apply=False,
            )
            self.assertGreaterEqual(retention_report.snapshots_marked_for_deletion, 1)

    def _create_repo_fixture(self, root: Path) -> None:
        (root / "docs" / "obsidian").mkdir(parents=True, exist_ok=True)
        (root / "docs" / "obsidian" / "index.md").write_text("# Docs\n", encoding="utf-8")

        package_root = root / "packages" / "core" / "fp" / "result"
        (package_root / "src").mkdir(parents=True, exist_ok=True)
        (package_root / "package.json").write_text(
            json.dumps({"name": "@fixture/core-fp-result", "version": "0.0.1"}, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        (package_root / "src" / "index.ts").write_text("export const map = <T>(value: T): T => value;\n", encoding="utf-8")


if __name__ == "__main__":
    unittest.main()
