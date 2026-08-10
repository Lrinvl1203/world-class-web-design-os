# World-Class Web Design OS — Codex Operating Rules

These instructions apply to the entire repository.

## Continuation handoff

When `CODEX_HANDOFF.md` exists, read it before substantive continuation work. It records inherited state, completed research/experiments, pending milestones, and non-negotiable decisions. Preserve that context unless the user explicitly changes direction.

## Mission

Produce web experiences that are distinctive, coherent, usable, accessible, fast, and technically maintainable. Optimize for design intent and user outcomes rather than fashionable effects or component-library assembly.

## Required routing

For any task that designs, redesigns, builds, or materially polishes a web page/interface, start with `$web-design-orchestrator` unless the user explicitly requests a narrower skill.

Use the specialist skills only when relevant:

- `$design-discovery` — business goal, audience, CTQs, IA, content priority, CTA.
- `$reference-forensics` — visual reference decomposition and principled remixing.
- `$art-direction` — point of view, composition, typography, imagery, visual energy, signature concept.
- `$design-system` — tokens, primitives, component/state rules, responsive and motion tokens.
- `$component-source-router` — choose native/custom/primitives/component registries intentionally.
- `$interaction-design` — state, feedback, gestures, navigation, affordance, interaction budget.
- `$motion-engine` — select Motion, Anime.js, GSAP, Lenis, or native motion by intent.
- `$creative-web` — 3D, WebGL/WebGPU, Rive, Spline, Theatre.js, SVG/canvas/shaders.
- `$frontend-implementation` — semantic, maintainable production implementation.
- `$responsive-recomposition` — redesign priority and composition across breakpoints.
- `$a11y-performance` — accessibility and performance hard gates.
- `$visual-qa` — Playwright screenshots, regressions, overflow/state/browser checks.
- `$design-critic` — independent macro/meso/micro critique and Design Quality scoring.
- `$ai-smell-detector` — detect generic AI aesthetics and unjustified effects.
- `$visual-polish` — focused high-craft typography, spacing, imagery, surface and micro-interaction polish.
- `$continuous-learning` — convert defects and lessons into evidence-backed improvement proposals.

## Design process

1. Understand the business/job and primary user action before styling.
2. If references exist, analyze them before implementation. Extract principles; never reproduce a site wholesale.
3. Establish a design POV and an explicit anti-direction: what the experience must *not* feel like.
4. When scope allows and direction is not locked, produce three materially different art-direction routes, not color variants.
5. Define or update the design system before proliferating one-off CSS.
6. Select primitives and motion engines after the interaction intent is known.
7. Implement semantic structure first; layer enhancement progressively.
8. Recompose mobile deliberately instead of stacking desktop blocks mechanically.
9. Render real screenshots at representative viewports.
10. Run the design critic and AI-smell detector separately from the implementation pass.
11. Fix the highest-leverage root causes, not merely the most visible symptoms.
12. Do not declare completion until the hard gates pass.

## Tool-selection rules

- Prefer CSS, Web Animations API, CSS Scroll-Driven Animations, or View Transitions for simple native-capable motion.
- Prefer Motion for React state/layout/gesture/shared-layout animation.
- Prefer Anime.js for precise lightweight timelines, staggering, SVG/text choreography, and deterministic sequencing.
- Prefer GSAP for complex scroll choreography, pin/scrub, FLIP, advanced text/SVG/path work, and multi-system orchestration.
- Use Lenis only when smooth-scroll behavior materially improves the experience; do not install it by default.
- Use Three.js / React Three Fiber only when 3D is part of the communication or brand idea, not as decorative novelty.
- Use Rive for designer-authored interactive vector state machines; Spline for designer-owned 3D scenes/embeds; Theatre.js for timeline authoring and synchronized scene animation when justified.
- Do not load multiple overlapping animation libraries without an explicit capability reason and performance review.

## Quality rules

- Keep critical content and controls available without animation.
- Respect `prefers-reduced-motion` and preserve navigation/state comprehension when motion is reduced.
- Keyboard focus must be visible and not hidden by sticky/fixed UI.
- Critical pointer targets must meet WCAG 2.2 AA expectations or valid spacing/equivalent exceptions.
- Avoid horizontal overflow at all target widths.
- Optimize imagery, font loading, JavaScript, 3D, and animation work to protect Core Web Vitals.
- No console errors, broken links, dead controls, or inaccessible custom controls in a release candidate.

## Anti-slop rules

Do not default to centered hero + two CTAs, generic bento grids, gradient text, purple/blue glows, glass cards, excessive pills, uniform `rounded-xl`, generic icon-card repetition, identical fade-up reveals, or vague marketing copy. These patterns are permitted only when they are supported by the brand, content, and interaction model.

## Continuous improvement

After a substantive project, record generalizable defects and countermeasures through `$continuous-learning`. Do not silently rewrite core skills. Propose a patch, validate it against at least one prior and one new scenario, then adopt it intentionally.
