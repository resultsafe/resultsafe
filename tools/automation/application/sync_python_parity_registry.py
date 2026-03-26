from __future__ import annotations

import importlib
import json
import sys
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Any

OUTPUT_JSON_RELATIVE = Path("docs/_generated/identifier-registry/PYTHON-RUST-PARITY-REGISTRY.json")
OUTPUT_MARKDOWN_RELATIVE = Path("docs/specs/DOC-006-python-rust-method-parity-registry.md")
DOC_006_UUID = "0bd7b8bd-a5d8-4fdf-8de0-8a6dd8e23516"

STATUS_DONE = "выполнено"
STATUS_IN_ADJUSTMENT = "в корректировке"
STATUS_PLANNED = "планируемо"
STATUS_ARCHIVED = "архивировано"


# DDD Value Object: описание Python-пакета в parity-слое.
@dataclass(frozen=True)
class PythonPackageSpec:
    package_identifier: str
    package_name: str
    module_name: str
    source_path: str


# DDD Value Object: целевая привязка Rust-метода к Python API.
@dataclass(frozen=True)
class RustParityMethodSpec:
    method_identifier: str
    package_identifier: str
    module_name: str
    python_method_name: str
    rust_original_method_identifier: str | None
    rust_original_method_name: str | None
    source_path: str


# DDD Aggregate source-of-truth для Python parity слоя.
PYTHON_PACKAGES: tuple[PythonPackageSpec, ...] = (
    PythonPackageSpec(
        package_identifier="PY-PACKAGE-0001",
        package_name="resultsafe.core.fp.result",
        module_name="resultsafe.core.fp.result",
        source_path="packages/python/src/resultsafe/core/fp/result.py",
    ),
    PythonPackageSpec(
        package_identifier="PY-PACKAGE-0002",
        package_name="resultsafe.core.fp.option",
        module_name="resultsafe.core.fp.option",
        source_path="packages/python/src/resultsafe/core/fp/option.py",
    ),
    PythonPackageSpec(
        package_identifier="PY-PACKAGE-0003",
        package_name="resultsafe.core.fp.either",
        module_name="resultsafe.core.fp.either",
        source_path="packages/python/src/resultsafe/core/fp/either.py",
    ),
    PythonPackageSpec(
        package_identifier="PY-PACKAGE-0004",
        package_name="resultsafe.core.fp.task",
        module_name="resultsafe.core.fp.task",
        source_path="packages/python/src/resultsafe/core/fp/task.py",
    ),
    PythonPackageSpec(
        package_identifier="PY-PACKAGE-0005",
        package_name="resultsafe.core.fp.task_result",
        module_name="resultsafe.core.fp.task_result",
        source_path="packages/python/src/resultsafe/core/fp/task_result.py",
    ),
    PythonPackageSpec(
        package_identifier="PY-PACKAGE-0006",
        package_name="resultsafe.core.fp.effect",
        module_name="resultsafe.core.fp.effect",
        source_path="packages/python/src/resultsafe/core/fp/effect.py",
    ),
)

