---
name: component-source-router
description: Use when deciding whether to implement UI from native HTML/CSS, accessible primitives, shadcn-style source components, or visual component registries such as 21st.dev, Aceternity, React Bits, Motion Primitives, Magic UI, or Animate UI.
metadata:
  short-description: Choose accessible primitives and component sources
---

# Component Source Router

## Principle

A component source solves implementation cost; it does not define the final visual language.

## Route in this order

1. semantic native HTML/CSS when sufficient;
2. accessible unstyled primitives for complex behavior;
3. owned/source components when they save implementation time;
4. animated/visual registries as inspiration or behavior prototypes;
5. custom implementation when the signature interaction requires it.

Read `references/catalog.md` when choosing a source.

For a reused, composite, asynchronous, or task-critical component, write the small behavior contract in `references/component-contract.md` before importing source code. Use only the fields that change implementation or verification; a plain native button does not need a form.

Choose the interaction model before the package: a link navigates, a button acts, native `select` handles a simple fixed choice, a disclosure expands content, a modal dialog blocks the page, and the native Popover API opens a non-modal surface. A popover or anchored position supplies display behavior, not a menu/combobox keyboard model. Use the relevant WAI-ARIA APG pattern and tested primitive when native semantics do not cover a composite widget.

## Before adopting an external component

Check:
- behavior fit;
- accessibility and keyboard model;
- framework/runtime fit;
- dependency cost and duplication;
- styling reset effort;
- responsive behavior;
- reduced-motion behavior;
- license/current documentation;
- composition after wrapping: forwarded DOM props/ref, event handlers, IDs, accessible name, and actual rendered element;
- support in target browsers, a usable fallback, and touch/light-dismiss behavior for platform features.

## Integration rule

Strip generic surface styling, map to project tokens, rewrite content, adapt composition, audit states, and remove unused dependencies. If the imported component makes the page look like its registry, the integration is unfinished.

Verify the contract in rendered states, including keyboard and touch, focus entry/return, dynamic items or async results when relevant, accessibility structure, narrow containers, and reduced motion. Do not infer that a component is accessible from its source label or a single closed-state audit.
