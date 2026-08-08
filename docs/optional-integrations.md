# Optional Integrations

## UI UX Pro Max

The OS does not depend on UI UX Pro Max, but it can coexist as an additional searchable design-intelligence skill for Codex.

Current project installation documented by the upstream repository:

```bash
npm install -g uipro-cli
uipro init --ai codex
```

Treat its palettes, font pairings, interface patterns and UX rules as searchable evidence. The selected project art direction and this OS's quality gates remain authoritative for the project.

After installation, inspect the generated `.codex/skills/` content rather than assuming a successful CLI message means every referenced data/script file is present. Use the upstream repository's current instructions when its installer changes.

## External component catalogs

Do not vendor whole registries into this OS. Search or install only components required by a project, then adapt them through `$component-source-router`.