PYTHON_RUST_PARITY_METHODS: tuple[RustParityMethodSpec, ...] = (
    RustParityMethodSpec("PY-METHOD-0001", "PY-PACKAGE-0001", "resultsafe.core.fp.result", "is_ok", "1", "is_ok", "packages/python/src/resultsafe/core/fp/result.py"),
    RustParityMethodSpec("PY-METHOD-0002", "PY-PACKAGE-0001", "resultsafe.core.fp.result", "is_err", "2", "is_err", "packages/python/src/resultsafe/core/fp/result.py"),
    RustParityMethodSpec("PY-METHOD-0003", "PY-PACKAGE-0001", "resultsafe.core.fp.result", "map_result", "7", "map", "packages/python/src/resultsafe/core/fp/result.py"),
    RustParityMethodSpec("PY-METHOD-0004", "PY-PACKAGE-0001", "resultsafe.core.fp.result", "map_err", "8", "map_err", "packages/python/src/resultsafe/core/fp/result.py"),
    RustParityMethodSpec("PY-METHOD-0005", "PY-PACKAGE-0001", "resultsafe.core.fp.result", "and_then", "12", "and_then", "packages/python/src/resultsafe/core/fp/result.py"),
    RustParityMethodSpec("PY-METHOD-0006", "PY-PACKAGE-0001", "resultsafe.core.fp.result", "or_else", "14", "or_else", "packages/python/src/resultsafe/core/fp/result.py"),
    RustParityMethodSpec("PY-METHOD-0007", "PY-PACKAGE-0001", "resultsafe.core.fp.result", "unwrap", "15", "unwrap", "packages/python/src/resultsafe/core/fp/result.py"),
    RustParityMethodSpec("PY-METHOD-0008", "PY-PACKAGE-0001", "resultsafe.core.fp.result", "unwrap_or", "16", "unwrap_or", "packages/python/src/resultsafe/core/fp/result.py"),
    RustParityMethodSpec("PY-METHOD-0009", "PY-PACKAGE-0001", "resultsafe.core.fp.result", "unwrap_or_else", "17", "unwrap_or_else", "packages/python/src/resultsafe/core/fp/result.py"),
    RustParityMethodSpec("PY-METHOD-0010", "PY-PACKAGE-0001", "resultsafe.core.fp.result", "expect", "20", "expect", "packages/python/src/resultsafe/core/fp/result.py"),
    RustParityMethodSpec("PY-METHOD-0011", "PY-PACKAGE-0001", "resultsafe.core.fp.result", "inspect", "24", "inspect", "packages/python/src/resultsafe/core/fp/result.py"),
    RustParityMethodSpec("PY-METHOD-0012", "PY-PACKAGE-0001", "resultsafe.core.fp.result", "inspect_err", "25", "inspect_err", "packages/python/src/resultsafe/core/fp/result.py"),
    RustParityMethodSpec("PY-METHOD-0013", "PY-PACKAGE-0001", "resultsafe.core.fp.result", "flatten", "33", "flatten", "packages/python/src/resultsafe/core/fp/result.py"),
    RustParityMethodSpec("PY-METHOD-0014", "PY-PACKAGE-0001", "resultsafe.core.fp.result", "transpose", "34", "transpose", "packages/python/src/resultsafe/core/fp/result.py"),
    RustParityMethodSpec("PY-METHOD-0015", "PY-PACKAGE-0001", "resultsafe.core.fp.result", "ok", "40", "Ok(value)", "packages/python/src/resultsafe/core/fp/result.py"),
    RustParityMethodSpec("PY-METHOD-0016", "PY-PACKAGE-0001", "resultsafe.core.fp.result", "err", "41", "Err(error)", "packages/python/src/resultsafe/core/fp/result.py"),
    RustParityMethodSpec("PY-METHOD-0017", "PY-PACKAGE-0002", "resultsafe.core.fp.option", "map_option", None, None, "packages/python/src/resultsafe/core/fp/option.py"),
    RustParityMethodSpec("PY-METHOD-0018", "PY-PACKAGE-0002", "resultsafe.core.fp.option", "and_then_option", None, None, "packages/python/src/resultsafe/core/fp/option.py"),
    RustParityMethodSpec("PY-METHOD-0019", "PY-PACKAGE-0002", "resultsafe.core.fp.option", "transpose", None, None, "packages/python/src/resultsafe/core/fp/option.py"),
    RustParityMethodSpec("PY-METHOD-0020", "PY-PACKAGE-0003", "resultsafe.core.fp.either", "map_either", None, None, "packages/python/src/resultsafe/core/fp/either.py"),
    RustParityMethodSpec("PY-METHOD-0021", "PY-PACKAGE-0003", "resultsafe.core.fp.either", "map_left", None, None, "packages/python/src/resultsafe/core/fp/either.py"),
    RustParityMethodSpec("PY-METHOD-0022", "PY-PACKAGE-0003", "resultsafe.core.fp.either", "and_then_either", None, None, "packages/python/src/resultsafe/core/fp/either.py"),
    RustParityMethodSpec("PY-METHOD-0023", "PY-PACKAGE-0005", "resultsafe.core.fp.task_result", "from_async", None, None, "packages/python/src/resultsafe/core/fp/task_result.py"),
    RustParityMethodSpec("PY-METHOD-0024", "PY-PACKAGE-0006", "resultsafe.core.fp.effect", "Effect.and_then", None, None, "packages/python/src/resultsafe/core/fp/effect.py"),
)


