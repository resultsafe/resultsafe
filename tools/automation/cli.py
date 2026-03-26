from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

from tools.automation.application.capture_platform_settings_snapshot import run_capture_platform_settings_snapshot
from tools.automation.application.check_links import run_check_links
from tools.automation.application.file_inventory import run_file_inventory
from tools.automation.application.governance_check import run_governance_check
from tools.automation.application.platform_enforcement_evidence import run_platform_enforcement_evidence_check
from tools.automation.application.rag_governance_check import run_rag_governance_check
from tools.automation.application.registry_consistency_report import run_registry_consistency_report
from tools.automation.application.readme_create import run_readme_create
from tools.automation.application.snapshot_catalog import (
    CATALOG_SQL_FILE_RELATIVE,
    SnapshotPublishRequest,
    run_catalog_create_database,
    run_catalog_incremental_refresh,
    run_catalog_init_schema,
    run_catalog_rebuild_from_snapshot,
    run_snapshot_compaction_plan,
    run_snapshot_diff,
    run_snapshot_publish,
    run_snapshot_retention,
    run_snapshot_validate,
)
from tools.automation.application.sync_entity_catalog import run_sync_entity_catalog
from tools.automation.application.sync_identifiers import run_sync_identifiers
from tools.automation.application.sync_noise_ignores import run_sync_noise_ignores
from tools.automation.application.sync_registries import run_sync_registries
from tools.automation.application.sync_semantic_modules import run_sync_semantic_modules
from tools.automation.application.sync_python_parity_registry import run_sync_python_parity_registry
from tools.automation.application.verify_docs import run_verify_docs
from tools.automation.shared.result import Err, Ok, Result


# Единый контракт exit-кодов для automation CLI.
EXIT_OK = 0
EXIT_VALIDATION_ERROR = 1
EXIT_SYSTEM_ERROR = 2
EXIT_INTERRUPT = 130


