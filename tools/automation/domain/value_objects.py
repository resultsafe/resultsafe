from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path


# DDD Value Object: неизменяемая ссылка на путь в контексте репозитория.
@dataclass(frozen=True)
class RepoPath:
    value: Path

    @staticmethod
    def of(path_like: str | Path) -> "RepoPath":
        return RepoPath(Path(path_like).resolve())

    def join(self, relative: str) -> "RepoPath":
        return RepoPath((self.value / relative).resolve())

