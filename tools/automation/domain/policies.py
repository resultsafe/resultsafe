from __future__ import annotations

from dataclasses import dataclass


# DDD Policy: контракт frontmatter для обычных docs-объектов.
@dataclass(frozen=True)
class CommonFrontmatterPolicy:
    required_fields: tuple[str, ...] = ("id", "title", "status", "layer", "lang", "created", "updated")
    date_fields: tuple[str, ...] = ("created", "updated")


# DDD Policy: отдельный контракт ai-session (documented exception).
@dataclass(frozen=True)
class AiSessionFrontmatterPolicy:
    required_fields: tuple[str, ...] = ("concept", "date", "ai_tool", "model")
    date_fields: tuple[str, ...] = ("date",)
