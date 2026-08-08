# Motion tool router

| Need | Default | Escalate when |
|---|---|---|
| Hover/focus/press/basic reveal | CSS / WAAPI | state/layout orchestration is complex |
| Simple scroll-linked property | CSS Scroll-Driven Animations | target support or choreography requires JS |
| Route/state visual continuity | View Transition API | app-specific control requires another engine |
| React layout/shared element/gesture | Motion | precise timeline or advanced pinned scroll dominates |
| Precise timeline/stagger/SVG/text | Anime.js | scroll pin/scrub/FLIP/large orchestration dominates |
| Complex scroll/story/timeline | GSAP | — |
| Smooth-scroll feel | Lenis | use only with clear experiential purpose |

Decision order: purpose → interaction model → framework → target browser → complexity → bundle/performance → accessibility → engine.
