# Architecture

## 1. System layers

```text
INPUT / BUSINESS INTENT
        ↓
DESIGN DISCOVERY
        ↓
REFERENCE FORENSICS ──────→ DESIGN KNOWLEDGE
        ↓
ART DIRECTION
        ↓
DESIGN SYSTEM
        ↓
COMPONENT + INTERACTION + MOTION ROUTERS
        ↓
FRONTEND IMPLEMENTATION / CREATIVE WEB
        ↓
RESPONSIVE RECOMPOSITION
        ↓
RENDER / SCREENSHOT / FUNCTIONAL QA
        ↓
INDEPENDENT DESIGN CRITIC + AI-SMELL DETECTOR
        ↓
Web Design OS SCORE + HARD GATES
        ↓
ROOT-CAUSE CORRECTION LOOP
        ↓
RELEASE
        ↓
CONTINUOUS-LEARNING PROPOSAL
```

## 2. Why the skills are separated

A single giant prompt creates three problems: context bloat, weak routing, and self-confirming critique. The OS instead uses narrow skills that are loaded only when relevant. The creator and critic have different objectives so visual intent is not automatically treated as proof of quality.

## 3. Intelligence vs runtime tools

### Design intelligence

- Business/user CTQs and information hierarchy.
- Meng To / Design+Code-inspired reference analysis, remix, visual hierarchy, component craft, and polish principles distilled from public materials.
- Art direction, composition, type, color/materiality, imagery, content, spatial rhythm.
- AI design anti-pattern detection.

### Runtime tools

- Interaction: native web platform, Motion, Anime.js, GSAP, Lenis.
- Creative: Three.js/R3F, Rive, Spline, Theatre.js, SVG/canvas/shaders.
- Primitives/components: Base UI, React Aria, Radix, shadcn, 21st.dev, Aceternity, React Bits, Motion Primitives, Magic UI, Animate UI.
- QA: Playwright screenshot and interaction tests.

Runtime tools are selected *after* intent. The OS does not install all of them.

## 4. Release decision

Release is a conjunction, not an average:

```text
Release = Design Quality score ≥ target
          AND category floors pass
          AND functional gate
          AND accessibility gate
          AND responsive gate
          AND reduced-motion gate
          AND performance gate
```

The rubric lives in `config/design-quality-rubric.json`.

## 5. Learning loop

Every defect is classified as one of:

- project-specific exception;
- execution error;
- missing rule;
- bad rule;
- tool-selection error;
- validation blind spot.

Only the latter four are candidates for OS updates. Updates are proposed, regression-tested, and then accepted explicitly.
