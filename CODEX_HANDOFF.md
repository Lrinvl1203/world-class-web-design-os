# Codex Handoff — World-Class Web Design OS

## 0. Purpose of this handoff

Continue the existing project exactly from its current state. Do **not** restart the architecture, replace the skill system with a new prompt stack, or discard previous experiments. Preserve the repository as the source of truth, audit it first, then improve it incrementally.

This project began as an attempt to turn a high-end Claude Code web-design tutorial workflow into a more rigorous, reusable, Codex-native **Web Design Operating System**. The target is not merely “pretty AI websites.” The target is a system that can repeatedly produce distinctive, coherent, usable, accessible, fast, maintainable web experiences and improve itself through evidence-backed critique.

Primary remote target:

- `https://github.com/Lrinvl1203/world-class-web-design-os`

The user wants all future work on this project to continue in Codex with no loss of context.

---

## 1. Non-negotiable design philosophy

The system must optimize for **design fluency**, not tool count.

Design fluency means the following work together as one language:

1. visual fluency — typography, composition, spacing, imagery, color, materiality;
2. interaction fluency — intent, affordance, feedback, state, navigation;
3. motion fluency — meaningful timing, easing, choreography, continuity;
4. responsive fluency — recomposition by device/context, not desktop stacking;
5. cognitive fluency — users should understand what matters and what to do without unnecessary thought;
6. technical fluency — accessibility, performance, maintainability, progressive enhancement.

Never equate “premium” with more animation, more 3D, more gradients, or more component libraries. Tool choice follows communication intent.

Core loop:

`Discover → Reference Forensics → Art Direction → Design System → Build → Render → Critique → Root Cause → Countermeasure → Rebuild → QA → Learn`

This is deliberately analogous to built-in quality / PDCA rather than final-inspection-only design.

---

## 2. Current repository state

The current local history that must be preserved is:

- `2ec5b43 record github publish handoff`
- `d130d37 add 2026 benchmark atlas and WDX evidence`
- `b05c615 fix concierge interaction and accessibility defects`
- `3c82970 add first WDX concierge experiment`
- `33b9c65 bootstrap world-class web design os`

Before changing anything, run:

```bash
git status -sb
git log --oneline --decorate -10
```

If the remote repository already contains commits, fetch and inspect them before choosing merge/rebase strategy. Do not force-push over unknown remote work.

---

## 3. Codex-native structure already implemented

The project intentionally uses Codex-native skills:

```text
.codex/skills/<skill-name>/SKILL.md
```

with progressive disclosure through `references/`, `scripts/`, `assets/`, and `agents/openai.yaml` where relevant.

There are currently **17 core skills**:

1. `web-design-orchestrator`
2. `design-discovery`
3. `reference-forensics`
4. `art-direction`
5. `design-system`
6. `component-source-router`
7. `interaction-design`
8. `motion-engine`
9. `creative-web`
10. `frontend-implementation`
11. `responsive-recomposition`
12. `a11y-performance`
13. `visual-qa`
14. `design-critic`
15. `ai-smell-detector`
16. `visual-polish`
17. `continuous-learning`

Do not merge all of these into one giant skill. Their separation exists to protect context efficiency, role clarity, and independent critique.

Always read root `AGENTS.md` first. For full web-design work, `$web-design-orchestrator` is the governing workflow.

---

## 4. Knowledge and methodology already integrated

The OS must retain and continue learning from the following bodies of practice, while avoiding copyrighted or paid-course reproduction.

### Design intelligence

- Anthropic-style frontend-design principles: distinctive production UI, explicit art direction, avoidance of generic AI defaults.
- UI UX Pro Max as an optional searchable knowledge source for palettes, typography, UI/UX rules, stacks, etc.; never make the OS dependent on it.
- Meng To / Design+Code methodology as **design-to-code craftsmanship**, especially:
  - reference decomposition;
  - hierarchy;
  - composition;
  - typography;
  - color/materiality;
  - component craft;
  - design systems;
  - reference remixing rather than copying;
  - responsive polish;
  - interaction/animation prompting and prototyping.
