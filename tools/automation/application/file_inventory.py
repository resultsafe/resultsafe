from __future__ import annotations

import hashlib
import json
import mimetypes
import os
import stat
import tomllib
from dataclasses import dataclass
from datetime import datetime, timezone
from fnmatch import fnmatch
from pathlib import Path
from typing import Any


DEFAULT_SCRIPT_EXTENSIONS: tuple[str, ...] = (
    ".py",
    ".ps1",
    ".sh",
    ".bash",
    ".zsh",
    ".cmd",
    ".bat",
    ".js",
    ".mjs",
    ".cjs",
    ".ts",
    ".mts",
    ".cts",
    ".tsx",
    ".jsx",
)

DEFAULT_EXCLUDE_DIRECTORIES: tuple[str, ...] = (
    "node_modules",
    ".git",
    ".hg",
    ".svn",
    ".idea",
    ".vscode",
    ".next",
    ".turbo",
    ".docusaurus",
    ".pnpm-store",
    "__pycache__",
    "dist",
    "build",
    "coverage",
)


@dataclass(frozen=True)
class FileInventoryEntry:
    file_id: str
    relative_path: str
    absolute_path: str
    parent_directory: str
    top_level_directory: str
    relative_depth: int
    file_name: str
    file_stem: str
    extension: str
    suffixes: tuple[str, ...]
    file_kind: str
    language_hint: str
    mime_type: str
    scan_scope: str
    package_name: str | None
    package_path: str | None
    size_bytes: int
    line_count: int
    non_empty_line_count: int
    character_count: int
    word_count: int
    newline_count: int
    newline_style: str
    contains_non_ascii: bool
    created_at_utc: str
    modified_at_utc: str
    accessed_at_utc: str
    mode_octal: str
    is_executable: bool
    is_symlink: bool
    is_hidden: bool
    is_readable: bool
    is_writable: bool
    sha256: str
    md5: str
    shebang: str | None

    def to_dict(self) -> dict[str, Any]:
        return {
            "file_id": self.file_id,
            "relative_path": self.relative_path,
            "absolute_path": self.absolute_path,
            "parent_directory": self.parent_directory,
            "top_level_directory": self.top_level_directory,
            "relative_depth": self.relative_depth,
            "file_name": self.file_name,
            "file_stem": self.file_stem,
            "extension": self.extension,
            "suffixes": list(self.suffixes),
            "file_kind": self.file_kind,
            "language_hint": self.language_hint,
            "mime_type": self.mime_type,
            "scan_scope": self.scan_scope,
            "package_name": self.package_name,
            "package_path": self.package_path,
            "size_bytes": self.size_bytes,
            "line_count": self.line_count,
            "non_empty_line_count": self.non_empty_line_count,
            "character_count": self.character_count,
            "word_count": self.word_count,
            "newline_count": self.newline_count,
            "newline_style": self.newline_style,
            "contains_non_ascii": self.contains_non_ascii,
            "created_at_utc": self.created_at_utc,
            "modified_at_utc": self.modified_at_utc,
            "accessed_at_utc": self.accessed_at_utc,
            "mode_octal": self.mode_octal,
            "is_executable": self.is_executable,
            "is_symlink": self.is_symlink,
            "is_hidden": self.is_hidden,
            "is_readable": self.is_readable,
            "is_writable": self.is_writable,
            "sha256": self.sha256,
            "md5": self.md5,
            "shebang": self.shebang,
        }


