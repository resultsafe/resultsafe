from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from tools.automation.application.check_links import run_check_links


class CheckLinksTests(unittest.TestCase):
    def test_detects_missing_markdown_link(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "docs").mkdir(parents=True)
            md = root / "docs" / "a.md"
            md.write_text("[broken](missing.md)\n", encoding="utf-8")

            report = run_check_links(root)
            self.assertEqual(report.checked_files, 1)
            self.assertEqual(len(report.missing_links), 1)
            self.assertEqual(report.missing_links[0].link_type, "markdown")

    def test_ignores_links_inside_fenced_code(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "docs").mkdir(parents=True)
            md = root / "docs" / "a.md"
            md.write_text("```md\n[broken](missing.md)\n```\n", encoding="utf-8")

            report = run_check_links(root)
            self.assertTrue(report.is_success)

    def test_wikilink_basename_fallback(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "docs").mkdir(parents=True)
            (root / "docs" / "target-note.md").write_text("# t\n", encoding="utf-8")
            (root / "docs" / "source.md").write_text("[[target-note]]\n", encoding="utf-8")

            report = run_check_links(root)
            self.assertTrue(report.is_success)

    def test_ignores_node_modules_by_noise_patterns(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "docs").mkdir(parents=True)
            (root / "docs" / "ok.md").write_text("# ok\n", encoding="utf-8")
            (root / "node_modules" / "pkg").mkdir(parents=True)
            (root / "node_modules" / "pkg" / "broken.md").write_text("[broken](missing.md)\n", encoding="utf-8")

            report = run_check_links(root)
            self.assertEqual(report.checked_files, 1)
            self.assertTrue(report.is_success)


if __name__ == "__main__":
    unittest.main()
