#!/usr/bin/env bash
set -euo pipefail
TARGET="${1:-}"
if [[ -z "$TARGET" ]]; then
  echo "Usage: $0 /path/to/target-repo" >&2
  exit 2
fi
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
node "$ROOT/cli/web-design-os.mjs" install --agent codex --root "$TARGET" "${@:2}"
echo "Installed Codex skills and shared runtime into: $TARGET"
echo "Merge $ROOT/templates/AGENTS.snippet.md into the target AGENTS.md intentionally; it was not overwritten."