@dataclass(frozen=True)
class FileInventoryReport:
    root: str
    output_file: str
    generated_at: str
    scanned_scopes: tuple[dict[str, str], ...]
    config_file: str | None
    include_repo_root: bool
    include_all_packages: bool
    selected_packages: tuple[str, ...]
    script_extensions: tuple[str, ...]
    include_markdown: bool
    exclude_globs: tuple[str, ...]
    exclude_file_names: tuple[str, ...]
    exclude_extensions: tuple[str, ...]
    exclude_directories: tuple[str, ...]
    files: tuple[FileInventoryEntry, ...]
    errors: tuple[str, ...]

    @property
    def report_kind(self) -> str:
        return "file-inventory"

    @property
    def files_count(self) -> int:
        return len(self.files)

    @property
    def is_success(self) -> bool:
        return len(self.errors) == 0

    def to_dict(self) -> dict[str, Any]:
        by_kind: dict[str, int] = {}
        by_extension: dict[str, int] = {}
        by_top_level: dict[str, int] = {}
        by_package: dict[str, int] = {}
        total_size = 0
        total_lines = 0
        total_non_empty_lines = 0

        for item in self.files:
            total_size += item.size_bytes
            total_lines += item.line_count
            total_non_empty_lines += item.non_empty_line_count
            by_kind[item.file_kind] = by_kind.get(item.file_kind, 0) + 1
            by_extension[item.extension] = by_extension.get(item.extension, 0) + 1

            parts = item.relative_path.split("/")
            top = parts[0] if len(parts) > 0 else "."
            by_top_level[top] = by_top_level.get(top, 0) + 1

            package_key = item.package_name or "(no-package)"
            by_package[package_key] = by_package.get(package_key, 0) + 1

        return {
            "version": "1.0",
            "root": self.root,
            "output_file": self.output_file,
            "generated_at": self.generated_at,
            "status": "ok" if self.is_success else "validation_error",
            "settings": {
                "config_file": self.config_file,
                "include_repo_root": self.include_repo_root,
                "include_all_packages": self.include_all_packages,
                "selected_packages": list(self.selected_packages),
                "script_extensions": list(self.script_extensions),
                "include_markdown": self.include_markdown,
                "exclude_globs": list(self.exclude_globs),
                "exclude_file_names": list(self.exclude_file_names),
                "exclude_extensions": list(self.exclude_extensions),
                "exclude_directories": list(self.exclude_directories),
            },
            "scanned_scopes": list(self.scanned_scopes),
            "summary": {
                "files_count": len(self.files),
                "total_size_bytes": total_size,
                "total_lines": total_lines,
                "total_non_empty_lines": total_non_empty_lines,
                "by_kind": by_kind,
                "by_extension": by_extension,
                "by_top_level_directory": by_top_level,
                "by_package": by_package,
                "errors_count": len(self.errors),
            },
            "errors": list(self.errors),
            "files": [item.to_dict() for item in self.files],
        }


@dataclass(frozen=True)
class _PackageInfo:
    package_name: str
    package_root: Path
    package_root_relative: str


@dataclass(frozen=True)
class _InventoryConfig:
    include_repo_root: bool
    include_all_packages: bool
    package_selectors: tuple[str, ...]
    include_markdown: bool
    script_extensions: tuple[str, ...]
    exclude_globs: tuple[str, ...]
    exclude_file_names: tuple[str, ...]
    exclude_extensions: tuple[str, ...]
    exclude_directories: tuple[str, ...]


