# Public launch kit

Use one channel at a time, answer every substantive reply, and record the final URL in `docs/growth-launch-plan.md`. Do not paste identical copy across communities or ask for empty upvotes.

Canonical channel status lives in `config/distribution.json` and is validated against the growth log and README. X, Threads, Reddit, and the Product Hunt launch page are recorded there; Show HN remains pending until the owner completes account setup.

## Core facts

- Open source, MIT licensed, version 0.2.0.
- One orchestrator plus 16 specialist skills.
- Installs into Codex, Claude Code, Cursor, GitHub Copilot, OpenCode, or all declared targets.
- Two deliberately different internal experiments; no external benchmark win claimed.
- Browser QA covers representative viewports, keyboard use, axe, overflow, console errors, reduced motion, and no-JavaScript survival.
- Daily evolution creates reviewable proposals; it cannot silently rewrite core skills.

## Show HN

Title:

> Show HN: An open design OS that makes coding agents prove the interface they ship

Body:

> I built World-Class Web Design OS because agent-made sites often jump from a vague style prompt straight to implementation. It is a set of 17 installable skills that routes a coding agent through discovery, art direction, design systems, implementation, an independent critique pass, accessibility, and rendered browser QA.
>
> The interesting constraint is that it does not prescribe a house style. The repository includes two intentionally different test cases—an editorial hospitality experience and an industrial commerce site—and labels its own scores as internal evidence, not market validation.
>
> Install: `npx --yes github:Lrinvl1203/world-class-web-design-os install --agent codex`
>
> I also published a Same Brief Challenge so anyone can compare it against their normal workflow with the same inputs and publish negative results. I would value feedback on the routing architecture, benchmark protocol, and whether the quality gates catch the failures you see in real agent work.

## Reddit: r/OpenAIcodex or r/codex

Title:

> I turned my web-design workflow into 17 Codex skills, then added independent critique and browser release gates

Body:

> I kept seeing the same failure mode: a coding agent receives “make it premium,” assembles familiar cards and gradients, and calls a desktop screenshot done.
>
> This open-source project adds a small router and 16 specialist skills for discovery, reference analysis, art direction, interaction/motion decisions, responsive recomposition, independent critique, AI-smell detection, accessibility, and Playwright QA. Broad website requests start at the orchestrator automatically after installation.
>
> The repo includes an 18-second demo, two contrasting test sites, the validation suite, and a public Same Brief Challenge. The included 92.8 and 91.8 scores are explicitly internal; there is no claim of external validation yet.
>
> One-line install: `npx --yes github:Lrinvl1203/world-class-web-design-os install --agent codex`
>
> Repo: https://github.com/Lrinvl1203/world-class-web-design-os
>
> I would especially like critical feedback from people already using project rules or skills: what is missing, what is too prescriptive, and which failure should become a regression test?

## X

> I open-sourced the web-design workflow I wanted coding agents to follow.
>
> 17 installable skills. One orchestrator. Separate build and critique passes. Real browser gates for keyboard, axe, overflow, console errors, reduced motion, and responsive states.
>
> No house style. No “world-class” outcome claim. Two contrasting demos and a public same-brief challenge.
>
> https://github.com/Lrinvl1203/world-class-web-design-os

Attach `site/assets/web-design-os-demo-4x3.mp4`.

## Threads

> I built an open-source “web design OS” for coding agents—not a component library and not a pack of aesthetic prompts.
>
> It makes the agent resolve the job and audience first, choose a point of view and an anti-direction, build semantically, recompose for mobile, then survive a separate design critique and real browser QA.
>
> The repo includes two deliberately different outputs and a same-brief challenge so the claims can be tested publicly. I’d love the sharp version of your feedback: which agent-made web failure should it catch next?
>
> https://github.com/Lrinvl1203/world-class-web-design-os

## Product Hunt

Name: World-Class Web Design OS

Tagline: An evidence-led design workflow for coding agents

Description:

> Install a complete web-design operating system into your coding agent. It routes broad website work through discovery, art direction, design systems, interaction and motion decisions, semantic implementation, responsive recomposition, independent critique, accessibility, and rendered QA. Outputs are not forced into a house style, and daily learning can propose improvements without silently changing core skills.

Maker comment:

> I built this after watching capable coding agents skip the hard design decisions and optimize for a plausible first screenshot. The project is intentionally opinionated about process and honest about evidence: the included scores are internal, the browser gates are reproducible, and the external benchmark is still open. I would love builders to run the Same Brief Challenge and publish the failures as well as the wins.

## Launch media

- 18-second 4:3 MP4: `site/assets/web-design-os-demo-4x3.mp4`
- Animated preview: `site/assets/web-design-os-demo.webp`
- Poster: `site/assets/web-design-os-demo-poster.jpg`
- 1280×640 social card: `site/assets/social-preview.jpg`
- Live overview: https://lrinvl1203.github.io/world-class-web-design-os/
- Benchmark: https://github.com/Lrinvl1203/world-class-web-design-os/blob/main/BENCHMARK.md
