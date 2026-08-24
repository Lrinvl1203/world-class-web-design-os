# 10K growth system

This document turns the 10,000-star ambition into a repeatable operating system. It is not a forecast or a promise. Stars are a discovery signal; successful installs, independent builds, recurring users, and contributors are stronger evidence of usefulness.

## Current-position baseline — 2026-08-17

- World-Class Web Design OS: 5 stars, including the owner.
- UI UX Pro Max: approximately 117K stars.
- MengTo/Skills: approximately 4.8K stars.
- The universal `skills` CLI discovered all 17 local skills, but the dated baseline search returned no public result.
- GitHub traffic is moving slowly while external builds, forks, replies, and star conversion remain near zero.

Reaching 10K from 5 requires 9,995 additional stars. That is roughly 27 net stars per day for one year or 14 per day for two years. Repeating launch posts cannot sustain that rate. Distribution, proof, education, and community must compound together.

### Measured update — 2026-08-24

- The repository has 7 stars, 0 forks, and 0 watchers.
- Rolling GitHub traffic reports 159 views from 96 unique visitors and 436 clones from 130 unique cloners. Clone traffic is unattributed and may include CI, bots, repeated checkouts, or human evaluation; it is not install evidence.
- `skills find web-design-orchestrator --owner Lrinvl1203` now returns the public skill page with one indexed install.
- Verified adoption remains 0/10 reproducible external builds and 0/2 independent comparisons. These gates, rather than clone counts, are the current constraint.

## Positioning

The category is not “more design prompts.” The category is:

> A self-improving, evidence-led web-design operating system for non-designers who can generate a front end but cannot reliably judge why it feels wrong.

The supportable difference is the governed loop across discovery, art direction, components, interaction, motion, justified 3D/WebGL, responsive recomposition, independent critique, AI-smell detection, accessibility, and rendered browser QA. Do not claim universal superiority over UI UX Pro Max, MengTo/Skills, or any external benchmark until reproducible third-party evidence supports it.

## The compounding loop

1. Find one real UI failure or non-designer question.
2. Reproduce it with a fixed brief, assets, model, and time budget.
3. Build or repair it with the OS and retain the failures, prompts, and QA evidence.
4. Publish the useful lesson natively in the community where the question appeared.
5. Turn the same evidence into a repository case, long video, short clip, screenshot carousel, and discussion prompt.
6. Invite a build, failure report, or comparison; adopt validated defects as regression tests.

One experiment should create several channel-native artifacts. Identical cross-posted copy is not a content system.

The Monday workflow now operationalizes this loop. `npm run growth:propagate` reads the private weekly evidence review, the controlled strategy, verified performance observations, and reviewed local case seeds. It creates a private channel-native propagation plan and JSON decision record. It does not publish anything; approved URLs and metrics must be recorded in `marketing/growth-experiments.json` before they influence a later decision.

Verified external use is tracked separately in `marketing/adoption-evidence.json`. Only unique records with `status: "verified"` and an HTTPS evidence URL count; external builds must also use `type: "external_build"` and `reproducible: true`. Independent comparisons use `type: "independent_comparison"`. Pending, duplicate, invalid, or self-asserted records remain visible as review work but do not advance the stage gate.

## Five growth stages

### 0–99 stars: proof and activation

The project is here now. The objective is not broad awareness; it is ten strangers completing discovery → install → invocation → result → share without maintainer help.

- Restore search visibility on `skills.sh` and verify each public skill page and security audit.
- Recruit ten public design partners, prioritizing non-developer vibe coders with real projects.
- Publish two same-brief comparisons and three full build recordings, including weak or partial results.
- Give each external build a stable case URL, screenshots, prompt, environment, QA evidence, and limitation note.
- Repair recurring installation and first-run failures before increasing promotion frequency.

Exit gate: ten reproducible external builds, two independent comparisons, and searchable skill-directory listings.

### 100–999 stars: category ownership

- Publish a recurring “Why this AI UI feels wrong” teardown series.
- Release one evidence-bearing artifact per week: a build, failure, regression, benchmark, or contributor story.
- Partner with small creators and communities through useful demonstrations, not paid or reciprocal stars.
- Add English documentation/video captions for every high-performing Korean artifact.
- Earn inclusion in relevant curation lists and agent-skill discovery surfaces.

