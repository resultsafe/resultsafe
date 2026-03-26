import json
import subprocess
import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
CLI = ROOT / "tools" / "result_api" / "interface" / "cli" / "result_tool.py"


class CliTests(unittest.TestCase):
    def test_cli_ok(self):
        completed = subprocess.run(
            [sys.executable, str(CLI), "--id", "demo"],
            capture_output=True,
            text=True,
        )
        self.assertEqual(completed.returncode, 0)
        data = json.loads(completed.stdout.strip())
        self.assertTrue(data["ok"])

    def test_cli_not_found(self):
        completed = subprocess.run(
            [sys.executable, str(CLI), "--id", "missing"],
            capture_output=True,
            text=True,
        )
        self.assertEqual(completed.returncode, 1)
        data = json.loads(completed.stdout.strip())
        self.assertFalse(data["ok"])
        self.assertEqual(data["error"]["code"], "not_found")


if __name__ == "__main__":
    unittest.main()
