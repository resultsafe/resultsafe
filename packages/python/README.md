---
uuid: f8356f11-c7dc-4a5f-8db7-fc54ca58c614
lang: en
---

# ResultSafe Python Runtime

The Python runtime layer for the polyglot ResultSafe experience. It mirrors the Rust and TypeScript contracts while exposing `resultsafe.core.fp` as the stable public surface.

## Layout

```text
packages/python/
├── src/
│   └── resultsafe/
│       └── core/
│           └── fp/
│               ├── result.py
│               ├── option.py
│               ├── either.py
│               ├── task.py
│               ├── task_result.py
│               └── effect.py
└── tests/
    ├── unit/
    ├── property/
    └── conformance/
```

## Getting started

Install the locally built wheel and run the smoke checks:

```bash
pip install build
python -m build
pip install dist/resultsafe_core_fp-0.1.0-py3-none-any.whl
python -m pytest
```

## Validation

- `python -m pytest` exercises the unit/property/conformance suites.
- `python -m mypy src` ensures typing parity with the TypeScript/ Rust contracts.
- `python -m tools.automation docs sync-python-parity --root .` validates the parity registry.

## Publishing

1. Ensure `pyproject.toml` contains the correct version and metadata.
2. Run `python -m build` to generate `dist/`.
3. Publish via `twine upload dist/*` or an automation workflow.

- Run `python -m build` to generate `dist/`.
- Publish via `twine upload dist/*` or an automation workflow.

## Dev helper

Use the reusable scripts to install the editable package:

- `scripts/setup-python-runtime.sh` for POSIX/macOS
- `scripts/setup-python-runtime.ps1` for PowerShell/Windows

They run `python -m pip install -e packages/python` so the canonical `resultsafe.core.fp` package is on your `PYTHONPATH`.

## Policy notes

- Public APIs are surfaced under `resultsafe.core.fp`. Deep imports outside that namespace are not part of the stable contract.
- Unsafe behavior is confined to `unwrap`/`expect` helpers and is documented as such.
