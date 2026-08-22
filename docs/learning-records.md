# Continuous-learning records

## Deployment QA must preserve the configured base path

- **Date / project:** 2026-08-15 / GitHub Pages post-deploy verification
- **Observation/evidence:** The deployed launch page and all new assets returned HTTP 200 under `/world-class-web-design-os/`, but the first live Playwright run navigated with `page.goto('/')`. URL resolution discarded the repository subpath and audited GitHub Pages' domain-root 404 instead of the product.
- **Severity/impact:** major QA false failure; a successful deployment appeared inaccessible and its unrelated 404 page produced misleading accessibility defects.
- **Classification:** QA blind spot
- **Root cause:** Local preview always served at the origin root, so an origin-absolute test path was never challenged by a subpath deployment.
- **Generalizable principle:** When `baseURL` may include a path prefix, navigate to `./` or an explicitly joined application route. Do not let a test silently replace the configured base path with the host root.
- **Proposed file/section change:** Make launch and release-gate entry navigation base-path-relative.
- **Positive regression scenario:** The same suite audits both `http://127.0.0.1:4175/` and `https://example.test/repository-name/` without route overrides.
- **Negative/regression-risk scenario:** A product intentionally mounted at the domain root or a test specifically exercising `/` may keep an absolute route, but that intent must be explicit.
- **Validation performed:** The complete local matrix still passes 15/15. The deployed Pages URL passes 6/6 launch and hard-gate checks at 320 and 1440 px, including no-JavaScript survival.
- **Decision:** adopted in repository QA; retain as regression evidence before proposing a core Visual QA starter change.

## Editorial discovery needs a controlled path when engagement metrics do not exist

- **Date / project:** 2026-08-15 / controlled daily evolution
- **Observation/evidence:** The original score floor was calibrated for official social metrics. RSS sources expose no reliable views, likes, or shares, so even trusted editorial material could never qualify for cross-source review; a live four-feed run later collected 81 sanitized signals but correctly produced no proposal until three independent publications recur around the same controlled principle.
- **Severity/impact:** moderate learning-coverage defect; the automation ran, but its no-secret baseline could not contribute evidence to the proposal gate.
- **Classification:** missing rule
- **Root cause:** One candidate threshold was asked to compare unlike evidence: engagement-bearing platform records and engagement-free editorial feeds.
- **Generalizable principle:** Give high-trust editorial sources a separate discovery floor only when their untrusted text maps to a locally owned taxonomy. Remote text may nominate an existing principle but may not create a rule, execute instructions, or bypass the independent-source and human-adoption gates.
- **Proposed file/section change:** Add `minimumEditorialSignalScore`, a local topic taxonomy, and verified Smashing Magazine, web.dev, and MDN feeds while preserving the three-independent-source proposal threshold.
- **Positive regression scenario:** Three independent editorial publications that repeatedly discuss purposeful motion can draft a review proposal even without engagement metrics.
- **Negative/regression-risk scenario:** One popular or malicious feed item, or an item that maps to no local principle, must remain a signal and never mutate a skill.
- **Validation performed:** Added three unit regressions for taxonomy-constrained qualification and independent-source recurrence; 20 unit tests pass. A live run collected 81 signals from Codrops, Smashing Magazine, web.dev, MDN, and curated links, stored only sanitized metadata/excerpts, reported missing optional YouTube/Threads credentials explicitly, and created zero unsupported proposals.
- **Decision:** adopted in repository automation; no core skill or rubric mutation.

## Narrow command blocks must reflow before they become keyboard-only scroll regions

- **Date / project:** 2026-08-15 / non-designer first-use path
- **Observation/evidence:** The new terminal command used `white-space: nowrap` with horizontal scrolling. Axe flagged the region as serious at 320, 375, 1440, and 1920 px because Safari keyboard users could not focus the scrollable code element.
- **Severity/impact:** serious accessibility release defect; the primary install instruction could become partially unreachable without a pointer.
- **Classification:** execution error caught by rendered QA
- **Root cause:** A desktop-oriented code presentation rule was reused without deciding whether exact single-line appearance was more important than narrow-screen readability.
- **Generalizable principle:** For copyable commands, preserve the exact text in the DOM and clipboard while allowing visual wrapping at narrow widths. If scrolling is genuinely required, make the region keyboard-focusable and visibly focused.
- **Proposed file/section change:** Use `white-space: pre-wrap` plus `overflow-wrap: anywhere` for the first-run command; retain the adjacent copy control and truthful clipboard fallback.
- **Positive regression scenario:** The installer remains fully readable and copyable at 320 px without a horizontal scroll region.
- **Negative/regression-risk scenario:** Logs, tables, or code where line position is semantically important may retain scrolling, but must provide keyboard access and a clear focus state.
- **Validation performed:** The initial browser matrix failed 8 accessibility cases plus one clipboard-expectation case. After the source and test corrections, all 15 launch-site cases passed across 320, 375, 768, 1440, and 1920 px with zero serious/critical axe findings, no overflow, no console errors, and no-JavaScript survival.
- **Decision:** adopted in the launch implementation; no core skill edit because the existing accessibility gate already specifies keyboard-accessible controls and reflow.

