from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from tools.automation.application.readme_create import run_readme_create


class ReadmeCreateTests(unittest.TestCase):
    def test_generates_markdown_from_jsdoc(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            src = root / "src"
            src.mkdir(parents=True)
            ts_file = src / "Result.ts"
            ts_file.write_text(
                """/**
 * Описание сущности результата.
 * @example
 * const x = 1;
 */
export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
""",
                encoding="utf-8",
            )
            out = root / "README.md"
            meta = run_readme_create(src, out)
            self.assertEqual(meta["items_count"], 1)
            content = out.read_text(encoding="utf-8")
            self.assertIn("`Result`", content)
            self.assertIn("const x = 1;", content)


if __name__ == "__main__":
    unittest.main()

