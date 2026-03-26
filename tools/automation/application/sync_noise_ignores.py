from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

from tools.automation.shared.noise import load_noise_patterns


RGIGNORE_RELATIVE_PATH = Path(".rgignore")
PRETTIERIGNORE_RELATIVE_PATH = Path(".prettierignore")

PRETTIER_BASE_PATTERNS: tuple[str, ...] = (
    ".env",
    "*.env.*",
    "**/out/",
)

RGIGNORE_HEADER = "# Synced from config/noise-ignore.txt via automation CLI."
PRETTIERIGNORE_HEADER = "# Synced from config/noise-ignore.txt via automation CLI."


# DDD Aggregate: итог синхронизации ignore-файлов из канонического noise-layer.
@dataclass(frozen=True)
class NoiseIgnoreSyncReport:
    noise_patterns_count: int
    rgignore_file: str
    prettierignore_file: str
    rgignore_patterns_count: int
    prettier_patterns_count: int

    def to_dict(self) -> dict[str, Any]:
        return {
            "noise_patterns_count": self.noise_patterns_count,
            "rgignore_file": self.rgignore_file,
            "prettierignore_file": self.prettierignore_file,
            "rgignore_patterns_count": self.rgignore_patterns_count,
            "prettier_patterns_count": self.prettier_patterns_count,
        }


def run_sync_noise_ignores(root: Path) -> NoiseIgnoreSyncReport:
    repo_root = root.resolve()
    noise_patterns = _dedupe(load_noise_patterns(repo_root))
    noise_patterns_with_slash = _ensure_dir_slash_patterns(noise_patterns)

    rgignore_path = (repo_root / RGIGNORE_RELATIVE_PATH).resolve()
    prettierignore_path = (repo_root / PRETTIERIGNORE_RELATIVE_PATH).resolve()

    rgignore_lines = [RGIGNORE_HEADER, *noise_patterns]
    prettier_patterns = _dedupe((*PRETTIER_BASE_PATTERNS, *noise_patterns_with_slash))
    prettierignore_lines = [PRETTIERIGNORE_HEADER, *prettier_patterns]

    rgignore_path.write_text(_join_lines(rgignore_lines), encoding="utf-8")
    prettierignore_path.write_text(_join_lines(prettierignore_lines), encoding="utf-8")

    return NoiseIgnoreSyncReport(
        noise_patterns_count=len(noise_patterns),
        rgignore_file=str(rgignore_path),
        prettierignore_file=str(prettierignore_path),
        rgignore_patterns_count=len(noise_patterns),
        prettier_patterns_count=len(prettier_patterns),
    )


def _join_lines(lines: list[str]) -> str:
    return "\n".join(lines) + "\n"


def _dedupe(values: tuple[str, ...] | list[str]) -> tuple[str, ...]:
    seen: set[str] = set()
    ordered: list[str] = []
    for raw in values:
        value = raw.strip()
        if not value or value in seen:
            continue
        seen.add(value)
        ordered.append(value)
    return tuple(ordered)


def _ensure_dir_slash_patterns(patterns: tuple[str, ...]) -> tuple[str, ...]:
    normalized: list[str] = []
    for pattern in patterns:
        if pattern.endswith("/**"):
            normalized.append(f"{pattern[:-3]}/")
            normalized.append(pattern)
            continue
        normalized.append(pattern)
    return _dedupe(normalized)
