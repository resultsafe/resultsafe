import sys


def log_internal_error(exc: Exception, tb: str | None = None) -> None:
    sys.stderr.write(f"[internal_error] {exc}\n")
    if tb:
        sys.stderr.write(tb + "\n")
