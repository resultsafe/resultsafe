from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from tools.automation.application.file_inventory import run_file_inventory
from tools.automation.cli import main


class FileInventoryTests(unittest.TestCase):
    def test_run_file_inventory_collects_markdown_and_script_metadata(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self._create_fixture(root)

            output_file = root / "dist" / "inventory.json"
            report = run_file_inventory(root=root, output_file=output_file)

            self.assertTrue(output_file.exists())
            self.assertTrue(report.is_success)
            self.assertGreater(report.files_count, 0)

            payload = json.loads(output_file.read_text(encoding="utf-8"))
            files = payload["files"]
            relative_paths = {item["relative_path"] for item in files}

            self.assertIn("docs/index.md", relative_paths)
            self.assertIn("scripts/build.py", relative_paths)
            self.assertNotIn("node_modules/lib/index.js", relative_paths)
            self.assertNotIn("scripts/readme.txt", relative_paths)

            docs_entry = next(item for item in files if item["relative_path"] == "docs/index.md")
            self.assertEqual(docs_entry["file_kind"], "markdown")
            self.assertEqual(docs_entry["language_hint"], "markdown")
            self.assertIn("sha256", docs_entry)
            self.assertIn("md5", docs_entry)
            self.assertIn("newline_style", docs_entry)
            self.assertIn("contains_non_ascii", docs_entry)

            summary = payload["summary"]
            self.assertIn("total_lines", summary)
            self.assertIn("by_extension", summary)

    def test_run_file_inventory_respects_toml_filters_and_package_scope(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self._create_fixture(root)

            config_file = root / "config" / "inventory.toml"
            config_file.parent.mkdir(parents=True, exist_ok=True)
            config_file.write_text(
                """
[scope]
include_repo_root = false
include_all_packages = true

[filters]
include_markdown = true
script_extensions = [".py", ".ts"]
exclude_globs = ["**/README.md"]
exclude_file_names = ["secret*.md"]
exclude_extensions = [".ts"]
exclude_directories = ["packages/core/fp/result/docs/generated"]
""".strip()
                + "\n",
                encoding="utf-8",
            )

            output_file = root / "dist" / "inventory-filtered.json"
            report = run_file_inventory(root=root, output_file=output_file, config_file=config_file)

            self.assertTrue(report.is_success)
            payload = json.loads(output_file.read_text(encoding="utf-8"))
            relative_paths = {item["relative_path"] for item in payload["files"]}

            self.assertIn("packages/core/fp/result/tools/build.py", relative_paths)
            self.assertIn("packages/core/fp/result/docs/guide.md", relative_paths)
            self.assertNotIn("docs/index.md", relative_paths)
            self.assertNotIn("packages/core/fp/result/src/index.ts", relative_paths)
            self.assertNotIn("packages/core/fp/result/README.md", relative_paths)
            self.assertNotIn("packages/core/fp/result/docs/secret-plan.md", relative_paths)
            self.assertNotIn("packages/core/fp/result/docs/generated/auto.md", relative_paths)

    def test_cli_docs_file_inventory_command_generates_json(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self._create_fixture(root)

            output_file = root / "dist" / "cli-inventory.json"
            exit_code = main(
                [
                    "docs",
                    "file-inventory",
                    "--root",
                    str(root),
                    "--output-file",
                    str(output_file),
                    "--include-repo-root",
                    "false",
                    "--package",
                    "packages/core/fp/result",
                ]
            )

            self.assertEqual(exit_code, 0)
            self.assertTrue(output_file.exists())

            payload = json.loads(output_file.read_text(encoding="utf-8"))
            self.assertEqual(payload["status"], "ok")
            self.assertIn("packages/core/fp/result", payload["settings"]["selected_packages"])
            self.assertGreater(payload["summary"]["files_count"], 0)

    def _create_fixture(self, root: Path) -> None:
        (root / "docs").mkdir(parents=True, exist_ok=True)
        (root / "scripts").mkdir(parents=True, exist_ok=True)
        (root / "node_modules" / "lib").mkdir(parents=True, exist_ok=True)

        (root / "docs" / "index.md").write_text("# Docs\n", encoding="utf-8")
        (root / "scripts" / "build.py").write_text("#!/usr/bin/env python3\nprint('ok')\n", encoding="utf-8")
        (root / "scripts" / "readme.txt").write_text("not included\n", encoding="utf-8")
        (root / "node_modules" / "lib" / "index.js").write_text("console.log('ignore')\n", encoding="utf-8")

        package_root = root / "packages" / "core" / "fp" / "result"
        (package_root / "src").mkdir(parents=True, exist_ok=True)
        (package_root / "tools").mkdir(parents=True, exist_ok=True)
        (package_root / "docs" / "generated").mkdir(parents=True, exist_ok=True)

        (package_root / "package.json").write_text(
            json.dumps({"name": "@resultsafe-fp-result", "version": "0.0.1"}, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        (package_root / "src" / "index.ts").write_text("export const value = 1;\n", encoding="utf-8")
        (package_root / "tools" / "build.py").write_text("print('package')\n", encoding="utf-8")
        (package_root / "README.md").write_text("# Package\n", encoding="utf-8")
        (package_root / "docs" / "guide.md").write_text("# Guide\n", encoding="utf-8")
        (package_root / "docs" / "secret-plan.md").write_text("# Secret\n", encoding="utf-8")
        (package_root / "docs" / "generated" / "auto.md").write_text("# Auto\n", encoding="utf-8")


if __name__ == "__main__":
    unittest.main()

