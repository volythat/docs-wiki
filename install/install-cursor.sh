#!/usr/bin/env bash
# Usage: ./install/install-cursor.sh [project-path]
# Defaults to current directory if no argument given.
#
# The Cursor rule (docs-wiki.mdc) is GENERATED from skill/SKILL.md so the command
# table lives in exactly one place (the skill's own single-source-of-truth rule
# applied to itself). Only the Cursor-specific frontmatter + path note are added here.
set -euo pipefail

PROJECT="${1:-.}"
SRC_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILL="$SRC_ROOT/skill/SKILL.md"
RULES_DIR="$PROJECT/.cursor/rules"

if [ ! -d "$PROJECT" ]; then
  echo "Project directory not found: $PROJECT" >&2
  exit 1
fi

if [ ! -f "$SKILL" ]; then
  echo "Cannot find $SKILL" >&2
  exit 1
fi

mkdir -p "$RULES_DIR/docs-wiki/references"
mkdir -p "$RULES_DIR/docs-wiki/templates"

cp "$SRC_ROOT/skill/references/"*.md "$RULES_DIR/docs-wiki/references/"
rsync -a "$SRC_ROOT/skill/templates/" "$RULES_DIR/docs-wiki/templates/"

PATH_NOTE='> **Cursor path note:** All relative paths in this rule (`references/xxx.md`, `templates/`) resolve to `.cursor/rules/docs-wiki/` in your project root. Read reference files with the Read tool when needed.'

# Generate docs-wiki.mdc = (SKILL frontmatter, minus `name:`, plus Cursor keys)
#                        + path note + skill body (from the `# docs-wiki` heading).
{
  awk '
    NR==1 && $0=="---" { print; infm=1; next }
    infm && $0=="---"  { print "globs:"; print "alwaysApply: false"; print "---"; infm=0; next }
    infm && /^name:/   { next }
    infm               { print; next }
  ' "$SKILL"
  printf '\n%s\n\n' "$PATH_NOTE"
  awk '/^# docs-wiki/{f=1} f' "$SKILL"
} > "$RULES_DIR/docs-wiki.mdc"
echo "Generated docs-wiki.mdc from SKILL.md"

# Create small always-on trigger rule (idempotent).
TRIGGER_FILE="$RULES_DIR/docs-wiki-trigger.mdc"
if [ ! -f "$TRIGGER_FILE" ]; then
  cat > "$TRIGGER_FILE" << 'EOF'
---
description: docs-wiki passive trigger
globs:
alwaysApply: true
---
When the user mentions "docs", "tài liệu", "documentation", or any docs topic (API, CMS, PRD, data model, flows, specs, styles, guides) in any context, invoke the docs-wiki skill before responding.
EOF
  echo "Created docs-wiki-trigger.mdc in $RULES_DIR"
fi

echo "Installed docs-wiki Cursor rules to $RULES_DIR"
