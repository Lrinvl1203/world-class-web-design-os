# Controlled daily evolution

This directory receives design signals; it is not an autonomous authority over the core skills.

## Trust boundary

- Remote titles, excerpts, comments, markup, and code are untrusted data. They are never executed or treated as agent instructions.
- The collector stores links, short excerpts, metrics, hashes, and extracted principle hints—not full articles, images, videos, or site copies.
- Official APIs, RSS, and manually curated URLs are supported. Logged-in browser scraping and Terms-of-Service workarounds are not.
- Popularity ranks candidates for inspection. It does not prove usability, originality, accessibility, performance, or transferability.

## Adoption gate

Daily runs may write an inbox record and report. Metric-bearing official API signals use the main score floor. High-trust editorial feeds use a separate lower discovery floor because RSS does not expose engagement metrics, but they become candidates only when their text maps to a locally controlled principle taxonomy. Remote text cannot create its own principle label. A proposal draft is created only when the same controlled principle recurs across at least three independent sources. A proposal must still include:

1. observation and user impact;
2. reusable principle rather than copied styling;
3. provenance and rights notes;
4. a counterexample or misuse condition;
5. one prior and one new regression scenario;
6. skill/Web Design OS patch as a reviewable diff;
7. validator, accessibility, performance, and routing results.

No workflow pushes directly to the default branch, edits a core skill, or self-merges a proposal.

## Weekly evidence review

The `weekly-evidence-review` workflow runs every Monday at 09:10 Asia/Seoul and can also be dispatched manually. It combines:

- the current star, fork, watcher, issue, rolling traffic, clone, and referrer snapshot;
- published, pending, and open-curation distribution state;
- live state for recorded external GitHub pull requests;
- the latest daily design-signal inbox and any threshold-qualified draft proposals;
- repository validation, routing evaluation, and unit-test results.

The resulting Markdown, JSON, snapshot, and comparison state are private GitHub Actions artifacts retained for the repository maximum of 90 days. The previous state is restored through the Actions cache so movement can be reviewed without committing analytics to the public repository.

GitHub's default Actions token can read public repository signals but may receive `403` from the private traffic endpoints. When full view, clone, path, and referrer data is desired, configure the optional `GROWTH_TRAFFIC_TOKEN` repository secret with the minimum read permission required for repository traffic. Without it, those values remain explicitly `Unavailable`; the workflow still succeeds and never converts a denied metric into zero.

An owner can capture the same metrics locally without copying a broad workstation credential into Actions:

```text
npm run growth:snapshot:owner
```

That explicit command reads the authenticated GitHub CLI token in memory, writes only the JSON snapshot, and never prints or stores the token. Do not populate `GROWTH_TRAFFIC_TOKEN` with a broad classic `repo` token merely to remove the warning; create a fine-grained, least-privilege credential when unattended traffic collection is required.

This review is deterministic decision support. It may recommend the next evidence-producing action, but it never edits skills, sends posts or reminders, commits, opens pull requests, or merges changes. A substantive update still requires an intentional review, regression evidence, the normal validation suite, and a separate PR.

After the weekly review, `scripts/growth/propagation-plan.mjs` selects one reviewed local case and one content mode. It uses the manually verified observations in `marketing/growth-experiments.json` to explore under-tested modes before favoring stronger evidence. The resulting private Markdown/JSON artifacts multiply one experiment into channel-native YouTube, short-video, Threads, X, and community-participation briefs. They are drafts only: the workflow cannot publish, reply, DM, create accounts, hide creator affiliation, buy engagement, or change the product. Final copy, media, channel, and timing require a human decision.

GitHub Actions restores the most recent inbox cache so the collector can compare the configured rolling 30-day evidence window. URLs are deduplicated, preventing a repeatedly fetched or multiply submitted item from pretending to be independent evidence.

## Commands

```text
npm run evolve:daily
npm run web-design-os -- evolve --offline
npm run growth:snapshot
npm run weekly:review
npm run growth:propagate
```

Optional environment variables:

- `YOUTUBE_API_KEY` enables official YouTube search/statistics collection.
- `THREADS_ACCESS_TOKEN` and comma-separated `THREADS_POST_IDS` enable insights for posts the token is permitted to inspect.

Threads-wide popularity discovery is intentionally not implemented through scraping. Add public candidates to `manual-signals.json` or use an approved official endpoint when the account and permissions support it.

The no-secret baseline uses four independent public feeds: Codrops, Smashing Magazine, web.dev, and the MDN Blog. Their titles and short excerpts remain untrusted data. The local taxonomy can nominate them for review under categories such as purposeful motion, accessible interaction, performance budgets, creative 3D, design systems, responsive recomposition, editorial structure, and interaction as story; it cannot execute or copy remote instructions.
