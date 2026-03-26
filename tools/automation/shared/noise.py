from __future__ import annotations

from fnmatch import fnmatch
from pathlib import Path


NOISE_CONFIG_RELATIVE_PATH = Path("config/noise-ignore.txt")

DEFAULT_NOISE_PATTERNS: tuple[str, ...] = (
    "**/node_modules",
    "**/node_modules/**",
    "**/.pnpm",
    "**/.pnpm/**",
    "**/dist",
    "**/dist/**",
    "**/build",
    "**/build/**",
    "**/coverage",
    "**/coverage/**",
    "**/.cache",
    "**/.cache/**",
    "**/.turbo",
    "**/.turbo/**",
    "**/.next",
    "**/.next/**",
    "**/.pytest_cache",
    "**/.pytest_cache/**",
    "**/.mypy_cache",
    "**/.mypy_cache/**",
    "**/__pycache__",
    "**/__pycache__/**",
    "**/_templates",
    "**/_templates/**",
)


def load_noise_patterns(root: Path) -> tuple[str, ...]:
    config_path = (root.resolve() / NOISE_CONFIG_RELATIVE_PATH).resolve()
    patterns: list[str] = []

    if config_path.exists():
        for raw_line in config_path.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip().replace("\\", "/")
            if not line or line.startswith("#"):
                continue
            patterns.append(line)

    if not patterns:
        patterns = list(DEFAULT_NOISE_PATTERNS)

    # Guardrail: keep runtime defaults even if config was accidentally incomplete.
    for pattern in DEFAULT_NOISE_PATTERNS:
        if pattern not in patterns:
            patterns.append(pattern)

    return tuple(patterns)


def is_noise_path(path: Path, root: Path, patterns: tuple[str, ...]) -> bool:
    # Важно: используем lexical-путь без resolve(), чтобы не терять сегменты
    # node_modules/.pnpm при работе через symlink/junction.
    root_path = _to_lexical_absolute(root)
    candidate_path = _to_lexical_absolute(path, root_path)

    try:
        relative = candidate_path.relative_to(root_path).as_posix()
    except ValueError:
        relative = candidate_path.as_posix()

    relative = relative.strip("/")
    if not relative:
        return False

    relative_with_trailing_slash = f"{relative}/"
    relative_prefixed = f"/{relative}"
    relative_prefixed_with_trailing_slash = f"/{relative}/"
    for pattern in patterns:
        normalized = pattern.strip().replace("\\", "/")
        if not normalized:
            continue
        if (
            fnmatch(relative, normalized)
            or fnmatch(relative_with_trailing_slash, normalized)
            or fnmatch(relative_prefixed, normalized)
            or fnmatch(relative_prefixed_with_trailing_slash, normalized)
        ):
            return True
    return False


def _to_lexical_absolute(path: Path, root: Path | None = None) -> Path:
    if path.is_absolute():
        return path.absolute()
    if root is None:
        return path.absolute()
    return (root / path).absolute()
