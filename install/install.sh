#!/usr/bin/env bash
# Shared installer for the docs-wiki skill.
# Usage: install.sh <claude|codex|gemini>
# Prefer the thin wrappers (install-claude.sh / install-codex.sh / install-gemini.sh).
set -euo pipefail

ACTION="install"
TARGET="${1:-}"
if [ "${1:-}" = "uninstall" ]; then
  ACTION="uninstall"
  TARGET="${2:-}"
fi
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/skill"

if [ ! -f "$SRC/SKILL.md" ]; then
  echo "Cannot find $SRC/SKILL.md" >&2
  exit 1
fi

# One trigger wording for every platform — kept in sync with SKILL.md's description.
TRIGGER_TEXT='When the user mentions "docs", "tài liệu", "documentation", or any docs topic (API, CMS, PRD, data model, flows, specs, styles, guides) in any context, invoke the docs-wiki skill before responding.'
MARKER="docs-wiki-trigger"

case "$TARGET" in
  claude)
    DEST="$HOME/.claude/skills/docs-wiki"
    TRIGGER_FILE="$HOME/.claude/CLAUDE.md"
    ;;
  codex)
    DEST="${CODEX_HOME:-$HOME/.codex}/skills/docs-wiki"
    TRIGGER_FILE="${CODEX_HOME:-$HOME/.codex}/AGENTS.md"
    ;;
  gemini)
    DEST="$HOME/.gemini/config/skills/docs-wiki"
    TRIGGER_FILE="$HOME/.gemini/GEMINI.md"
    ;;
  *)
    echo "Usage: $0 <claude|codex|gemini>" >&2
    echo "       $0 uninstall <claude|codex|gemini>" >&2
    exit 1
    ;;
esac

if [ "$ACTION" = "uninstall" ]; then
  if [ -d "$DEST" ]; then
    rm -rf "$DEST"
    echo "Removed docs-wiki skill from $DEST"
  else
    echo "docs-wiki skill not found at $DEST (already uninstalled?)"
  fi
  if grep -q "$MARKER" "$TRIGGER_FILE" 2>/dev/null; then
    awk '/<!-- docs-wiki-trigger -->/{skip=1; next} skip{skip=0; next} 1' \
      "$TRIGGER_FILE" > "${TRIGGER_FILE}.tmp" && mv "${TRIGGER_FILE}.tmp" "$TRIGGER_FILE"
    echo "Removed docs-wiki trigger rule from $TRIGGER_FILE"
  else
    echo "No docs-wiki trigger rule found in ${TRIGGER_FILE}"
  fi
  exit 0
fi

mkdir -p "$DEST"
# cursor/ is a build input for install-cursor.sh only; never sync it to skill dirs.
rsync -a --delete --exclude 'cursor/' "$SRC/" "$DEST/"
echo "Installed docs-wiki skill to $DEST"

# Append trigger rule to the platform's global instruction file (idempotent).
if ! grep -q "$MARKER" "$TRIGGER_FILE" 2>/dev/null; then
  mkdir -p "$(dirname "$TRIGGER_FILE")"
  printf '\n<!-- %s -->\n%s\n' "$MARKER" "$TRIGGER_TEXT" >> "$TRIGGER_FILE"
  echo "Added docs-wiki trigger rule to $TRIGGER_FILE"
else
  echo "docs-wiki trigger rule already present in $TRIGGER_FILE"
fi
