# Design system — Nocturne 24

## Palette
- Paper #EFE9DF
- Ink #171814
- Night #101512
- Acid moon #DBE8A4
- Terracotta #A8583D

## Typography
- Editorial display: Georgia/system serif for zero external font cost.
- Utility/body: Arial/Helvetica system sans.
- Extreme scale contrast between display and utility labels.

## Composition
- Asymmetric hero with staggered display lines.
- Dense utility strip after high-emotion hero.
- Alternating light/dark pacing.
- 2-column editorial layouts collapse by reprioritization, not just stacking.

## Imagery
- Two-image editorial field set: arched room window and nearby late-night roastery.
- Restrained after-rain palette, natural 35 mm grain, no neon/cyberpunk treatment.
- Hero image is eager and dimensioned; noncritical images are lazy, dimensioned, and decoded before visual QA capture.
- Photo crops preserve the window/threshold as the focal point at desktop and mobile widths.

## Signature interaction
- Arrival lightpath is a three-button single-pointer and keyboard flow: street door → third floor → room 302.
- Selected state is communicated by `aria-pressed`, editorial type change, route color, and updated text rather than motion alone.
- Motion is optional feedback; reduced motion preserves every state and task.

## Motion
- Scroll progress for orientation.
- Low-amplitude reveals on four focal moments only; critical content is visible by default and fails open without JavaScript.
- Small directional feedback on actionable arrows.
- Orbit only as low-salience ambient signature.
- Full reduced-motion fallback.
