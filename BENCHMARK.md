# The Same Brief Challenge

Can a design workflow produce distinct, usable work without collapsing into a house style? This is the public test for World-Class Web Design OS.

## Run the challenge

1. Choose a fresh website brief that neither workflow has seen.
2. Save the exact brief, assets, references, agent/model, versions, and time budget.
3. Build version A with your normal agent workflow.
4. Start a clean session, install Web Design OS, and build version B with the same inputs and budget.
5. Hide the workflow identity where practical and ask at least three people from the target audience to review both versions.
6. Publish the artifacts and raw results, including failures and manual corrections.

Install the OS before version B:

```bash
npx --yes github:Lrinvl1203/world-class-web-design-os install --agent codex
```

Then use the same plain-language request you used for version A. Do not add secret steering prompts to either run.

## Record the evidence

| Signal | How to record it |
|---|---|
| Reproducibility | Exact brief, assets, references, agent/model, versions, and commit SHA |
| Delivery effort | Elapsed time plus number and severity of human corrections |
| Task success | Whether representative users can identify the offer and complete the primary action |
| Accessibility | Keyboard path, visible focus, serious/critical axe findings, reduced-motion behavior |
| Responsive quality | Screenshots at 320, 375, 768, 1440, and 1920 px; overflow and interaction defects |
| Performance | Page weight and labeled laboratory measurements; never present lab data as field CWV |
| Design preference | Blinded preference, confidence, and written rationale from each reviewer |

Do not combine these signals into a single invented score. A preference result is not a conversion result, and an internal rubric is not external validation.

## Submit a result

Open a [Same Brief Challenge result](https://github.com/Lrinvl1203/world-class-web-design-os/issues/new?template=benchmark-result.yml) and link the public repository, screenshots, test notes, and anonymized raw review data. Partial or negative results are welcome when their limits are labeled.

The project will list independently reproducible submissions here without selecting only favorable outcomes. See the full [public evidence model](docs/public-benchmark.md).

## Current public results

No independent submissions yet. The two included experiments are internal demonstrations, not external benchmark wins.