### 1,000–2,999 stars: community flywheel

- Make showcase submission, contributor onboarding, and support response independently usable.
- Feature community builds and contributors prominently on the site and release notes.
- Run a quarterly same-brief challenge with public rules and negative-result acceptance.
- Add integrations only when repeated user evidence proves the demand.

### 3,000–9,999 stars: ecosystem distribution

- Become a standard install option in agent-skill packs, tutorials, starter kits, and workshops.
- Publish a stable benchmark dataset and invite independent maintainers to reproduce it.
- Coordinate release moments around meaningful compatibility or evidence milestones.
- Localize only the languages that have demonstrated traffic or contributor demand.

### 10,000+: stewardship

At this point the job changes from attention generation to trust, compatibility, governance, and contributor experience.

## Content portfolio

Use the mix in `config/growth-strategy.json` over a rolling month:

| Share | Content type | Link/CTA rule |
|---:|---|---|
| 35% | Native education: diagnosis checklists, teardown principles, prompt mistakes | Usually no link |
| 25% | Build/failure logs: what broke, what the QA caught, what changed | Link only to evidence when useful |
| 20% | Visual proof: before/after, motion, 3D, mobile, accessibility | Direct demo link is appropriate |
| 10% | Community questions and tester requests | State that the author built the project |
| 10% | Releases and direct calls to install/star | Ask after delivering value |

“Quiet” distribution means being useful without forcing a link. It never means pretending to be an unrelated user. When the repository is linked or recommended, disclose the creator relationship plainly: “I built this,” “we tested this,” or equivalent.

## Channel playbooks

### Threads

- Publish 2–5 original posts per week; include at least one weekend post when there is useful material.
- Spend more time in relevant replies than in promotional posts. Join conversations with a complete answer; link only when the project directly solves the stated problem.
- Prefer text plus a video, image, or carousel with context. Add a relevant topic tag when available.
- Rotate six modes: lesson, failure, before/after, opinion, request, release.
- Use Korean for the existing audience and test one English-native artifact per week. Do not machine-translate the same post into a duplicate thread.

### X

- Publish two or three English-native evidence posts per week.
- Contribute thoughtful replies to relevant AI coding, frontend, accessibility, and design-engineering conversations without hijacking them.
- Lead with the artifact or diagnosis, not the repository name. Place the link after the value is clear.
- Reuse a case only when the angle changes materially: design diagnosis, implementation, motion, mobile, QA, or learning.

### Reddit

- Read each community's current rules before participating.
- Keep at least 90% of participation useful and non-promotional where the community uses that convention.
- Never mass-post, automate comments, send unsolicited DMs, or paste the same launch copy across subreddits.
- Ask moderators before posting when rules are ambiguous.
- Return to answer every substantive question before using another subreddit.

### GitHub and skill directories

- Make `skills.sh` search/index visibility a release gate, not a marketing afterthought.
- Keep installation, doctor, update, security, contribution, benchmark, and showcase paths reproducible.
- Use Discussions for builds and failures; use Issues for defects and structured benchmark submissions.
- Follow up on unchanged curation PRs no more than once in seven days.
- Do not create fake installs, stars, forks, comments, or accounts.

### Product Hunt and launches

- Treat the existing page as durable social proof, not a channel for repeated relaunches.
- Relaunch only for a material version with new external proof or compatibility, and follow the platform's current rules.

Hacker News remains intentionally excluded unless the owner explicitly reverses that decision.

## YouTube system

YouTube should show the complete transformation, not act as a talking-head advertisement.

### Flagship series

Working title: **Can a non-designer ship this?**

1. One sentence to a finished, tested landing page.
2. Same brief: default agent workflow vs Web Design OS.
3. Why this AI-generated site feels wrong — live critique and repair.
4. Motion that communicates vs motion that decorates.
5. When 3D/WebGL earns its performance cost.
6. Desktop looked fine; mobile exposed the design failure.
7. Accessibility QA caught what the screenshot missed.
8. A real subscriber's project, including failures and manual corrections.

### Format

