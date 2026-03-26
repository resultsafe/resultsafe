from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from tools.automation.application.snapshot_catalog import (
    CATALOG_SQL_FILE_RELATIVE,
    run_catalog_create_database,
)


class SnapshotCatalogPostgresqlTests(unittest.TestCase):
    def test_rejects_invalid_postgresql_database_name(self) -> None:
        with self.assertRaises(ValueError):
            run_catalog_create_database(admin_dsn="postgresql://user:pass@localhost/postgres", database_name="bad-name")

    def test_catalog_sql_file_contains_required_projection_tables(self) -> None:
        sql_file = CATALOG_SQL_FILE_RELATIVE.resolve()
        content = sql_file.read_text(encoding="utf-8")
        self.assertIn("CREATE TABLE IF NOT EXISTS catalog.snapshot_manifest_index", content)
        self.assertIn("CREATE TABLE IF NOT EXISTS catalog.projection_repository_files", content)
        self.assertIn("CREATE TABLE IF NOT EXISTS catalog.projection_methods", content)
        self.assertIn("CREATE TABLE IF NOT EXISTS catalog.projection_relations", content)

    def test_catalog_sql_path_can_be_copied_to_temp_context(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "schema.sql"
            target.write_text(CATALOG_SQL_FILE_RELATIVE.resolve().read_text(encoding="utf-8"), encoding="utf-8")
            self.assertTrue(target.exists())
            self.assertGreater(target.stat().st_size, 100)


if __name__ == "__main__":
    unittest.main()
