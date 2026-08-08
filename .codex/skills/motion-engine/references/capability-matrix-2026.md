# Motion Capability Matrix — 2026

Use this after motion intent has been defined. Prefer the lowest-complexity engine that fully meets the interaction requirement.

| Need | First choice | Escalate when | Notes |
|---|---|---|---|
| Hover/focus/press/color/opacity | CSS transitions | state is interruptible or coordinated | Cheapest path for self-contained effects. |
| Simple keyframes | CSS / WAAPI | sequencing becomes complex | Keep transform/opacity compositor-friendly. |
| Route/view continuity | View Transition API | support/behavior requirements exceed native | Always preserve navigation without transition. |
| Native scroll-linked effect | CSS Scroll-Driven Animations / WAAPI | pin/scrub/story orchestration becomes complex | Keep reading independent of scroll effect. |
| React state/props animation | Motion | exact multi-part timeline is the primary requirement | Motion’s declarative model maps naturally to React state. |
| Layout/shared-layout/presence/gesture | Motion | custom orchestration crosses DOM/3D systems | Use `layout`, presence and gesture primitives before custom measurement code. |
| Precise stagger/timeline/SVG/value choreography | Anime.js | pin/scrub/Flip/3D orchestration dominates | `createTimeline()` is a strong fit for deterministic sequencing. |
| Advanced scroll pin/scrub/timeline | GSAP + ScrollTrigger | none; this is the escalation tier | Budget complexity and mobile-specific choreography. |
| Shared-state geometry transitions | Native View Transition / Motion layout | arbitrary DOM states require FLIP control | GSAP Flip when lower-level geometry control is justified. |
| Text splitting choreography | CSS/native when simple | robust line/word/char sequencing needed | GSAP SplitText is an escalation path; preserve semantic text/reflow. |
| Motion along arbitrary path | CSS offset-path / SVG native | timeline/path tooling required | GSAP MotionPath is the escalation path. |
| Smooth-scroll normalization | Native scroll | product concept explicitly needs smooth interpolation | Lenis is optional, not a default dependency. |
| DOM + Three/WebGL synchronization | One shared clock/orchestrator | multiple libraries must coordinate | Avoid competing RAF loops. |

## Verified current capabilities

### Motion
Motion for React supports prop/state-linked animation, gestures, layout and scroll animation. Its hybrid engine can use browser Web Animations API and ScrollTimeline where appropriate and fall back to JavaScript for capabilities such as springs/gestures. CSS remains preferable for simple, isolated effects.

### Anime.js
Anime.js timelines synchronize animations, timers and callbacks. Use them for choreography with explicit offsets, labels and stagger rather than for ordinary component state transitions.

### GSAP
Use GSAP only when the project materially benefits from advanced timeline/scroll/orchestration features such as ScrollTrigger, Flip, SplitText or MotionPath.

### Lenis
Use smooth scrolling only when it is part of the product’s motion language. Synchronize it with the chosen animation loop and preserve native-scroll semantics/fallbacks.

## Motion-budget policy

Per viewport, as a starting constraint:

- major narrative motion: <= 1 simultaneous focal system;
- medium transitions: <= 2 competing systems;
- micro interactions: contextual, short and non-competing;
- no continuous decorative loop unless it contributes clear atmosphere/meaning and pauses when offscreen;
- reduced-motion mode must preserve state, hierarchy and task completion.
