from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from tools.automation.application.sync_registries import run_sync_registries
from tools.automation.application.sync_entity_catalog import ENTITY_CATALOG_JSON_RELATIVE
from tools.automation.application.sync_semantic_modules import (
    SEMANTIC_LAYER_MARKDOWN_RELATIVE,
    SEMANTIC_REGISTRY_JSON_RELATIVE,
)
from tools.automation.application.sync_identifiers import (
    REGISTRY_DIR_RELATIVE,
    REGISTRY_JSON_FILE_NAME,
)


class SyncRegistriesTests(unittest.TestCase):
    def test_orchestrates_identifiers_then_semantic_layers(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self._create_minimal_repo_fixture(root)

            report = run_sync_registries(root)

            self.assertGreaterEqual(report.identifiers_report.packages_count, 1)
            self.assertGreaterEqual(report.identifiers_report.methods_count, 1)
            self.assertEqual(report.semantic_report.semantic_modules_count, 14)
            self.assertGreater(report.entity_catalog_report.relations_count, 0)

            identifiers_json = root / REGISTRY_DIR_RELATIVE / REGISTRY_JSON_FILE_NAME
            semantic_json = root / SEMANTIC_REGISTRY_JSON_RELATIVE
            semantic_layer = root / SEMANTIC_LAYER_MARKDOWN_RELATIVE
            entity_catalog_json = root / ENTITY_CATALOG_JSON_RELATIVE
            self.assertTrue(identifiers_json.exists())
            self.assertTrue(semantic_json.exists())
            self.assertTrue(semantic_layer.exists())
            self.assertTrue(entity_catalog_json.exists())

            payload = json.loads(semantic_json.read_text(encoding="utf-8"))
            self.assertEqual(payload["summary"]["modules_count"], 14)

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
            "export { map } from './map.js';\n",
            encoding="utf-8",
        )
        (package_root / "src" / "methods" / "map.ts").write_text(
            "export const map = <T>(value: T): T => value;\n",
            encoding="utf-8",
        )
        (package_root / "__tests__" / "unit" / "methods" / "map.test.ts").write_text(
            "import { map } from '../../src/methods/map.js';\nmap(1);\n",
            encoding="utf-8",
        )


if __name__ == "__main__":
    unittest.main()
