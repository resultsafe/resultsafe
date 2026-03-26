from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from tools.automation.application.sync_entity_catalog import (
    ENTITY_CATALOG_JSON_RELATIVE,
    run_sync_entity_catalog,
)
from tools.automation.application.sync_identifiers import run_sync_identifiers
from tools.automation.application.sync_python_parity_registry import run_sync_python_parity_registry
from tools.automation.application.sync_semantic_modules import run_sync_semantic_modules


class SyncEntityCatalogTests(unittest.TestCase):
    def test_builds_unified_entity_catalog_with_relations(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self._create_minimal_repo_fixture(root)

            run_sync_identifiers(root)
            run_sync_semantic_modules(root)
            run_sync_python_parity_registry(root)
            report = run_sync_entity_catalog(root)

            self.assertGreater(report.documents_count, 0)
            self.assertGreater(report.relations_count, 0)

            output_path = root / ENTITY_CATALOG_JSON_RELATIVE
            self.assertTrue(output_path.exists())

            payload = json.loads(output_path.read_text(encoding="utf-8"))
            summary = payload["summary"]
            self.assertGreater(summary["methods_count"], 0)
            self.assertGreater(summary["relations_count"], 0)

            document_ids = {item["entity_identifier"] for item in payload["entities"]["documents"]}
            self.assertIn("DOC-001", document_ids)
            root_document_ids = {item["entity_identifier"] for item in payload["entities"]["root_documents"]}
            self.assertIn("DOC-README-001", root_document_ids)

            relation_pairs = {
                (item["from_entity_identifier"], item["to_entity_identifier"], item["resolution_state"])
                for item in payload["relations"]
                if item["relation_kind"] == "document_link"
            }
            self.assertIn(("DOC-001", "DOC-README-001", "resolved"), relation_pairs)

    def _create_minimal_repo_fixture(self, root: Path) -> None:
        (root / "docs" / "obsidian" / "specs").mkdir(parents=True, exist_ok=True)
        (root / "docs" / "obsidian" / "specs" / "identifier-registry").mkdir(parents=True, exist_ok=True)

        (root / "README.md").write_text(
            "\n".join(
                [
                    "| Поле | Значение |",
                    "|------|----------|",
                    "| ID документа | `DOC-README-001` |",
                    "",
                ]
            ),
            encoding="utf-8",
        )

        (root / "package.json").write_text(
            json.dumps(
                {
                    "name": "fixture",
                    "private": True,
                    "workspaces": ["packages/core/fp/result"],
                },
                ensure_ascii=False,
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )

        obsidian_root = root / "docs" / "obsidian"
        (obsidian_root / "specs" / "DOC-001.md").write_text(
            """---
id: DOC-001
title: "Doc"
type: doc
status: active
created: 2026-03-22
updated: 2026-03-22
links: [DOC-README-001]
tags: [test]
---
# doc
""",
            encoding="utf-8",
        )
        (obsidian_root / "specs" / "index.md").write_text(
            """---
id: SPECS-INDEX
title: "Specs"
type: doc
status: active
created: 2026-03-22
updated: 2026-03-22
links: [DOC-001]
tags: [test]
---
# specs

- [doc](DOC-001.md)
""",
            encoding="utf-8",
        )
        (obsidian_root / "index.md").write_text(
            """---
id: DOC-INDEX
title: "Root"
type: doc
status: active
created: 2026-03-22
updated: 2026-03-22
links: [SPECS-INDEX]
tags: [test]
---
# root

- [specs](specs/index.md)
""",
            encoding="utf-8",
        )

        package_root = root / "packages" / "core" / "fp" / "result"
        (package_root / "src" / "methods").mkdir(parents=True, exist_ok=True)
        (package_root / "__tests__" / "unit" / "methods").mkdir(parents=True, exist_ok=True)
        (package_root / "package.json").write_text(
            json.dumps({"name": "@example/core-fp-result", "version": "0.0.1"}, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        (package_root / "src" / "index.ts").write_text("export * from './methods/index.js';\n", encoding="utf-8")
        (package_root / "src" / "methods" / "index.ts").write_text(
            "export { map } from './map.js';\n",
            encoding="utf-8",
        )
        (package_root / "src" / "methods" / "map.ts").write_text(
            "export const map = <T>(value: T): T => value;\n",
            encoding="utf-8",
        )
        (package_root / "__tests__" / "unit" / "methods" / "map.test.ts").write_text(
            "import { map } from '../../src/methods/map.js';\nmap(1);\n",
            encoding="utf-8",
        )


if __name__ == "__main__":
    unittest.main()
