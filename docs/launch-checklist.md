# Public launch checklist

The repository was made public with explicit owner approval on 2026-08-10. This file now records the completed launch controls and remaining follow-up work.

## Before visibility changes

- [x] Confirm the owner name in `LICENSE` and the intended MIT license (`Lrinvl1203`).
- [x] Review every tracked file for credentials, private URLs, personal data, third-party assets, and collision-prone names.
- [x] Confirm all checks pass from a clean clone or package tarball.
- [x] Confirm the one-line GitHub install in a temporary home directory.
- [x] Review the launch page at 320, 375, 768, 1440, and 1920 px.
- [x] Confirm internal scores and field evidence remain separately labeled.

## GitHub launch settings

- [x] Change repository visibility to public only after owner approval.
- [x] Enable vulnerability alerts and private vulnerability reporting.
- [x] Enable secret scanning and push protection; keep noisy dependency-update PRs disabled.
- [x] Enable Issues and Discussions if maintainers can respond.
- [x] Enable Pages with **GitHub Actions** as the source, then run `deploy-pages` manually.
- [ ] Upload `site/assets/social-preview.jpg` under repository social preview settings.
- [x] Set the homepage to `https://lrinvl1203.github.io/world-class-web-design-os/` after Pages is live.
- [x] Create the `v0.2.0` release from `CHANGELOG.md`.
- [x] Add branch protection requiring `validate` and `browser-hard-gates`, with force pushes and branch deletion disabled.

## Suggested repository metadata

Description: `Evidence-led operating system for distinctive, accessible, and verifiable agentic web design.`

Topics: `agent-skills`, `web-design`, `design-system`, `accessibility`, `visual-testing`, `frontend`, `codex`, `motion-design`, `design-ops`, `playwright`.

## After launch

- [x] Verify the public Pages URL and both experiment links without repository authentication, and verify the packaged installer in a temporary home.
- [ ] Pin a “Start here / show your build” Discussion.
- [ ] Publish the first reproducible external benchmark before making comparative quality claims.
- [ ] Triage launch feedback into defects, feature ideas, and evidence proposals.
