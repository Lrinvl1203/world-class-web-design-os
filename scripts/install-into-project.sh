#!/usr/bin/env bash
set -euo pipefail
TARGET="${1:-}"
if [[ -z "$TARGET" ]]; then
  echo "Usage: $0 /path/to/target-repo" >&2
  exit 2
fi
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$TARGET/.codex"
cp -R "$ROOT/.codex/skills" "$TARGET/.codex/"
echo "Installed Codex skills into: $TARGET/.codex/skills"
echo "Merge $ROOT/templates/AGENTS.snippet.md into the target AGENTS.md intentionally; it was not overwritten."
