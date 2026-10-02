# Use the existing modular workflow and browser correction loop

This guide reuses the existing router, skill files, screenshot tool and Playwright tests. It adds no agent runner, context-loader command, automatic design critic or new browser framework. A local tool smoke test is distinct from an autonomous agent-effectiveness study.

## Load the current phase, then re-route

The installer makes 17 modules discoverable; that does not require putting all their full documents into every prompt. Start a full task with `web-design-orchestrator`, read the selected specialists, and follow relevant reference links only when needed. The existing router is a keyword-based first pass, not a complete project planner. It returns names/reasons, not concatenated documents, and can return no specialists for unfamiliar wording. Apply task judgment. Keep the orchestrator across phases; the three-specialist budget excludes the orchestrator.

PowerShell, after installing with `--root` to an absolute target:

```powershell
$installRoot = 'C:\absolute\path\to\installed-root'
$runtime = Join-Path $installRoot '.web-design-os\runtime'
$cli = Join-Path $runtime 'cli\web-design-os.mjs'
$skillRoot = Join-Path $installRoot '.codex\skills'
node $cli doctor --root $installRoot --json

# Concept phase: select only the documents needed for this decision.
$route = node $cli route 'brand art direction typography design system' | ConvertFrom-Json
$names = @('web-design-orchestrator') + @($route.specialists | ForEach-Object { $_.skill })
foreach ($name in ($names | Select-Object -Unique)) {
  Get-Content -Encoding UTF8 -LiteralPath (Join-Path $skillRoot "$name\SKILL.md")
}

# Later, use a new phase query; do not accumulate every earlier module body.
node $cli route 'implement html responsive mobile interaction state'
node $cli route 'playwright qa overflow accessibility'
node $cli route 'critique review generic ai smell'
```

The first query selects art-direction and design-system, the build query selects interaction-design/frontend-implementation/responsive-recomposition, and the QA query selects visual-qa/a11y-performance. These are example matches, not mandatory routes for all websites. `--limit 1` or `2` narrows the budget; larger positive limits are capped at three, and zero/negative/non-integer values fail. An agent can use the same CLI and read the returned SKILL paths itself. In another host, use that host's installed skill directory. Shared scripts/rubric remain under the installed runtime.

For a manual context file, redirect only the current phase's selected text to a project-local note. For real agent usage, prefer on-demand file reads so large reference atlases are not automatically injected. A concatenated context is a transport convenience, not proof that the model complied with the skills.

## Capture, assert, correct, re-run

From the installed runtime, start the existing fictional Sequence Desk example:

```powershell
Set-Location $runtime
node scripts/serve-static.mjs experiments/sequence-desk 4173
```

Use another terminal in the runtime. Playwright/axe packages and Chromium must already be available; see free-starter.md for installation from the official registry. Do not treat doctor READY as browser readiness.

```powershell
$env:TARGET_URL = 'http://127.0.0.1:4173'
$env:CI = '1'
node scripts/capture-screenshots.mjs $env:TARGET_URL
# Preserve this artifacts/screenshots directory as your before evidence.
npx --no-install playwright test tests/release-gates.spec.ts tests/sequence-desk.spec.ts --project=edge-mobile --project=desktop --reporter=line
```

Inspect first-screen and full-page captures at native scale. Record current defects in the website's QA.md with viewport/state, severity, evidence and correction scope. Make the smallest fix in the website (not in the shared runtime or frozen baseline), retain before screenshots/results, capture again, and run the same assertions against the same URL, viewport matrix and browser. The screenshot script records overflow/console observations; it is not a failing quality gate. The Playwright assertions provide a failure exit status. The supplied visual.spec.ts has Nocturne-specific selectors; the Sequence Desk tests have Sequence-specific controls. Adapt functional selectors/expected content for a different app instead of pointing those controls at an unrelated site.

CI=1 skips the inherited Sequence Desk pixel baseline comparison. It does not skip the interaction, exposed-dialog accessibility, focus-return or overflow assertions. Pixel regression additionally needs reviewed baselines and a matching browser environment; the smaller core distribution puts historical snapshots in its optional image archive. Do not automatically update a failing baseline. Local axe/overflow passes do not establish complete manual accessibility or field performance. Keep the original rubric and unknown field gates intact.

The verified smoke path copies Sequence Desk to an isolated temporary website, injects one deliberate overflow defect, observes failing assertions, removes only that injection, and re-runs the same tests successfully. This verifies the plumbing and failure signal. It is not an agent-generated correction, a new design performance result, or an A/B experiment.

For cross-project learning, draft/adoption boundaries, clean-version rollback and a proposed held-out evolution study, read [evolution-lifecycle.md](evolution-lifecycle.md). The post-project query `route "post-project repeated defect learning record"` now selects the existing continuous-learning module. It does not ingest feedback or adopt a patch automatically.

## Evaluating installed-agent behavior

A full-agent comparison needs fresh independent sessions in clean project directories, identical model/settings/brief/assets/tools/browser/dependencies, and one predeclared correction policy. Disable unrelated skill sources in both arms; make the installed Web OS files available only in the treatment. Give that arm an orchestrator entry point and allow selective reads instead of preloading all seventeen bodies. The control receives the same capable neutral design brief and browser tools.

Before scoring designs, verify that each agent can read its permitted files, write a sentinel inside its test project, run the local browser checks and inspect a screenshot using the intended permissions. A requested setting or a model's statement about permissions is not a capability test. Record actual reads/writes, screenshots, failed assertions, corrections, token/time budgets and manual interventions. Use condition-blind review, repeated tasks and independent users before claiming general effectiveness. Local module routing and tool smoke checks alone do not demonstrate better design outcomes.