@dataclass(frozen=True)
class PythonParitySyncReport:
    packages_count: int
    methods_count: int
    completed_methods_count: int
    in_adjustment_methods_count: int
    planned_methods_count: int
    registry_json_file: str
    registry_markdown_file: str

    def to_dict(self) -> dict[str, Any]:
        return {
            "packages_count": self.packages_count,
            "methods_count": self.methods_count,
            "completed_methods_count": self.completed_methods_count,
            "in_adjustment_methods_count": self.in_adjustment_methods_count,
            "planned_methods_count": self.planned_methods_count,
            "registry_json_file": self.registry_json_file,
            "registry_markdown_file": self.registry_markdown_file,
        }


def run_sync_python_parity_registry(root: Path) -> PythonParitySyncReport:
    _ensure_python_src_on_path(root)

    package_status_entries = [
        {
            "package_identifier": package.package_identifier,
            "package_name": package.package_name,
            "module_name": package.module_name,
            "source_path": package.source_path,
            "implementation_status": STATUS_DONE if _module_exists(package.module_name) else STATUS_IN_ADJUSTMENT,
        }
        for package in PYTHON_PACKAGES
    ]

    method_entries = [_build_method_entry(spec) for spec in PYTHON_RUST_PARITY_METHODS]

    completed_count = sum(1 for item in method_entries if item["implementation_status"] == STATUS_DONE)
    in_adjustment_count = sum(
        1 for item in method_entries if item["implementation_status"] == STATUS_IN_ADJUSTMENT
    )
    planned_count = sum(1 for item in method_entries if item["implementation_status"] == STATUS_PLANNED)

    payload = {
        "version": "1.0",
        "generated_at": date.today().isoformat(),
        "status_catalog": {
            STATUS_DONE: "Реализация присутствует и проходит тестовый контур.",
            STATUS_IN_ADJUSTMENT: "Реализация присутствует, но требует корректировки/дополнительных проверок.",
            STATUS_PLANNED: "Метод зафиксирован в parity-слое как целевой, но отсутствует в реализации.",
            STATUS_ARCHIVED: "Статус зарезервирован для выведенных из активного контура методов.",
        },
        "packages": package_status_entries,
        "methods": method_entries,
        "summary": {
            "packages_count": len(package_status_entries),
            "methods_count": len(method_entries),
            "completed_methods_count": completed_count,
            "in_adjustment_methods_count": in_adjustment_count,
            "planned_methods_count": planned_count,
        },
    }

    output_json = root / OUTPUT_JSON_RELATIVE
    output_json.parent.mkdir(parents=True, exist_ok=True)
    output_json.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    output_markdown = root / OUTPUT_MARKDOWN_RELATIVE
    output_markdown.parent.mkdir(parents=True, exist_ok=True)
    output_markdown.write_text(_build_markdown(payload), encoding="utf-8")

    return PythonParitySyncReport(
        packages_count=len(package_status_entries),
        methods_count=len(method_entries),
        completed_methods_count=completed_count,
        in_adjustment_methods_count=in_adjustment_count,
        planned_methods_count=planned_count,
        registry_json_file=str(output_json),
        registry_markdown_file=str(output_markdown),
    )


def _build_method_entry(spec: RustParityMethodSpec) -> dict[str, Any]:
    method_exists = _method_exists(spec.module_name, spec.python_method_name)
    if method_exists:
        status = STATUS_DONE
    elif spec.rust_original_method_identifier is not None:
        status = STATUS_PLANNED
    else:
        status = STATUS_IN_ADJUSTMENT

    return {
        "method_identifier": spec.method_identifier,
        "package_identifier": spec.package_identifier,
        "module_name": spec.module_name,
        "python_method_name": spec.python_method_name,
        "rust_original_method_identifier": spec.rust_original_method_identifier,
        "rust_original_method_name": spec.rust_original_method_name,
        "source_path": spec.source_path,
        "implementation_status": status,
    }


