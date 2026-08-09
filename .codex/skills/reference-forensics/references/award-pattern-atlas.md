# Award & Creative-Web Pattern Atlas — 2026

Use this atlas as a **pattern vocabulary and benchmark router**, not as a template library. Never recreate a reference site wholesale. Extract a principle, translate it through the current brand, and verify that it serves the user job.

## Evidence levels

- **A — case-study verified:** the source documents intent, implementation, or both.
- **B — demo verified:** the source documents the interaction/technical pattern but not a full commercial design system.
- **C — award benchmark:** the source establishes recognition/relevance. Inspect the actual site or supplied screenshots before claiming a specific mechanic.

## 100-reference atlas

| # | Reference | Source | Evidence | Design/engineering lesson to extract | Do not cargo-cult |
|---|---|---|---|---|---|
| 1 | Trionn case study | Codrops, 2026 | A | Treat scroll, DOM motion and WebGL as one orchestration system; use device-specific motion rules instead of shrinking desktop choreography. | GSAP/Three/Lenis merely because they appear in the stack. |
| 2 | Shopify Spring ’26 Edition: Everywhere | Codrops, 2026 | A | Cinematic presentation can coexist with responsive, accessible and performance-aware architecture when renderer tiers and fallbacks are designed up front. | A maximal 3D renderer for every device. |
| 3 | Podium | Codrops, 2026 | A | Design a page as a temporal sequence: rhythm, motion, pause and restraint can preserve cinematic storytelling without constant spectacle. | Animation on every section. |
| 4 | A Better Lou | Codrops, 2026 | A | Premium design can mean cognitive-load reduction: simplify content, information architecture and systems before adding decoration. | Treating “award-worthy” as synonymous with visual complexity. |
| 5 | Sketching the Impossible | Codrops, 2026 | A | Strong spatial ideas can be built with simple geometry; concept and composition can outrank asset complexity. | Assuming bespoke 3D models are required for memorable 3D. |
| 6 | Horeca | Codrops, 2026 | A | Motion systems need production tuning, mobile optimization and performance constraints as part of the design—not as cleanup. | Desktop-only sticky/scroll choreography. |
| 7 | Interactive Digital Stamp Collection | Codrops, 2026 | A | Tie interaction directly to the content object: drag, inspect and magnify are meaningful because the content is collectible stamps. | Adding shader loupe or drag to unrelated content. |
| 8 | Lesse Studio | Codrops, 2026 | A | Tool intentionality and self-hosting/performance choices are part of craft. A simpler stack can make the final experience feel more deliberate. | Dependency accumulation. |
| 9 | Shader.se WebGPU Pipeline | Codrops, 2026 | A | Selective rendering and scene transitions can turn GPU effects into a coherent scroll narrative while controlling runtime cost. | Rendering every scene continuously. |
| 10 | Bisous | Codrops, 2026 | A | Editorial composition + purposeful motion + minimalist UI can let high-value imagery remain the protagonist. | UI chrome competing with cinematic work. |
| 11 | Page Transitions with WebGPU | Codrops demo, 2026 | B | Use GPU transitions when the transition itself is a meaningful visual bridge and native/DOM methods cannot express it. | WebGPU for ordinary route fades. |
| 12 | 3D Image Rotations on Scroll | Codrops demo, 2026 | B | Scroll-linked spatial transformation can communicate depth when imagery benefits from object-like treatment. | Rotating flat content with no semantic reason. |
| 13 | Thumbnail Flow with GSAP MotionPath | Codrops demo, 2026 | B | Motion paths can turn navigation or media sequences into a legible trajectory. | Curved-path animation as decoration. |
| 14 | Infinite Parallax Scroll with GSAP & Lenis | Codrops demo, 2026 | B | Infinite motion requires seamless continuity, velocity discipline and clear content hierarchy. | Smooth-scroll + parallax by default. |
| 15 | Scroll-driven SVG Graph/Map | Codrops demo, 2026 | B | SVG is often the right medium for crisp explanatory motion; scroll can progressively reveal data or geography. | WebGL where SVG is sufficient. |
| 16 | HTML-in-Canvas Examples | Codrops demo, 2026 | B | Hybrid DOM/canvas techniques can preserve semantic UI while introducing fluid visual distortion. | Moving essential controls wholly into canvas. |
| 17 | False Earth | Codrops demo, 2026 | B | Procedural visuals and TSL/WebGPU are strongest when the procedural behavior is the content or concept. | Shader novelty detached from brand meaning. |
| 18 | Sticky Grid Scroll | Codrops demo, 2026 | B | Grid systems can become temporal compositions; sticky states should clarify grouping and progression. | Sticky sections that trap the user. |
| 19 | Grid Layout Transitions with GSAP Flip | Codrops demo, 2026 | B | Shared-layout transitions can preserve spatial continuity while a grid changes state. | Heavy timeline code where native View Transitions or Motion layout suffice. |
| 20 | Dual Wave Text Animation | Codrops demo, 2026 | B | Typography may carry motion identity, but reading integrity and reduced-motion fallbacks remain primary. | Splitting every paragraph into animated glyphs. |
| 21 | Bruno’s Portfolio Case Study | Awwwards, 2026 | A | A portfolio can become a navigable world when the spatial metaphor is the product experience itself. | 3D-world navigation for content that needs fast scanning. |
| 22 | Ribbit Case Study | Awwwards, 2026 | A | A motion studio site can use motion as evidence of capability; interaction should embody the studio’s craft. | Showreel behavior on utility-heavy sites. |
| 23 | Inversa Case Study | Awwwards, 2026 | A | Translate mission and field reality into visual/material direction instead of generic sustainability tropes. | Green gradients and eco icons as a substitute for story. |
| 24 | MindMarket Case Study | Awwwards, 2026 | A | Research/data products should speak the language of people; content language is a design-system input. | Dashboard aesthetics merely because the business involves data. |
| 25 | Heidelberg CCUS | Awwwards, 2026 | A | Complex industrial/sustainability narratives need hierarchy and explanatory clarity before expressive layers. | Visualizing every technical concept simultaneously. |
| 26 | Obys’ Design Books | Awwwards, 2026 | A | Curation itself can become information architecture; content taxonomy and editorial art direction can form one system. | Decorative editorial styling without a curation model. |
| 27 | GQ × Audemars Piguet: The Extraordinary Lab | Awwwards, 2026 | A | Real-time cinematic technique is appropriate when luxury product craft and temporal storytelling are central. | Luxury = slow animations everywhere. |
| 28 | Fluid Glass Case Study | Awwwards, 2026 | A | Material properties of the physical product can inform digital surfaces, light, transparency and spatial composition. | Glassmorphism unrelated to an actual material story. |
| 29 | Mapping the Uncharted: San Rita | Awwwards, 2026 | A | Build a sense of place; spatial/topographic language can prevent a studio site from becoming generic monochrome agency UI. | Map motifs for brands with no geographic narrative. |
| 30 | Not a Portfolio. A Presence. | Awwwards, 2026 | A | A portfolio’s strongest differentiator can be a consistent way of seeing rather than a collection of disconnected effects. | Effect-per-project inconsistency. |
| 31 | 100 Lost Species | Awwwards, 2026 | A | Emotional digital stories work when interaction supports memory and subject matter, not just spectacle. | Gamifying sensitive narratives without purpose. |
| 32 | UNESCO Virtual Museum of Stolen Cultural Objects | Awwwards, 2026 | A | Absence can be a design material; museum/exhibition interfaces can communicate meaning through what is withheld as well as shown. | Empty-space theatrics with no conceptual basis. |
| 33 | StringTune: For Core Web Animations | Awwwards, 2026 | A | Treat animation infrastructure as a reusable system rather than isolated snippets. | A single global animation style applied indiscriminately. |
| 34 | Phantom.Land | Awwwards award index | C | Benchmark target for portfolio/developer craft. Inspect actual visual reference before extracting a specific pattern. | Inferring mechanics from award labels alone. |
| 35 | Made With GSAP | Awwwards award index | C | Benchmark target for motion-rich product/creative development. Validate task fit before borrowing any mechanic. | “Made with GSAP” as a design brief. |
| 36 | Seasoned | Awwwards award index | C | Benchmark target for typography-led identity. Inspect scale, rhythm, pairing and reading behavior rather than copying the font. | Typeface imitation. |
| 37 | Telepathic Instruments | Awwwards award index | C | Benchmark target for e-commerce + product personality. Inspect how commerce utility and character coexist. | Character animation that obscures purchase flow. |
| 38 | Eduard Bodak Portfolio | Awwwards award index | C | Benchmark target for retro/portfolio craft. Separate durable compositional ideas from time-bound stylistic residue. | Retro styling without brand rationale. |
| 39 | Aramco — Birth of Oil | Awwwards storytelling/3D collections | C | Benchmark target for immersive historical storytelling. Inspect whether 3D clarifies sequence, place or causality. | 3D merely because the story is historical. |
| 40 | BlueYard Capital | Awwwards 3D collection | C | Benchmark target showing that institutional/corporate contexts can still support expressive spatial art direction. | Creative effects that reduce trust or scanability. |
| 41 | [Reform Collective: Designed to Be Seen](https://tympanus.net/codrops/2025/07/24/reform-collective-a-new-website-designed-to-be-seen/) | Codrops, 2025 | A | Remove portfolio click tunnels and let structural navigation physically reframe content instead of obscuring it. | Assuming every case study needs a long process essay. |
| 42 | [Troa 25′ Folio](https://tympanus.net/codrops/2025/03/28/case-study-troa-25-folio/) | Codrops, 2025 | A | Treat performance, sustainability, custom type, and portfolio identity as one design system. | Calling a heavy site sustainable because it uses muted colors. |
| 43 | [Green Stack](https://tympanus.net/codrops/2025/03/26/design-in-motion-the-animation-principles-behind-green-stack/) | Codrops, 2025 | A | Define a small motion grammar early—direction, material behavior, variable type—and prevent interruptible hover timelines from competing. | Using blur and variable-font animation without a material or product rationale. |
| 44 | [Ciel Rose](https://tympanus.net/codrops/2025/04/07/case-study-ciel-rose/) | Codrops, 2025 | A | Keep cinematic work central by making media persistence, crop control, and page transitions serve the film language. | Shader deformation on ordinary image grids. |
| 45 | [Arts Corporation](https://tympanus.net/codrops/2025/04/22/designing-for-flow-not-frustration-the-transformation-of-arts-corporation/) | Codrops, 2025 | A | Sound can reinforce an artistic identity when it is optional, context-aware, and paused when the page loses relevance. | Autoplay audio or sound on every hover. |
| 46 | [24/7 Artists](https://tympanus.net/codrops/2025/04/16/case-study-24-7-artists/) | Codrops, 2025 | A | Storyboard a launch page when timing is tight; derive motion verbs from the domain—equalize, pulse, play—and reuse mastered techniques. | Inventing risky effects during a deadline sprint. |
| 47 | [Nite Riot](https://tympanus.net/codrops/2025/04/15/nite-riot-minimalism-gets-a-wild-side/) | Codrops, 2025 | A | Give loud portfolio media a restrained structural frame; optimize media as part of the creative pipeline. | Matching energetic work with equally noisy chrome. |
| 48 | [OXI ONE MKII](https://tympanus.net/codrops/2025/05/29/no-visuals-no-time-no-problem-launching-oxi-instruments-one-mkii-in-2-weeks/) | Codrops, 2025 | A | Under asset scarcity, make structure, type, scan order, and specifications do more work instead of fabricating spectacle. | Hiding product detail behind a launch-film aesthetic. |
| 49 | [TrueKind](https://tympanus.net/codrops/2025/06/25/designing-truekind-a-skincare-brands-journey-through-moodboards-motion-and-meaning/) | Codrops, 2025 | A | Curate moodboards by light, saturation, atmosphere, and brand energy; replace reference placeholders with owned production imagery. | Treating a collage of attractive images as an art direction. |
| 50 | [KODE Immersive](https://tympanus.net/codrops/2025/06/16/inside-the-frontier-of-ai-webxr-real-time-3d-crafting-kode-immersive/) | Codrops, 2025 | A | Prototype emerging-tech concepts early and budget draw calls, workers, audio, discovery cues, and device QA as design constraints. | WebXR/WebGL merely to signal innovation. |
| 51 | [Bloom Paris TV](https://tympanus.net/codrops/2025/07/08/bloom-paris-tv-where-refined-art-direction-meets-world-class-production/) | Codrops, 2025 | A | Extend one identity mark into navigation, focus, transitions, and editorial punctuation while letting production imagery lead. | Repeating a logo motif until it becomes ornament. |
| 52 | [21 TSI](https://tympanus.net/codrops/2025/07/21/beyond-the-corporate-mold-how-21-tsi-sets-the-future-of-sports-in-motion/) | Codrops, 2025 | A | A corporate grid can remain rigorous while motion and imagery express domain energy; tune GPU work against trust and clarity. | Assuming institutional brands need either sterile UI or maximal WebGL. |
| 53 | [Hello Robo Rebrand](https://tympanus.net/codrops/2025/07/14/hello-robos-rebrand-distilling-complex-tech-into-interfaces-anyone-can-use/) | Codrops, 2025 | A | Interview clients before styling, then translate their language into precise visual and interaction rules for complex products. | Generic dark-tech styling without product evidence. |
| 54 | [Meet Your Legend](https://tympanus.net/codrops/2025/07/17/designing-momentum-the-story-behind-meet-your-legend/) | Codrops, 2025 | A | Turn a brand idea into a throughline across identity, information architecture, booking, typography, and motion. | Cinematic preludes that delay the mentor or transaction path. |
| 55 | [Aether 1](https://tympanus.net/codrops/2025/08/06/building-aether-1-sound-without-boundaries/) | Codrops, 2025 | A | Treat fictional product experiments as explicit sandboxes; bake assets, gate rendering, and profile mobile before claiming transferability. | Presenting a technical demo as proven commerce UX. |
| 56 | [Christian Fleming: Print, Web, and 3D](https://tympanus.net/codrops/2025/08/14/setting-the-stage-inside-the-process-of-bringing-christian-flemings-work-to-life-in-print-web-and-3d/) | Codrops, 2025 | A | Build one modular editorial system that survives print, web, changing image ratios, permissions, and frequent content updates. | Minimalism that depends on fixed demo content. |
| 57 | [New Jitter Website](https://tympanus.net/codrops/2025/09/02/a-behind-the-scenes-look-at-the-new-jitter-website/) | Codrops, 2025 | A | Use product research to shift from features to benefits, and make motion prototypes a shared source of truth for design and engineering. | Demonstrating a motion product with generic decorative animation. |
| 58 | [LO2S × SNP & DashDigital](https://tympanus.net/codrops/2025/09/19/lo2s-x-snp-dashdigital-designing-a-website-full-of-movement-and-energy/) | Codrops, 2025 | A | When movement is the brand premise, make media compression, transitions, and runtime performance part of the same production plan. | Full-screen video without loading and fallback budgets. |
| 59 | [NITEX](https://tympanus.net/codrops/2025/10/10/nitex-building-a-brand-and-digital-platform-for-fashions-new-supply-chain/) | Codrops, 2025 | A | Split narrative and action paths for multi-audience platforms; give deep overlays URLs and keep complex content addressable. | Forcing conversion users through an immersive scroll story. |
| 60 | [Forged.build](https://tympanus.net/codrops/2025/10/20/from-garage-to-browser-forged-build-and-the-webgpu-revolution/) | Codrops, 2025 | A | A spatial studio can feel like a place when world-building is the brand; combine baked realism with selective real-time behavior. | Building a custom WebGPU engine for a conventional portfolio. |
| 61 | [OPTIKKA Frame Sequences](https://tympanus.net/codrops/2025/10/16/creating-smooth-scroll-synchronized-animation-for-optikka-from-html5-video-to-frame-sequences/) | Codrops, 2025 | A | Choose frame sequences only when exact scroll control warrants request count, memory, preprocessing, and device-specific variants. | Replacing ordinary video with hundreds of frames by default. |
| 62 | [Windsurf × Metalab](https://tympanus.net/codrops/2025/11/17/windsurf-x-metalab-building-a-new-brand-for-the-future-of-ai-coding/) | Codrops, 2025 | A | Differentiate an AI product with a governing metaphor that spans naming, mark, type, iconography, product feeling, and motion. | Another fluid gradient with no relationship to product behavior. |
| 63 | [Spain Collection](https://tympanus.net/codrops/2025/12/18/spain-collection-evolving-a-luxury-website-into-a-digital-ecosystem/) | Codrops, 2025 | A | Luxury travel needs a scalable editorial ecosystem and service narrative, not isolated cinematic pages. | Equating exclusivity with slow navigation and hidden utility. |
| 64 | [Naked City Films](https://tympanus.net/codrops/2026/01/19/naked-city-films-designing-and-building-a-website-that-refuses-to-stand-still/) | Codrops, 2026 | A | Pair intensity with restraint and build custom systems only where they preserve the production studio's rhythm and control. | Effect variety that competes with the films. |
| 65 | [Motion layout animations](https://motion.dev/docs/react-layout-animations) | Motion official docs | B | Use transform-based layout and shared-element continuity for React state changes that users need to track spatially. | Applying shared-layout motion to unrelated elements. |
| 66 | [Motion scroll](https://motion.dev/docs/scroll) | Motion official docs | B | Use a small scroll signal or timeline when it cleanly maps progress to a property; keep reading independent of the effect. | Replacing native scroll semantics with a visual demo. |
| 67 | [Motion for React](https://motion.dev/docs/react) | Motion official docs | B | Route gestures, presence, springs, and layout behavior through one React-aligned state model. | Installing Motion for isolated hover transitions CSS can handle. |
| 68 | [Anime.js timeline](https://animejs.com/documentation/timeline/) | Anime.js official docs | B | Synchronize deterministic animation, timers, callbacks, and labels when exact sequencing is the core need. | A timeline for independent component feedback. |
| 69 | [Anime.js stagger](https://animejs.com/documentation/utilities/stagger/) | Anime.js official docs | B | Distribute time or values when sequence explains grouping or order. | Identical staggered entrance animation on every section. |
| 70 | [Anime.js scope](https://animejs.com/documentation/scope/) | Anime.js official docs | B | Scope animations by root, media query, and reduced-motion state so responsive components can cleanly revert. | Global selectors and unreverted animations in routed apps. |
| 71 | [Anime.js SVG morphing](https://animejs.com/documentation/svg/morphto/) | Anime.js official docs | B | Morph vector states when shape continuity carries meaning and paths are intentionally prepared. | Morphing decorative blobs because the API exists. |
| 72 | [Anime.js WAAPI improvements](https://animejs.com/documentation/web-animation-api/improvements-to-the-web-animation-api/) | Anime.js official docs | B | Combine native animation performance with Anime.js sequencing only when the hybrid capability is actively used. | Loading both APIs without a routing reason. |
| 73 | [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) | GSAP official docs | B | Use pin, scrub, snap, and responsive scroll orchestration for genuinely temporal narratives. | Pinning long reading content or normalizing scroll by default. |
| 74 | [GSAP Flip](https://gsap.com/docs/v3/Plugins/Flip/) | GSAP official docs | B | Preserve spatial continuity across complex DOM layout states when native/View Transition options are insufficient. | FLIP for a simple expand/collapse. |
| 75 | [GSAP SplitText](https://gsap.com/docs/v3/Plugins/SplitText/) | GSAP official docs | B | Split only the needed text unit, preserve screen-reader semantics, and resplit after fonts or widths change. | Character animation on body copy or broken inline-link semantics. |
| 76 | [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia%28%29/) | GSAP official docs | B | Author distinct motion setups by viewport and preference, with automatic cleanup when conditions change. | Shrinking desktop timelines with numeric multipliers. |
| 77 | [GSAP MotionPath](https://gsap.com/docs/v3/Plugins/MotionPathPlugin/) | GSAP official docs | B | Move an object along a path when trajectory communicates route, process, or physical behavior. | Curved flight paths as atmosphere. |
| 78 | [GSAP Observer](https://gsap.com/docs/v3/Plugins/Observer/) | GSAP official docs | B | Unify directional pointer, touch, wheel, and scroll intent only when the interface also provides direct controls. | Hijacking navigation without keyboard or single-pointer alternatives. |
| 79 | [GSAP quickTo](https://gsap.com/docs/v3/GSAP/gsap.quickTo%28%29/) | GSAP official docs | B | Reuse optimized setters for high-frequency pointer response instead of creating a new tween per event. | Continuous cursor effects that add no meaning. |
| 80 | [Lenis](https://github.com/darkroomengineering/lenis) | Lenis official repository | B | Add smooth interpolation only when synchronized WebGL, parallax, or a named motion language needs a normalized signal. | Installing Lenis as an automatic premium-site dependency. |
| 81 | [Three.js responsive rendering](https://threejs.org/manual/en/responsive.html) | Three.js official manual | B | Resize renderer, camera, and pixel density from the actual canvas while capping costly resolution. | Rendering every device at unrestricted DPR. |
| 82 | [Three.js cleanup](https://threejs.org/manual/en/cleanup.html) | Three.js official manual | B | Dispose geometries, materials, textures, and scene resources when content changes or routes unmount. | Assuming JavaScript garbage collection frees GPU memory. |
| 83 | [Three.js OffscreenCanvas](https://threejs.org/manual/en/offscreencanvas.html) | Three.js official manual | B | Move rendering to a worker only when main-thread contention justifies message-passing and fallback complexity. | Workers as a substitute for scene simplification. |
| 84 | [Three.js post-processing](https://threejs.org/manual/en/post-processing.html) | Three.js official manual | B | Build explicit render passes when the visual material needs them, and budget every full-screen pass. | Bloom, blur, and grain stacked as automatic cinematic polish. |
| 85 | [R3F scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance) | React Three Fiber official docs | B | Use on-demand rendering, instancing, performance monitoring, and quality regression to serve weaker devices. | A permanent 60 fps loop for static scenes. |
| 86 | [R3F loading models](https://r3f.docs.pmnd.rs/tutorials/loading-models) | React Three Fiber official docs | B | Prefer glTF, preload intentionally, expose progress, and turn models into maintainable scene components. | Blocking the page behind an unexplained 3D load. |
| 87 | [R3F hooks and asset loading](https://r3f.docs.pmnd.rs/api/hooks) | React Three Fiber official docs | B | Keep frame-loop work outside React state and respect cached asset ownership and disposal. | Per-frame state updates or disposing shared cached assets. |
| 88 | [Rive state machines](https://rive.app/docs/runtimes/state-machines) | Rive official docs | B | Let designer-authored states settle when idle and control them through explicit product inputs. | Using a continuous linear animation where a state machine is expected. |
| 89 | [Rive data binding](https://rive.app/docs/runtimes/web/data-binding) | Rive official docs | B | Connect interface data to authored vector behavior through typed view-model properties. | Treating Rive as a decorative video layer. |
| 90 | [Rive web layout](https://rive.app/docs/runtimes/web/layouts) | Rive official docs | B | Author responsive fit, alignment, bounds, DPR, and layout behavior together in editor and runtime. | Scaling one fixed artboard across all contexts. |
| 91 | [Rive Canvas vs WebGL2](https://rive.app/docs/runtimes/web/canvas-vs-webgl) | Rive official docs | B | Select runtime by rendering features, package size, context count, and the number of simultaneous instances. | One WebGL context per small icon. |
| 92 | [Rive runtime sizes](https://rive.app/docs/runtimes/runtime-sizes) | Rive official docs | B | Include WASM/runtime weight in the decision before adopting Rive for minor embellishment. | Ignoring runtime cost because the `.riv` asset is small. |
| 93 | [Rive web parameters and profiling](https://rive.app/docs/runtimes/web/rive-parameters) | Rive official docs | B | Use offscreen sharing, listener controls, explicit playback, and performance marks to tune real deployments. | Autoplaying every instance and guessing at startup cost. |
| 94 | [Spline code export](https://docs.spline.design/exporting-your-scene/web/exporting-as-code) | Spline official docs | B | Choose embed, runtime, Three, React, or R3F export based on ownership and interaction requirements. | Selecting an export path before the production integration model is known. |
| 95 | [Spline variables](https://docs.spline.design/interaction-states-events-and-actions/variables) | Spline official docs | B | Use variables and state changes when a designer-owned scene needs product data and reusable behavior. | Encoding business-critical state only inside the scene. |
| 96 | [Spline scene optimization](https://docs.spline.design/exporting-your-scene/how-to-optimize-your-scene) | Spline official docs | B | Review the performance panel, geometry, materials, textures, and play settings before export. | Shipping the editor preview unchanged. |
| 97 | [Theatre.js with React Three Fiber](https://www.theatrejs.com/docs/latest/getting-started/with-react-three-fiber) | Theatre.js official docs | B | Author synchronized scene timelines visually, export project state, and exclude Studio from production. | Bundling the authoring UI or localStorage state in release builds. |
| 98 | [Theatre.js extensions](https://www.theatrejs.com/docs/latest/extensions) | Theatre.js official docs | B | Add timeline authoring where a stable extension boundary reduces designer–developer translation loss. | Theatre.js for isolated CSS transitions. |
| 99 | [Web Animations API](https://developer.mozilla.org/docs/Web/API/Web_Animations_API) | MDN web platform docs | B | Use native keyframe and playback control for progressive, dependency-free component motion. | Reimplementing complex state orchestration with unmanaged animations. |
| 100 | [CSS Scroll-Driven Animations](https://developer.mozilla.org/docs/Web/CSS/CSS_scroll-driven_animations) | MDN web platform docs | B | Prefer declarative scroll progress and view timelines for simple supported effects with readable fallbacks. | Making comprehension depend on an unsupported scroll timeline. |

## Pattern clusters distilled from the atlas

### 1. One governing metaphor beats many effects
The strongest cases repeatedly anchor visuals and motion to one brand/content idea. Require a named **signature concept** before adding a signature interaction.

### 2. Presence, not volume
Premium work commonly alternates intensity and rest. Use an energy curve: `tension → release → focal moment → pause → resolution`.

### 3. Content and interaction must share a verb
Examples: inspect a stamp, navigate a spatial portfolio, reveal a map, reflow a grid. Prefer interactions whose verb belongs naturally to the content.

### 4. Editorial systems are a high-value default
Asymmetry, controlled measure, deliberate whitespace, cropping, type scale and pacing often create more distinction than decorative effects.

### 5. Technology follows the visual problem
SVG for crisp explanatory paths, DOM/native for ordinary UI, Motion for React state/layout, Anime.js for precise sequencing, GSAP for advanced orchestration, Three/R3F for genuine spatial/3D problems, WebGPU only when its capability is justified.

### 6. Mobile is a different composition and motion budget
Never port desktop choreography mechanically. Reduce simultaneous motion, shorten spatial travel, preserve task access and reconsider sticky/pinned sequences.

### 7. Performance is art direction
Renderer tiers, selective rendering, lazy loading and reduced motion change what can responsibly be designed. Treat them as concept constraints, not engineering cleanup.

## How Codex should use this atlas

1. Select **3–6 references** relevant to the current business, content and interaction problem.
2. State the evidence level for each.
3. Extract no more than **1–2 principles per reference**.
4. Recombine principles through the project’s own brand and content.
5. Reject any principle that weakens usability, accessibility, performance or authenticity.
6. Never claim a C-level benchmark uses a specific mechanic until the actual site/screenshots have been inspected.

## Source hubs

- Codrops case studies: https://tympanus.net/codrops/tag/case-study/
- Codrops Creative Hub: https://tympanus.net/codrops/hub/all/codrops/
- Awwwards case studies: https://www.awwwards.com/blog/?tag=case-study&text=web+design
- Awwwards website collections/awards: https://www.awwwards.com/websites/