def main(argv: list[str] | None = None) -> int:
    parser = _build_parser()
    args = parser.parse_args(argv)

    try:
        if args.command == "docs":
            if args.docs_command == "check-links":
                return _run_docs_check_links(args)
            if args.docs_command == "verify":
                return _run_docs_verify(args)
            if args.docs_command == "readme-create":
                return _run_readme_create(args)
            if args.docs_command == "sync-identifiers":
                return _run_docs_sync_identifiers(args)
            if args.docs_command == "sync-registries":
                return _run_docs_sync_registries(args)
            if args.docs_command == "sync-semantic-modules":
                return _run_docs_sync_semantic_modules(args)
            if args.docs_command == "sync-python-parity":
                return _run_docs_sync_python_parity(args)
            if args.docs_command == "sync-entity-catalog":
                return _run_docs_sync_entity_catalog(args)
            if args.docs_command == "sync-noise-ignores":
                return _run_docs_sync_noise_ignores(args)
            if args.docs_command == "governance-check":
                return _run_docs_governance_check(args)
            if args.docs_command == "registry-consistency-report":
                return _run_docs_registry_consistency_report(args)
            if args.docs_command == "rag-governance-check":
                return _run_docs_rag_governance_check(args)
            if args.docs_command == "capture-platform-settings-snapshot":
                return _run_docs_capture_platform_settings_snapshot(args)
            if args.docs_command == "platform-enforcement-evidence-check":
                return _run_docs_platform_enforcement_evidence_check(args)
            if args.docs_command == "file-inventory":
                return _run_docs_file_inventory(args)
            return _print_error("Unsupported docs command.", EXIT_SYSTEM_ERROR)

        if args.command == "snapshot":
            if args.snapshot_command == "publish":
                return _run_snapshot_publish(args)
            if args.snapshot_command == "validate":
                return _run_snapshot_validate(args)
            if args.snapshot_command == "diff":
                return _run_snapshot_diff(args)
            if args.snapshot_command == "retention":
                return _run_snapshot_retention(args)
            if args.snapshot_command == "compaction-plan":
                return _run_snapshot_compaction_plan(args)
            return _print_error("Unsupported snapshot command.", EXIT_SYSTEM_ERROR)

        if args.command == "catalog":
            if args.catalog_command == "create-database":
                return _run_catalog_create_database(args)
            if args.catalog_command == "init-schema":
                return _run_catalog_init_schema(args)
            if args.catalog_command == "rebuild":
                return _run_catalog_rebuild(args)
            if args.catalog_command == "incremental-refresh":
                return _run_catalog_incremental_refresh(args)
            return _print_error("Unsupported catalog command.", EXIT_SYSTEM_ERROR)

        return _print_error("Unsupported command group.", EXIT_SYSTEM_ERROR)
    except KeyboardInterrupt:
        return EXIT_INTERRUPT
    except Exception as exc:  # noqa: BLE001
        return _print_error(f"System error: {exc}", EXIT_SYSTEM_ERROR)


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="automation", description="ResultSafe automation CLI")
    sub = parser.add_subparsers(dest="command", required=True)

    docs = sub.add_parser("docs", help="Documentation automation")
    docs_sub = docs.add_subparsers(dest="docs_command", required=True)

    check = docs_sub.add_parser("check-links", help="Check markdown and wikilinks")
    check.add_argument("--root", default=".", help="Repository root")
    check.add_argument("--fail-on-missing", default="true", choices=("true", "false"), help="Fail if missing links")
    check.add_argument("--output-format", default="text", choices=("text", "json"), help="Output format")

    verify = docs_sub.add_parser("verify", help="Run governance docs verification")
    verify.add_argument("--root", default=".", help="Repository root")
    verify.add_argument("--output-format", default="text", choices=("text", "json"), help="Output format")

    readme = docs_sub.add_parser("readme-create", help="Generate README from TS JSDoc")
    readme.add_argument("--source-dir", required=True, help="Source directory with .ts files")
    readme.add_argument("--out-file", required=True, help="Output README file")
    readme.add_argument("--output-format", default="text", choices=("text", "json"), help="Output format")

    sync_identifiers = docs_sub.add_parser(
        "sync-identifiers",
        help="Generate monorepo unique identifier registry for packages and methods",
    )
    sync_identifiers.add_argument("--root", default=".", help="Repository root")
    sync_identifiers.add_argument("--output-format", default="text", choices=("text", "json"), help="Output format")

    sync_registries = docs_sub.add_parser(
        "sync-registries",
        help="Synchronize identifier and semantic registries in canonical order",
    )
    sync_registries.add_argument("--root", default=".", help="Repository root")
    sync_registries.add_argument("--output-format", default="text", choices=("text", "json"), help="Output format")

    sync_semantic_modules = docs_sub.add_parser(
        "sync-semantic-modules",
        help="Generate machine-readable semantic layer for fp-result methods and modules",
    )
    sync_semantic_modules.add_argument("--root", default=".", help="Repository root")
    sync_semantic_modules.add_argument("--output-format", default="text", choices=("text", "json"), help="Output format")

    sync_python_parity = docs_sub.add_parser(
        "sync-python-parity",
        help="Generate Python Rust parity registry (machine and human readable)",
    )
    sync_python_parity.add_argument("--root", default=".", help="Repository root")
    sync_python_parity.add_argument("--output-format", default="text", choices=("text", "json"), help="Output format")

    sync_entity_catalog = docs_sub.add_parser(
        "sync-entity-catalog",
        help="Generate unified machine-readable entity catalog for docs/package/method IDs and relations",
    )
    sync_entity_catalog.add_argument("--root", default=".", help="Repository root")
    sync_entity_catalog.add_argument("--output-format", default="text", choices=("text", "json"), help="Output format")

    sync_noise_ignores = docs_sub.add_parser(
        "sync-noise-ignores",
        help="Synchronize .rgignore and .prettierignore from config/noise-ignore.txt",
    )
    sync_noise_ignores.add_argument("--root", default=".", help="Repository root")
    sync_noise_ignores.add_argument("--output-format", default="text", choices=("text", "json"), help="Output format")

    governance_check = docs_sub.add_parser(
        "governance-check",
        help="Run documentation governance policy gates",
    )
    governance_check.add_argument("--root", default=".", help="Repository root")
    governance_check.add_argument("--mode", default="pr", choices=("pr", "main", "scheduled"), help="Governance run mode")
    governance_check.add_argument("--changed-files-file", help="Optional newline-delimited changed files list")
    governance_check.add_argument("--policy-file", help="Optional docs governance policy file")
    governance_check.add_argument("--report-file", help="Optional machine-readable report output path")
    governance_check.add_argument("--output-format", default="text", choices=("text", "json"), help="Output format")

    registry_consistency = docs_sub.add_parser(
        "registry-consistency-report",
        help="Build registry consistency report for merge/release evidence",
    )
    registry_consistency.add_argument("--root", default=".", help="Repository root")
    registry_consistency.add_argument(
        "--mode",
        default="release",
        choices=("pr", "main", "release", "scheduled"),
        help="Registry consistency run mode",
    )
    registry_consistency.add_argument("--policy-file", help="Optional release registry report policy file")
    registry_consistency.add_argument("--report-file", help="Optional JSON report output path")
    registry_consistency.add_argument("--markdown-file", help="Optional markdown report output path")
    registry_consistency.add_argument("--output-format", default="text", choices=("text", "json"), help="Output format")

    rag_governance = docs_sub.add_parser(
        "rag-governance-check",
        help="Run RAG hardening v2 governance gates",
    )
    rag_governance.add_argument("--root", default=".", help="Repository root")
    rag_governance.add_argument(
        "--mode",
        default="pr",
        choices=("pr", "main", "release", "scheduled"),
        help="RAG governance run mode",
    )
    rag_governance.add_argument("--changed-files-file", help="Optional newline-delimited changed files list")
    rag_governance.add_argument("--policy-file", help="Optional RAG metadata policy file")
    rag_governance.add_argument("--report-file", help="Optional JSON report output path")
    rag_governance.add_argument("--markdown-file", help="Optional markdown report output path")
    rag_governance.add_argument("--output-format", default="text", choices=("text", "json"), help="Output format")

    capture_platform_settings = docs_sub.add_parser(
        "capture-platform-settings-snapshot",
        help="Capture live GitHub rulesets into docs platform settings snapshot",
    )
    capture_platform_settings.add_argument("--root", default=".", help="Repository root")
    capture_platform_settings.add_argument("--repository", required=True, help="GitHub repository identifier OWNER/REPO")
    capture_platform_settings.add_argument("--captured-by", required=True, help="Capture operator (team/user id)")
    capture_platform_settings.add_argument("--policy-file", help="Optional platform evidence policy file")
    capture_platform_settings.add_argument("--output-file", help="Optional output snapshot file")
    capture_platform_settings.add_argument("--raw-rulesets-file", help="Optional raw rulesets JSON file (offline mode)")
    capture_platform_settings.add_argument("--raw-export-file", help="Optional output file for raw rulesets export")
    capture_platform_settings.add_argument("--source-type", default="github-rest-api", help="source_of_capture.type value")
    capture_platform_settings.add_argument("--captured-from", help="source_of_capture.captured_from value")
    capture_platform_settings.add_argument("--capture-ref", help="source_of_capture.capture_ref value override")
    capture_platform_settings.add_argument("--token", help="GitHub token for API capture")
    capture_platform_settings.add_argument("--token-env", default="GITHUB_TOKEN", help="Env var for GitHub token")
    capture_platform_settings.add_argument("--api-base-url", default="https://api.github.com", help="GitHub API base URL")
    capture_platform_settings.add_argument("--timeout-seconds", default=30, type=int, help="GitHub API timeout in seconds")
    capture_platform_settings.add_argument(
        "--settings-export-file",
        action="append",
        default=[],
        help="Evidence path for settings export file (repeatable)",
    )
    capture_platform_settings.add_argument(
        "--workflow-run-url",
        action="append",
        default=[],
        help="Evidence URL for workflow run (repeatable)",
    )
    capture_platform_settings.add_argument("--failing-pr-example", default="", help="Blocked PR URL evidence")
    capture_platform_settings.add_argument("--passing-pr-example", default="", help="Passing PR URL evidence")
    capture_platform_settings.add_argument("--audit-notes", default="", help="Audit notes for evidence section")
    capture_platform_settings.add_argument(
        "--allow-incomplete-evidence",
        default="false",
        choices=("true", "false"),
        help="Allow snapshot save with incomplete evidence fields",
    )
    capture_platform_settings.add_argument("--output-format", default="text", choices=("text", "json"), help="Output format")

    platform_evidence = docs_sub.add_parser(
        "platform-enforcement-evidence-check",
        help="Validate live platform branch-protection/ruleset evidence against repo spec",
    )
    platform_evidence.add_argument("--root", default=".", help="Repository root")
    platform_evidence.add_argument(
        "--mode",
        default="release",
        choices=("pr", "main", "release", "scheduled"),
        help="Evidence validation run mode",
    )
    platform_evidence.add_argument("--policy-file", help="Optional platform evidence policy file")
    platform_evidence.add_argument("--snapshot-file", help="Optional live settings snapshot file")
    platform_evidence.add_argument("--report-file", help="Optional JSON report output path")
    platform_evidence.add_argument("--markdown-file", help="Optional markdown report output path")
    platform_evidence.add_argument("--output-format", default="text", choices=("text", "json"), help="Output format")

    file_inventory = docs_sub.add_parser(
        "file-inventory",
        help="Build JSON inventory of scripts and markdown files with extended metadata",
    )
    file_inventory.add_argument("--root", default=".", help="Repository root")
    file_inventory.add_argument("--output-file", default="dist/file-inventory/file-inventory.json", help="Output JSON file")
    file_inventory.add_argument("--config-file", help="Optional TOML config file with scope/filters")
    file_inventory.add_argument("--include-repo-root", choices=("true", "false"), help="Include monorepo root scan scope")
    file_inventory.add_argument("--include-all-packages", choices=("true", "false"), help="Include all packages/* with package.json")
    file_inventory.add_argument("--package", action="append", default=[], help="Package selector (name/path/wildcard), repeatable")
    file_inventory.add_argument("--include-markdown", choices=("true", "false"), help="Include .md files")
    file_inventory.add_argument("--script-extension", action="append", default=[], help="Script extension to include, repeatable")
    file_inventory.add_argument("--exclude-glob", action="append", default=[], help="Exclude glob pattern, repeatable")
    file_inventory.add_argument("--exclude-file-name", action="append", default=[], help="Exclude file name/pattern, repeatable")
    file_inventory.add_argument("--exclude-extension", action="append", default=[], help="Exclude extension, repeatable")
    file_inventory.add_argument("--exclude-directory", action="append", default=[], help="Exclude directory name/path pattern, repeatable")
    file_inventory.add_argument("--output-format", default="text", choices=("text", "json"), help="Output format")

    snapshot = sub.add_parser("snapshot", help="Parquet snapshot layer automation")
    snapshot_sub = snapshot.add_subparsers(dest="snapshot_command", required=True)

    snapshot_publish = snapshot_sub.add_parser("publish", help="Publish Parquet snapshot")
    snapshot_publish.add_argument("--root", default=".", help="Repository root")
    snapshot_publish.add_argument("--storage-root", default="dist/snapshot-store", help="Snapshot storage root")
    snapshot_publish.add_argument("--repository-id", required=True, help="Repository identifier")
    snapshot_publish.add_argument("--scan-id", required=True, help="Scan identifier")
    snapshot_publish.add_argument("--commit-hash", required=True, help="Git commit hash")
    snapshot_publish.add_argument("--branch-name", default="main", help="Branch name")
    snapshot_publish.add_argument("--snapshot-kind", default="full", help="Snapshot kind")
    snapshot_publish.add_argument("--extractor-version", default="1.0.0", help="Extractor version")
    snapshot_publish.add_argument("--schema-version", default="v1", help="Schema version")
    snapshot_publish.add_argument("--storage-format-version", default="1.0", help="Storage format version")
    snapshot_publish.add_argument("--datasets-json-file", help="Optional JSON file with dataset rows")
    snapshot_publish.add_argument("--lineage-json-file", help="Optional JSON file with lineage refs")
    snapshot_publish.add_argument("--output-format", default="text", choices=("text", "json"), help="Output format")

    snapshot_validate = snapshot_sub.add_parser("validate", help="Validate published snapshot")
    snapshot_validate.add_argument("--storage-root", default="dist/snapshot-store", help="Snapshot storage root")
    snapshot_validate.add_argument("--repository-id", required=True, help="Repository identifier")
    snapshot_validate.add_argument("--snapshot-id", required=True, help="Snapshot identifier")
    snapshot_validate.add_argument("--output-format", default="text", choices=("text", "json"), help="Output format")

    snapshot_diff = snapshot_sub.add_parser("diff", help="Build diff between two snapshots")
    snapshot_diff.add_argument("--storage-root", default="dist/snapshot-store", help="Snapshot storage root")
    snapshot_diff.add_argument("--repository-id", required=True, help="Repository identifier")
    snapshot_diff.add_argument("--from-snapshot-id", required=True, help="From snapshot id")
    snapshot_diff.add_argument("--to-snapshot-id", required=True, help="To snapshot id")
    snapshot_diff.add_argument("--output-format", default="text", choices=("text", "json"), help="Output format")

    snapshot_retention = snapshot_sub.add_parser("retention", help="Apply or preview retention policy")
    snapshot_retention.add_argument("--storage-root", default="dist/snapshot-store", help="Snapshot storage root")
    snapshot_retention.add_argument("--repository-id", required=True, help="Repository identifier")
    snapshot_retention.add_argument("--keep-daily", type=int, default=30, help="Daily snapshots to keep")
    snapshot_retention.add_argument("--keep-weekly", type=int, default=12, help="Weekly anchors to keep")
    snapshot_retention.add_argument("--keep-monthly", type=int, default=24, help="Monthly anchors to keep")
    snapshot_retention.add_argument("--apply", default="false", choices=("true", "false"), help="Apply deletion")
    snapshot_retention.add_argument("--output-format", default="text", choices=("text", "json"), help="Output format")

    snapshot_compaction = snapshot_sub.add_parser("compaction-plan", help="Build compaction candidates report")
    snapshot_compaction.add_argument("--storage-root", default="dist/snapshot-store", help="Snapshot storage root")
    snapshot_compaction.add_argument("--repository-id", required=True, help="Repository identifier")
    snapshot_compaction.add_argument("--snapshot-id", required=True, help="Snapshot identifier")
    snapshot_compaction.add_argument("--min-file-size-mb", type=int, default=16, help="Small file threshold in MB")
    snapshot_compaction.add_argument("--output-format", default="text", choices=("text", "json"), help="Output format")

    catalog = sub.add_parser("catalog", help="PostgreSQL catalog projection automation")
    catalog_sub = catalog.add_subparsers(dest="catalog_command", required=True)

    catalog_create_db = catalog_sub.add_parser("create-database", help="Create PostgreSQL database")
    catalog_create_db.add_argument("--admin-dsn", required=True, help="Admin DSN for PostgreSQL")
    catalog_create_db.add_argument("--database-name", required=True, help="Database name to create")
    catalog_create_db.add_argument("--output-format", default="text", choices=("text", "json"), help="Output format")

    catalog_init = catalog_sub.add_parser("init-schema", help="Initialize catalog schema")
    catalog_init.add_argument("--dsn", required=True, help="Target PostgreSQL DSN")
    catalog_init.add_argument("--sql-file", default=str(CATALOG_SQL_FILE_RELATIVE), help="SQL schema file")
    catalog_init.add_argument("--output-format", default="text", choices=("text", "json"), help="Output format")

    catalog_rebuild = catalog_sub.add_parser("rebuild", help="Full rebuild from snapshot")
    catalog_rebuild.add_argument("--dsn", required=True, help="Target PostgreSQL DSN")
    catalog_rebuild.add_argument("--storage-root", default="dist/snapshot-store", help="Snapshot storage root")
    catalog_rebuild.add_argument("--repository-id", required=True, help="Repository identifier")
    catalog_rebuild.add_argument("--snapshot-id", required=True, help="Snapshot identifier")
    catalog_rebuild.add_argument("--output-format", default="text", choices=("text", "json"), help="Output format")

    catalog_incremental = catalog_sub.add_parser("incremental-refresh", help="Incremental refresh by snapshot diff")
    catalog_incremental.add_argument("--dsn", required=True, help="Target PostgreSQL DSN")
    catalog_incremental.add_argument("--storage-root", default="dist/snapshot-store", help="Snapshot storage root")
    catalog_incremental.add_argument("--repository-id", required=True, help="Repository identifier")
    catalog_incremental.add_argument("--from-snapshot-id", required=True, help="From snapshot id")
    catalog_incremental.add_argument("--to-snapshot-id", required=True, help="To snapshot id")
    catalog_incremental.add_argument("--output-format", default="text", choices=("text", "json"), help="Output format")

    return parser


