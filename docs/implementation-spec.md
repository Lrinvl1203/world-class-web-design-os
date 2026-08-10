# Implementation Specification

## Objective

Turn Codex into a repeatable web-design production system that can move from vague business intent to a polished, validated website while preserving distinct art direction and technical quality.

## Phase 1 — Design brain

Deliverables:

- project design brief;
- reference-DNA matrix;
- three art-direction routes when appropriate;
- selected design POV and anti-direction;
- visual-energy curve;
- typography, color/materiality, imagery and copy rules;
- signature interaction hypothesis.

Exit criteria: the design can be described without naming a component library.

## Phase 2 — Design system

Deliverables:

- semantic color tokens;
- type roles/scales/measure/line-height/tracking;
- spacing and layout/grid rules;
- radius, border, shadow/material rules;
- interaction/motion tokens;
- primitive/component state matrix;
- responsive transformations.

Exit criteria: a new section can be created without inventing arbitrary visual values.

## Phase 3 — Implementation routing

For each required behavior, record:

1. interaction intent;
2. simplest native solution;
3. capability gap, if any;
4. selected library/primitive;
5. bundle/performance/accessibility implications.

Do not install overlapping libraries merely because a reference uses them.

## Phase 4 — Build and creative enhancement

Build semantic, usable content first. Add progressive enhancement after the base flow works. Creative 3D/canvas/shader layers must have fallbacks and must not own essential text/navigation.

## Phase 5 — Multi-viewport QA and critique

Default screenshot matrix:

- 320×568 edge case;
- 375×812 mobile;
- 390×844 mobile;
- 768×1024 tablet;
- 1440×900 desktop;
- 1920×1080 wide desktop.

Run functional checks, screenshot checks, overflow checks, keyboard checks, reduced-motion checks, then the independent critic.

## Phase 6 — Correction loop

Rank defects by:

`impact × recurrence × user/business criticality ÷ correction effort`

Correct system causes before local symptoms. Cap broad redesign loops; once direction is valid, move from macro → meso → micro polish.

## Phase 7 — Release and learning

Produce:

- final Design Quality score;
- hard-gate status;
- unresolved tradeoffs;
- generalizable learning proposal.

The learning proposal does not mutate the OS automatically.
