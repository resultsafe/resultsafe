from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from tools.automation.application.sync_noise_ignores import run_sync_noise_ignores


class SyncNoiseIgnoresTests(unittest.TestCase):
    def test_sync_generates_rg_and_prettier_from_noise_config(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "config").mkdir(parents=True)
            (root / "config" / "noise-ignore.txt").write_text(
                "\n".join(
                    [
                        "# comment",
                        "",
                        "**/node_modules/**",
                        "**/dist/**",
                    ]
                )
                + "\n",
                encoding="utf-8",
            )

            report = run_sync_noise_ignores(root)

            rgignore = (root / ".rgignore").read_text(encoding="utf-8")
            prettierignore = (root / ".prettierignore").read_text(encoding="utf-8")

            self.assertGreater(report.noise_patterns_count, 0)
            self.assertIn("**/node_modules/**", rgignore)
            self.assertIn("**/dist/**", rgignore)
            self.assertIn(".env", prettierignore)
            self.assertIn("*.env.*", prettierignore)
            self.assertIn("**/out/", prettierignore)
            self.assertIn("**/dist/", prettierignore)
            self.assertIn("**/dist/**", prettierignore)

    def test_sync_is_idempotent(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "config").mkdir(parents=True)
            (root / "config" / "noise-ignore.txt").write_text("**/dist/**\n", encoding="utf-8")

            run_sync_noise_ignores(root)
            first_rgignore = (root / ".rgignore").read_text(encoding="utf-8")
            first_prettierignore = (root / ".prettierignore").read_text(encoding="utf-8")

            run_sync_noise_ignores(root)
            second_rgignore = (root / ".rgignore").read_text(encoding="utf-8")
            second_prettierignore = (root / ".prettierignore").read_text(encoding="utf-8")

            self.assertEqual(first_rgignore, second_rgignore)
            self.assertEqual(first_prettierignore, second_prettierignore)


if __name__ == "__main__":
    unittest.main()
