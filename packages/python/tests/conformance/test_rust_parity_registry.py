from __future__ import annotations

import json
from pathlib import Path

from tools.automation.application.sync_python_parity_registry import (
    OUTPUT_JSON_RELATIVE,
    run_sync_python_parity_registry,
)


def test_rust_parity_registry_conformance() -> None:
    root = Path(__file__).resolve().parents[4]

    run_sync_python_parity_registry(root)

    payload = json.loads((root / OUTPUT_JSON_RELATIVE).read_text(encoding="utf-8"))
    methods = payload["methods"]

    rust_mapped = [item for item in methods if item["rust_original_method_identifier"] is not None]
    assert rust_mapped, "Rust parity section must not be empty"

    not_completed = [item for item in rust_mapped if item["implementation_status"] != "выполнено"]
    assert not not_completed, f"Rust parity methods are not completed: {not_completed}"
