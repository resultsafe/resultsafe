#!/usr/bin/env bash
set -euo pipefail

echo "Installing the editable ResultSafe Python runtime..."
python -m pip install --upgrade pip
python -m pip install -e packages/python
