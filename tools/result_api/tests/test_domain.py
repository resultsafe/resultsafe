import unittest

from tools.result_api.domain import Ok, Err, ErrorDetail, Query, ok, err, result_to_dict


class ResultDomainTests(unittest.TestCase):
    def test_ok_to_dict(self):
        res = ok({"x": 1})
        self.assertEqual(result_to_dict(res), {"ok": True, "value": {"x": 1}})

    def test_err_to_dict(self):
        res = err("not_found", "missing")
        self.assertEqual(
            result_to_dict(res),
            {"ok": False, "error": {"code": "not_found", "message": "missing"}},
        )

    def test_query_validation(self):
        with self.assertRaises(ValueError):
            Query("")
        with self.assertRaises(ValueError):
            Query("bad id")
        self.assertEqual(str(Query("good_id")), "good_id")


if __name__ == "__main__":
    unittest.main()
