# Web Design OS — Free Starter

One free package: the existing orchestrator and 16 routed specialist skills, their references, CLI, rubric, QA tools, examples, and MIT notices. The product title does not promise a particular design standard or business result. The supplied fictional sites are existing examples; packaging does not establish a new agent-generated outcome.

## Install from the ZIP

Extract the complete `web-design-os-free-starter` directory. Keep its `SKILL.md`, `scripts`, `references`, and `assets` together. Node.js 20 or later is required for the installer and CLI. No Git checkout, account, API key, npm install, or paid service is needed for the bundled CLI's install, doctor, route, search, setup, audit, or offline evolution commands.

From the extracted directory:

```text
node scripts/web-design-os.mjs install --agent codex
node scripts/web-design-os.mjs doctor --agent codex
```

The default root is your home directory. For a project-local or isolated install, use the same absolute `--root` on both commands:

```text
node scripts/web-design-os.mjs install --agent codex --root "/absolute/path/to/target"
node scripts/web-design-os.mjs doctor --agent codex --root "/absolute/path/to/target" --json
```

The installer writes only this package's named skills into the agent's skills directory and copies the shared runtime to `<root>/.web-design-os/runtime`. Unrelated skills are preserved. Existing managed skills require `--overwrite` to update. Use a newly extracted bundle for an update; do not install the runtime over itself. No project `AGENTS.md`, agent security setting, connector permission, or schedule is changed.

Restart the agent session to refresh skill discovery. Start work with:

```text
Use $web-design-orchestrator to inspect my site and brief, choose relevant specialists, implement the agreed direction, and report rendered checks and remaining limitations.
```

This is an example request, not an agent-performance test. The agent still needs appropriate project tools and authorization for the requested work.

## Quick start after installation

Run the installed CLI using its absolute path, including when the ZIP has been moved or removed:

```text
node "/absolute/path/to/target/.web-design-os/runtime/cli/web-design-os.mjs" route "redesign a website with keyboard navigation"
node "/absolute/path/to/target/.web-design-os/runtime/cli/web-design-os.mjs" search "editorial motion" --limit 3
node "/absolute/path/to/target/.web-design-os/runtime/cli/web-design-os.mjs" setup "/absolute/path/to/my-site"
```

`setup` creates `.web-design-os/project-context.md` in that project and refuses to overwrite an existing file. Populate it with the real audience, goal, content, assets, and constraints. Shared resource paths resolve from the installed skill's directory, as described in the four skills that use root resources; never infer them from the site's current working directory.

## Reproduce the existing Sequence Desk example locally

In `<root>/.web-design-os/runtime`, serve the fictional interface:

```text
node scripts/serve-static.mjs experiments/sequence-desk 4173
```

Open `http://127.0.0.1:4173`. Choose the Onboarding tab, resolve the decision, and inspect the local feedback. Open Find action, press Escape, and confirm focus returns to its button. No data is sent by this example.

For automated browser checks, install the declared development dependencies from the official npm registry and Chromium through Playwright. No dependencies or browser binaries are embedded in the ZIP:

```text
npm install --ignore-scripts --registry=https://registry.npmjs.org
npx --no-install playwright install chromium
```

In a second terminal set `TARGET_URL=http://127.0.0.1:4173` and `CI=1`, then run:

```text
npx --no-install playwright test tests/sequence-desk.spec.ts --project=edge-mobile --project=desktop
node scripts/capture-screenshots.mjs http://127.0.0.1:4173
```

PowerShell: `$env:TARGET_URL='http://127.0.0.1:4173'; $env:CI='1'`. POSIX shell: prefix the Playwright command with `TARGET_URL=http://127.0.0.1:4173 CI=1`. CI mode skips the example's inherited pixel comparison. The capture tool produces six viewport PNGs and local overflow/console observations in the current directory's `artifacts/screenshots`. These are local checks, not field Core Web Vitals.

`tests/visual.spec.ts` is a starter tied to the Nocturne example's controls. Adapt selectors, assertions, and reviewed baselines for a different site. The ZIP preserves the five upstream examples and existing baselines as source material; the documented Sequence Desk reproduction has separate local verification. Browser binaries and rendering environments can change visual baselines.

## Compatibility and limits

For selective phase context and the existing capture → assertion → correction → recheck path, see [modular-workflow.md](modular-workflow.md). That guide distinguishes local tool verification from a full autonomous agent trial.

| Target | Installer layout | Verification scope |
| --- | --- | --- |
| Codex | `.codex/skills` | Local layout and file integrity |
| Shared skills convention | `.agents/skills` | Local layout and file integrity |
| Claude Code | `.claude/skills` | Local layout and file integrity |
| Cursor | `.cursor/skills` | Local layout and file integrity |
| GitHub Copilot | `.github/skills` | Local layout and file integrity |
| OpenCode | `.opencode/skills` | Local layout and file integrity |

`--agent all` writes all six declared layouts and one shared runtime. Host-specific discovery, tool permissions, and actual agent behavior have not been tested for every host. Agensi import has not been attempted; the archive follows the requested SKILL.md/name/description plus scripts/references/assets format. A marketplace importer that strips nested files will not retain the complete package. Import the full archive, or extract it and use the bundled installer. A universal CLI skills-only copy omits companion runtime files and is not a complete installation.

Doctor verifies expected files and their recorded SHA-256 values. It does not install Node, Python, npm dependencies, or Chromium, execute browser checks, authenticate external services, evaluate design effectiveness, or verify an archive's publisher signature. Reference access and CLI smoke tests are separate from actual agent design work. `audit` evaluates recorded quality-report declarations; a valid report can still return HOLD/INCOMPLETE and field evidence remains separate.

`npm run validate` requires Python 3 for the inherited validators; `test:unit` and `eval:skills` use Node. Optional live evolution and owner/growth tools require their separately authorized services; this starter reproduction uses offline/local commands only. No schedules, integrations, API keys, or publishing permissions are provisioned.

No new agent-produced website, blinded review, independent-user study, paid API test, revenue outcome, external deployment, or field performance measurement is included. The MIT license, copyright, source links, and upstream notices remain intact. Synthetic experiment imagery is fictional concept material; review the notices and use owned or properly licensed assets for real projects.

## Source and version status

Source: https://github.com/Lrinvl1203/world-class-web-design-os. The portable installation and routing changes build on `c2ef97775dfbca42b83b964227fc00cd8779f0c8`; the public main audit baseline is `4c5f30c5c3989a34fea17f5a54fb2c29f1583b44`. A review branch is not a tagged upstream release. Record the exact source commit when building a bundle. Default-branch GitHub/npx commands can resolve an older version; use the reviewed checkout's `node cli/web-design-os.mjs` or a complete generated starter ZIP for its changes.
