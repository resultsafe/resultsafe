from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from tools.automation.application.verify_docs import run_verify_docs


def _index_fm(index_id: str, uuid_value: str) -> str:
    return f"""---
id: {index_id}
uuid: {uuid_value}
title: "Index"
type: doc
status: active
layer: authored
lang: en
kb_lifecycle: current
created: 2026-03-22
updated: 2026-03-22
links: []
tags: [test]
---
"""


def _seed_registry_files(root: Path) -> None:
    registry_dir = root / "docs" / "obsidian" / "specs" / "identifier-registry"
    registry_dir.mkdir(parents=True, exist_ok=True)
    (registry_dir / "MONOREPO-IDENTIFIER-REGISTRY.json").write_text(
        '{"packages":[],"methods":[]}\n',
        encoding="utf-8",
    )
    (registry_dir / "MONOREPO-ENTITY-CATALOG.json").write_text(
        json.dumps(
            {
                "summary": {"unresolved_relations_count": 0},
                "entities": {
                    "documents": [
                        {"entity_identifier": "CONCEPT-001"},
                        {"entity_identifier": "CONCEPTS-INDEX"},
                        {"entity_identifier": "DOC-INDEX"},
                        {"entity_identifier": "SPECS-INDEX"},
                        {"entity_identifier": "DOC-001"},
                        {"entity_identifier": "DOC-002"},
                    ]
                },
            }
        )
        + "\n",
        encoding="utf-8",
    )


