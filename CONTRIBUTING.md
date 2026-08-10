# Contributing to Web Design OS

Web Design OS improves when a change is tied to an observed failure, a reproducible scenario, and a measurable gate. Contributions are welcome across skills, references, tooling, documentation, accessibility, and verification experiments.

## Before opening a change

1. Search existing issues and the [learning records](docs/learning-records.md).
2. For a skill change, name the defect it prevents and the scenario that exposed it.
3. For a visual reference, record provenance, the reusable principle, and what must not be copied.
4. For a new dependency, explain the capability gap and its accessibility and performance cost.

Large architectural or licensing changes should begin as an issue. Security reports follow [SECURITY.md](SECURITY.md).

## Local checks

Use Node.js 20+ and Python 3.

```bash
npm install
npm run validate
npm run eval:skills
npm run qa:install
npm run qa:visual
```

If your change affects rendering, attach representative desktop and mobile screenshots. If it changes a core skill, validate it against at least one existing scenario and one new scenario.

## Pull-request evidence

Describe:

- the user or agent failure being addressed;
- the root cause, not only the visible symptom;
- files and behavior changed;
- verification run and results;
- accessibility, performance, license, and compatibility risks;
- whether documentation, templates, experiments, or global installs need synchronization.

## Design contribution bar

Web Design OS does not accept novelty by decoration alone. A design or motion proposal should state its communication job, reduced-motion behavior, responsive composition, and failure mode. Avoid reproducing a reference wholesale.

## Commit scope

Keep changes reviewable and avoid mixing unrelated formatting or generated artifacts. Generated daily evolution reports are ignored by default; submit a reviewed, stable learning record when evidence should become project history.

By participating, you agree to follow [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Contributions are provided under the repository's MIT license.

