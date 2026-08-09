# Continuous-learning records

## Visual baselines must prove capture readiness

- **Date / project:** 2026-08-09 / Nocturne 24 Phase C
- **Evidence:** The original full-page captures passed while offscreen `.reveal` sections remained at `opacity: 0` because the capture path did not trigger their observer. After visibility assertions were added, a 1920 px comparison also exposed lazy-image decode timing as a second nondeterministic input.
- **Severity:** major
- **Classification:** QA blind spot with an execution-level capture defect
- **Root cause:** Pixel comparison was treated as the first assertion instead of the last. The suite had no preconditions for critical-content visibility or settled media.
- **Generalizable principle:** A visual baseline is admissible only after the test proves the intended page state is complete and essential content remains available without motion.
- **Countermeasure:** Update `$visual-qa` to require font/media settling, deterministic motion, and critical-content visibility checks before baseline acceptance. The Nocturne suite now performs these checks and the capture script decodes images before full-page capture.
- **Positive regression:** Nocturne's observer-driven reveal sections and lazy editorial images must produce complete, stable captures at all six configured viewports.
- **Negative regression:** Purpose-built loading, skeleton, and empty-state tests remain valid when that incomplete state is explicitly the intended capture state.
- **Validation:** The new visibility assertion would fail the prior hidden-content state; the media-settling change removed the reproduced 1920 px diff; six viewports then passed twice consecutively.
- **Decision:** adopted in `$visual-qa`; no new skill or architecture branch required.