def _run_docs_check_links(args: argparse.Namespace) -> int:
    root = Path(args.root).resolve()
    report = run_check_links(root)
    should_fail = args.fail_on_missing.lower() == "true"

    payload = {
        "status": "ok" if report.is_success else "validation_error",
        "version": "1.0",
        "data": report.to_dict(),
        "errors": [],
    }
    _emit(payload, args.output_format, report)

    if should_fail and not report.is_success:
        return EXIT_VALIDATION_ERROR
    return EXIT_OK


def _run_docs_verify(args: argparse.Namespace) -> int:
    root = Path(args.root).resolve()
    report = run_verify_docs(root)
    payload = {
        "status": "ok" if report.is_success else "validation_error",
        "version": "1.0",
        "data": report.to_dict(),
        "errors": [],
    }
    _emit(payload, args.output_format, report)
    return EXIT_OK if report.is_success else EXIT_VALIDATION_ERROR


def _run_readme_create(args: argparse.Namespace) -> int:
    source_dir = Path(args.source_dir)
    out_file = Path(args.out_file)
    result: Result[dict[str, str | int], str]
    try:
        result = Ok(run_readme_create(source_dir=source_dir, out_file=out_file))
    except Exception as exc:  # noqa: BLE001
        result = Err(str(exc))

    if isinstance(result, Err):
        payload = {"status": "validation_error", "version": "1.0", "data": {}, "errors": [result.error]}
        _emit(payload, args.output_format, None)
        return EXIT_VALIDATION_ERROR

    payload = {"status": "ok", "version": "1.0", "data": result.value, "errors": []}
    _emit(payload, args.output_format, None)
    return EXIT_OK


