# Design system — Afterimage Atlas

## Art direction

- POV: a living research folio where scholarship feels physical rather than institutional.
- Emotional register: attentive, unresolved, intimate.
- Composition grammar: narrow reading rail, oversized object stage, numbered marginalia, hard rules, deliberate overlaps.
- Signature visual: a single poster reconstructed through five crop/translation states.
- Signature interaction: edition rail updates the aperture, caption, annotation, and provenance marker as one state change.

## Foundations

- Paper `#eee9dd`, carbon `#171713`, vermilion `#d73b22`, cobalt `#244d9b`, dust `#aaa395`.
- Display: Georgia italic/roman with tight measure; utility: Arial; metadata: system monospace.
- Space uses a 6 px base with dense margins and generous chapter breaks.
- Corners are square. Depth comes from paper offsets, rules, and ink density, never generic shadows.
- Focus uses a 3 px cobalt outline with 4 px offset.

## Components and states

- Edition tab: number, year, transformation; default/hover/focus/selected are all distinct; `aria-selected` carries state.
- Object stage: visual layer plus permanent textual fallback. Selected transformation changes crop, ink, and annotation.
- Margin note: live region updates after selection; initial content is present server-side.
- Chapter link: underlined on focus/hover, never hidden behind sticky index.

## Motion and responsive rules

- Native CSS transitions only: 180 ms controls, 520 ms object continuity, `cubic-bezier(.2,.75,.2,1)`.
- One dominant motion moment: object-layer continuity when an edition changes.
- Reduced motion removes transitions and exposes instant state changes.
- At ≤720 px, the edition rail becomes a horizontally scrollable tablist with visible next content; the object precedes annotation and sticky behavior is removed.
