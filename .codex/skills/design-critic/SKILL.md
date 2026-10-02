---
name: design-critic
description: Use as an independent design-review pass after rendering a website; evaluates macro, meso, micro craft, applies the Design Quality rubric, identifies root causes, and prioritizes changes without defending the implementation intent.
metadata:
  short-description: Independently critique and score rendered web design
---

# Design Critic

## Independence rule

Review the rendered result as if you did not build it. Begin from screenshots and user/business brief; inspect implementation only after identifying visual/UX symptoms.

## Three review scales

### Macro
- brand distinction and point of view;
- narrative/read order;
- page composition and energy curve;
- visual memorability;
- overall trust/fit for audience.

### Meso
- section composition;
- density and spatial rhythm;
- type and image relationships;
- CTA hierarchy;
- responsive transformation;
- interaction consistency.

### Micro
- baselines and alignments;
- type metrics and wrapping;
- border/radius/shadow consistency;
- icon sizing;
- focus/hover/press states;
- animation easing/distance/timing;
- image crop and optical alignment.

## Design Quality scoring

Use the OS root's `config/design-quality-rubric.json`; read this skill's `references/design-quality.md` for interpretation. Resolve the OS root from this skill directory: `../../..` in a source checkout, or `../../../.web-design-os/runtime` after the bundled installer. Choose the root containing this package's CLI and rubric, never a rubric inferred from the website project's working directory. Do not inflate scores to match effort spent.

## Correction priority

Prefer one systemic fix that resolves five symptoms over five local patches. State the top three root causes before listing micro-polish.
