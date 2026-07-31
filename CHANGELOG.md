# multi-layer-radial-chart-native

## 1.0.0

### Major Changes

- First stable release.

  ### Added
  - Multi-layer radial (activity-ring) chart rendered with `react-native-svg`.
  - Animated value transitions via `requestAnimationFrame` (honors OS Reduce Motion).
  - Responsive sizing via `View` `onLayout`, or a fixed `size`.
  - Per-ring gradients, overflow laps, threshold markers, and `pattern: "dashed"`.
  - Gauge / semicircle layouts via `maxSweepDegrees`.
  - Interactivity via `onSegmentPress`; center content via `children`.
  - `percentDecimals` for configurable legend percentage precision.
  - `useCountUp` and headless `useRadialChart` hooks.
  - Framework-agnostic `multi-layer-radial-chart-native/core` entry (no React/RN).

  ### Notes
  - Public API is stable under semver.
  - Sibling of [`multi-layer-radial-chart`](https://www.npmjs.com/package/multi-layer-radial-chart); same core engine, adapted for React Native.
