from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path


MD_LINK_RE = re.compile(r"\[[^\]]+\]\(([^)]+)\)")
WIKI_LINK_RE = re.compile(r"\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]")


@dataclass(frozen=True)
class ParsedFrontmatter:
    has_frontmatter: bool
    is_valid: bool
    fields: dict[str, str]
    reason: str = ""


def strip_code_blocks(content: str) -> str:
    no_fenced = re.sub(r"```.*?```", "", content, flags=re.S)
    return re.sub(r"`[^`]*`", "", no_fenced)


def parse_markdown_targets(content: str) -> list[str]:
    clean = strip_code_blocks(content)
    result: list[str] = []
    for match in MD_LINK_RE.finditer(clean):
        target = _clean_link_target(match.group(1))
        if target:
            result.append(target)
    return result


def parse_wikilink_targets(content: str) -> list[str]:
    clean = strip_code_blocks(content)
    result: list[str] = []
    for match in WIKI_LINK_RE.finditer(clean):
        target = match.group(1).strip()
        if target and not _is_external(target):
            result.append(target)
    return result


def parse_frontmatter(content: str) -> ParsedFrontmatter:
    lines = content.splitlines()
    if not lines or lines[0].strip() != "---":
        return ParsedFrontmatter(False, False, {}, "Missing frontmatter start delimiter '---' on first line.")

    end = -1
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            end = i
            break

    if end < 0:
        return ParsedFrontmatter(True, False, {}, "Missing frontmatter closing delimiter '---'.")

    fields: dict[str, str] = {}
    for line in lines[1:end]:
        m = re.match(r"^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$", line)
        if not m:
            continue
        key = m.group(1).strip().lower()
        if key not in fields:
            fields[key] = m.group(2).strip()

    return ParsedFrontmatter(True, True, fields, "")


def is_empty_value(value: str | None) -> bool:
    if value is None:
        return True
    trimmed = value.strip()
    return trimmed == "" or trimmed in ('""', "''")


def resolve_link(base_dir: Path, target: str) -> Path | None:
    clean = _clean_link_target(target)
    if not clean:
        return None
    if clean.startswith("#") or _is_external(clean):
        return None
    path = Path(clean)
    if path.is_absolute():
        return path
    return (base_dir / clean).resolve()


def _clean_link_target(target: str) -> str:
    if not target:
        return ""
    clean = target.strip()
    if clean.startswith("<") and clean.endswith(">") and len(clean) > 2:
        clean = clean[1:-1]
    clean = clean.split("#", 1)[0].split("?", 1)[0].strip()
    return clean


def _is_external(target: str) -> bool:
    return re.match(r"^(https?|mailto|data|javascript):", target) is not None

