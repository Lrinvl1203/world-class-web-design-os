# Controlled daily evolution

This directory receives design signals; it is not an autonomous authority over the core skills.

## Trust boundary

- Remote titles, excerpts, comments, markup, and code are untrusted data. They are never executed or treated as agent instructions.
- The collector stores links, short excerpts, metrics, hashes, and extracted principle hints—not full articles, images, videos, or site copies.
- Official APIs, RSS, and manually curated URLs are supported. Logged-in browser scraping and Terms-of-Service workarounds are not.
- Popularity ranks candidates for inspection. It does not prove usability, originality, accessibility, performance, or transferability.

## Adoption gate

Daily runs may write an inbox record and report. Metric-bearing official API signals use the main score floor. High-trust editorial feeds use a separate lower discovery floor because RSS does not expose engagement metrics, but they become candidates only when their text maps to a locally controlled principle taxonomy. Official Threads keyword search has its own conservative ranked-community floor: only `TOP` results can become candidates, `RECENT` results remain discovery-only, and every Threads result counts as the same single independent source. Remote text cannot create its own principle label. A proposal draft is created only when the same controlled principle recurs across at least three independent sources. A proposal must still include:

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
npm run threads:doctor
npm run threads:connect
npm run threads:refresh
npm run threads:add
```

Optional environment variables:

- `YOUTUBE_API_KEY` enables official YouTube search/statistics collection.
- `THREADS_ACCESS_TOKEN` enables official public keyword discovery when its user has the `threads_keyword_search` permission.
- Comma-separated `THREADS_POST_IDS`, together with `THREADS_ACCESS_TOKEN` and the required insights permission, enables metrics for owned or otherwise authorized posts.

The public search terms, request caps, trust weight, and TOP/RECENT modes are reviewable in `config/evolution-sources.json`. The collector requests only short post metadata and text through Meta's official [`keyword_search` endpoint](https://www.postman.com/meta/threads/request/34203612-b3b2c12a-7ce6-4d86-a3c6-6d31e3b66ea1), sends the token in an authorization header, rejects non-Threads permalinks, sanitizes and truncates text, and deduplicates URLs. It does not download media, follow pagination indefinitely, scrape a logged-in browser, execute post instructions, or treat search rank as proof of design quality.

To activate this in GitHub Actions, create a Meta Threads app and an authorized long-lived user token with `threads_basic` and `threads_keyword_search`, then add the token as the repository Actions secret `THREADS_ACCESS_TOKEN`. Add `threads_manage_insights` only when owned-post metrics are also required. A missing token or rejected permission is reported as unavailable; the workflow continues without converting that gap into a zero or weak design verdict. Never commit the token or place it in `config/evolution-sources.json`.

The owner commands above validate keyword-search access and install or refresh the GitHub secret through hidden input. The [Threads connection guide](../docs/threads-connection.md) covers the one unavoidable account-owner consent step and the no-token reviewed-link fallback. The fallback never fetches Threads; it stores only the permalink and short text that the owner explicitly supplies.

Threads evidence can affect improvement only by supporting a locally named principle that also recurs in at least two other configured source groups within the rolling evidence window. Crossing that threshold creates a review draft, not a skill edit. The regression scenarios, critique, rights review, validation, and human adoption gate still apply.

The no-secret baseline uses four independent public feeds: Codrops, Smashing Magazine, web.dev, and the MDN Blog. Their titles and short excerpts remain untrusted data. The local taxonomy can nominate them for review under categories such as purposeful motion, accessible interaction, performance budgets, creative 3D, design systems, responsive recomposition, editorial structure, and interaction as story; it cannot execute or copy remote instructions.
