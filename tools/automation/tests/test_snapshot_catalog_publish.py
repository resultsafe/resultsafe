from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from tools.automation.application.snapshot_catalog import (
    MANDATORY_DATASETS,
    SnapshotPublishRequest,
    run_snapshot_publish,
    run_snapshot_validate,
)


class SnapshotCatalogPublishTests(unittest.TestCase):
    def test_publish_and_validate_snapshot_with_idempotency(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self._create_repo_fixture(root)

            request = SnapshotPublishRequest(
                root=root,
                storage_root=root / "dist" / "snapshot-store",
                repository_id="repo_fixture",
                scan_id="scan_001",
                commit_hash="abc123",
                branch_name="main",
                snapshot_kind="full",
                extractor_version="1.0.0",
                schema_version="v1",
                storage_format_version="1.0",
            )

            first_report = run_snapshot_publish(request)
            self.assertTrue(first_report.is_success)
            self.assertFalse(first_report.reused_existing_snapshot)

            manifest = json.loads(Path(first_report.manifest_file).read_text(encoding="utf-8"))
            dataset_names = {entry["dataset_name"] for entry in manifest["datasets"]}
            self.assertEqual(dataset_names, set(MANDATORY_DATASETS))

            validation_report = run_snapshot_validate(
                storage_root=request.storage_root,
                repository_id=request.repository_id,
                snapshot_id=first_report.snapshot_id,
            )
            self.assertTrue(validation_report.is_success)

            second_report = run_snapshot_publish(request)
            self.assertTrue(second_report.is_success)
            self.assertTrue(second_report.reused_existing_snapshot)
            self.assertEqual(second_report.snapshot_id, first_report.snapshot_id)

    def _create_repo_fixture(self, root: Path) -> None:
        (root / "docs" / "obsidian").mkdir(parents=True, exist_ok=True)
        (root / "docs" / "obsidian" / "index.md").write_text("# Docs\n", encoding="utf-8")

        package_root = root / "packages" / "core" / "fp" / "result"
        (package_root / "src").mkdir(parents=True, exist_ok=True)
        (package_root / "package.json").write_text(
            json.dumps({"name": "@fixture/core-fp-result", "version": "0.0.1"}, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        (package_root / "src" / "index.ts").write_text(
            "export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };\n"
            "export const map = <T>(value: T): T => value;\n",
            encoding="utf-8",
        )


if __name__ == "__main__":
    unittest.main()
