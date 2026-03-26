from __future__ import annotations

from pathlib import Path


def list_markdown_files(root: Path) -> list[Path]:
    return [p for p in root.rglob("*.md") if p.is_file()]


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")

