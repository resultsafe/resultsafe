from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path


TYPE_DECL_RE = re.compile(r"^\s*export\s+(?:type|interface)\s+([A-Za-z0-9_]+)", re.M)
JSDOC_RE = re.compile(r"/\*\*(.*?)\*/\s*export\s+(?:type|interface)\s+([A-Za-z0-9_]+)", re.S)
EXAMPLE_RE = re.compile(r"@example\s*([\s\S]*?)(?=\n\s*@\w+|\Z)")


@dataclass(frozen=True)
class DocItem:
    name: str
    description: str
    example: str


def run_readme_create(source_dir: Path, out_file: Path) -> dict[str, str | int]:
    src = source_dir.resolve()
    if not src.exists():
        raise FileNotFoundError(f"Source directory not found: {src}")

    ts_files = sorted(src.rglob("*.ts"))
    items: list[DocItem] = []
    for ts_file in ts_files:
        text = ts_file.read_text(encoding="utf-8")
        items.extend(_extract_doc_items(text))

    markdown = _build_markdown(items)
    out_file.parent.mkdir(parents=True, exist_ok=True)
    out_file.write_text(markdown, encoding="utf-8")

    return {"written_file": str(out_file.resolve()), "items_count": len(items)}


def _extract_doc_items(source_text: str) -> list[DocItem]:
    items: list[DocItem] = []
    for match in JSDOC_RE.finditer(source_text):
        raw_comment = match.group(1)
        name = match.group(2)
        description = _cleanup_jsdoc_description(raw_comment)
        example = _extract_example(raw_comment)
        items.append(DocItem(name=name, description=description, example=example))

    # fallback: если JSDoc нет, все равно покажем экспортируемые типы
    if not items:
        for match in TYPE_DECL_RE.finditer(source_text):
            items.append(DocItem(name=match.group(1), description="", example=""))

    return items


def _cleanup_jsdoc_description(raw_comment: str) -> str:
    lines = []
    for line in raw_comment.splitlines():
        cleaned = re.sub(r"^\s*\*\s?", "", line).rstrip()
        if cleaned.startswith("@"):
            break
        lines.append(cleaned)
    return "\n".join([l for l in lines if l.strip()]).strip()


def _extract_example(raw_comment: str) -> str:
    m = EXAMPLE_RE.search(raw_comment)
    if not m:
        return ""
    value = m.group(1)
    lines = [re.sub(r"^\s*\*\s?", "", ln).rstrip() for ln in value.splitlines()]
    return "\n".join(lines).strip()


def _build_markdown(items: list[DocItem]) -> str:
    lines: list[str] = [
        "# API README (generated)",
        "",
        "> Этот файл сгенерирован automation CLI.",
        "",
        "## API",
        "",
    ]

    for item in items:
        lines.append(f"### `{item.name}`")
        lines.append("")
        if item.description:
            lines.append(item.description)
            lines.append("")
        if item.example:
            lines.extend(["#### Example", "```ts", item.example, "```", ""])

    content = "\n".join(lines).rstrip() + "\n"
    return re.sub(r"\n{3,}", "\n\n", content)

