import unittest

from tools.result_api.application.handlers import handle_request, DefaultResultService
from tools.result_api.infrastructure.repositories import InMemoryResultRepository


class ApplicationTests(unittest.TestCase):
    def test_handle_ok(self):
        res = handle_request("demo")
        self.assertTrue(res["ok"])
        self.assertIn("message", res["value"])

    def test_handle_not_found(self):
        res = handle_request("missing")
        self.assertFalse(res["ok"])
        self.assertEqual(res["error"]["code"], "not_found")

    def test_handle_invalid(self):
        res = handle_request("bad id")
        self.assertFalse(res["ok"])
        self.assertEqual(res["error"]["code"], "invalid_id")


if __name__ == "__main__":
    unittest.main()
