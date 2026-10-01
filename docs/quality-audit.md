# Audit a project's quality evidence

The audit reads a report and the existing Design Quality rubric. It does not run a browser, fetch evidence URLs, update scores, or declare a deployment ready. The rubric's weights, category floors, and 92-point target remain unchanged.

```bash
web-design-os audit ./design-quality-review.json
web-design-os audit ./design-quality-review.json --json
web-design-os audit ./design-quality-review.json --require-field --json
```

Omitting the path reads `design-quality-review.json` in the current directory. The command is available through the repository CLI and GitHub installer; this does not publish a new npm release.

The audit separates four questions:

- **Integrity:** Does the report contain valid category scores, literal boolean hard gates, and consistent declared totals and thresholds? Strings, booleans used as numbers, non-finite values, negative metrics, unknown categories, and malformed objects are rejected.
- **Design:** Do the recomputed total and every category meet the unchanged rubric?
- **Reported technical checks:** Do the declared gates and performance diagnostics pass? Missing measurements produce INCOMPLETE. These are report declarations, with no new browser run or proof of freshness.
- **Field evidence:** Does the report contain a complete structured field evidence record with passing metrics? Local diagnostics, next-frame response proxies, and a string such as `PENDING_REAL_DEPLOYMENT` cannot establish a field pass.

The default command exits 0 for INTERNAL PASS even when field evidence is pending. It exits 1 for malformed reports, design HOLD, reported technical failures, incomplete diagnostics, or reported field failures. `--require-field` also exits 1 when field evidence is pending. JSON contains `valid`, `ok`, `total`, `design`, `technical`, `field`, `decision`, `issues`, and `next_actions` so callers can distinguish integrity from readiness.

## Field evidence contract

Google's [Web Vitals guidance](https://web.dev/articles/vitals) assesses all three metrics at the 75th percentile; [lab and field measurements](https://web.dev/articles/lab-and-field-data-differences) describe different conditions. This audit applies the repository's field percentile and limits without treating local proxies as field measurements.

The following illustrates the structure under `hard_gates.field_core_web_vitals`. The URLs and measurements are synthetic examples, not collected project evidence:

```json
{
  "measurement_scope": "field",
  "percentile": 75,
  "source": {
    "type": "rum",
    "url": "https://example.com/evidence/report",
    "target": "https://example.com/"
  },
  "collected_at": "2026-10-01",
  "metrics": { "lcp_ms": 2100, "inp_ms": 160, "cls": 0.05 }
}
```

`source.type` must be `crux` or `rum`. Evidence and measured-target URLs must be HTTPS without embedded credentials. The date must be real and cannot be in the future. Missing metadata stays PENDING; invalid supplied numeric values or types invalidate the report. Passing evidence is labeled REPORTED PASS: the audit does not authenticate its source, prove its device coverage, or impose a freshness window. Review the actual source, target, mobile/desktop coverage, and collection period before relying on it for release.

## Audit the public proof collection

```bash
npm run audit:proof
node scripts/audit-proof.mjs --json
```

The proof audit requires reports for every public content seed and includes additional experiment reports. Removing a required report cannot silently remove its case from validation. Its exit code tests report integrity, so a correctly recorded HOLD is preserved without making repository validation fail. The output explicitly distinguishes that from project release readiness.

As checked on 2026-10-02, four of five reports meet the design threshold. Linehold Forge remains at 91.8. Three cases omit local performance metrics and therefore have incomplete technical evidence. Every case still lacks structured field evidence. No scores or historical reports were changed to manufacture passes.