- Awwwards as a visual/brand/art-direction benchmark source.
- Codrops as a creative-engineering and implementation case-study source.

Important: learn principles and publicly observable patterns. Do not reproduce paid course text, proprietary templates, or entire reference websites.

---

## 5. Motion and interaction stack already decided

The OS is **not** a motion-library collection. It contains a router that chooses the simplest justified engine.

### Native first

Prefer when sufficient:

- CSS transitions/keyframes;
- Web Animations API;
- CSS Scroll-Driven Animations;
- View Transitions API;
- IntersectionObserver for triggers when appropriate.

### Motion.dev

Preferred for React-centric:

- state-linked animation;
- layout/shared-layout animation;
- gestures;
- drag;
- presence;
- spring behavior;
- scroll-linked or scroll-triggered UI motion where Motion is the cleanest fit.

### Anime.js

Preferred for:

- precise deterministic timelines;
- stagger choreography;
- SVG/text/logo animation;
- multi-element lightweight sequences;
- tightly timed hero choreography.

### GSAP

Escalate to GSAP for:

- complex scroll choreography;
- pin/scrub;
- FLIP;
- MotionPath;
- advanced text/SVG choreography;
- cross-system timeline orchestration;
- DOM + canvas/WebGL synchronization when justified.

### Lenis

Use only when smooth scrolling meaningfully improves experience. Never add by default.

### Motion rules

- Motion must have purpose: feedback, orientation, continuity, hierarchy, attention, storytelling, or personality.
- “If everything moves, nothing is special.”
- Maintain a motion budget.
- Critical information/functionality must remain usable with `prefers-reduced-motion`.
- Avoid multiple overlapping libraries unless capability differences justify the cost.

Reference files already exist under `.codex/skills/motion-engine/references/` and must be preserved and improved, not duplicated elsewhere.

---

## 6. Creative-web stack already decided

Escalate only when spatial/interactive communication requires it.

- SVG — vector diagrams, masks, paths, lightweight expressive motion.
- Canvas — pixel/particle/custom rendering when DOM/SVG is not appropriate.
- Three.js — programmable 3D/WebGL/WebGPU scenes.
- React Three Fiber — React-based 3D scene composition.
- WebGL / WebGPU / shaders — only when material/performance/visual intent warrants the complexity.
- Rive — designer-authored interactive vector animation/state machines.
- Spline — designer-owned interactive 3D scene/embedding workflows.
- Theatre.js — timeline authoring and synchronized 3D/DOM scenes when it provides real leverage.

Do not use 3D, shaders, particles, cursor distortions, or WebGPU as novelty theater.

---

## 7. Component ecosystem already considered

The OS should know but not blindly assemble from:

### Accessible/unstyled foundations

- Base UI
- React Aria
- Radix
- shadcn/ui

### Visual/experimental registries and inspiration

- 21st.dev
- Aceternity UI
- React Bits
- Motion Primitives
- Magic UI
- Animate UI

Rule:

`registry component → extract behavior → remove generic styling → apply project design tokens → adapt composition → accessibility audit → dependency audit → production component`

A component library is raw material, not art direction.

---

## 8. Anti-generic / AI-smell principles

Do not default to:

- centered hero + two CTA buttons;
- generic bento grids;
- repetitive three-column feature cards;
- gradient text as automatic premium styling;
- purple/blue glows;
- meaningless glassmorphism;
- excessive pill badges;
- uniform `rounded-xl` on everything;
- icon + heading + description card repetition;
- every-section fade-up;
- “Elevate / Unlock / Transform / Experience” filler copy;
- meaningless floating objects/particles;
- unnecessary 3D cursors;
- parallax everywhere.