## Owner analytics should not turn a broad workstation token into an unattended secret

- **Date / project:** 2026-08-15 / growth measurement
- **Observation/evidence:** The scheduled GitHub token can read public repository metadata but receives `403` for private traffic endpoints. The authenticated workstation token can read traffic, but it has broader scopes than a recurring analytics job needs.
- **Severity/impact:** moderate security and measurement risk.
- **Classification:** missing operational boundary
- **Root cause:** The workflow documented an optional traffic secret but offered no safe owner-only path, creating pressure to paste a broad existing credential into Actions.
- **Generalizable principle:** Separate explicit local owner capture from unattended collection. Read a workstation credential only in memory for the requested run, never print or persist it, and require a newly created least-privilege credential for scheduled automation.
- **Proposed file/section change:** Add `npm run growth:snapshot:owner`, explicit traffic-access status/remediation, and documentation that rejects broad classic-token reuse.
- **Positive regression scenario:** An authenticated owner can capture exact traffic locally while the scheduled workflow remains green and labels unavailable traffic honestly.
- **Negative/regression-risk scenario:** A denied or absent token must not become a fabricated zero, and a broad token must not be copied into repository secrets merely to silence a warning.
- **Validation performed:** Unit coverage preserves unavailable-as-unavailable behavior and remediation copy. A live owner run reported traffic access as available and captured 78 views/55 unique visitors plus 200 clones/60 unique cloners without printing or storing the token.
- **Decision:** adopted as repository operations guidance.

## Full-page captures must expose visually-hidden utility controls only in their active state

- **Date / project:** 2026-08-14 / three public reference cases
- **Observation/evidence:** All 18 functional and accessibility runs passed, but independent review of full-page baselines showed the skip link painted inside the page at the viewport position Playwright had scrolled to for the interaction assertion. A transform-only off-canvas hiding technique was not stable in full-page capture composition.
- **Severity/impact:** moderate visual-evidence defect; the released UI remained operable, but the accepted screenshots misrepresented the intended visual state.
- **Classification:** QA blind spot and execution error
- **Root cause:** The baseline suite proved semantics, focus behavior, and overflow but did not assert that inactive utility controls were visually absent before accepting the screenshot. Transform-only hiding also depended on fixed-position capture behavior.
- **Generalizable principle:** Full-page evidence should verify both sides of conditional utility UI: visually absent while inactive and visible/usable when focused. Use robust clipping/size containment for visually hidden controls rather than relying only on translated fixed positioning.
- **Proposed file/section change:** Trial an explicit inactive/active utility-control assertion in future visual-QA starter updates after recurrence in another unrelated project; do not change the core skill from this single project.
- **Positive regression scenario:** A long page captured after an interaction scroll should not show its inactive skip link, while keyboard focus on that link should expose it at the viewport edge.
- **Negative/regression-risk scenario:** A deliberately persistent accessibility or status control must not be hidden merely because it is visually utilitarian.
- **Validation performed:** The three implementations now use clipped 1 px inactive states and restore full size on focus. All 18 baselines were regenerated and passed again; desktop/mobile screenshots were re-inspected.
- **Decision:** trial as project evidence; no core-skill mutation.

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

## Growth multiplication must learn from verified outcomes without gaining publication authority

- **Date / project:** 2026-08-17 / World-Class Web Design OS 10K growth system
- **Observation/evidence:** Daily design evolution and weekly repository reviews could collect and compare evidence, but one completed experiment still depended on an ad hoc session to become distinct YouTube, short-video, Threads, X, and community artifacts. Repeating launch copy produced views without external builds or meaningful star conversion.
- **Severity/impact:** major growth-system gap; useful project evidence did not compound, while naive automation would create spam and trust risk.
- **Classification:** missing rule and automation gap
- **Root cause:** The project separated learning from public mutation correctly but had no governed intermediate layer that converted reviewed evidence into channel-native briefs or learned which content mode deserved another test.
- **Generalizable principle:** Safe content propagation should multiply one reproducible source experiment into distinct native artifacts, rank tactics by verified downstream evidence, explore under-tested modes before exploiting apparent winners, and retain human publication authority.
- **Proposed file/section change:** Add reviewed content seeds, a verified performance ledger, a deterministic propagation planner, a private weekly artifact, stage-aware CTAs, and explicit prohibitions on auto-posting, hidden affiliation, fake engagement, unsolicited DMs, or core-skill mutation.
- **Positive regression scenario:** With three observed Threads artifacts and no education/build-log sample, the planner must select an under-tested non-promotional mode, generate multiple channel briefs from one reviewed case, and prioritize an external build over an empty star request.
- **Negative/regression-risk scenario:** High impressions from one promotional post must not be treated as design-quality proof, sufficient evidence to abandon exploration, or authority to post automatically.
- **Validation performed:** Three propagation regressions prove external builds outweigh shallow reach, under-tested modes are explored first, and every generated plan remains review-gated. The full unit suite passes 24/24, all 17 skills validate, the Design Quality sample remains 92/100, and a live local run generated the expected Nocturne Concierge weekly plan from the current evidence review.
- **Decision:** adopted as review-only growth automation. No core design skill, scoring weight, public post, account, commit, or merge was changed automatically.

