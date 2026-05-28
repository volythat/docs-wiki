#!/usr/bin/env bash
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/skill"
DEST="${CODEX_HOME:-$HOME/.codex}/skills/docs-wiki"

if [ ! -f "$SRC/SKILL.md" ]; then
  echo "Cannot find $SRC/SKILL.md" >&2
  exit 1
fi

mkdir -p "$DEST"
rsync -a --delete --exclude 'cursor/' "$SRC/" "$DEST/"
echo "Installed docs-wiki skill to $DEST"
