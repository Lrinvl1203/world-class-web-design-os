# World-Class Web Design OS

A reusable design-production operating system for distinctive, accessible, fast web experiences. Codex is the canonical runtime; compatible skill folders can also be installed for other agents.

This repository is not a component kit and not a single mega-prompt. It is a modular skill system:

- `AGENTS.md` — repository-level operating rules for Codex.
- `.codex/skills/*/SKILL.md` — specialized skills with progressive disclosure.
- `docs/` — architecture, implementation specification, master handoff prompt, and verified source registry.
- `config/` — WDX quality rubric, viewport matrix, and motion/tool routing policy.
- `scripts/` — deterministic validation, screenshot capture, installation, and GitHub publishing helpers.
- `tests/` — Playwright visual QA starter.

## Core idea

Design quality is produced by a controlled loop, not a one-shot prompt:

`Discover → Analyze references → Art direct → Systemize → Build → Recompose → Render → Critique → Fix → Validate → Learn`

The system deliberately separates **creation** from **critique** and separates **design intent** from **tool choice**.

## Quick start in Codex

1. Open this repository in Codex.
2. Start with:

```text
Use $web-design-orchestrator to design and build this project.
Business goal: ...
Audience: ...
Primary action: ...
References: ...
Assets: ...
Constraints: ...
```

3. The orchestrator routes work to the smallest relevant skill set.
4. Before calling the work finished, run quality gates and the independent design critic.

One-sentence invocation:

```text
Use $web-design-orchestrator with the WDX hard gates to design and build this website: [brief].
```

Create a reusable project brief and inspect the initial skill route:

```bash
npm run wdx -- setup /path/to/project
npm run wdx -- route "Build a responsive editorial portfolio with purposeful motion"
```

## Installing into another repository

```bash
./scripts/install-into-project.sh /path/to/target-repo
```

This copies `.codex/skills`. It does **not** overwrite the target repository's `AGENTS.md`; merge the guidance from `templates/AGENTS.snippet.md` intentionally.

Cross-platform Node installer:

```bash
# Install into another project
npm run wdx -- install --agent codex --root /path/to/project

# Install into the current user's global agent directory
npm run wdx -- install --agent codex

# Supported targets: codex, agents, claude, cursor, copilot, opencode, all
npm run wdx -- install --agent all --overwrite
```

The package is currently private and unpublished. Running it through `npx` from npm is therefore not claimed; the included `wdx` bin is ready for local or GitHub-package use if the repository is later published intentionally.

## Searchable Design DNA

Search the evidence-graded 100-reference atlas rather than loading it all into the model context:

```bash
npm run wdx -- search "editorial motion"
npm run wdx -- search "WebGL performance" --limit 5
```

The router keeps at most three specialist skills active per phase. Full builds still begin with `$web-design-orchestrator`; later phases re-route instead of accumulating every skill in context.

## Daily controlled evolution

The scheduled pipeline runs at 03:00 Asia/Seoul and collects only reviewable evidence from configured RSS, official APIs, and curated links. It ranks candidates using age-adjusted velocity, engagement depth, and source confidence. Popularity is not treated as quality.

```bash
npm run evolve:daily
npm run wdx -- evolve --offline
```

Optional secrets enable official YouTube and authorized Threads post metrics. The pipeline never scrapes logged-in community pages, stores full copyrighted posts, executes remote instructions, edits core skills directly, changes WDX scoring, pushes to `main`, or self-merges. It may only create an inbox, report, and—after recurrence across three independent sources—a review-required proposal draft. See `evolution/README.md`.

## Validation

```bash
npm install
npm run validate
npm run eval:skills
npm run qa:install
TARGET_URL=http://localhost:3000 npm run qa:capture
TARGET_URL=http://localhost:3000 npm run qa:visual
```

## Design quality target

A release candidate should satisfy both:

- **WDX design score ≥ 92/100**, with category floors.
- **Hard gates pass**: functionality, WCAG 2.2 AA critical checks, responsive QA, reduced-motion behavior, and Core Web Vitals targets.

See `config/wdx-rubric.json`.

## Design DNA evidence

The reference-forensics skill includes a 100-reference atlas spanning creator-authored case studies, official interaction/creative-web documentation, and clearly labeled award benchmarks. Use it as a problem router, never as a template gallery. See `.codex/skills/reference-forensics/references/award-pattern-atlas.md` and `docs/reference-study-100.md`.

## Benchmarked capabilities now included

- searchable Design DNA and deterministic skill routing;
- a one-command project context scaffold and multi-agent skill installer;
- a provenance/rights/performance asset protocol;
- product edge-case state coverage;
- routing and evolution eval fixtures;
- Playwright + axe browser hard gates in CI;
- a daily, poison-resistant evidence collector with proposal-only governance;
- the existing builder/critic separation, evidence levels, WDX rubric, six-viewport visual QA, and controlled learning loop.

## Validation experiments

- `experiments/nocturne-concierge/` — bilingual hospitality concierge; WDX 92.8 internal pass, field validation pending.
- `experiments/vanta-forge/` — industrial/manufacturing B2B supplier evaluation; WDX 91.8 hold, buyer and field validation pending.

The scores are internal workflow evidence, not external awards or production guarantees.

## Philosophy

- Reference, do not clone.
- Components are raw material, not design.
- Motion must communicate state, hierarchy, continuity, or brand character.
- Mobile is a recomposition, not a shrunken desktop.
- Native platform capabilities are preferred when they solve the problem cleanly.
- Add libraries only when their capability justifies their cost.
- One memorable signature interaction is more valuable than twenty decorative effects.
- Quality defects become inputs to the next standard, but core rules are never silently self-modified.
