# GitHub Publish

This repository can be published after GitHub CLI is installed and authenticated.

```bash
./scripts/publish-github.sh --private
# or
./scripts/publish-github.sh --public
```

The script refuses to proceed if `gh` is missing, authentication is unavailable, or a remote already exists without an explicit choice.
