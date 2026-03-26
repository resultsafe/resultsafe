"""
Проверка структуры пакета по каноническому стандарту docs/RULES.md и DOC-010.

Использование:
  python tools/package_checker/check_package_structure.py --root packages/core/fp/result

Вывод:
  - Список отсутствующих обязательных файлов/директорий
  - Exit code 0, если нарушений нет; 1 при найденных проблемах
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path
from typing import Iterable


MANDATORY_FILES = {
    "package.json",
    "CHANGELOG.md",
    "CONTRIBUTING.md",
    "README.md",
}

# README.ru.md допускается, но не обязателен
OPTIONAL_FILES = {"README.ru.md"}

MANDATORY_DIRS = {
    "src",
    "__examples__",
    "__tests__",
    "docs",
}

# Структура __examples__
EXAMPLES_DIRS = {
    "__examples__/basic",
    "__examples__/advanced",
    "__examples__/domains",
    "__examples__/domains/auth",
    "__examples__/domains/payments",
    "__examples__/domains/validation",
}

# Структура docs
DOCS_FILES = {
    "docs/_category_.json",
    "docs/index.md",
    "docs/api.md",
    "docs/changelog.md",
    "docs/examples/_category_.json",
    "docs/examples/index.md",
    "docs/examples/basic.md",
    "docs/examples/advanced.md",
    "docs/examples/domains/_category_.json",
    "docs/examples/domains/index.md",
    "docs/examples/domains/auth.md",
    "docs/examples/domains/payments.md",
    "docs/examples/domains/validation.md",
    "docs/migration/_category_.json",
    "docs/migration/index.md",
    "docs/migration/v1-to-v2.md",
    "docs/api/_category_.json",
    "docs/api/index.md",
    "docs/api/ok.md",
    "docs/api/err.md",
    "docs/api/result.md",
}


def check_exists(root: Path, paths: Iterable[str]) -> list[str]:
    missing: list[str] = []
    for rel in paths:
        if not (root / rel).exists():
            missing.append(rel)
    return missing


def check_depth_and_types(root: Path, max_depth: int = 6) -> list[str]:
    """
    Дополнительная проверка:
    - глубина вложенности не превышает max_depth (от root)
    - типы файлов в docs/ ограничены markdown/json/_category_.json
    """
    issues: list[str] = []
    for path in root.rglob("*"):
        rel = path.relative_to(root)
        depth = len(rel.parts)
        if depth > max_depth:
            issues.append(f"excessive depth ({depth}): {rel.as_posix()}")

        # Ограничение типов для docs/
        if rel.parts and rel.parts[0] == "docs" and path.is_file():
            if not (path.suffix in {".md", ".json"} or path.name == "_category_.json"):
                issues.append(f"unsupported file type in docs/: {rel.as_posix()}")
    return issues


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Проверка структуры пакета по стандарту")
    parser.add_argument(
        "--root",
        required=True,
        help="Путь к корню пакета (где лежит package.json)",
    )
    parser.add_argument(
        "--max-depth",
        type=int,
        default=6,
        help="Максимальная глубина вложенности (по умолчанию 6)",
    )
    args = parser.parse_args(argv)

    root = Path(args.root).resolve()
    if not root.exists():
        sys.stderr.write(f"ERROR: root path does not exist: {root}\n")
        return 1

    missing = []
    missing += check_exists(root, MANDATORY_FILES)
    missing += check_exists(root, MANDATORY_DIRS)
    missing += check_exists(root, EXAMPLES_DIRS)
    missing += check_exists(root, DOCS_FILES)

    issues = missing + check_depth_and_types(root, args.max_depth)

    if issues:
        sys.stderr.write("Missing required items:\n")
        for item in sorted(issues):
            sys.stderr.write(f" - {item}\n")
        return 1

    print("OK: package structure matches the canonical standard.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
