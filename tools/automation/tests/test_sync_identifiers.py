from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from tools.automation.application.sync_identifiers import (
    ASSIGNMENTS_FILE_NAME,
    REGISTRY_DIR_RELATIVE,
    REGISTRY_JSON_FILE_NAME,
    REGISTRY_MARKDOWN_FILE_RELATIVE,
    run_sync_identifiers,
)


class SyncIdentifiersTests(unittest.TestCase):
    def test_generates_registry_and_preserves_identifiers_between_runs(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self._create_minimal_repo_fixture(root)

            first_report = run_sync_identifiers(root)
            self.assertEqual(first_report.packages_count, 1)
            self.assertGreaterEqual(first_report.methods_count, 2)

            assignments_path = root / REGISTRY_DIR_RELATIVE / ASSIGNMENTS_FILE_NAME
            registry_json_path = root / REGISTRY_DIR_RELATIVE / REGISTRY_JSON_FILE_NAME
            registry_markdown_path = root / REGISTRY_MARKDOWN_FILE_RELATIVE

            self.assertTrue(assignments_path.exists())
            self.assertTrue(registry_json_path.exists())
            self.assertTrue(registry_markdown_path.exists())

            assignments_before = json.loads(assignments_path.read_text(encoding="utf-8"))
            package_id_before = assignments_before["package_identifiers"]["@example/core-fp-result"]
            method_id_before = assignments_before["method_identifiers"]["@example/core-fp-result::map"]

            second_report = run_sync_identifiers(root)
            self.assertEqual(second_report.packages_count, 1)

            assignments_after = json.loads(assignments_path.read_text(encoding="utf-8"))
            self.assertEqual(
                assignments_after["package_identifiers"]["@example/core-fp-result"],
                package_id_before,
            )
            self.assertEqual(
                assignments_after["method_identifiers"]["@example/core-fp-result::map"],
                method_id_before,
            )

    def _create_minimal_repo_fixture(self, root: Path) -> None:
        (root / "docs" / "obsidian" / "specs").mkdir(parents=True, exist_ok=True)
        (root / "docs" / "obsidian" / "specs" / "identifier-registry").mkdir(parents=True, exist_ok=True)

        (root / "package.json").write_text(
            json.dumps(
                {
                    "name": "fixture",
                    "private": True,
                    "workspaces": ["packages/core/fp/result"],
                },
                ensure_ascii=False,
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )

        package_root = root / "packages" / "core" / "fp" / "result"
        (package_root / "src" / "methods").mkdir(parents=True, exist_ok=True)
        (package_root / "__tests__" / "unit" / "methods").mkdir(parents=True, exist_ok=True)

        (package_root / "package.json").write_text(
            json.dumps({"name": "@example/core-fp-result", "version": "0.0.1"}, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

        (package_root / "src" / "index.ts").write_text(
            "export * from './methods/index.js';\n",
            encoding="utf-8",
        )
        (package_root / "src" / "methods" / "index.ts").write_text(
            "export { map } from './map.js';\nexport { unwrap } from './unwrap.js';\n",
            encoding="utf-8",
        )
        (package_root / "src" / "methods" / "map.ts").write_text(
            "export const map = <T>(value: T): T => value;\n",
            encoding="utf-8",
        )
        (package_root / "src" / "methods" / "unwrap.ts").write_text(
            "export const unwrap = <T>(value: T): T => value;\n",
            encoding="utf-8",
        )
        (package_root / "__tests__" / "unit" / "methods" / "map.test.ts").write_text(
            "import { map } from '../../src/methods/map.js';\nmap(1);\n",
            encoding="utf-8",
        )


if __name__ == "__main__":
    unittest.main()

