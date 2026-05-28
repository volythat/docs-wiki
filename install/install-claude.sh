#!/usr/bin/env bash
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/skill"
DEST="$HOME/.claude/skills/docs-wiki"

if [ ! -f "$SRC/SKILL.md" ]; then
  echo "Không tìm thấy $SRC/SKILL.md" >&2
  exit 1
fi

mkdir -p "$DEST"
rsync -a --delete --exclude 'cursor/' "$SRC/" "$DEST/"
echo "Đã cài docs-wiki skill vào $DEST"

# Append trigger rule to ~/.claude/CLAUDE.md (idempotent)
GLOBAL_CLAUDE="$HOME/.claude/CLAUDE.md"
MARKER="docs-wiki-trigger"
if ! grep -q "$MARKER" "$GLOBAL_CLAUDE" 2>/dev/null; then
  printf '\n<!-- %s -->\nWhen the user mentions "docs", "tài liệu", or documentation in any context, invoke the docs-wiki skill before responding.\n' "$MARKER" >> "$GLOBAL_CLAUDE"
  echo "Đã thêm docs-wiki trigger rule vào $GLOBAL_CLAUDE"
else
  echo "docs-wiki trigger rule đã có trong $GLOBAL_CLAUDE"
fi