## Community discovery must not turn rank into design authority

- **Date / project:** 2026-08-17 / official Threads design discovery
- **Observation/evidence:** The evolution pipeline could inspect metrics for explicitly listed owned Threads posts, but it could not discover current public design, motion, animation, WebGL, accessibility, responsive, or design-system discussion. Treating a community search result or each author as independent proof would have made popularity easy to mistake for transferable design quality.
- **Severity/impact:** major learning-coverage and evidence-integrity gap; community practice was absent from discovery, while a naive integration could silently overfit the OS to engagement-ranked posts.
- **Classification:** source-coverage gap with adoption-gate risk
- **Root cause:** Threads-wide collection had previously been rejected because browser scraping was not acceptable, and the later official keyword-search capability had not yet been integrated with a community-specific trust model.
- **Generalizable principle:** Community search may broaden discovery only through an authorized official API, bounded requests, sanitized excerpts, a controlled local taxonomy, and source-family independence. Search rank can nominate evidence for review but cannot prove quality or create a design rule by itself.
- **Countermeasure:** Add official TOP/RECENT keyword discovery for six reviewed design topics; keep RECENT discovery-only; allow only taxonomy-mapped TOP results to cross a conservative community floor; group official search, owned insights, and manually reviewed Threads links under one source family; require two other source families before drafting a proposal; add hidden-input owner commands that validate, install, and refresh the GitHub secret without logging it; keep every proposal review-only.
- **Positive regression scenario:** A TOP Threads post about purposeful motion plus matching evidence from two independent publications may create a draft proposal containing regression and rights-review placeholders.
- **Negative/regression-risk scenario:** Ten popular Threads posts, duplicate TOP/RECENT appearances, a malicious instruction inside post text, a non-Threads permalink, or a missing/denied API permission must not create an adopted rule or three-source proposal.
- **Validation performed:** Twelve Threads-specific regressions cover bounded authenticated requests, sanitization, host filtering, deduplication with TOP preservation, missing/denied credentials, controlled candidate qualification, cross-collector source-family independence, manual-queue validation, secure token refresh, and stdin-only GitHub secret installation. The full unit suite passes 35/35, routing passes 10/10, all 17 skills validate, and the configured Design Quality report remains 92/100.
- **Decision:** adopted as optional official-API discovery. No scraping, media copying, core-skill mutation, public posting, commit, or merge occurs inside the scheduled workflow; live collection remains disabled until an owner-authorized Meta token is configured.

## Community discovery must exclude maintainer-authored promotion

- **Date / project:** 2026-08-22 / World-Class Web Design OS Threads discovery
- **Observation/evidence:** The first post-merge weekly run collected 90 signals, including nine official Threads results. All nine were authored by the repository owner, and five crossed the ranked-community candidate floor. Counting those posts as public community discovery would let the project reinforce its own marketing claims.
- **Severity/impact:** major evidence-integrity defect; a working official API path could still create a biased review queue without any external community evidence.
- **Classification:** missing rule and live-validation blind spot
- **Root cause:** The collector bounded, sanitized, ranked, and deduplicated results but did not distinguish maintainer-authored distribution from independent public discussion. The request limit also ended before less-prominent external results could be considered.
- **Generalizable principle:** A project may measure its own posts as distribution outcomes, but self-authored content must not enter the external community-discovery evidence pool. Author exclusions must be explicit, case-insensitive, and source-scoped.
- **Proposed file/section change:** Add a configured `excludeAuthors` list to Threads public discovery, filter matching authors before normalization, raise the still-bounded per-query result window from five to ten, and document the distinction from authorized owned-post insights.
- **Positive regression scenario:** An external designer result and a maintainer result returned by both TOP and RECENT searches must retain the external result once while excluding the maintainer result regardless of username case.
- **Negative/regression-risk scenario:** The exclusion must not suppress unrelated authors, disable authorized owned-post metrics, weaken the three-source proposal gate, or turn an empty external result set into fabricated evidence.
- **Validation performed:** The full unit suite passes 35/35, routing passes 10/10, evolution evaluation passes 15/15, all 17 skills validate, and the configured Design Quality report remains 92/100. A fresh official-API workflow run collected 81 signals: 80 publication records and one manually reviewed community record, with zero Threads records and zero maintainer matches after filtering. The unchanged prior run had collected 90 signals, including nine maintainer-authored Threads records, so the live comparison proves that the exclusion fails closed without fabricating replacement evidence.
- **Decision:** adopted as the public Threads discovery boundary. Owned-post metrics remain available only through the separate authorized insights path; no core-skill mutation or public posting occurs automatically.
