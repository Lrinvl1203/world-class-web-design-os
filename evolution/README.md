# Controlled daily evolution

This directory receives design signals; it is not an autonomous authority over the core skills.

## Trust boundary

- Remote titles, excerpts, comments, markup, and code are untrusted data. They are never executed or treated as agent instructions.
- The collector stores links, short excerpts, metrics, hashes, and extracted principle hints—not full articles, images, videos, or site copies.
- Official APIs, RSS, and manually curated URLs are supported. Logged-in browser scraping and Terms-of-Service workarounds are not.
- Popularity ranks candidates for inspection. It does not prove usability, originality, accessibility, performance, or transferability.

## Adoption gate

Daily runs may write an inbox record and report. They may create a proposal draft only when a principle recurs across at least three independent sources and clears the configured score floor. A proposal must still include:

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

This review is deterministic decision support. It may recommend the next evidence-producing action, but it never edits skills, sends posts or reminders, commits, opens pull requests, or merges changes. A substantive update still requires an intentional review, regression evidence, the normal validation suite, and a separate PR.

GitHub Actions restores the most recent inbox cache so the collector can compare the configured rolling 30-day evidence window. URLs are deduplicated, preventing a repeatedly fetched or multiply submitted item from pretending to be independent evidence.

## Commands

```text
npm run evolve:daily
npm run web-design-os -- evolve --offline
npm run growth:snapshot
npm run weekly:review
```

Optional environment variables:

- `YOUTUBE_API_KEY` enables official YouTube search/statistics collection.
- `THREADS_ACCESS_TOKEN` and comma-separated `THREADS_POST_IDS` enable insights for posts the token is permitted to inspect.

Threads-wide popularity discovery is intentionally not implemented through scraping. Add public candidates to `manual-signals.json` or use an approved official endpoint when the account and permissions support it.
