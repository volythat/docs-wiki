#!/usr/bin/env bash
# Sync skill/ → ~/.gemini/config/skills/docs-wiki/ and register the trigger rule.
# Thin wrapper over install.sh (shared logic for all platforms).
exec "$(dirname "${BASH_SOURCE[0]}")/install.sh" gemini "$@"
