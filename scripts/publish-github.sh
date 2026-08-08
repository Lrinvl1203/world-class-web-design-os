#!/usr/bin/env bash
set -euo pipefail
VISIBILITY="${1:---private}"
if [[ "$VISIBILITY" != "--private" && "$VISIBILITY" != "--public" ]]; then
  echo "Usage: $0 [--private|--public]" >&2
  exit 2
fi
if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is required." >&2
  exit 3
fi
gh auth status >/dev/null
if git remote get-url origin >/dev/null 2>&1; then
  echo "An origin remote already exists: $(git remote get-url origin)" >&2
  echo "Publish intentionally with your existing remote rather than creating another repository." >&2
  exit 4
fi
NAME="world-class-web-design-os"
gh repo create "$NAME" "$VISIBILITY" --source=. --remote=origin --push
