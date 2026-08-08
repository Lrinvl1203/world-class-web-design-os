# World-Class Skill Stack

This catalog is a routing map, not a requirement to install everything.

## A. Design intelligence and reference craft

| Source / family | What to learn | OS usage |
|---|---|---|
| Meng To / Design+Code | hierarchy, typography, color/gradient craft, components, prototyping, design systems, responsive polish, reference-based composition | `reference-forensics`, `art-direction`, `design-system` |
| UI UX Pro Max | broad searchable patterns, palettes, fonts, UX rules, design-system generation | optional external knowledge adapter; never overrides project POV |
| Codrops | current creative-development patterns, interaction/scroll/WebGL case studies | inspiration + technical feasibility reference |
| Awwwards / curated award sites | composition, art direction, emerging interaction idioms | benchmark source; not a copy target |

## B. Interaction and motion engines

| Tool | Prefer when | Avoid when |
|---|---|---|
| Native CSS / WAAPI | simple transitions/keyframes, low dependency, progressive enhancement | sophisticated state orchestration becomes brittle |
| CSS Scroll-Driven Animations | simple compositor-friendly scroll-linked effects | browser/support constraints conflict with target matrix |
| View Transition API | route/state visual continuity that maps naturally to view transitions | app architecture or target support makes fallback complexity disproportionate |
| Motion | React state/layout/shared-layout/gesture/scroll animation | only a timeline is needed and framework coupling adds cost |
| Anime.js | precise timeline/stagger/SVG/text/value choreography | complex pinned scroll storytelling needing deeper scroll tooling |
| GSAP | advanced timeline, ScrollTrigger, SplitText, Flip, MotionPath, synchronized systems | simple hover/fade where native CSS is sufficient |
| Lenis | smooth-scroll signal and feel are part of the design | default scrolling is already appropriate; avoid as decoration |

## C. Creative web

| Tool | Prefer when |
|---|---|
| Three.js | low-level 3D/WebGL/WebGPU scene control |
| React Three Fiber | 3D belongs inside a React component/state architecture |
| Rive | interactive vector animation with designer-authored state machines |
| Spline | designer-owned 3D scene authoring and web embedding/integration |
| Theatre.js | timeline authoring and synchronized 3D/DOM animation control |
| SVG | resolution-independent iconographic/illustrative motion and masks |
| Canvas/shaders | custom visual computation is central to the concept |

## D. Accessible primitives

Base UI, React Aria, and Radix are preferred sources when custom visual design needs robust interaction semantics. shadcn may be used as owned source code rather than a fixed visual identity.

## E. Component and effect registries

21st.dev, Aceternity UI, React Bits, Motion Primitives, Magic UI, and Animate UI can accelerate exploration. Treat every imported item as a prototype substrate:

1. extract the behavior;
2. remove generic styling;
3. remap tokens;
4. audit accessibility;
5. audit dependency/bundle cost;
6. integrate with the page composition;
7. delete it if it does not support the design POV.

## F. QA and standards

- Playwright for screenshots, visual regression and interaction testing.
- WCAG 2.2 AA as accessibility baseline.
- Core Web Vitals as performance hard gates.
- Reduced-motion and keyboard behavior as explicit release checks.

See `docs/source-registry.md` for verified public sources.
