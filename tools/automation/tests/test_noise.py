from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from tools.automation.shared.noise import is_noise_path, load_noise_patterns


class NoisePatternsTests(unittest.TestCase):
    def test_loads_default_patterns_when_config_missing(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            patterns = load_noise_patterns(root)
            self.assertTrue(any("node_modules" in pattern for pattern in patterns))

    def test_uses_repo_noise_config_and_matches_dist(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "config").mkdir(parents=True)
            (root / "config" / "noise-ignore.txt").write_text("**/dist/**\n", encoding="utf-8")
            dist_file = root / "packages" / "core" / "dist" / "index.md"
            dist_file.parent.mkdir(parents=True)
            dist_file.write_text("# d\n", encoding="utf-8")

            patterns = load_noise_patterns(root)
            self.assertTrue(is_noise_path(dist_file, root, patterns))


if __name__ == "__main__":
    unittest.main()
