# Design system — Sequence Desk

## Art direction

- POV: an operator’s desk, not a dashboard showroom.
- Emotional register: decisive, low-anxiety, lucid.
- Composition grammar: persistent release rail, central decision canvas, narrow proof log; strong horizontal sequencing.
- Signature visual: dependency path rendered as a numbered line with one movable “decision lens.”
- Signature interaction: scenario tabs replace the full chain; resolving the active blocker moves the lens and writes an audit event.

## Foundations

- Chalk `#f4f1e8`, ink `#111310`, green `#1f5c3d`, lime `#c8f45d`, blue `#3156d8`, warning `#b44d21`.
- Display/body: Arial/Helvetica with calibrated weight and width; evidence/meta: system monospace.
- 8 px rhythm, 1 px structural rules, 0–8 px functional radii, no decorative glass or gradient text.
- Focus ring is lime on dark surfaces and blue on light surfaces.

## Components and states

- Scenario tab: selected state uses border, label, and `aria-selected`, not color alone.
- Decision node: pending/active/resolved states have icon, verb, and status text. Disabled actions explain why.
- Resolve control: press triggers immediate textual confirmation, next-node focus, and undo affordance.
- Proof log: initial, empty, and appended-event states; timestamps are fictional and explicitly labeled.
- Command palette: optional shortcut with dialog semantics, escape close, return focus, and click alternative.

## Motion and responsive rules

- Native CSS/WAAPI: 140 ms feedback, 280 ms layout emphasis, restrained spring-like easing without physics dependency.
- Dominant motion is lens continuity along the dependency path; log insertion is the sole support animation.
- Reduced motion makes state changes instant.
- At ≤800 px, the three-column desk becomes a single decision stack; the release rail becomes a compact status header and the proof log follows the primary action.