def _run_docs_sync_identifiers(args: argparse.Namespace) -> int:
    root = Path(args.root).resolve()
    report = run_sync_identifiers(root)
    payload = {
        "status": "ok",
        "version": "1.0",
        "data": report.to_dict(),
        "errors": [],
    }
    _emit(payload, args.output_format, report)
    return EXIT_OK


def _run_docs_sync_registries(args: argparse.Namespace) -> int:
    root = Path(args.root).resolve()
    report = run_sync_registries(root)
    payload = {
        "status": "ok",
        "version": "1.0",
        "data": report.to_dict(),
        "errors": [],
    }
    _emit(payload, args.output_format, report)
    return EXIT_OK


def _run_docs_sync_semantic_modules(args: argparse.Namespace) -> int:
    root = Path(args.root).resolve()
    report = run_sync_semantic_modules(root)
    payload = {
        "status": "ok",
        "version": "1.0",
        "data": report.to_dict(),
        "errors": [],
    }
    _emit(payload, args.output_format, report)
    return EXIT_OK


def _run_docs_sync_python_parity(args: argparse.Namespace) -> int:
    root = Path(args.root).resolve()
    report = run_sync_python_parity_registry(root)
    payload = {
        "status": "ok",
        "version": "1.0",
        "data": report.to_dict(),
        "errors": [],
    }
    _emit(payload, args.output_format, report)
    return EXIT_OK


def _run_docs_sync_entity_catalog(args: argparse.Namespace) -> int:
    root = Path(args.root).resolve()
    report = run_sync_entity_catalog(root)
    payload = {
        "status": "ok",
        "version": "1.0",
        "data": report.to_dict(),
        "errors": [],
    }
    _emit(payload, args.output_format, report)
    return EXIT_OK


