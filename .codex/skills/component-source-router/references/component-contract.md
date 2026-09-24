# Component behavior contract

Use this brief contract for a reused, composite, async, or task-critical component. A static native control usually needs only design tokens and normal QA. Write the contract before choosing a registry or primitive, then keep it beside the implementation or design system.

## 1. Purpose and source decision

- User job and primary action:
- Semantic model: link / button / native form control / disclosure / non-modal popover / modal dialog / APG composite pattern:
- Native option and its gap, if any:
- Selected primitive or source, version, license, and reason:
- Target browsers/devices, feature-support check date, fallback when unavailable:

`<dialog>.showModal()` provides modal behavior; the Popover API creates a non-modal surface. CSS anchor positioning places a surface but does not provide its semantics, keyboard behavior, or state. Verify each feature's current support and real target-device behavior; a browser API's existence alone does not prove the complete interaction works.

## 2. Anatomy and design-system mapping

- Parts and their ownership (trigger, label, content, close action, status, etc.):
- Semantic tokens for text, surface, border, focus, spacing, density, and motion:
- Variants justified by a different hierarchy or behavior:
- Content limits, long text, localization, and empty content:
- Composition check: custom wrappers preserve the rendered element, accessible name, IDs, supplied DOM props/ref, and handlers. Test the composed result, not only the underlying library example.

## 3. Applicable state transitions

Keep only relevant rows. For each state record its entry event, visible feedback, accessibility state or announcement, focus destination, exit/recovery, and a verification assertion.

| State / transition | Entry event | Visible result | Semantics and focus | Exit / recovery | Browser assertion |
|---|---|---|---|---|---|
| Default → open/active | | | | | |
| Open → selection/submit | | | | | |
| Open → Escape/outside press/cancel | | | | | |
| Pending → success/error/abort | | | | | |
| Dynamic items, empty, disabled, or stale result | | | | | |

For async data, decide what happens when a later query finishes first, an item disappears while focused, or a request is aborted. For an overlay, include a press that begins before the surface opens and ends afterward. Preserve user input and explain recovery when a failure is visible.

## 4. Layout and input modes

- Component-container widths and narrow/short viewport behavior; use size container queries when the component's available space, rather than the page width, controls its composition.
- Keyboard, touch, coarse pointer, zoom/reflow, virtual keyboard, and reduced-motion behavior that matter to this component.
- Overlay collision, outside press, Escape, focus return, and scroll behavior on mobile if the component opens a surface.

## 5. Evidence before reuse or release

- Render the relevant states and verify behavior by user input, not only a default screenshot.
- Assert roles/names and key state attributes where they express the contract. Run axe against exposed states; review focus order and screen-reader-sensitive behavior manually where automation cannot decide it.
- Verify narrow container/viewport, touch or mobile browser when overlay behavior matters, and the fallback on a browser without a newer feature.
- Keep screenshots for meaningful visual states and a regression for a reproduced failure. Do not install Storybook solely to fill this contract; use the project's existing browser test harness.

## Two routing examples

**Site navigation disclosure:** Keep links as links and the expandable trigger as a button. A native disclosure or a small accessible behavior is usually sufficient. Test Tab, Enter/Space, Escape where supported by the chosen pattern, 320 px reflow, and visible focus. Do not turn ordinary site navigation into an application `menu` role merely because it drops down.

**Async searchable choice:** A filterable combobox needs the APG combobox/listbox model, stable option IDs, keyboard selection, pending/empty/error states, and stale-response handling. Prefer a tested accessible primitive unless the project has evidence that custom ownership is justified. Test rapid queries, item removal, Escape without accidental commitment, touch selection, and focus return.

## Primary references

- [WAI-ARIA APG patterns](https://www.w3.org/WAI/ARIA/apg/patterns/) and [combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [MDN dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog), [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API), [container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries), and [CSS anchor positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning)
- [Base UI composition](https://base-ui.com/react/handbook/composition) and [popover](https://base-ui.com/react/components/popover)
- [React Aria async list](https://react-aria.adobe.com/useAsyncList)
- [Playwright ARIA snapshots](https://playwright.dev/docs/aria-snapshots) and [Storybook interaction tests](https://storybook.js.org/docs/writing-tests/interaction-testing)
