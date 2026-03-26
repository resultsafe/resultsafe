from __future__ import annotations

from pathlib import Path

from tools.automation.domain.entities import LinkCheckReport, LinkIssue
from tools.automation.infrastructure.filesystem import list_markdown_files, read_text
from tools.automation.infrastructure.markdown import parse_markdown_targets, parse_wikilink_targets, resolve_link
from tools.automation.shared.noise import is_noise_path, load_noise_patterns


def run_check_links(root: Path) -> LinkCheckReport:
    repo_root = root.resolve()
    noise_patterns = load_noise_patterns(repo_root)
    all_md_files = [p for p in list_markdown_files(repo_root) if not is_noise_path(p, repo_root, noise_patterns)]

    basename_map: dict[str, list[Path]] = {}
    for md in all_md_files:
        basename_map.setdefault(md.stem, []).append(md)

    missing: list[LinkIssue] = []

    for md in all_md_files:
        content = read_text(md)
        base_dir = md.parent

        for target in parse_markdown_targets(content):
            resolved = resolve_link(base_dir, target)
            if resolved is None:
                continue
            if not _path_exists_with_md_fallback(resolved):
                missing.append(
                    LinkIssue(
                        source_file=str(md),
                        link_type="markdown",
                        target=target,
                        resolved=str(resolved),
                    )
                )

        for target in parse_wikilink_targets(content):
            resolved = resolve_link(base_dir, target)
            exists = False
            resolved_text: str | None = str(resolved) if resolved is not None else None

            if resolved is not None:
                exists = _path_exists_with_md_fallback(resolved)

            if not exists and target in basename_map:
                exists = True
                resolved_text = "; ".join(str(p) for p in basename_map[target])

            if not exists:
                missing.append(
                    LinkIssue(
                        source_file=str(md),
                        link_type="wikilink",
                        target=target,
                        resolved=resolved_text,
                    )
                )

    return LinkCheckReport(checked_files=len(all_md_files), missing_links=missing)
def _path_exists_with_md_fallback(path: Path) -> bool:
    if path.exists():
        return True
    if path.suffix == "":
        return path.with_suffix(".md").exists()
    return False
