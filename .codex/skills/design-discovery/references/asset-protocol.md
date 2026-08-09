# Asset protocol

Use this compact ledger before art direction or implementation depends on an asset.

| Field | Required decision |
|---|---|
| Role | What communication or task does the asset support? |
| Source | Owned, commissioned, licensed library, generated, public-domain, reference-only, or unknown |
| Rights | Allowed media, territory, term, attribution, model/property release, derivative restrictions |
| Fidelity | Final, temporary, synthetic, low-resolution, or reference-only |
| Delivery | File/URL, format, dimensions/duration, color profile, alpha/audio requirements |
| Responsive use | Required crops, focal point, art-directed variants, small-screen substitute |
| Accessibility | Alt purpose, transcript/caption, pause/mute controls, decorative status |
| Performance | Encoding, size budget, preload/lazy strategy, poster/fallback, DPR/render cap |
| Failure mode | What remains understandable if it is blocked, slow, or removed? |

Rules:

- Do not present reference imagery, social posts, screenshots, or generated placeholders as owned production assets.
- Do not hotlink a third-party asset unless its terms and operational reliability explicitly allow it.
- Preserve provenance and generation/edit history for synthetic media.
- Prefer a coherent owned image system over unrelated stock chosen one section at a time.
- If rights or delivery are unknown, label the asset as a dependency and design a truthful fallback.
