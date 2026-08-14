# Design system — Orbital Commons

## Art direction

- POV: a civic field notebook looking through an atmospheric instrument.
- Emotional register: consequential, legible, cautiously optimistic.
- Composition grammar: full-bleed dark field, compact control dock, asymmetric editorial findings, public-method footnotes.
- Signature visual: oblique extruded neighborhood cells whose height and temperature change together.
- Signature interaction: scenario selection morphs every cell, updates the result sentence, and keeps an adjacent comparison table synchronized.

## Foundations

- Night `#0c1718`, fog `#dce8de`, mint `#9ff3c3`, heat `#ff7657`, sun `#f5d260`, sky `#78a7ff`.
- Typography: Trebuchet/Arial humanist sans for display and body; monospace for coordinates and method labels.
- Grid: viewport field with a 12-column editorial overlay; 5 px micro-rhythm and 20/40/80 px macro cadence.
- Surfaces use translucent solid fills only where legibility requires them; no generic glass cards.
- Focus is a 3 px sun outline with 3 px offset.

## Components and states

- Scenario control: native buttons with default/hover/focus/selected; each exposes temperature and shade deltas in its label region.
- Field canvas: decorative rendering only; resizes with `ResizeObserver`, caps DPR at 1.5, stops when hidden.
- Result sentence: polite live region; same state copied to the semantic data table.
- Method disclosure: native `details` element, usable without JavaScript.

## Motion and responsive rules

- Custom `requestAnimationFrame` interpolation only for the explanatory field, with a 550 ms capped transition.
- No perpetual animation. A very slow camera drift runs only on hover-capable screens while visible and is stopped by reduced motion.
- At ≤720 px, the camera is fixed, cell count reduces, scenario controls become a vertical list, and findings precede the methodology table.
