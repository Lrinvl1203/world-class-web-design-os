# Creative-Web Capability Matrix — 2026

| Visual problem | Default route | Escalation/alternative | Guardrail |
|---|---|---|---|
| Crisp illustration/path/mask | SVG | Canvas when many dynamic objects | Keep semantics/content in DOM. |
| Designer-authored interactive vector | Rive | SVG/Anime for simple sequences | State machine must add product meaning; pause/settle when idle. |
| Designer-authored 3D embed | Spline | Three/R3F for deeper runtime control | Keep embed count/load budget intentional. |
| Programmatic 3D scene | Three.js | R3F in React architecture | Define fallback and quality tiers first. |
| React-integrated 3D | React Three Fiber | direct Three.js for minimal non-React apps | Avoid unnecessary React<->render-loop churn. |
| Shader/material behavior | Three.js + TSL/WebGL | WebGPU renderer if feature/perf case is justified | GPU novelty is not a concept. |
| Modern WebGPU pipeline | Three WebGPURenderer/TSL | WebGLRenderer when compatibility/maturity wins | WebGPURenderer is still experimental; keep a fallback strategy. |
| Time-authored multi-property scene | Theatre.js | GSAP timeline if authoring UI is unnecessary | Avoid dual timeline authorities. |
| Many 2D particles / custom raster | Canvas/WebGL | DOM for small counts | Stop offscreen, cap DPR/particles. |

## Three.js WebGPU rule

Three.js WebGPURenderer currently prefers a WebGPU backend and can fall back to WebGL2, but the renderer remains experimental and some legacy material/post-processing patterns require TSL/node-material migration. Do not make WebGPU the default merely because it is newer.

## Rive rule

Rive state machines are designer-authored states/transitions controlled at runtime through bindings. Use them where an interactive vector artifact has meaningful states. When a state machine settles, runtime work can stop; preserve this behavior rather than forcing needless continuous animation.

## Spline rule

Use Spline where designer-authored spatial scenes and fast iteration matter more than fine-grained renderer ownership. Prefer explicit loading/fallback plans and avoid a page full of independent heavy embeds.
