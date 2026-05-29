#!/usr/bin/env bash
# Sync skill/ → ~/.claude/skills/docs-wiki/ and register the trigger rule.
# Thin wrapper over install.sh (shared logic for all platforms).
exec "$(dirname "${BASH_SOURCE[0]}")/install.sh" claude "$@"