def run_file_inventory(
    root: Path,
    output_file: Path,
    *,
    config_file: Path | None = None,
    include_repo_root: bool | None = None,
    include_all_packages: bool | None = None,
    package_selectors: tuple[str, ...] = (),
    include_markdown: bool | None = None,
    script_extensions: tuple[str, ...] = (),
    exclude_globs: tuple[str, ...] = (),
    exclude_file_names: tuple[str, ...] = (),
    exclude_extensions: tuple[str, ...] = (),
    exclude_directories: tuple[str, ...] = (),
) -> FileInventoryReport:
    repo_root = root.resolve()
    output_path = output_file if output_file.is_absolute() else (repo_root / output_file).resolve()

    file_config = _load_inventory_config(config_file if config_file is None or config_file.is_absolute() else (repo_root / config_file).resolve())
    merged = _merge_config(
        file_config=file_config,
        include_repo_root=include_repo_root,
        include_all_packages=include_all_packages,
        package_selectors=package_selectors,
        include_markdown=include_markdown,
        script_extensions=script_extensions,
        exclude_globs=exclude_globs,
        exclude_file_names=exclude_file_names,
        exclude_extensions=exclude_extensions,
        exclude_directories=exclude_directories,
    )

    packages = _discover_packages(repo_root)
    selected_packages = _resolve_package_selection(repo_root, packages, merged.package_selectors)
    selected_paths = {item.package_root.resolve() for item in selected_packages}
    package_map = {item.package_root.resolve().as_posix(): item for item in selected_packages}

    scopes: list[tuple[str, Path]] = []
    if merged.include_repo_root:
        scopes.append(("repo-root", repo_root))
    for item in selected_packages:
        scopes.append((f"package:{item.package_name}", item.package_root))
    if merged.include_all_packages:
        for item in packages:
            if item.package_root.resolve() in selected_paths:
                continue
            scopes.append((f"package:{item.package_name}", item.package_root))

    if len(scopes) == 0:
        raise ValueError("No scan scope selected. Enable --include-repo-root or provide --package selectors.")

    seen_paths: set[str] = set()
    entries: list[FileInventoryEntry] = []
    errors: list[str] = []
    scope_rows: list[dict[str, str]] = []

    for scope_name, scan_root in scopes:
        scope_rows.append(
            {
                "scope": scope_name,
                "scan_root": scan_root.as_posix(),
            }
        )
        for file_path in _iter_files(scan_root):
            try:
                relative = file_path.relative_to(repo_root).as_posix()
            except ValueError:
                # scan_root may be outside repo root only in broken setup
                continue

            if relative in seen_paths:
                continue

            if merged.include_repo_root and len(selected_packages) > 0 and scope_name == "repo-root":
                # In mixed mode repo-root + selected packages, include root context but skip all packages subtree.
                if relative.startswith("packages/"):
                    continue

            if not _is_included_file_type(file_path=file_path, include_markdown=merged.include_markdown, script_extensions=merged.script_extensions):
                continue

            if _is_excluded(relative_path=relative, file_path=file_path, config=merged):
                continue

            package_info = _resolve_package_context(file_path=file_path, packages=packages, fallback_map=package_map)
            try:
                entry = _build_entry(
                    file_path=file_path,
                    repo_root=repo_root,
                    scan_scope=scope_name,
                    package_info=package_info,
                )
            except Exception as exc:  # noqa: BLE001
                errors.append(f"{relative}: {exc}")
                continue

            entries.append(entry)
            seen_paths.add(relative)

    entries_sorted = tuple(sorted(entries, key=lambda item: item.relative_path))
    report = FileInventoryReport(
        root=repo_root.as_posix(),
        output_file=output_path.as_posix(),
        generated_at=_utc_now(),
        scanned_scopes=tuple(scope_rows),
        config_file=config_file.as_posix() if config_file is not None else None,
        include_repo_root=merged.include_repo_root,
        include_all_packages=merged.include_all_packages,
        selected_packages=tuple(item.package_root_relative for item in selected_packages),
        script_extensions=merged.script_extensions,
        include_markdown=merged.include_markdown,
        exclude_globs=merged.exclude_globs,
        exclude_file_names=merged.exclude_file_names,
        exclude_extensions=merged.exclude_extensions,
        exclude_directories=merged.exclude_directories,
        files=entries_sorted,
        errors=tuple(errors),
    )
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(report.to_dict(), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return report


def _load_inventory_config(config_file: Path | None) -> _InventoryConfig:
    if config_file is None or not config_file.exists():
        return _InventoryConfig(
            include_repo_root=True,
            include_all_packages=False,
            package_selectors=(),
            include_markdown=True,
            script_extensions=tuple(sorted(set(DEFAULT_SCRIPT_EXTENSIONS))),
            exclude_globs=(),
            exclude_file_names=(),
            exclude_extensions=(),
            exclude_directories=tuple(sorted(set(DEFAULT_EXCLUDE_DIRECTORIES))),
        )

    payload = tomllib.loads(config_file.read_text(encoding="utf-8"))
    filters = payload.get("filters", {})
    scope = payload.get("scope", {})

    return _InventoryConfig(
        include_repo_root=_to_bool(scope.get("include_repo_root"), default=True),
        include_all_packages=_to_bool(scope.get("include_all_packages"), default=False),
        package_selectors=tuple(_to_string_list(scope.get("include_packages"))),
        include_markdown=_to_bool(filters.get("include_markdown"), default=True),
        script_extensions=tuple(sorted(set(_normalize_extensions(_to_string_list(filters.get("script_extensions")), defaults=DEFAULT_SCRIPT_EXTENSIONS)))),
        exclude_globs=tuple(sorted(set(_to_string_list(filters.get("exclude_globs"))))),
        exclude_file_names=tuple(sorted(set(_to_string_list(filters.get("exclude_file_names"))))),
        exclude_extensions=tuple(sorted(set(_normalize_extensions(_to_string_list(filters.get("exclude_extensions")), defaults=())))),
        exclude_directories=tuple(sorted(set(_normalize_directory_rules(_to_string_list(filters.get("exclude_directories")), defaults=DEFAULT_EXCLUDE_DIRECTORIES)))),
    )


def _merge_config(
    *,
    file_config: _InventoryConfig,
    include_repo_root: bool | None,
    include_all_packages: bool | None,
    package_selectors: tuple[str, ...],
    include_markdown: bool | None,
    script_extensions: tuple[str, ...],
    exclude_globs: tuple[str, ...],
    exclude_file_names: tuple[str, ...],
    exclude_extensions: tuple[str, ...],
    exclude_directories: tuple[str, ...],
) -> _InventoryConfig:
    merged_package_selectors = tuple(item for item in [*file_config.package_selectors, *package_selectors] if item.strip())

    merged_script_extensions = set(file_config.script_extensions)
    merged_script_extensions.update(_normalize_extensions(script_extensions, defaults=()))
    if len(merged_script_extensions) == 0:
        merged_script_extensions.update(DEFAULT_SCRIPT_EXTENSIONS)

    merged_exclude_globs = set(file_config.exclude_globs)
    merged_exclude_globs.update(item.strip() for item in exclude_globs if item.strip())

    merged_exclude_file_names = set(file_config.exclude_file_names)
    merged_exclude_file_names.update(item.strip() for item in exclude_file_names if item.strip())

    merged_exclude_extensions = set(file_config.exclude_extensions)
    merged_exclude_extensions.update(_normalize_extensions(exclude_extensions, defaults=()))

    merged_exclude_directories = set(file_config.exclude_directories)
    merged_exclude_directories.update(_normalize_directory_rules(exclude_directories, defaults=()))

    return _InventoryConfig(
        include_repo_root=file_config.include_repo_root if include_repo_root is None else include_repo_root,
        include_all_packages=file_config.include_all_packages if include_all_packages is None else include_all_packages,
        package_selectors=merged_package_selectors,
        include_markdown=file_config.include_markdown if include_markdown is None else include_markdown,
        script_extensions=tuple(sorted(merged_script_extensions)),
        exclude_globs=tuple(sorted(merged_exclude_globs)),
        exclude_file_names=tuple(sorted(merged_exclude_file_names)),
        exclude_extensions=tuple(sorted(merged_exclude_extensions)),
        exclude_directories=tuple(sorted(merged_exclude_directories)),
    )


def _discover_packages(repo_root: Path) -> list[_PackageInfo]:
    packages_root = (repo_root / "packages").resolve()
    if not packages_root.exists():
        return []

    found: list[_PackageInfo] = []
    for package_json in packages_root.rglob("package.json"):
        if "node_modules" in package_json.parts:
            continue
        package_root = package_json.parent.resolve()
        package_name = package_root.name
        try:
            payload = json.loads(package_json.read_text(encoding="utf-8"))
            field_name = str(payload.get("name", "")).strip()
            if field_name:
                package_name = field_name
        except Exception:  # noqa: BLE001
            pass
        found.append(
            _PackageInfo(
                package_name=package_name,
                package_root=package_root,
                package_root_relative=package_root.relative_to(repo_root).as_posix(),
            )
        )
    return sorted(found, key=lambda item: item.package_root_relative)


def _resolve_package_selection(
    repo_root: Path,
    packages: list[_PackageInfo],
    package_selectors: tuple[str, ...],
) -> list[_PackageInfo]:
    if len(package_selectors) == 0:
        return []

    by_name: dict[str, _PackageInfo] = {item.package_name: item for item in packages}
    by_path: dict[str, _PackageInfo] = {item.package_root_relative: item for item in packages}

    selected: list[_PackageInfo] = []
    seen: set[str] = set()
    for selector in package_selectors:
        token = selector.strip()
        if not token:
            continue

        if token in by_name:
            info = by_name[token]
        elif token in by_path:
            info = by_path[token]
        elif "*" in token or "?" in token:
            matches = [
                item
                for item in packages
                if fnmatch(item.package_name, token) or fnmatch(item.package_root_relative, token)
            ]
            if len(matches) == 0:
                raise ValueError(f"Unknown package selector pattern '{selector}'.")
            for info in matches:
                if info.package_root_relative in seen:
                    continue
                seen.add(info.package_root_relative)
                selected.append(info)
            continue
        else:
            candidate = (repo_root / token).resolve()
            match = next((item for item in packages if item.package_root.resolve() == candidate), None)
            if match is None:
                raise ValueError(f"Unknown package selector '{selector}'. Use package path or package name from package.json.")
            info = match

        if info.package_root_relative in seen:
            continue
        seen.add(info.package_root_relative)
        selected.append(info)
    return selected


def _iter_files(scan_root: Path) -> list[Path]:
    if not scan_root.exists():
        return []
    files: list[Path] = []
    for root_dir, dir_names, file_names in os.walk(scan_root):
        root_path = Path(root_dir)
        dir_names[:] = [item for item in dir_names if item not in DEFAULT_EXCLUDE_DIRECTORIES]
        for file_name in file_names:
            files.append(root_path / file_name)
    return files


def _is_included_file_type(*, file_path: Path, include_markdown: bool, script_extensions: tuple[str, ...]) -> bool:
    extension = file_path.suffix.lower()
    if include_markdown and extension == ".md":
        return True
    return extension in script_extensions


def _is_excluded(*, relative_path: str, file_path: Path, config: _InventoryConfig) -> bool:
    normalized = relative_path.replace("\\", "/")
    file_name = file_path.name
    extension = file_path.suffix.lower()

    if extension in config.exclude_extensions:
        return True

    for pattern in config.exclude_globs:
        if fnmatch(normalized, pattern):
            return True

    for pattern in config.exclude_file_names:
        if fnmatch(file_name, pattern) or fnmatch(normalized, pattern):
            return True

    path_parts = normalized.split("/")
    parent_path = "/".join(path_parts[:-1])
    for rule in config.exclude_directories:
        if rule in path_parts[:-1]:
            return True
        if "/" in rule:
            if fnmatch(parent_path, rule) or parent_path.startswith(rule.rstrip("/") + "/"):
                return True
        else:
            if any(fnmatch(part, rule) for part in path_parts[:-1]):
                return True

    return False


def _resolve_package_context(
    *,
    file_path: Path,
    packages: list[_PackageInfo],
    fallback_map: dict[str, _PackageInfo],
) -> _PackageInfo | None:
    for package in packages:
        try:
            file_path.relative_to(package.package_root)
            return package
        except ValueError:
            continue

    for package_root, package_info in fallback_map.items():
        if file_path.as_posix().startswith(package_root + "/"):
            return package_info

    return None


def _build_entry(
    *,
    file_path: Path,
    repo_root: Path,
    scan_scope: str,
    package_info: _PackageInfo | None,
) -> FileInventoryEntry:
    relative = file_path.relative_to(repo_root).as_posix()
    absolute = file_path.resolve().as_posix()
    path_parts = relative.split("/")
    file_name = file_path.name
    file_stem = file_path.stem
    extension = file_path.suffix.lower()
    suffixes = tuple(item.lower() for item in file_path.suffixes)
    file_kind = "markdown" if extension == ".md" else "script"
    parent = file_path.parent.relative_to(repo_root).as_posix() if file_path.parent != repo_root else "."
    top_level_directory = path_parts[0] if len(path_parts) > 1 else "."
    relative_depth = len(path_parts)

    raw = file_path.read_bytes()
    decoded = raw.decode("utf-8", errors="replace")
    lines = decoded.splitlines()
    non_empty_lines = [line for line in lines if line.strip()]
    word_count = len(decoded.split())
    shebang = lines[0] if len(lines) > 0 and lines[0].startswith("#!") else None
    newline_style, newline_count = _detect_newline_stats(raw)
    contains_non_ascii = any(ord(char) > 127 for char in decoded)

    file_stat = file_path.stat()
    mode_octal = oct(file_stat.st_mode & 0o777)
    is_executable = bool(file_stat.st_mode & stat.S_IXUSR)
    is_hidden = file_name.startswith(".")
    is_readable = os.access(file_path, os.R_OK)
    is_writable = os.access(file_path, os.W_OK)

    language_hint = _guess_language(extension, file_name)
    mime_type = mimetypes.guess_type(file_name)[0] or "application/octet-stream"
    file_id = hashlib.sha256(relative.encode("utf-8")).hexdigest()

    return FileInventoryEntry(
        file_id=file_id,
        relative_path=relative,
        absolute_path=absolute,
        parent_directory=parent,
        top_level_directory=top_level_directory,
        relative_depth=relative_depth,
        file_name=file_name,
        file_stem=file_stem,
        extension=extension,
        suffixes=suffixes,
        file_kind=file_kind,
        language_hint=language_hint,
        mime_type=mime_type,
        scan_scope=scan_scope,
        package_name=package_info.package_name if package_info is not None else None,
        package_path=package_info.package_root_relative if package_info is not None else None,
        size_bytes=len(raw),
        line_count=len(lines),
        non_empty_line_count=len(non_empty_lines),
        character_count=len(decoded),
        word_count=word_count,
        newline_count=newline_count,
        newline_style=newline_style,
        contains_non_ascii=contains_non_ascii,
        created_at_utc=_to_iso_utc(file_stat.st_ctime),
        modified_at_utc=_to_iso_utc(file_stat.st_mtime),
        accessed_at_utc=_to_iso_utc(file_stat.st_atime),
        mode_octal=mode_octal,
        is_executable=is_executable,
        is_symlink=file_path.is_symlink(),
        is_hidden=is_hidden,
        is_readable=is_readable,
        is_writable=is_writable,
        sha256=hashlib.sha256(raw).hexdigest(),
        md5=hashlib.md5(raw).hexdigest(),  # noqa: S324 - checksum for inventory fingerprinting
        shebang=shebang,
    )


def _to_iso_utc(timestamp: float) -> str:
    return datetime.fromtimestamp(timestamp, tz=timezone.utc).isoformat()


def _utc_now() -> str:
    return datetime.now(tz=timezone.utc).isoformat()


def _guess_language(extension: str, file_name: str) -> str:
    if extension == ".md":
        return "markdown"
    mapping = {
        ".py": "python",
        ".ps1": "powershell",
        ".sh": "shell",
        ".bash": "bash",
        ".zsh": "zsh",
        ".cmd": "cmd",
        ".bat": "batch",
        ".js": "javascript",
        ".mjs": "javascript",
        ".cjs": "javascript",
        ".ts": "typescript",
        ".mts": "typescript",
        ".cts": "typescript",
        ".tsx": "typescript",
        ".jsx": "javascript",
    }
    if extension in mapping:
        return mapping[extension]
    if file_name.lower() in {"makefile"}:
        return "make"
    return "unknown"


def _detect_newline_stats(raw: bytes) -> tuple[str, int]:
    crlf_count = raw.count(b"\r\n")
    lf_count = raw.count(b"\n")
    cr_count = raw.count(b"\r")
    lf_only_count = max(0, lf_count - crlf_count)
    cr_only_count = max(0, cr_count - crlf_count)
    newline_count = crlf_count + lf_only_count + cr_only_count

    variants = 0
    if crlf_count > 0:
        variants += 1
    if lf_only_count > 0:
        variants += 1
    if cr_only_count > 0:
        variants += 1

    if newline_count == 0:
        return "none", 0
    if variants > 1:
        return "mixed", newline_count
    if crlf_count > 0:
        return "crlf", newline_count
    if lf_only_count > 0:
        return "lf", newline_count
    return "cr", newline_count


def _to_bool(value: Any, *, default: bool) -> bool:
    if value is None:
        return default
    if isinstance(value, bool):
        return value
    text = str(value).strip().lower()
    if text in {"1", "true", "yes", "on"}:
        return True
    if text in {"0", "false", "no", "off"}:
        return False
    return default


def _to_string_list(value: Any) -> list[str]:
    if value is None:
        return []
    if isinstance(value, str):
        token = value.strip()
        return [token] if token else []
    if isinstance(value, list):
        output: list[str] = []
        for item in value:
            token = str(item).strip()
            if token:
                output.append(token)
        return output
    return []


def _normalize_extensions(values: tuple[str, ...] | list[str], *, defaults: tuple[str, ...]) -> list[str]:
    source = list(values) if len(values) > 0 else list(defaults)
    output: list[str] = []
    for item in source:
        token = item.strip().lower()
        if not token:
            continue
        if not token.startswith("."):
            token = "." + token
        output.append(token)
    return output


def _normalize_directory_rules(values: tuple[str, ...] | list[str], *, defaults: tuple[str, ...]) -> list[str]:
    source = list(values) if len(values) > 0 else list(defaults)
    output: list[str] = []
    for item in source:
        token = item.strip().replace("\\", "/").strip("/")
        if token:
            output.append(token)
    return output
