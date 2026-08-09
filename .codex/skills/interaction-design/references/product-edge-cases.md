# Product edge-case matrix

Apply only relevant rows, but decide them explicitly.

| Area | States and questions |
|---|---|
| Data | first load, refresh, stale cache, partial data, empty, malformed, offline, permission denied |
| Actions | idle, hover/focus, pending, success, validation error, server error, retry, cancellation, duplicate submit |
| Forms | required/optional, format, constraints, password manager/autofill, paste, IME composition, unsaved changes |
| Lists | zero/one/many, pagination, filters with no result, sort stability, very long labels, bulk selection |
| Accounts | signed out, expired session, restricted role, deleted resource, invitation pending, multi-tenant context |
| Media | missing, slow, wrong ratio, failed decode, caption/transcript absent, autoplay blocked, reduced data |
| Localization | long translation, mixed Hangul/Latin metrics, RTL if required, currency/date/time zone, plural rules |
| Devices | keyboard, touch, coarse pointer, zoom/reflow, narrow/short viewport, safe areas, virtual keyboard |
| Navigation | deep link, back/forward, interrupted transition, unavailable anchor, restored scroll/focus |
| Realtime | reconnecting, out-of-order event, concurrent edit, optimistic rollback, conflict resolution |

For every non-happy state define: trigger, visible message, retained user input, recovery action, focus destination, announcement behavior, and telemetry if appropriate. Avoid generic “Something went wrong” copy when a recovery path can be stated.
