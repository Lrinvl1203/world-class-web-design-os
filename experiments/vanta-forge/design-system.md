# Design system — VANTA Forge

## Tokens

- Paper: `#eee9dd`
- Carbon: `#161714`
- Steel: `#77786f`
- Rule: `#b8b4a9`
- Signal orange: `#e65d24`
- Inspection green: `#b9d69a`
- Display: Arial Black / Arial Narrow / system sans, compressed through letter spacing and scale.
- Body and data: Arial / Helvetica / system sans; tabular numerals for specifications.

## Composition

- A 12-column desktop grid with hard vertical rules and offset content, recomposed to a single technical rail on mobile.
- No floating cards. Sections share borders so evidence reads as one manufacturing record.
- Large editorial statements are paired with compact data, never centered above a generic grid.
- The orange datum line is reserved for selection, process continuity, and CTA focus.

## Imagery

- Two original documentary images: plant-scale five-axis machining and close inspection work.
- Cool graphite ambient light, restrained amber daylight, authentic wear, and no sparks, smoke, holograms, neon, logos, or legible generated text.
- Hero image loads eagerly with fixed dimensions; inspection imagery is lazy, dimensioned, and decoded before visual capture.

## Interaction and motion

- Production-family buttons use `aria-pressed`; text and data update in one live region.
- RFQ controls generate a local, non-submitting brief and state that no data was transmitted.
- Focus uses a high-contrast orange outline with offset.
- Motion is limited to the datum-line position, selected-value replacement, and initial hero rule draw.
- Reduced motion disables interpolation without removing state distinction or content.

## Responsive recomposition

- At narrow widths, hero copy precedes the image and proof rail; capability controls become a horizontally scrollable labeled tablist with visible overflow cue.
- Dense metric rows keep label/value pairs together rather than shrinking type.
- The RFQ builder becomes a linear form; the generated brief follows controls in reading order.