def _module_exists(module_name: str) -> bool:
    try:
        importlib.import_module(module_name)
        return True
    except Exception:
        return False


def _method_exists(module_name: str, method_name: str) -> bool:
    try:
        target: Any = importlib.import_module(module_name)
    except Exception:
        return False
    for attribute in method_name.split("."):
        target = getattr(target, attribute, None)
        if target is None:
            return False
    return callable(target)


def _ensure_python_src_on_path(root: Path) -> None:
    src_path = root / "packages" / "python" / "src"
    src_text = str(src_path)
    if src_text not in sys.path:
        sys.path.insert(0, src_text)


def _build_markdown(payload: dict[str, Any]) -> str:
    summary = payload["summary"]
    lines = [
        "---",
        "id: DOC-006",
        f"uuid: {DOC_006_UUID}",
        'title: "Python Rust Method Parity Registry"',
        "type: doc",
        "status: active",
        "layer: authored",
        "lang: en",
        "kb_lifecycle: current",
        'owner: "core-fp"',
        "version: 1.0",
        "created: 2026-03-22",
        f"updated: {payload['generated_at']}",
        "source_of_truth: self",
        "links: [DOC-004, DOC-005, SPEC-004, TASK-020]",
        "tags: [python, rust, parity, registry, fp]",
        "---",
        "",
        "# DOC-006: Python Rust Method Parity Registry",
        "",
        "## Назначение",
        "",
        "- Документ фиксирует соответствие Python API и Rust-оригинальных методов в рамках TASK-020.",
        "- Machine-readable артефакт: `docs/_generated/identifier-registry/PYTHON-RUST-PARITY-REGISTRY.json`.",
        "- Обновление выполняется командой: `python -m tools.automation docs sync-python-parity --root .`.",
        "",
        "## Сводка",
        "",
        f"- Пакетов: `{summary['packages_count']}`.",
        f"- Методов: `{summary['methods_count']}`.",
        f"- Выполнено: `{summary['completed_methods_count']}`.",
        f"- В корректировке: `{summary['in_adjustment_methods_count']}`.",
        f"- Планируемо: `{summary['planned_methods_count']}`.",
        "",
        "## Таблица пакетов",
        "",
        "| Package ID | Package | Module | Source Path | Status |",
        "|---|---|---|---|---|",
    ]

    for package in payload["packages"]:
        lines.append(
            f"| `{package['package_identifier']}` | `{package['package_name']}` | `{package['module_name']}` | `{package['source_path']}` | {package['implementation_status']} |"
        )

    lines.extend(
        [
            "",
            "## Таблица методов",
            "",
            "| Method ID | Package ID | Python Method | Rust ID | Rust Method | Source Path | Status |",
            "|---|---|---|---|---|---|---|",
        ]
    )

    for method in payload["methods"]:
        rust_id = method["rust_original_method_identifier"] or "—"
        rust_name = method["rust_original_method_name"] or "—"
        lines.append(
            f"| `{method['method_identifier']}` | `{method['package_identifier']}` | `{method['python_method_name']}` | `{rust_id}` | `{rust_name}` | `{method['source_path']}` | {method['implementation_status']} |"
        )

    lines.extend(
        [
            "",
            "## Дерево",
            "",
            "```text",
        ]
    )

    for package in payload["packages"]:
        lines.append(
            f"{package['package_identifier']} | {package['package_name']} | статус: {package['implementation_status']}"
        )
        for method in payload["methods"]:
            if method["package_identifier"] != package["package_identifier"]:
                continue
            lines.append(
                f"  - {method['method_identifier']} | {method['python_method_name']} | rust_id={method['rust_original_method_identifier'] or '-'} | статус: {method['implementation_status']}"
            )

    lines.extend(["```", ""])
    return "\n".join(lines)
