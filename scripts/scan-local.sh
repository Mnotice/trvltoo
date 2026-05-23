#!/usr/bin/env bash
set -euo pipefail

# Local secret scan helper using detect-secrets (audit + baseline)
if ! command -v python3 &> /dev/null; then
  echo "python3 not found — please install Python 3 to run local secret scan." >&2
  exit 2
fi

VENV_DIR=.venv-secrets
if [ ! -d "$VENV_DIR" ]; then
  python3 -m venv "$VENV_DIR"
fi
. "$VENV_DIR/bin/activate"
pip install --upgrade pip
pip install detect-secrets

echo "Running detect-secrets scan..."
detect-secrets scan > .secrets.baseline
echo "Baseline written to .secrets.baseline"
echo "You can run: detect-secrets audit .secrets.baseline" 
