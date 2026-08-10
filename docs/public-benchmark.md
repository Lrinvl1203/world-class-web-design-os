# Public benchmark and evidence model

Web Design OS separates four kinds of evidence so a strong internal result is not presented as market proof.

| Layer | What it answers | Current evidence | Public claim allowed |
|---|---|---|---|
| Structural | Are required skills, links, schemas, and routes intact? | Validation and regression suites | Build integrity |
| Rendered | Does the page survive real viewports, keyboard use, axe checks, overflow checks, and console inspection? | Playwright release gates across representative viewports | Browser and accessibility gate result |
| Internal design | Does an artifact meet the Design Quality rubric and anti-slop criteria? | Nocturne 92.8; Linehold 91.8 hold | Internal score only |
| Field | Do representative users succeed, prefer it, or convert better? | Not yet collected | No outcome claim yet |

## External benchmark plan

The executable public protocol is [The Same Brief Challenge](../BENCHMARK.md). Independent submissions may include unfavorable or partial results when inputs, raw evidence, and limitations are public.

The first public evaluation should use the same brief across Web Design OS and at least two credible alternatives, with identity hidden from reviewers where practical. Record:

- time from brief to shippable artifact;
- task completion by representative users;
- keyboard and automated accessibility failures;
- mobile overflow and interaction defects;
- page-weight and Core Web Vitals proxies;
- blinded design preference and rationale;
- number and severity of human corrections.

Publish the brief, versions, prompts, screenshots, test scripts, raw anonymized results, and known limitations. Do not aggregate incompatible signals into one “world-class” score.

## Existing experiment status

Nocturne Concierge demonstrates that the system can cross its internal 92-point threshold on an editorial hospitality archetype. Linehold Forge deliberately remains on hold at 91.8, showing that the threshold is enforced rather than rounded into a pass. Neither experiment currently has representative-user or conversion evidence.
