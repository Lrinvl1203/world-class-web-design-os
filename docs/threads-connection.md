# Threads connection without browser scraping

World-Class Web Design OS supports two Threads input paths:

1. bounded automatic discovery through Meta's official API;
2. a human-reviewed permalink queue when no API token is available.

It does not use Playwright, stored browser cookies, private endpoints, or login-session scraping to collect Threads content. Meta's automated-data terms require prior permission for automated collection, and browser automation would also be brittle around login checks, DOM changes, rate limits, and account enforcement.

## One-time official connection

1. Create a Meta app with the **Threads API** use case in [Meta for Developers](https://developers.facebook.com/apps/).
2. Add the repository owner's Threads account as an app user/tester while the app is in development mode.
3. Authorize only `threads_basic` and `threads_keyword_search`. Do not grant content-publishing, reply-management, or mention-management permissions for discovery.
4. Generate a long-lived Threads user token through Meta's official [Threads API authorization flow](https://www.postman.com/meta/threads/folder/34203612-e0373e84-de6b-46f1-b90d-3fea76ba6782). Keep a recovery copy in the owner's password manager because GitHub Secrets cannot be read back.
5. From the repository, run:

```text
npm run threads:connect
```

Paste the token into the hidden prompt. The command makes a one-result official keyword search to prove the required permission, then pipes the token directly to `gh secret set THREADS_ACCESS_TOKEN`. It never includes the token in process arguments, request URLs, repository files, or console output.

Confirm only the presence of the GitHub secret:

```text
npm run threads:doctor
```

After the pull request is merged, run the review once:

```text
gh workflow run weekly-review.yml --ref main
```

The normal daily and weekly schedules will then collect the configured TOP and RECENT design queries automatically.

## Token renewal

Long-lived Threads tokens are reported by Meta with a finite lifetime. Before the current token expires, run:

```text
npm run threads:refresh
```

Paste the current long-lived token from the owner's password manager. The command calls Meta's official refresh endpoint, validates the replacement token through keyword search, and replaces the GitHub secret without printing either token. Automatic secret rotation inside GitHub Actions is intentionally not enabled because persisting a replacement would require a second credential with repository-secret administration authority.

## No-token reviewed queue

When API authorization is not ready, manually inspect Threads in a normal user-controlled browser and add only a permalink plus a short factual note:

```text
npm run threads:add
```

The command accepts only HTTPS `threads.com` or `threads.net` permalinks, removes markup and control characters, truncates stored text, rejects duplicates and future dates, and caps the queue at 200 links. It does not fetch the permalink. Run the offline classifier afterward:

```text
npm run web-design-os -- evolve --offline
```

Official search, owned-post insights, and reviewed Threads links all share the same `threads` source family. Ten Threads posts therefore still count as one independent source. A design proposal requires the same controlled principle in two other source families and remains review-only after crossing that threshold.

## What Playwright may still do

Playwright remains appropriate for this project's own launch-site screenshots, accessibility checks, responsive rendering, and browser regressions. It is not used to impersonate a person, scroll Threads feeds, extract posts, retain Threads cookies, bypass login controls, or simulate engagement.
