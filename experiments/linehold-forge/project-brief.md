# Project brief — Linehold Forge

- Product: fictional Korean precision-machining partner for aerospace, energy, and industrial robotics programs.
- Primary job: let a technical buyer verify process fit, tolerance capability, inspection evidence, and a credible RFQ path quickly.
- Primary CTA: build an RFQ brief.
- Audience: manufacturing engineers, procurement leads, and program managers evaluating a new supplier under time pressure.
- Content priority: measurable capability → inspection proof → process/risk controls → RFQ readiness → company narrative.
- Anti-direction: generic dark-tech SaaS, chrome-and-glow futurism, stock sparks, vague “innovation” language, decorative 3D parts, or card-dashboard composition.

## Art-direction routes considered

1. **Metrology ledger:** pale inspection-paper field, red markup, dense tables, and macro photography. Strongest for proof but too visually narrow for plant scale.
2. **Forge cinema:** dark full-bleed factory imagery with dramatic type. Strongest emotional entry but risks familiar industrial advertising and weak scan utility.
3. **Tolerance line — selected:** warm technical paper and graphite production imagery joined by a continuous orange datum line. Measurement is both the visual grammar and the navigation model.

## Signature idea

The datum line moves only when a user selects a production family. It updates achievable tolerance, process, inspection method, and typical lot size together, turning a brand motif into a supplier-fit comparison tool.

## Motion and component decisions

- Native CSS and Web Animations API only; state feedback does not justify a dependency.
- Semantic buttons, anchors, form controls, and native details disclosure.
- Custom sharp-edged composition because a generic card registry would fight the metrology-led system.
- Critical content is visible without JavaScript; enhanced comparisons and the RFQ summary fail open to readable defaults.
