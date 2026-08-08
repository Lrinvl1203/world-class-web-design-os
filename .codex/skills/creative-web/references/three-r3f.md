# Three.js / React Three Fiber

Prefer Three.js when direct renderer/scene/shader control is the goal. Prefer React Three Fiber when the scene should compose with React state and components.

Performance levers:
- render on demand when continuous animation is unnecessary;
- reuse geometries/materials/textures;
- use instancing for repeated meshes;
- control DPR and post-processing;
- use LOD/adaptive quality where meaningful;
- profile draw calls, texture memory and main-thread work;
- avoid rendering a hidden scene.

Do not put critical readable copy exclusively into WebGL.
