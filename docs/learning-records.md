# Continuous-learning records

## Recurring improvement needs comparison evidence, not autonomous mutation

- **Date / project:** 2026-08-11 / World-Class Web Design OS weekly maintenance
- **Evidence:** Daily design-signal collection and daily growth snapshots existed independently, but there was no weekly comparison state, consolidated decision queue, or reliable way to distinguish a first observation from a trend. The owner requested weekly ongoing updates.
- **Severity:** moderate maintenance and expectation risk
- **Classification:** missing rule and automation gap
- **Root cause:** Collection cadence was defined, while review cadence and cross-signal synthesis were left to ad hoc sessions.
- **Generalizable principle:** Recurring improvement automation should compare current and prior evidence, label rolling metrics honestly, and produce a review queue; it must not imply that popularity proves quality or that unattended automation has authority to edit and merge core behavior.
- **Countermeasure:** Add a Monday weekly workflow, cached comparison state, deterministic Markdown/JSON report, external curation-PR checks, and private 90-day artifacts. Keep posting, skill edits, commits, PR creation, and merging outside the scheduled job.
- **Positive regression:** A second weekly run with higher traffic and unchanged stars must recommend improving third-party proof or successful-use onboarding while reporting exact directional deltas.
- **Negative regression:** A first run or an API-denied metric must remain baseline/unavailable rather than becoming a fabricated zero, trend, or conversion claim.
- **Validation:** Five weekly-review regressions cover comparison, traffic-without-star growth, unavailable metrics, latest-evolution selection, and read-only workflow policy. A live authenticated dry run recorded 2 stars, 41 rolling views, 120 rolling clones, five referrers, two open curation PRs, one design signal, and zero proposals without modifying public state. The first GitHub Actions run succeeded in 20 seconds, uploaded the full evidence package, restored/saved both caches, collected 11 live signals, and preserved default-token traffic `403` values as unavailable. Its retention warning also proved the repository maximum is 90 days, so workflow and documentation were corrected to match.
- **Decision:** adopted as repository automation. No core skill, routing, or Design Quality rule changed.

## Launch distribution needs one validated source of truth

- **Date / project:** 2026-08-11 / World-Class Web Design OS public distribution
- **Evidence:** After X and Product Hunt authentication completed, the public URLs were added to the growth log and handoff, while the launch checklist and launch kit still described those channels as pending. The Product Hunt time was also written as `12:01 PT`, which was ambiguous and inconsistent with the site's `12:01am PT` confirmation.
- **Severity:** moderate operational trust risk
- **Classification:** missing rule
- **Root cause:** Channel state was maintained as prose in several files without a canonical machine-readable record or consistency gate.
- **Generalizable principle:** Public distribution events need a single manifest with explicit status, canonical URL, date/time zone, and blocker fields; human-facing summaries should be validated projections of that record.
- **Countermeasure:** Add `config/distribution.json`, validate active URLs against the growth log, require featured links in the README, allow pending channels only with an explicit blocker, and include the manifest in the private daily growth snapshot.
- **Positive regression:** Publishing or scheduling a new channel while forgetting the README or growth log must fail CI with the missing location named.
- **Negative regression:** A channel that is intentionally pending must remain valid without a fabricated URL when it records a concrete blocker and is not featured.
- **Validation:** Repository-valid, duplicate-ID, and pending-without-blocker scenarios are covered by unit tests; the validator is part of `npm run validate`, and CI now runs the unit suite.
- **Decision:** adopted as repository launch governance. No core design skill or scoring rule changed.

## Launch media must separate poster-first loading from playback evidence

- **Date / project:** 2026-08-11 / World-Class Web Design OS distribution launch
- **Evidence:** Adding an inline 18-second MP4 pushed two existing `loading="lazy"` experiment images farther below the fold. The launch test then timed out while calling `decode()` on images the browser had not yet promoted for loading. The first video configuration also used metadata preloading even though playback was not part of the initial-content path.
- **Severity:** moderate
- **Classification:** QA blind spot with an execution-level media-loading assumption
- **Root cause:** The test assumed all lazy images would begin loading after navigation, and the page treated video metadata as initial content rather than user-requested enhancement.
- **Generalizable principle:** A proof video should reserve space and expose an accessible poster without entering the initial transfer path; tests that require downstream lazy media must explicitly bring each asset into its loading range before decoding it.
- **Countermeasure:** Set noncritical proof video to `preload="none"`, provide a poster and textual description, scroll each asserted lazy image into view before `decode()`, and keep playback validation separate from initial-load budgets.
- **Positive regression:** A long launch page with an inline demo video and lazy case-study images must complete browser gates without downloading the MP4 before user intent or hanging on unrequested images.
- **Negative regression:** A video whose first frame is itself critical instructional content must not be blindly deferred; its loading and alternative-content plan requires a task-specific decision.
- **Validation:** The original five launch-site tests timed out; after the countermeasure, all 15 browser cases passed in 70 seconds across 320, 375, 768, 1440, and 1920 px, including the 500 KB initial transfer budget and no-JavaScript survival.
- **Decision:** adopted in the launch implementation and regression test. No core-skill edit was needed because `$visual-qa` already requires lazy-media promotion and settled capture state.

