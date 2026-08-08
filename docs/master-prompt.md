# Codex Master Handoff Prompt

Use this as the starting prompt for a new website project.

```text
Use $web-design-orchestrator as the governing workflow for this project.

MISSION
Create a distinctive, production-grade web experience whose visual language, interaction model, motion, content hierarchy, responsive behavior, accessibility, and performance feel deliberately designed rather than AI-assembled.

INPUTS
- Business / product: [describe]
- Target users: [describe]
- Primary job-to-be-done: [describe]
- Primary CTA / conversion: [describe]
- Required pages / states: [describe]
- Content source: [files / URL / notes]
- Brand constraints: [describe]
- Visual references: [paths / screenshots / URLs]
- Existing assets: [paths]
- Existing stack: [framework / CSS / component system]
- Technical constraints: [deployment, browser, SEO, analytics, CMS, etc.]

OPERATING RULES
1. Inspect the existing repository before proposing architecture changes.
2. Use $design-discovery to convert the brief into user/business CTQs and information priority.
3. If references are supplied, use $reference-forensics. Extract design DNA; do not clone a source.
4. Unless direction is already locked or the task is narrowly scoped, propose three genuinely different art directions. Each must differ in composition, typography, imagery, spatial rhythm, interaction and motion—not merely color.
5. Define the selected Design POV, Anti-Direction, Visual Energy Curve, signature visual idea, and signature interaction.
6. Use $design-system before proliferating one-off styling.
7. Use $component-source-router, $interaction-design and $motion-engine to select the smallest justified implementation stack. Native platform first when sufficient.
8. Use $creative-web only where 3D/vector/canvas/shader work communicates meaning or brand character.
9. Implement with $frontend-implementation and preserve the existing stack unless change is justified.
10. Use $responsive-recomposition for a dedicated mobile/tablet pass. Do not merely stack desktop sections.
11. Render screenshots and test via $visual-qa.
12. Run $design-critic and $ai-smell-detector as independent review passes. Do not defend implementation choices merely because you made them.
13. Fix high-leverage root causes, re-render, and re-score.
14. Run $a11y-performance. Release only when hard gates pass and WDX score meets the configured threshold.
15. Use $continuous-learning to propose reusable improvements discovered during the project; do not silently modify core skills.

DESIGN STANDARD
- Strong point of view, not trend collage.
- Composition has tension/release and intentional density changes.
- Typography is a brand and hierarchy system, not a font choice.
- Imagery has art direction and deliberate cropping.
- Motion has purpose: feedback, orientation, continuity, hierarchy, storytelling or personality.
- One strong signature moment is preferred over constant animation.
- Component registries are raw materials, never the final design language.
- Critical UX must work with keyboard, reduced motion, slow networks and without decorative 3D.

FINAL RESPONSE
Report:
- selected design direction and why;
- implementation/tool choices and why;
- WDX score by category;
- hard-gate results;
- remaining tradeoffs;
- files changed and validation commands run.
```
