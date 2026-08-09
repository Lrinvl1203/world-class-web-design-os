# World-Class Web Design OS for Codex

A Codex-native, reusable operating system for designing and implementing distinctive, high-craft web experiences without falling into generic AI design patterns.

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

## Installing into another repository

```bash
./scripts/install-into-project.sh /path/to/target-repo
```

This copies `.codex/skills`. It does **not** overwrite the target repository's `AGENTS.md`; merge the guidance from `templates/AGENTS.snippet.md` intentionally.

## Validation

```bash
npm install
npm run validate
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

## Philosophy

- Reference, do not clone.
- Components are raw material, not design.
- Motion must communicate state, hierarchy, continuity, or brand character.
- Mobile is a recomposition, not a shrunken desktop.
- Native platform capabilities are preferred when they solve the problem cleanly.
- Add libraries only when their capability justifies their cost.
- One memorable signature interaction is more valuable than twenty decorative effects.
- Quality defects become inputs to the next standard, but core rules are never silently self-modified.