## Visual baselines must prove capture readiness

- **Date / project:** 2026-08-09 / Nocturne 24 Phase C
- **Evidence:** The original full-page captures passed while offscreen `.reveal` sections remained at `opacity: 0` because the capture path did not trigger their observer. After visibility assertions were added, a 1920 px comparison also exposed lazy-image decode timing as a second nondeterministic input.
- **Severity:** major
- **Classification:** QA blind spot with an execution-level capture defect
- **Root cause:** Pixel comparison was treated as the first assertion instead of the last. The suite had no preconditions for critical-content visibility or settled media.
- **Generalizable principle:** A visual baseline is admissible only after the test proves the intended page state is complete and essential content remains available without motion.
- **Countermeasure:** Update `$visual-qa` to require font/media settling, deterministic motion, and critical-content visibility checks before baseline acceptance. The Nocturne suite now performs these checks and the capture script decodes images before full-page capture.
- **Positive regression:** Nocturne's observer-driven reveal sections and lazy editorial images must produce complete, stable captures at all six configured viewports.
- **Negative regression:** Purpose-built loading, skeleton, and empty-state tests remain valid when that incomplete state is explicitly the intended capture state.
- **Validation:** The new visibility assertion would fail the prior hidden-content state; the media-settling change removed the reproduced 1920 px diff; six viewports then passed twice consecutively.
- **Decision:** adopted in `$visual-qa`; no new skill or architecture branch required.

## Automated accessibility must exercise real archetypes

- **Date / project:** 2026-08-09 / daily-evolution and benchmark integration
- **Evidence:** Adding axe to real Chromium runs exposed small-text contrast failures in Nocturne and both token-role contrast plus invalid definition-list structure in LINEHOLD, although prior visual/task checks were green.
- **Severity:** major
- **Classification:** release-gate coverage gap
- **Root cause:** Manual contrast samples and interaction tests did not cover every rendered text role or semantic container. LINEHOLD also reused one orange value for foreground-on-paper and background-behind-carbon, two incompatible contrast jobs.
- **Generalizable principle:** Automated accessibility checks must run against representative rendered archetypes, and color tokens must encode surface role when one value cannot satisfy both foreground and background contrast relationships.
- **Countermeasure:** Add Playwright + axe serious/critical checks at edge-mobile and desktop to CI; preserve the existing visual matrix; split incompatible color roles; require semantic structure fixes rather than audit exclusions. Allow only narrow documented exclusions for truly decorative, hidden-from-AT artwork.
- **Positive regression:** Nocturne and LINEHOLD must both pass axe, overflow, console, dead-link, reduced-motion, and heading visibility gates at 320 and 1440 widths.
- **Negative regression:** Decorative aria-hidden watermark artwork may retain low-contrast material treatment when it is excluded narrowly; information-bearing text and controls may not use that exception.
- **Validation:** The gate failed on both inherited archetypes, the source defects were corrected, and all four browser runs passed. Routing evals 10/10, evolution tests 6/6, all 17 skills, and the sample Design Quality report also passed.
- **Decision:** adopted in CI and `$a11y-performance`/`$visual-qa` execution; no Web Design OS threshold or weight changed.

## Public-launch review must separate copyright provenance from naming clearance

- **Date / project:** 2026-08-10 / World-Class Web Design OS public launch
- **Evidence:** A current-tree provenance review found no bundled third-party screenshots, fonts, article copies, or stock assets, but exact and same-field searches found an active `Vanta Forge` site and existing web-design uses of `WDX`.
- **Severity:** major public-launch risk
- **Classification:** QA blind spot
- **Root cause:** The launch checklist covered license ownership and tracked-file review but did not independently test public-facing names for source-confusion risk.
- **Generalizable principle:** Copyright provenance, open-source licensing, and trademark/source-confusion are different gates. A clean content audit does not clear a product, CLI, metric, or fictional demo name.
- **Countermeasure:** Rename material current-tree collisions, regenerate text baked into screenshots and launch assets, publish a concise `NOTICE.md` plus provenance record, and search exact and same-field uses before public exposure. Formal commercial trademark clearance remains outside this automated check.
- **Positive regression:** A public repository with a fictional demo brand and a short CLI alias must flag an exact same-field name collision before visibility changes.
- **Negative regression:** Common descriptive terms or unrelated technical acronyms should not trigger automatic renaming without related-goods, geography, and confusion context.
- **Validation:** `WDX` became descriptive `Design Quality`/`World-Class Web Design OS`; `Vanta Forge` became `Linehold Forge`; all legacy-name searches are empty; the package smoke install is 17/17 READY; all validators, unit tests, 15 launch-browser cases, and both Linehold hard-gate cases pass.
- **Decision:** adopted as launch process evidence and global project-management guidance; no autonomous core-skill rewrite.
