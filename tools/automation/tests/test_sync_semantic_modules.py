from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from tools.automation.application.sync_semantic_modules import (
    SEMANTIC_LAYER_MARKDOWN_RELATIVE,
    SEMANTIC_REGISTRY_JSON_RELATIVE,
    run_sync_semantic_modules,
)
from tools.automation.application.sync_identifiers import (
    REGISTRY_DIR_RELATIVE,
    REGISTRY_JSON_FILE_NAME,
    STATUS_COMPLETED,
    STATUS_IN_ADJUSTMENT,
    STATUS_PLANNED,
)


class SyncSemanticModulesTests(unittest.TestCase):
    def test_generates_semantic_registry_json_and_markdown_layer(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self._create_fixture(root)

            report = run_sync_semantic_modules(root)

            self.assertEqual(report.semantic_modules_count, 14)
            self.assertEqual(report.primary_methods_count, 39)
            self.assertEqual(report.supplemental_methods_count, 3)
            self.assertEqual(report.type_entries_count, 3)
            self.assertGreater(report.resolved_methods_count, 0)

            registry_json_path = root / SEMANTIC_REGISTRY_JSON_RELATIVE
            layer_markdown_path = root / SEMANTIC_LAYER_MARKDOWN_RELATIVE
            self.assertTrue(registry_json_path.exists())
            self.assertTrue(layer_markdown_path.exists())

            payload = json.loads(registry_json_path.read_text(encoding="utf-8"))
            self.assertEqual(payload["summary"]["modules_count"], 14)
            self.assertEqual(payload["summary"]["primary_methods_count"], 39)
            self.assertEqual(payload["summary"]["supplemental_methods_count"], 3)

            module_map = {item["module_id"]: item for item in payload["modules"]}
            self.assertEqual(module_map[4]["implementation_status"], STATUS_COMPLETED)
            self.assertEqual(module_map[1]["implementation_status"], STATUS_PLANNED)

            markdown = layer_markdown_path.read_text(encoding="utf-8")
            self.assertIn("semantic-modules-fp-result-layer", markdown)
            self.assertIn("pnpm run docs:sync-semantic-modules", markdown)

    def _create_fixture(self, root: Path) -> None:
        registry_dir = root / REGISTRY_DIR_RELATIVE
        registry_dir.mkdir(parents=True, exist_ok=True)

        methods = [
            {
                "method_identifier": "METHOD-000157",
                "package_name": "@resultsafe/core-fp-result",
                "project_method_name": "Err",
                "rust_original_method_identifier": "41",
                "rust_original_method_name": "Err(error)",
                "source_path": "packages/core/fp/result/src/constructors/Err.ts",
                "implementation_status": STATUS_COMPLETED,
            },
            {
                "method_identifier": "METHOD-000158",
                "package_name": "@resultsafe/core-fp-result",
                "project_method_name": "Ok",
                "rust_original_method_identifier": "40",
                "rust_original_method_name": "Ok(value)",
                "source_path": "packages/core/fp/result/src/constructors/Ok.ts",
                "implementation_status": STATUS_COMPLETED,
            },
            {
                "method_identifier": "METHOD-000166",
                "package_name": "@resultsafe/core-fp-result",
                "project_method_name": "isErr",
                "rust_original_method_identifier": "2",
                "rust_original_method_name": "is_err",
                "source_path": "packages/core/fp/result/src/guards/isErr.ts",
                "implementation_status": STATUS_IN_ADJUSTMENT,
            },
            {
                "method_identifier": "METHOD-000168",
                "package_name": "@resultsafe/core-fp-result",
                "project_method_name": "isOk",
                "rust_original_method_identifier": "1",
                "rust_original_method_name": "is_ok",
                "source_path": "packages/core/fp/result/src/guards/isOk.ts",
                "implementation_status": STATUS_IN_ADJUSTMENT,
            },
            {
                "method_identifier": "METHOD-000174",
                "package_name": "@resultsafe/core-fp-result",
                "project_method_name": "match",
                "rust_original_method_identifier": None,
                "rust_original_method_name": None,
                "source_path": "packages/core/fp/result/src/methods/match.ts",
                "implementation_status": STATUS_COMPLETED,
            },
            {
                "method_identifier": "METHOD-000191",
                "package_name": "@resultsafe/core-fp-result",
                "project_method_name": "не определено (цель по Rust: contains)",
                "rust_original_method_identifier": "5",
                "rust_original_method_name": "contains",
                "source_path": "не реализовано",
                "implementation_status": STATUS_PLANNED,
            },
            {
                "method_identifier": "METHOD-000291",
                "package_name": "@resultsafe/core-fp-union",
                "project_method_name": "isResult",
                "rust_original_method_identifier": None,
                "rust_original_method_name": None,
                "source_path": "packages/core/fp/union/src/guards/isResult.ts",
                "implementation_status": STATUS_IN_ADJUSTMENT,
            },
        ]
        payload = {
            "version": "1.0",
            "generated_at": "2026-03-22",
            "status_catalog": {},
            "packages": [],
            "methods": methods,
        }
        (registry_dir / REGISTRY_JSON_FILE_NAME).write_text(
            json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

        for type_path in [
            "packages/core/fp/result-shared/src/types/Result.ts",
            "packages/core/fp/result-shared/src/types/Ok.ts",
            "packages/core/fp/result-shared/src/types/Err.ts",
        ]:
            full_path = root / type_path
            full_path.parent.mkdir(parents=True, exist_ok=True)
            full_path.write_text("export type T = unknown;\n", encoding="utf-8")


if __name__ == "__main__":
    unittest.main()



