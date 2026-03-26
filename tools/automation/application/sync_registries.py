from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

from tools.automation.application.sync_entity_catalog import EntityCatalogSyncReport, run_sync_entity_catalog
from tools.automation.application.sync_identifiers import IdentifierSyncReport, run_sync_identifiers
from tools.automation.application.sync_python_parity_registry import (
    PythonParitySyncReport,
    run_sync_python_parity_registry,
)
from tools.automation.application.sync_semantic_modules import SemanticSyncReport, run_sync_semantic_modules


# DDD Aggregate: итог оркестрации синхронизации всех реестров документации.
@dataclass(frozen=True)
class RegistriesSyncReport:
    identifiers_report: IdentifierSyncReport
    semantic_report: SemanticSyncReport
    python_parity_report: PythonParitySyncReport
    entity_catalog_report: EntityCatalogSyncReport

    def to_dict(self) -> dict[str, Any]:
        return {
            "identifiers": self.identifiers_report.to_dict(),
            "semantic": self.semantic_report.to_dict(),
            "python_parity": self.python_parity_report.to_dict(),
            "entity_catalog": self.entity_catalog_report.to_dict(),
        }


def run_sync_registries(root: Path) -> RegistriesSyncReport:
    # FP-пайплайн оркестрации: identifiers -> semantic -> python parity -> entity catalog.
    identifiers_report = run_sync_identifiers(root)
    semantic_report = run_sync_semantic_modules(root)
    python_parity_report = run_sync_python_parity_registry(root)
    entity_catalog_report = run_sync_entity_catalog(root)
    return RegistriesSyncReport(
        identifiers_report=identifiers_report,
        semantic_report=semantic_report,
        python_parity_report=python_parity_report,
        entity_catalog_report=entity_catalog_report,
    )
