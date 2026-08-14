# Project brief — Orbital Commons

- Status: fictional public design study using illustrative, not scientific, data.
- Goal: explain how three urban heat interventions redistribute shade and surface temperature across a neighborhood.
- Audience: residents, planners, journalists, and non-technical civic teams.
- Primary job: compare intervention scenarios and understand who benefits.
- Primary action: select a scenario and inspect its neighborhood-level consequence.
- Content priority: human question → spatial model → scenario delta → neighborhood equity note → methodology caveat.
- Brand: civic, atmospheric, precise, publicly accountable.
- Anti-direction: sci-fi command center, decorative spinning globe, neon cyber grid, inaccessible canvas-only story, fake real-time data.
- Signature idea: a purposeful 3D “heat canopy” lifts cooler blocks toward the reader while the same values remain in a semantic comparison table.
- Constraints: custom canvas with no external 3D dependency, bounded pixel ratio, static fallback, reduced-motion stop, illustrative-data disclaimer.
- CTQs: Is the canvas doing explanatory work? Can the same comparison be completed without canvas? Does the scene remain responsive and quiet on a low-power mobile viewport?

## Reference principles

- The visualization is an instrument embedded in an editorial argument, not a decorative hero.
- A single interaction verb—compare—governs camera, controls, labels, and supporting copy.
- Mobile receives a static oblique composition and smaller motion budget rather than a scaled desktop scene.

## Asset ledger

| Role | Source and rights | Delivery | Accessibility / failure mode |
| --- | --- | --- | --- |
| Neighborhood model | Original procedural geometry and fictional illustrative values | Local Canvas 2D pseudo-3D renderer | Equivalent HTML table and narrative summary always present |
| Grid/atmosphere | Original canvas/CSS geometry | Canvas/CSS | Decorative; canvas is `aria-hidden` |
