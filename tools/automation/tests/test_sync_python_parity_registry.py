from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from tools.automation.application.sync_python_parity_registry import (
    OUTPUT_JSON_RELATIVE,
    OUTPUT_MARKDOWN_RELATIVE,
    run_sync_python_parity_registry,
)


class SyncPythonParityRegistryTests(unittest.TestCase):
    def test_generates_python_parity_registry_artifacts(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self._create_python_fixture(root)

            report = run_sync_python_parity_registry(root)

            self.assertEqual(report.packages_count, 6)
            self.assertEqual(report.methods_count, 24)

            registry_json = root / OUTPUT_JSON_RELATIVE
            registry_markdown = root / OUTPUT_MARKDOWN_RELATIVE
            self.assertTrue(registry_json.exists())
            self.assertTrue(registry_markdown.exists())

            payload = json.loads(registry_json.read_text(encoding="utf-8"))
            self.assertEqual(payload["summary"]["packages_count"], 6)
            self.assertEqual(payload["summary"]["methods_count"], 24)

    def _create_python_fixture(self, root: Path) -> None:
        fp = root / "packages" / "python" / "src" / "resultsafe" / "core" / "fp"
        fp.mkdir(parents=True, exist_ok=True)

        (root / "packages" / "python" / "src" / "resultsafe" / "__init__.py").write_text("", encoding="utf-8")
        (root / "packages" / "python" / "src" / "resultsafe" / "core" / "__init__.py").write_text("", encoding="utf-8")
        (fp / "__init__.py").write_text("", encoding="utf-8")

        for module_name in ("result", "option", "either", "task", "task_result", "effect"):
            (fp / f"{module_name}.py").write_text("", encoding="utf-8")


if __name__ == "__main__":
    unittest.main()