class VerifyDocsTests(unittest.TestCase):
    def test_verify_docs_success_on_minimal_valid_tree(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            obsidian = root / "docs" / "obsidian"
            concepts = obsidian / "concepts"
            concept_materials = concepts / "CONCEPT-001"
            concept_materials.mkdir(parents=True)

            concept_doc = concepts / "CONCEPT-001-main.md"
            concept_doc.write_text(
                """---
id: CONCEPT-001
uuid: 11111111-1111-4111-8111-111111111111
title: "Concept"
type: concept
status: captured
layer: authored
lang: en
kb_lifecycle: current
created: 2026-03-22
updated: 2026-03-22
tags: [test]
---
# concept
""",
                encoding="utf-8",
            )
            ai_session = concept_materials / "ai-session-2026-03-22.md"
            ai_session.write_text(
                """---
concept: CONCEPT-001
date: 2026-03-22
ai_tool: chatgpt
model: gpt-5
---
# session
""",
                encoding="utf-8",
            )
            concepts_index = concepts / "index.md"
            concepts_index.write_text(
                _index_fm("CONCEPTS-INDEX", "22222222-2222-4222-8222-222222222222")
                + "\n# index\n\n- [CONCEPT-001-main](CONCEPT-001-main.md)\n- [ai](CONCEPT-001/ai-session-2026-03-22.md)\n",
                encoding="utf-8",
            )
            obsidian_index = obsidian / "index.md"
            obsidian_index.write_text(
                _index_fm("DOC-INDEX", "33333333-3333-4333-8333-333333333333")
                + "\n# root\n\n- [concepts/index](concepts/index.md)\n",
                encoding="utf-8",
            )
            _seed_registry_files(root)

            report = run_verify_docs(root)
            self.assertTrue(report.is_success, msg=[(i.check, i.message) for i in report.issues])

    def test_verify_docs_fails_on_ai_session_missing_model(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            obsidian = root / "docs" / "obsidian"
            concepts = obsidian / "concepts"
            concept_materials = concepts / "CONCEPT-001"
            concept_materials.mkdir(parents=True)

            (concepts / "CONCEPT-001-main.md").write_text(
                """---
id: CONCEPT-001
uuid: 11111111-1111-4111-8111-111111111111
title: "Concept"
type: concept
status: captured
layer: authored
lang: en
kb_lifecycle: current
created: 2026-03-22
updated: 2026-03-22
tags: [test]
---
""",
                encoding="utf-8",
            )
            (concept_materials / "ai-session-2026-03-22.md").write_text(
                """---
concept: CONCEPT-001
date: 2026-03-22
ai_tool: chatgpt
---
""",
                encoding="utf-8",
            )
            (concepts / "index.md").write_text(
                _index_fm("CONCEPTS-INDEX", "22222222-2222-4222-8222-222222222222")
                + "\n# index\n\n- [CONCEPT-001-main](CONCEPT-001-main.md)\n- [ai](CONCEPT-001/ai-session-2026-03-22.md)\n",
                encoding="utf-8",
            )
            (obsidian / "index.md").write_text(
                _index_fm("DOC-INDEX", "33333333-3333-4333-8333-333333333333")
                + "\n# root\n\n- [concepts/index](concepts/index.md)\n",
                encoding="utf-8",
            )
            _seed_registry_files(root)

            report = run_verify_docs(root)
            self.assertFalse(report.is_success)
            messages = [issue.message for issue in report.issues]
            self.assertTrue(any("Missing required field 'model'" in m for m in messages))

    def test_verify_docs_fails_on_duplicate_document_id(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            obsidian = root / "docs" / "obsidian"
            specs = obsidian / "specs"
            specs.mkdir(parents=True)

            shared_frontmatter = """---
id: DOC-001
uuid: 11111111-1111-4111-8111-111111111111
title: "Doc"
type: doc
status: active
layer: authored
lang: en
kb_lifecycle: current
created: 2026-03-22
updated: 2026-03-22
links: []
tags: [test]
---
"""

            (specs / "DOC-001-a.md").write_text(shared_frontmatter + "\n# a\n", encoding="utf-8")
            (specs / "DOC-001-b.md").write_text(
                shared_frontmatter.replace(
                    "11111111-1111-4111-8111-111111111111",
                    "22222222-2222-4222-8222-222222222222",
                )
                + "\n# b\n",
                encoding="utf-8",
            )
            (specs / "index.md").write_text(
                _index_fm("SPECS-INDEX", "33333333-3333-4333-8333-333333333333")
                + "\n# specs\n\n- [a](DOC-001-a.md)\n- [b](DOC-001-b.md)\n",
                encoding="utf-8",
            )
            (obsidian / "index.md").write_text(
                _index_fm("DOC-INDEX", "44444444-4444-4444-8444-444444444444")
                + "\n# root\n\n- [specs](specs/index.md)\n",
                encoding="utf-8",
            )
            _seed_registry_files(root)

            report = run_verify_docs(root)
            self.assertFalse(report.is_success)
            checks = [issue.check for issue in report.issues]
            self.assertIn("frontmatter-id-uniqueness", checks)

    def test_verify_docs_fails_on_duplicate_document_uuid(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            obsidian = root / "docs" / "obsidian"
            specs = obsidian / "specs"
            specs.mkdir(parents=True)

            (specs / "DOC-001-a.md").write_text(
                """---
id: DOC-001
uuid: 11111111-1111-4111-8111-111111111111
title: "Doc A"
type: doc
status: active
layer: authored
lang: en
kb_lifecycle: current
created: 2026-03-22
updated: 2026-03-22
links: []
tags: [test]
---
# a
""",
                encoding="utf-8",
            )
            (specs / "DOC-002-b.md").write_text(
                """---
id: DOC-002
uuid: 11111111-1111-4111-8111-111111111111
title: "Doc B"
type: doc
status: active
layer: authored
lang: en
kb_lifecycle: current
created: 2026-03-22
updated: 2026-03-22
links: []
tags: [test]
---
# b
""",
                encoding="utf-8",
            )
            (specs / "index.md").write_text(
                _index_fm("SPECS-INDEX", "33333333-3333-4333-8333-333333333333")
                + "\n# specs\n\n- [a](DOC-001-a.md)\n- [b](DOC-002-b.md)\n",
                encoding="utf-8",
            )
            (obsidian / "index.md").write_text(
                _index_fm("DOC-INDEX", "44444444-4444-4444-8444-444444444444")
                + "\n# root\n\n- [specs](specs/index.md)\n",
                encoding="utf-8",
            )
            _seed_registry_files(root)

            report = run_verify_docs(root)
            self.assertFalse(report.is_success)
            checks = [issue.check for issue in report.issues]
            self.assertIn("frontmatter-uuid-uniqueness", checks)

    def test_verify_docs_fails_on_unknown_frontmatter_link_identifier(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            obsidian = root / "docs" / "obsidian"
            specs = obsidian / "specs"
            specs.mkdir(parents=True)

            (specs / "DOC-001-a.md").write_text(
                """---
id: DOC-001
uuid: 11111111-1111-4111-8111-111111111111
title: "Doc"
type: doc
status: active
layer: authored
lang: en
kb_lifecycle: current
created: 2026-03-22
updated: 2026-03-22
links: [DOC-999]
tags: [test]
---
# a
""",
                encoding="utf-8",
            )
            (specs / "index.md").write_text(
                _index_fm("SPECS-INDEX", "33333333-3333-4333-8333-333333333333")
                + "\n# specs\n\n- [a](DOC-001-a.md)\n",
                encoding="utf-8",
            )
            (obsidian / "index.md").write_text(
                _index_fm("DOC-INDEX", "44444444-4444-4444-8444-444444444444")
                + "\n# root\n\n- [specs](specs/index.md)\n",
                encoding="utf-8",
            )
            _seed_registry_files(root)

            report = run_verify_docs(root)
            self.assertFalse(report.is_success)
            checks = [issue.check for issue in report.issues]
            self.assertIn("frontmatter-links", checks)


if __name__ == "__main__":
    unittest.main()