def _run_docs_sync_noise_ignores(args: argparse.Namespace) -> int:
    root = Path(args.root).resolve()
    report = run_sync_noise_ignores(root)
    payload = {
        "status": "ok",
        "version": "1.0",
        "data": report.to_dict(),
        "errors": [],
    }
    _emit(payload, args.output_format, report)
    return EXIT_OK


def _run_docs_governance_check(args: argparse.Namespace) -> int:
    root = Path(args.root).resolve()
    changed_files_file = Path(args.changed_files_file).resolve() if args.changed_files_file else None
    policy_file = Path(args.policy_file).resolve() if args.policy_file else None
    report_file = Path(args.report_file).resolve() if args.report_file else None

    report = run_governance_check(
        root=root,
        mode=args.mode,
        changed_files_file=changed_files_file,
        policy_file=policy_file,
        report_file=report_file,
    )
    payload = {
        "status": "ok" if report.is_success else "validation_error",
        "version": "1.0",
        "data": report.to_dict(),
        "errors": [],
    }
    _emit(payload, args.output_format, report)
    return EXIT_OK if report.is_success else EXIT_VALIDATION_ERROR


def _run_docs_registry_consistency_report(args: argparse.Namespace) -> int:
    root = Path(args.root).resolve()
    policy_file = Path(args.policy_file).resolve() if args.policy_file else None
    report_file = Path(args.report_file).resolve() if args.report_file else None
    markdown_file = Path(args.markdown_file).resolve() if args.markdown_file else None

    report = run_registry_consistency_report(
        root=root,
        mode=args.mode,
        policy_file=policy_file,
        report_file=report_file,
        markdown_file=markdown_file,
    )
    payload = {
        "status": "ok" if report.is_success else "validation_error",
        "version": "1.0",
        "data": report.to_dict(),
        "errors": [],
    }
    _emit(payload, args.output_format, report)

    mode_policy = {
        "pr": {"warnings_enforced": False},
        "main": {"warnings_enforced": True},
        "release": {"warnings_enforced": True},
        "scheduled": {"warnings_enforced": False},
    }
    if report.status == "fail":
        return EXIT_VALIDATION_ERROR
    if report.status == "pass-with-warnings" and mode_policy[args.mode]["warnings_enforced"]:
        return EXIT_VALIDATION_ERROR
    return EXIT_OK


def _run_docs_rag_governance_check(args: argparse.Namespace) -> int:
    root = Path(args.root).resolve()
    changed_files_file = Path(args.changed_files_file).resolve() if args.changed_files_file else None
    policy_file = Path(args.policy_file).resolve() if args.policy_file else None
    report_file = Path(args.report_file).resolve() if args.report_file else None
    markdown_file = Path(args.markdown_file).resolve() if args.markdown_file else None

    report = run_rag_governance_check(
        root=root,
        mode=args.mode,
        changed_files_file=changed_files_file,
        policy_file=policy_file,
        report_file=report_file,
        markdown_file=markdown_file,
    )
    payload = {
        "status": "ok" if report.is_success else "validation_error",
        "version": "2.0",
        "data": report.to_dict(),
        "errors": [],
    }
    _emit(payload, args.output_format, report)

    warnings_blocking = {"pr": False, "main": False, "release": True, "scheduled": False}
    if report.status == "fail":
        return EXIT_VALIDATION_ERROR
    if report.status == "pass-with-warnings" and warnings_blocking[args.mode]:
        return EXIT_VALIDATION_ERROR
    return EXIT_OK


def _run_docs_capture_platform_settings_snapshot(args: argparse.Namespace) -> int:
    root = Path(args.root).resolve()
    policy_file = Path(args.policy_file).resolve() if args.policy_file else None
    output_file = Path(args.output_file).resolve() if args.output_file else None
    raw_rulesets_file = Path(args.raw_rulesets_file).resolve() if args.raw_rulesets_file else None
    raw_export_file = Path(args.raw_export_file).resolve() if args.raw_export_file else None
    allow_incomplete_evidence = args.allow_incomplete_evidence.lower() == "true"

    report = run_capture_platform_settings_snapshot(
        root=root,
        repository=args.repository,
        captured_by=args.captured_by,
        policy_file=policy_file,
        output_file=output_file,
        raw_rulesets_file=raw_rulesets_file,
        raw_export_file=raw_export_file,
        source_type=args.source_type,
        captured_from=args.captured_from,
        capture_ref=args.capture_ref,
        token=args.token,
        token_env=args.token_env,
        api_base_url=args.api_base_url,
        timeout_seconds=int(args.timeout_seconds),
        settings_export_files=tuple(args.settings_export_file),
        workflow_run_urls=tuple(args.workflow_run_url),
        failing_pr_example=args.failing_pr_example,
        passing_pr_example=args.passing_pr_example,
        audit_notes=args.audit_notes,
        allow_incomplete_evidence=allow_incomplete_evidence,
    )
    payload = {
        "status": "ok" if report.is_success else "validation_error",
        "version": "1.0",
        "data": report.to_dict(),
        "errors": [],
    }
    _emit(payload, args.output_format, report)

    if report.status == "fail":
        return EXIT_VALIDATION_ERROR
    return EXIT_OK


def _run_docs_platform_enforcement_evidence_check(args: argparse.Namespace) -> int:
    root = Path(args.root).resolve()
    policy_file = Path(args.policy_file).resolve() if args.policy_file else None
    snapshot_file = Path(args.snapshot_file).resolve() if args.snapshot_file else None
    report_file = Path(args.report_file).resolve() if args.report_file else None
    markdown_file = Path(args.markdown_file).resolve() if args.markdown_file else None

    report = run_platform_enforcement_evidence_check(
        root=root,
        mode=args.mode,
        policy_file=policy_file,
        snapshot_file=snapshot_file,
        report_file=report_file,
        markdown_file=markdown_file,
    )
    payload = {
        "status": "ok" if report.is_success else "validation_error",
        "version": "1.0",
        "data": report.to_dict(),
        "errors": [],
    }
    _emit(payload, args.output_format, report)

    warnings_blocking = {"pr": False, "main": False, "release": True, "scheduled": False}
    if report.status == "fail":
        return EXIT_VALIDATION_ERROR
    if report.status == "pass-with-warnings" and warnings_blocking[args.mode]:
        return EXIT_VALIDATION_ERROR
    return EXIT_OK


