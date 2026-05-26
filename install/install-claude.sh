#!/usr/bin/env bash
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/skill"
DEST="$HOME/.claude/skills/docs-wiki"

if [ ! -f "$SRC/SKILL.md" ]; then
  echo "Không tìm thấy $SRC/SKILL.md" >&2
  exit 1
fi

mkdir -p "$DEST"
rsync -a --delete "$SRC/" "$DEST/"
echo "Đã cài docs-wiki skill vào $DEST"
