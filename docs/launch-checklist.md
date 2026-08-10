# Public launch checklist

The repository is prepared locally without making the irreversible visibility change automatically.

## Before visibility changes

- [x] Confirm the owner name in `LICENSE` and the intended MIT license (`Lrinvl1203`).
- [x] Review every tracked file for credentials, private URLs, personal data, third-party assets, and collision-prone names.
- [ ] Confirm all checks pass from a clean clone or package tarball.
- [ ] Confirm the one-line GitHub install in a temporary home directory.
- [ ] Review the launch page at 320, 375, 768, 1440, and 1920 px.
- [ ] Confirm internal scores and field evidence remain separately labeled.

## GitHub launch settings

- [ ] Change repository visibility to public only after owner approval.
- [ ] Enable private vulnerability reporting.
- [ ] Enable Issues and Discussions if maintainers can respond.
- [ ] Enable Pages with **GitHub Actions** as the source, then run `deploy-pages` manually.
- [ ] Upload `site/assets/social-preview.jpg` under repository social preview settings.
- [ ] Set the homepage to `https://lrinvl1203.github.io/world-class-web-design-os/` after Pages is live.
- [ ] Create the `v0.2.0` release from `CHANGELOG.md`.
- [ ] Add branch protection requiring `validate` and `browser-hard-gates`.

## Suggested repository metadata

Description: `Evidence-led operating system for distinctive, accessible, and verifiable agentic web design.`

Topics: `agent-skills`, `web-design`, `design-system`, `accessibility`, `visual-testing`, `frontend`, `codex`, `motion-design`, `design-ops`, `playwright`.

## After launch

- [ ] Verify the Pages URL, images, experiment links, and one-line install while logged out.
- [ ] Pin a “Start here / show your build” Discussion.
- [ ] Publish the first reproducible external benchmark before making comparative quality claims.
- [ ] Triage launch feedback into defects, feature ideas, and evidence proposals.
