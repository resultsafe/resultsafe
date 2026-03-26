from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


# DDD Entity: дефект ссылочной целостности.
@dataclass(frozen=True)
class LinkIssue:
    source_file: str
    link_type: str
    target: str
    resolved: str | None


# DDD Entity: дефект валидации документации (frontmatter/index/policy).
@dataclass(frozen=True)
class VerificationIssue:
    check: str
    file: str
    message: str


# DDD Aggregate: итог link-check use-case.
@dataclass(frozen=True)
class LinkCheckReport:
    checked_files: int
    missing_links: list[LinkIssue] = field(default_factory=list)

    @property
    def is_success(self) -> bool:
        return len(self.missing_links) == 0

    def to_dict(self) -> dict[str, Any]:
        return {
            "checked_files": self.checked_files,
            "missing_links_count": len(self.missing_links),
            "missing_links": [
                {
                    "source_file": issue.source_file,
                    "link_type": issue.link_type,
                    "target": issue.target,
                    "resolved": issue.resolved,
                }
                for issue in self.missing_links
            ],
        }


# DDD Aggregate: итог полной проверки docs governance.
@dataclass(frozen=True)
class VerifyDocsReport:
    checked_markdown_files: int
    checked_index_files: int
    issues: list[VerificationIssue] = field(default_factory=list)
    link_report: LinkCheckReport | None = None

    @property
    def is_success(self) -> bool:
        return len(self.issues) == 0

    def to_dict(self) -> dict[str, Any]:
        return {
            "checked_markdown_files": self.checked_markdown_files,
            "checked_index_files": self.checked_index_files,
            "issues_count": len(self.issues),
            "issues": [
                {"check": i.check, "file": i.file, "message": i.message}
                for i in self.issues
            ],
            "link_report": self.link_report.to_dict() if self.link_report else None,
        }

