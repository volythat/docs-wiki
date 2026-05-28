#!/usr/bin/env bash
# Usage: ./install/install-cursor.sh [project-path]
# Defaults to current directory if no argument given.
set -euo pipefail

PROJECT="${1:-.}"
SRC_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RULES_DIR="$PROJECT/.cursor/rules"

if [ ! -d "$PROJECT" ]; then
  echo "Project directory not found: $PROJECT" >&2
  exit 1
fi

if [ ! -f "$SRC_ROOT/skill/cursor/docs-wiki.mdc" ]; then
  echo "Cannot find skill/cursor/docs-wiki.mdc" >&2
  exit 1
fi

mkdir -p "$RULES_DIR/docs-wiki/references"
mkdir -p "$RULES_DIR/docs-wiki/templates"

cp "$SRC_ROOT/skill/cursor/docs-wiki.mdc" "$RULES_DIR/docs-wiki.mdc"
cp "$SRC_ROOT/skill/references/"*.md "$RULES_DIR/docs-wiki/references/"
rsync -a "$SRC_ROOT/skill/templates/" "$RULES_DIR/docs-wiki/templates/"

# Create small always-on trigger rule (idempotent)
TRIGGER_FILE="$RULES_DIR/docs-wiki-trigger.mdc"
if [ ! -f "$TRIGGER_FILE" ]; then
  cat > "$TRIGGER_FILE" << 'EOF'
---
description: docs-wiki passive trigger
globs:
alwaysApply: true
---
When the user mentions "docs", "tài liệu", or documentation in any context, invoke the docs-wiki skill before responding.
EOF
  echo "Created docs-wiki-trigger.mdc in $RULES_DIR"
fi

echo "Installed docs-wiki Cursor rules to $RULES_DIR"