These are not absolute bans. The question is always: **can this design choice be explained by brand, content, usability, or interaction intent?** If not, treat it as suspect.

---

## 9. Composition and art-direction principles

The system must deliberately reason about:

- asymmetry;
- overlap;
- controlled grid breaking;
- cropping;
- scale contrast;
- negative space;
- dense ↔ sparse rhythm;
- editorial alignment;
- foreground/background depth;
- visual tension and release;
- page-level energy curve;
- one memorable signature concept.

Before implementation, establish both:

1. **Design POV** — what the site should feel like;
2. **Anti-direction** — what it must never feel like.

When direction is not locked and scope permits, generate three materially different art directions, not color variants.

---

## 10. Typography requirements

Typography is a system, not a font pick.

Reason about:

- display/body/utility roles;
- type scale and contrast;
- line-height;
- measure;
- tracking;
- weight/width/optical size when supported;
- casing;
- language behavior;
- responsive type rhythm.

For Korean + Latin interfaces, tune Hangul and Latin separately rather than assuming one metric system feels equally balanced in both scripts.

---

## 11. Responsive recomposition

Do not reduce responsive design to `desktop → stack vertically`.

Re-evaluate by viewport/context:

- information priority;
- CTA priority;
- navigation model;
- imagery/crop;
- type scale;
- whitespace/density;
- touch affordances;
- motion intensity;
- reading order.

Think in terms of:

`desktop composition → tablet recomposition → mobile reprioritization`

---

## 12. Accessibility and performance hard gates

Do not mark a release complete because it looks good.

Baseline intent:

- WCAG 2.2 AA-oriented implementation;
- visible keyboard focus;
- no critical focus obstruction by sticky/fixed elements;
- pointer targets and spacing consistent with current WCAG expectations;
- semantic controls;
- keyboard-operable interactions;
- no required dragging without alternative where relevant;
- reduced-motion support;
- no horizontal overflow;
- no console errors;
- no broken links/dead controls.

Performance target framework:

- LCP ≤ 2.5s;
- INP ≤ 200ms;
- CLS ≤ 0.1;

Do not claim field Core Web Vitals without actual field data. Lab checks and local observations must be labeled as such.

---

## 13. WDX scoring system

The repository contains `config/wdx-rubric.json`. Keep the scoring transparent and resistant to gaming.

Current 100-point structure:

- Art Direction / Originality — 12
- Brand Distinctiveness — 8
- Composition — 12
- Typography — 10
- Color / Materiality — 6
- Spatial Rhythm — 8
- Imagery — 8
- Content / Copy — 6
- UX / Navigation — 8
- Interaction — 5
- Motion — 6
- Responsive — 5
- Accessibility — 3
- Performance — 3

Current internal release target:

- overall WDX ≥ 92;
- plus hard gates;
- plus minimum critical-dimension floors where configured.

Never change weights or thresholds merely to make an experiment pass. Improve the artifact instead.

---

## 14. Independent critique requirement

The builder and critic roles must remain conceptually separate.

Critique order:

1. **Macro** — art direction, brand, composition, story, energy curve;
2. **Meso** — section hierarchy, density, spatial rhythm, imagery relationship;
3. **Micro** — controls, radii, line heights, borders, alignment, hover/focus details.

Fix root causes in that order. Do not polish micro defects while the macro system is wrong.

---

## 15. Visual QA and Playwright

The repository already includes visual-QA infrastructure and representative viewports.

Required viewport matrix currently includes approximately:

- 320 × 568
- 375 × 812
- 390 × 844
- 768 × 1024
- 1440 × 900
- 1920 × 1080

Check at minimum:

- screenshots;
- horizontal overflow;
- console errors;
- core interactive states;
- keyboard behavior where applicable;
- reduced motion;
- visual regressions where baselines are appropriate.

Prefer Playwright for deterministic browser QA.

---

## 16. Reference knowledge already collected

Do not discard the existing research.

Important files:

- `.codex/skills/reference-forensics/references/award-pattern-atlas.md`
- `docs/reference-study-40.md`
- `.codex/skills/motion-engine/references/capability-matrix-2026.md`
- `.codex/skills/creative-web/references/capability-matrix-2026.md`
- `docs/source-registry.md`

The existing 40-reference study separates evidence quality roughly as:

- A — implementation/design intent supported by case-study evidence;
- B — interaction/technology supported by demo evidence;
- C — award/benchmark identity known but mechanics must not be invented.

Continue this evidence discipline. If expanding the atlas, cite official/primary sources or direct case studies wherever possible.

---

## 17. First experiment already completed: Nocturne 24

Path:

`experiments/nocturne-concierge/`

Current files include:

- `project-brief.md`
- `design-system.md`
- `index.html`
- `styles.css`
- `script.js`
- `qa-results.json`
- `wdx-review.json`
- `review.md`
- screenshots for multiple desktop/tablet/mobile viewports.

This experiment intentionally used a restrained “quiet luxury digital concierge” direction rather than gratuitous 3D/GSAP.

Current WDX result:

- **89.4 / 100 — HOLD**

Do not retroactively mark it as passed.

Known reasons it did not reach 92:

- imagery/visual system lacks enough proprietary/place-specific character;
- signature interaction is not yet memorable enough;
- some micro-typography / real-device nuance could be stronger;
- the experiment demonstrates the workflow but is not yet an award-level artifact.

Browser QA already addressed defects such as dead `#` links and meaningless interaction states. Preserve those fixes.

The next improvement pass should increase actual design quality, not manipulate WDX scoring.

---

## 18. Continuous-learning philosophy

After each meaningful project:

`Observation → Impact → Root Cause → Generalizable? → Countermeasure → Regression Scenario → Skill Patch Proposal → Validation → Adopt/Reject`

Do not silently rewrite core skills from one anecdote.

For a skill change to become standard:

1. identify a repeatable defect;
2. propose a generalized rule or tool improvement;
3. test against at least one prior case and one new case when feasible;
4. ensure it does not cause regressions or excessive context/tool use;
5. then adopt intentionally.

This project is intended to become **a learning production system**, not a frozen prompt pack.

---

## 19. Immediate continuation tasks — execute in this order

### Phase A — repository takeover and integrity audit

1. Read `AGENTS.md` and this file completely.
2. Run `git status`, `git log`, and inventory all 17 skills.
3. Run existing validation scripts/tests.
4. Verify every `SKILL.md` has valid concise frontmatter and that `agents/openai.yaml` remains aligned where present.
5. Confirm references are linked from the appropriate skill rather than duplicated into giant prompts.
6. Do not refactor architecture until this audit is complete.

### Phase B — connect/publish GitHub safely

Remote target:

```text
https://github.com/Lrinvl1203/world-class-web-design-os
```

1. Inspect `git remote -v`.
2. If no origin exists, add this URL as origin.
3. `git fetch origin` before pushing if remote resolves.
4. Inspect whether remote has an initial README/license/etc.
5. Preserve any remote work; merge/rebase intentionally if needed.
6. Push current history to `main` only after confirming it is safe.
7. Do not use destructive force-push unless explicitly justified and authorized.

### Phase C — improve the Nocturne experiment honestly

Goal: reach WDX ≥ 92 **through artifact improvement**, while keeping hard gates green.

Recommended priorities:

1. strengthen the signature visual/interaction concept;
2. increase place-specific or proprietary visual character without using random stock imagery;
3. refine typography and spatial rhythm at mobile and desktop breakpoints;
4. keep motion restrained and purposeful;
5. rerender all viewports;
6. rerun independent critic and AI-smell pass;
7. document before/after root causes and score changes.

Do not add 3D/GSAP merely to raise interaction/motion points.

### Phase D — expand Design DNA knowledge from 40 to 100+ evidence-backed references

Expand selectively across:

