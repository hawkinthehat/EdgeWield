#!/usr/bin/env bash
set -euo pipefail

WORKSPACE_DIR="/workspace"
cd "$WORKSPACE_DIR"

# Ensure Node/npm are available.
if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  if ! command -v apt-get >/dev/null 2>&1; then
    echo "Node.js and npm are required but apt-get is unavailable." >&2
    exit 1
  fi

  export DEBIAN_FRONTEND=noninteractive
  SUDO_BIN=""
  if command -v sudo >/dev/null 2>&1; then
    SUDO_BIN="sudo"
  fi
  $SUDO_BIN apt-get update -y
  $SUDO_BIN apt-get install -y nodejs npm
fi

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "Node.js and npm must be available for this workspace." >&2
  exit 1
fi

# Cached install:
# run npm ci only when node_modules is missing or package-lock changed.
if [ -f package-lock.json ]; then
  mkdir -p node_modules
  LOCK_HASH_FILE="node_modules/.cursor_package_lock_sha256"
  NEW_HASH="$(sha256sum package-lock.json | awk '{print $1}')"
  OLD_HASH=""
  if [ -f "$LOCK_HASH_FILE" ]; then
    OLD_HASH="$(<"$LOCK_HASH_FILE")"
  fi

  if [ ! -d node_modules/.bin ] || [ "$NEW_HASH" != "$OLD_HASH" ]; then
    npm ci --no-audit --no-fund
    printf '%s' "$NEW_HASH" > "$LOCK_HASH_FILE"
  fi
else
  if [ ! -d node_modules/.bin ]; then
    npm install --no-audit --no-fund
  fi
fi
