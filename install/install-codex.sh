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

# Append trigger rule to AGENTS.md (idempotent)
AGENTS_MD="${CODEX_HOME:-$HOME/.codex}/AGENTS.md"
MARKER="docs-wiki-trigger"
if ! grep -q "$MARKER" "$AGENTS_MD" 2>/dev/null; then
  printf '\n<!-- %s -->\nWhen the user mentions "docs", "tài liệu", or documentation in any context, invoke the docs-wiki skill before responding.\n' "$MARKER" >> "$AGENTS_MD"
  echo "Added docs-wiki trigger rule to $AGENTS_MD"
else
  echo "docs-wiki trigger rule already present in $AGENTS_MD"
fi