def _run_docs_file_inventory(args: argparse.Namespace) -> int:
    root = Path(args.root).resolve()
    config_file = Path(args.config_file).resolve() if args.config_file else None
    output_file = Path(args.output_file)
    if not output_file.is_absolute():
        output_file = (root / output_file).resolve()

    report = run_file_inventory(
        root=root,
        output_file=output_file,
        config_file=config_file,
        include_repo_root=_parse_optional_bool(args.include_repo_root),
        include_all_packages=_parse_optional_bool(args.include_all_packages),
        package_selectors=tuple(args.package),
        include_markdown=_parse_optional_bool(args.include_markdown),
        script_extensions=tuple(args.script_extension),
        exclude_globs=tuple(args.exclude_glob),
        exclude_file_names=tuple(args.exclude_file_name),
        exclude_extensions=tuple(args.exclude_extension),
        exclude_directories=tuple(args.exclude_directory),
    )

    payload = {
        "status": "ok" if report.is_success else "validation_error",
        "version": "1.0",
        "data": report.to_dict(),
        "errors": [],
    }
    _emit(payload, args.output_format, report)
    return EXIT_OK if report.is_success else EXIT_VALIDATION_ERROR


def _run_snapshot_publish(args: argparse.Namespace) -> int:
    request = SnapshotPublishRequest(
        root=Path(args.root).resolve(),
        storage_root=Path(args.storage_root).resolve(),
        repository_id=args.repository_id,
        scan_id=args.scan_id,
        commit_hash=args.commit_hash,
        branch_name=args.branch_name,
        snapshot_kind=args.snapshot_kind,
        extractor_version=args.extractor_version,
        schema_version=args.schema_version,
        storage_format_version=args.storage_format_version,
        datasets_json_file=Path(args.datasets_json_file).resolve() if args.datasets_json_file else None,
        lineage_json_file=Path(args.lineage_json_file).resolve() if args.lineage_json_file else None,
    )
    report = run_snapshot_publish(request)
    payload = {
        "status": "ok" if report.is_success else "validation_error",
        "version": "1.0",
        "data": report.to_dict(),
        "errors": list(report.validation_issues),
    }
    _emit(payload, args.output_format, report)
    return EXIT_OK if report.is_success else EXIT_VALIDATION_ERROR


def _run_snapshot_validate(args: argparse.Namespace) -> int:
    report = run_snapshot_validate(
        storage_root=Path(args.storage_root).resolve(),
        repository_id=args.repository_id,
        snapshot_id=args.snapshot_id,
    )
    payload = {
        "status": "ok" if report.is_success else "validation_error",
        "version": "1.0",
        "data": report.to_dict(),
        "errors": list(report.issues),
    }
    _emit(payload, args.output_format, report)
    return EXIT_OK if report.is_success else EXIT_VALIDATION_ERROR


def _run_snapshot_diff(args: argparse.Namespace) -> int:
    report = run_snapshot_diff(
        storage_root=Path(args.storage_root).resolve(),
        repository_id=args.repository_id,
        from_snapshot_id=args.from_snapshot_id,
        to_snapshot_id=args.to_snapshot_id,
    )
    payload = {
        "status": "ok",
        "version": "1.0",
        "data": report.to_dict(),
        "errors": [],
    }
    _emit(payload, args.output_format, report)
    return EXIT_OK


def _run_snapshot_retention(args: argparse.Namespace) -> int:
    report = run_snapshot_retention(
        storage_root=Path(args.storage_root).resolve(),
        repository_id=args.repository_id,
        keep_daily=int(args.keep_daily),
        keep_weekly=int(args.keep_weekly),
        keep_monthly=int(args.keep_monthly),
        apply=args.apply.lower() == "true",
    )
    payload = {
        "status": "ok",
        "version": "1.0",
        "data": report.to_dict(),
        "errors": [],
    }
    _emit(payload, args.output_format, report)
    return EXIT_OK


def _run_snapshot_compaction_plan(args: argparse.Namespace) -> int:
    report = run_snapshot_compaction_plan(
        storage_root=Path(args.storage_root).resolve(),
        repository_id=args.repository_id,
        snapshot_id=args.snapshot_id,
        min_file_size_mb=int(args.min_file_size_mb),
    )
    payload = {
        "status": "ok",
        "version": "1.0",
        "data": report.to_dict(),
        "errors": [],
    }
    _emit(payload, args.output_format, report)
    return EXIT_OK


def _run_catalog_create_database(args: argparse.Namespace) -> int:
    report = run_catalog_create_database(admin_dsn=args.admin_dsn, database_name=args.database_name)
    payload = {
        "status": "ok",
        "version": "1.0",
        "data": report.to_dict(),
        "errors": [],
    }
    _emit(payload, args.output_format, report)
    return EXIT_OK


def _run_catalog_init_schema(args: argparse.Namespace) -> int:
    report = run_catalog_init_schema(dsn=args.dsn, sql_file=Path(args.sql_file).resolve())
    payload = {
        "status": "ok",
        "version": "1.0",
        "data": report.to_dict(),
        "errors": [],
    }
    _emit(payload, args.output_format, report)
    return EXIT_OK


def _run_catalog_rebuild(args: argparse.Namespace) -> int:
    report = run_catalog_rebuild_from_snapshot(
        dsn=args.dsn,
        storage_root=Path(args.storage_root).resolve(),
        repository_id=args.repository_id,
        snapshot_id=args.snapshot_id,
    )
    payload = {
        "status": "ok",
        "version": "1.0",
        "data": report.to_dict(),
        "errors": [],
    }
    _emit(payload, args.output_format, report)
    return EXIT_OK