- Awwwards case studies / award winners;
- Codrops case studies and demos;
- Design+Code publicly documented principles;
- official Motion / Anime.js / GSAP / Lenis examples and docs;
- Three.js / R3F / Rive / Spline / Theatre examples when they reveal reusable design/engineering patterns;
- high-quality editorial, hospitality, product, cultural, architecture, portfolio, SaaS, commerce, and data-storytelling experiences.

Do **not** create a giant inspiration dump. For each useful reference, extract reusable Design DNA such as:

- art-direction principle;
- composition pattern;
- typography treatment;
- imagery strategy;
- interaction purpose;
- motion grammar;
- responsive behavior;
- technical implementation clue;
- performance/accessibility tradeoff;
- anti-pattern / misuse warning;
- evidence confidence.

Organize patterns by problem/intent, not only by website name.

### Phase E — strengthen the OS where evidence warrants

Potential areas to improve only after evidence:

- signature-interaction ideation;
- imagery-direction and image-system reasoning;
- Korean/Latin typography guidance;
- visual-energy curve evaluation;
- component registry adaptation rules;
- animation/performance budgets;
- creative-web escalation thresholds;
- critic calibration;
- automated QA coverage;
- learning-record format;
- installer/packaging/versioning ergonomics.

Avoid adding a new skill unless it has a clear routing boundary that cannot live cleanly in an existing skill/reference.

### Phase F — validate on additional real archetypes

After Nocturne, test the OS on at least several materially different archetypes, e.g.:

1. industrial / manufacturing B2B;
2. premium hospitality;
3. editorial/cultural experience;
4. SaaS/product interface;
5. commerce/brand landing;
6. data-rich dashboard or operational tool.

The purpose is to prove generalization and expose skill overfitting.

---

## 20. What must NOT happen during continuation

- Do not throw away the 17-skill architecture and replace it with one mega prompt.
- Do not add libraries simply because they are fashionable.
- Do not copy Awwwards, Codrops, Design+Code, or paid-course material wholesale.
- Do not claim “world-class” based only on a self-generated score.
- Do not change the WDX rubric to manufacture passes.
- Do not confuse responsive stacking with mobile design.
- Do not treat accessibility/performance as cleanup after visual work.
- Do not allow the builder’s intent to bias the critic into automatic approval.
- Do not let experimental creative effects break semantic HTML, keyboard behavior, reduced motion, or Core Web Vitals.
- Do not create unnecessary docs inside individual skill folders; keep skills concise with references/scripts/assets only when they serve execution.

---

## 21. Definition of success for the project

The project succeeds when Codex can receive a business/product brief plus optional references/assets and reliably:

1. clarify the real user/business job;
2. extract Design DNA from references without cloning them;
3. create a distinct art direction and anti-direction;
4. establish a coherent design system;
5. choose components and motion/creative engines by intent;
6. implement semantic production-quality frontend;
7. deliberately recompose for mobile/tablet;
8. render and test actual browser states;
9. perform independent visual/AI-smell critique;
10. meet WDX and hard gates without score gaming;
11. learn generalizable lessons into the OS;
12. improve future projects rather than merely the current one.

The long-term target is an **AI Web Design Production System / Design Operating System**, not a one-off website generator.

---

## 22. First Codex instruction after opening this repository

Use this exact instruction:

```text
Read AGENTS.md and CODEX_HANDOFF.md in full. Treat the existing repository, commits, 17 Codex skills, research atlas, and Nocturne experiment as inherited work that must be preserved. Do not redesign the architecture from scratch. First perform the Phase A integrity audit and report concrete findings. Then continue Phase B onward autonomously, making best-effort progress without asking me to repeat context already present in the repository. Use $web-design-orchestrator as the governing workflow for web-design work, keep builder and critic passes separate, verify current external/library facts against primary sources when they may have changed, and never game WDX thresholds. Commit coherent milestones with concise messages.
```

