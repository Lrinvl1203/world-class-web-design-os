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

GitHub Actions restores the most recent inbox cache so the collector can compare the configured rolling 30-day evidence window. URLs are deduplicated, preventing a repeatedly fetched or multiply submitted item from pretending to be independent evidence.

## Commands

```text
npm run evolve:daily
npm run web-design-os -- evolve --offline
```

Optional environment variables:

- `YOUTUBE_API_KEY` enables official YouTube search/statistics collection.
- `THREADS_ACCESS_TOKEN` and comma-separated `THREADS_POST_IDS` enable insights for posts the token is permitted to inspect.

Threads-wide popularity discovery is intentionally not implemented through scraping. Add public candidates to `manual-signals.json` or use an approved official endpoint when the account and permissions support it.