- Long form: one 8–15 minute implementation video every two weeks.
- Shorts: two 20–45 second clips from each build, with the result visible in the first five seconds.
- Open on the finished interaction or the visible defect, then explain the brief.
- Keep the prompt, tool/version, elapsed time, manual interventions, and failed attempts on screen.
- Put the install command and tested project link in the first two description lines.
- Pin one concrete question: “Which screen or failure should become the next regression test?”
- Add accurate captions. Test English narration or a separate English voice track on four episodes before deciding whether to split channels.
- For long-form videos, test up to three genuinely different thumbnails when YouTube Studio makes Test & Compare available.

### Video decision rules

- Fewer than 100 impressions: distribution/topic problem; do not blame the thumbnail yet.
- At least 100 impressions and CTR below 3%: revise the title/thumbnail promise.
- Fewer than 50% still watching at 30 seconds: the opening failed to match the title/thumbnail or delayed the result.
- Good CTR but weak retention: fix the video, not the packaging.
- Strong retention spike: move that type of proof earlier in the next video.
- Do not chase daily uploads. Quality and audience fit outrank upload frequency.

## Weekly operating rhythm

| Day | Required work | Optional public artifact |
|---|---|---|
| Monday | Review stars, unique visitors, referrers, installs, external builds, post/video metrics | One transparent weekly lesson |
| Tuesday | Reproduce one real UI failure or record one build | Behind-the-scenes screenshot |
| Wednesday | Publish one English-native educational or evidence post | X/Threads/DEV, channel-specific |
| Thursday | Finish the long video or a short proof clip | YouTube or Threads video |
| Friday | Reply to community questions and support external testers | No required self-link |
| Saturday | Publish a visual build, open request, or short experiment | Weekend Threads post |
| Sunday | Record what worked, what failed, and what to stop | No generic reminder post |

This is a capacity ceiling, not a quota. Skip weak posts rather than manufacture activity.

## Measurement

| Funnel stage | Primary signals | Failure interpretation |
|---|---|---|
| Discovery | GitHub unique visitors, referrers, skill-directory search/install counts, video impressions | No reach means a distribution or packaging problem |
| Activation | Installer completion, `doctor` pass, first orchestrator invocation | Traffic without activation means onboarding friction |
| Proof | External builds, comparisons, screenshots, benchmark submissions | No proof means claims still depend on the maintainer |
| Conversion | External stars per unique visitor, discussion/issue starts, forks | Traffic without stars means weak trust or relevance |
| Retention | Repeat contributors, update usage, follow-up builds | One-time attention is not a community |

Weekly rules:

- If unique visitors rise for two reviews while stars and builds stay flat, improve first-use proof and onboarding before publishing more promotional copy.
- If one channel produces no measurable repository visits across four evidence-bearing posts, pause it for a month.
- If a channel brings external builds even with low traffic, keep it; artifact quality matters more than raw clicks.
- Promote only evidence that passed the same disclosure, provenance, accessibility, and honesty standards as the repository.

## First 30-day campaign

1. Resolve `skills.sh` search/index visibility and record install counts as a new discovery metric.
2. Recruit ten public build partners with a specific offer: one real page, one recorded workflow, honest publication of both successes and failures.
3. Record the first same-brief YouTube build and cut two Shorts plus one screenshot carousel from it.
4. Publish one English “why AI UI feels wrong” teardown per week with no link in at least half of them.
5. Publish one direct tester request and one transparent release/proof post; do not beg for stars in every artifact.
6. Follow up once on the two open curation PRs, then wait for maintainer response.
7. At day 14 and day 30, stop one tactic, double down on one evidenced channel, and tie one product change to a repeated user problem.

## Source basis

- GitHub Open Source Guides: https://opensource.guide/building-community/
- GitHub community profiles: https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/about-community-profiles-for-public-repositories
- Threads creator guidance: https://about.fb.com/news/2024/10/find-your-community-with-new-threads-educational-insights/
- Threads topics and insights: https://about.fb.com/news/2025/03/new-threads-features-more-personalized-experience-you-control/
- Reddit spam guidance: https://support.reddithelp.com/hc/en-us/articles/360043504051-Spam
- YouTube retention: https://support.google.com/youtube/answer/9314415
- YouTube thumbnail experiments: https://support.google.com/youtube/answer/13861714
- YouTube publishing/performance FAQ: https://support.google.com/youtube/answer/141805
- Skills directory API and ranking surfaces: https://www.skills.sh/docs/api