def _run_catalog_incremental_refresh(args: argparse.Namespace) -> int:
    report = run_catalog_incremental_refresh(
        dsn=args.dsn,
        storage_root=Path(args.storage_root).resolve(),
        repository_id=args.repository_id,
        from_snapshot_id=args.from_snapshot_id,
        to_snapshot_id=args.to_snapshot_id,
    )
    payload = {
        "status": "ok",
        "version": "1.0",
        "data": report.to_dict(),
        "errors": [],
    }
    _emit(payload, args.output_format, report)
    return EXIT_OK


def _emit(payload: dict[str, Any], output_format: str, report: Any) -> None:
    if output_format == "json":
        print(json.dumps(payload, ensure_ascii=False, indent=2))
        return

    status = payload["status"]
    if status == "ok":
        if report is not None and hasattr(report, "checked_files"):
            print(f"Checked markdown files: {report.checked_files}")
            if hasattr(report, "missing_links"):
                print(f"Missing links: {len(report.missing_links)}")
        if report is not None and hasattr(report, "checked_markdown_files"):
            if getattr(report, "link_report", None) is not None:
                print(f"Checked markdown files: {report.link_report.checked_files}")
                print(f"Missing links: {len(report.link_report.missing_links)}")
            print("docs:verify OK")
            print(f"checked markdown files: {report.checked_markdown_files}")
            print(f"checked index files: {report.checked_index_files}")
        if report is not None and getattr(report, "report_kind", "") == "rag-governance":
            print(
                "RAG governance check completed: "
                f"mode={report.mode}, gates={len(report.gates)}, "
                f"status={report.status}, "
                f"blocking_failures={report.blocking_failures}, "
                f"warning_failures={report.warning_failures}"
            )
        elif report is not None and hasattr(report, "gates") and hasattr(report, "blocking_failures"):
            print(
                "Docs governance check completed: "
                f"mode={report.mode}, gates={len(report.gates)}, "
                f"blocking_failures={report.blocking_failures}, "
                f"warning_failures={report.warning_failures}"
            )
        if report is not None and hasattr(report, "sections") and hasattr(report, "score") and not hasattr(report, "gates"):
            if getattr(report, "report_kind", "") == "platform-enforcement-evidence":
                print(
                    "Platform enforcement evidence check completed: "
                    f"mode={report.mode}, status={report.status}, "
                    f"blocking_failures={report.blocking_failures}, "
                    f"warning_failures={report.warning_failures}, score={report.score}"
                )
            else:
                print(
                    "Registry consistency report completed: "
                    f"mode={report.mode}, status={report.status}, "
                    f"blocking_failures={report.blocking_failures}, "
                    f"warning_failures={report.warning_failures}, score={report.score}"
                )
        if report is not None and getattr(report, "report_kind", "") == "platform-settings-snapshot-capture":
            print(
                "Platform settings snapshot captured: "
                f"repository={report.repository}, status={report.status}, "
                f"rulesets={report.rulesets_count}, "
                f"required_checks={report.required_checks_count}, "
                f"release_required_checks={report.release_required_checks_count}"
            )
            print(f"snapshot_file: {report.snapshot_file}")
            print(f"raw_rulesets_file: {report.raw_rulesets_file}")
            if len(report.evidence_warnings) > 0:
                print("evidence_warnings:")
                for warning in report.evidence_warnings:
                    print(f"- {warning}")
        if report is not None and getattr(report, "report_kind", "") == "file-inventory":
            print(
                "File inventory completed: "
                f"files={report.files_count}, "
                f"scopes={len(report.scanned_scopes)}, "
                f"errors={len(report.errors)}"
            )
            print(f"output_file: {report.output_file}")
        if report is not None and report.__class__.__name__ == "IdentifierSyncReport":
            print(f"Identifier registry synchronized: packages={report.packages_count}, methods={report.methods_count}")
            print(f"completed={report.completed_methods_count}, in_adjustment={report.in_adjustment_methods_count}, planned={report.planned_methods_count}")
            print(f"assignments_file: {report.assignments_file}")
            print(f"registry_json_file: {report.registry_json_file}")
            print(f"registry_markdown_file: {report.registry_markdown_file}")
        if report is not None and report.__class__.__name__ == "SemanticRegistrySyncReport":
            print(
                "Semantic registry synchronized: "
                f"modules={report.semantic_modules_count}, "
                f"primary={report.primary_methods_count}, "
                f"supplemental={report.supplemental_methods_count}, "
                f"types={report.type_entries_count}"
            )
            print(
                f"resolved={report.resolved_methods_count}, unresolved={report.unresolved_methods_count}"
            )
            print(f"registry_json_file: {report.registry_json_file}")
            print(f"layer_markdown_file: {report.layer_markdown_file}")
        if report is not None and report.__class__.__name__ == "PythonParitySyncReport":
            print(
                "Python parity registry synchronized: "
                f"packages={report.packages_count}, methods={report.methods_count}, "
                f"completed={report.completed_methods_count}, "
                f"in_adjustment={report.in_adjustment_methods_count}, "
                f"planned={report.planned_methods_count}"
            )
            print(f"registry_json_file: {report.registry_json_file}")
            print(f"registry_markdown_file: {report.registry_markdown_file}")
        if report is not None and report.__class__.__name__ == "EntityCatalogSyncReport":
            print(
                "Entity catalog synchronized: "
                f"documents={report.documents_count}, packages={report.packages_count}, "
                f"methods={report.methods_count}, relations={report.relations_count}, "
                f"unresolved_relations={report.unresolved_relations_count}"
            )
            print(f"registry_json_file: {report.registry_json_file}")
        if report is not None and hasattr(report, "identifiers_report"):
            identifiers = report.identifiers_report
            semantic = report.semantic_report
            python_parity = report.python_parity_report
            entity_catalog = report.entity_catalog_report
            print(
                "Registries synchronized in order: "
                "identifiers -> semantic-modules -> python-parity -> entity-catalog"
            )
            print(
                f"identifiers: packages={identifiers.packages_count}, methods={identifiers.methods_count}, "
                f"completed={identifiers.completed_methods_count}, in_adjustment={identifiers.in_adjustment_methods_count}, planned={identifiers.planned_methods_count}"
            )
            print(
                f"semantic: modules={semantic.semantic_modules_count}, primary={semantic.primary_methods_count}, "
                f"supplemental={semantic.supplemental_methods_count}, types={semantic.type_entries_count}, "
                f"resolved={semantic.resolved_methods_count}, unresolved={semantic.unresolved_methods_count}"
            )
            print(
                f"python-parity: packages={python_parity.packages_count}, methods={python_parity.methods_count}, "
                f"completed={python_parity.completed_methods_count}, in_adjustment={python_parity.in_adjustment_methods_count}, planned={python_parity.planned_methods_count}"
            )
            print(
                f"entity-catalog: documents={entity_catalog.documents_count}, packages={entity_catalog.packages_count}, "
                f"methods={entity_catalog.methods_count}, relations={entity_catalog.relations_count}, "
                f"unresolved_relations={entity_catalog.unresolved_relations_count}"
            )
            print(f"identifier_registry_json_file: {identifiers.registry_json_file}")
            print(f"semantic_registry_json_file: {semantic.registry_json_file}")
            print(f"semantic_layer_markdown_file: {semantic.layer_markdown_file}")
            print(f"python_parity_registry_json_file: {python_parity.registry_json_file}")
            print(f"python_parity_registry_markdown_file: {python_parity.registry_markdown_file}")
            print(f"entity_catalog_registry_json_file: {entity_catalog.registry_json_file}")
        if report is not None and hasattr(report, "rgignore_file") and hasattr(report, "prettierignore_file"):
            print(
                "Noise ignore files synchronized: "
                f"noise_patterns={report.noise_patterns_count}, "
                f"rgignore_patterns={report.rgignore_patterns_count}, "
                f"prettier_patterns={report.prettier_patterns_count}"
            )
            print(f"rgignore_file: {report.rgignore_file}")
            print(f"prettierignore_file: {report.prettierignore_file}")
        if report is not None and hasattr(report, "snapshot_id") and hasattr(report, "reused_existing_snapshot"):
            print(
                "Snapshot publish "
                f"{'reused' if report.reused_existing_snapshot else 'completed'}: "
                f"snapshot_id={report.snapshot_id}, datasets={report.datasets_count}"
            )
            print(f"snapshot_root: {report.snapshot_root}")
            print(f"manifest_file: {report.manifest_file}")
        if report is not None and hasattr(report, "issues") and hasattr(report, "snapshot_id"):
            print(
                f"Snapshot validation {'OK' if report.is_success else 'FAILED'}: "
                f"snapshot_id={report.snapshot_id}, issues={len(report.issues)}"
            )
            print(f"manifest_file: {report.manifest_file}")
        if report is not None and hasattr(report, "changed_datasets") and hasattr(report, "from_snapshot_id") and hasattr(report, "to_snapshot_id") and hasattr(report, "diff_root"):
            print(
                "Snapshot diff completed: "
                f"from={report.from_snapshot_id}, to={report.to_snapshot_id}, "
                f"changed_datasets={len(report.changed_datasets)}"
            )
            print(f"diff_root: {report.diff_root}")
        if report is not None and hasattr(report, "snapshots_marked_for_deletion") and hasattr(report, "keep_daily"):
            print(
                "Snapshot retention evaluated: "
                f"total={report.snapshots_total}, kept={report.snapshots_kept}, "
                f"marked_for_deletion={report.snapshots_marked_for_deletion}, apply={report.apply}"
            )
        if report is not None and hasattr(report, "min_file_size_mb") and hasattr(report, "candidates"):
            print(
                "Snapshot compaction plan created: "
                f"snapshot_id={report.snapshot_id}, candidates={len(report.candidates)}, "
                f"min_file_size_mb={report.min_file_size_mb}"
            )
        if report is not None and hasattr(report, "database_name") and hasattr(report, "created"):
            print(
                "PostgreSQL database operation completed: "
                f"database_name={report.database_name}, created={report.created}"
            )
        if report is not None and hasattr(report, "sql_file") and hasattr(report, "dsn"):
            print(f"Catalog schema initialized: sql_file={report.sql_file}")
        if report is not None and hasattr(report, "loaded_datasets") and hasattr(report, "loaded_rows_total"):
            print(
                "Catalog projection updated: "
                f"repository_id={report.repository_id}, loaded_rows_total={report.loaded_rows_total}"
            )
            if hasattr(report, "snapshot_id"):
                print(f"snapshot_id: {report.snapshot_id}")
            if hasattr(report, "from_snapshot_id") and hasattr(report, "to_snapshot_id"):
                print(f"from_snapshot_id: {report.from_snapshot_id}")
                print(f"to_snapshot_id: {report.to_snapshot_id}")
        if report is not None and hasattr(report, "loaded_rows_total") and hasattr(report, "from_snapshot_id") and hasattr(report, "to_snapshot_id") and not hasattr(report, "diff_root"):
            print(
                "Catalog incremental refresh completed: "
                f"repository_id={report.repository_id}, "
                f"from={report.from_snapshot_id}, to={report.to_snapshot_id}, "
                f"changed_datasets={len(report.changed_datasets)}, "
                f"loaded_rows_total={report.loaded_rows_total}"
            )
        return

    if report is not None and hasattr(report, "checked_markdown_files"):
        if getattr(report, "link_report", None) is not None:
            print(f"Checked markdown files: {report.link_report.checked_files}")
            print(f"Missing links: {len(report.link_report.missing_links)}")
        print(f"docs:verify FAILED ({len(report.issues)} issue(s))")
        for issue in report.issues:
            print(f"- [{issue.check}] {issue.file}")
            print(f"  {issue.message}")
        return

    if report is not None and hasattr(report, "missing_links"):
        print(f"Checked markdown files: {report.checked_files}")
        print(f"Missing links: {len(report.missing_links)}")
        for issue in report.missing_links:
            print(f"- [{issue.link_type}] {issue.source_file} -> {issue.target}")
            print(f"  resolved: {issue.resolved}")
        return

    for error in payload.get("errors", []):
        print(error, file=sys.stderr)


def _print_error(message: str, code: int) -> int:
    print(message, file=sys.stderr)
    return code


def _parse_optional_bool(value: str | None) -> bool | None:
    if value is None:
        return None
    return value.lower() == "true"


if __name__ == "__main__":
    raise SystemExit(main())
