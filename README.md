# multi-layer-radial-chart-native

**Animated, multi-layer radial (activity-ring) charts for React Native — powered by `react-native-svg`, written in strict TypeScript.**

[![npm version](https://img.shields.io/npm/v/multi-layer-radial-chart-native.svg)](https://www.npmjs.com/package/multi-layer-radial-chart-native)
[![npm downloads](https://img.shields.io/npm/dm/multi-layer-radial-chart-native.svg)](https://www.npmjs.com/package/multi-layer-radial-chart-native)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/multi-layer-radial-chart-native)](https://bundlephobia.com/package/multi-layer-radial-chart-native)
[![CI](https://github.com/MosheHatab/multi-layer-radial-chart-native/actions/workflows/ci.yml/badge.svg)](https://github.com/MosheHatab/multi-layer-radial-chart-native/actions/workflows/ci.yml)
[![provenance](https://img.shields.io/npm/v/multi-layer-radial-chart-native?label=provenance&logo=npm)](https://www.npmjs.com/package/multi-layer-radial-chart-native#provenance)
[![types](https://img.shields.io/npm/types/multi-layer-radial-chart-native.svg)](https://www.npmjs.com/package/multi-layer-radial-chart-native)
[![license](https://img.shields.io/npm/l/multi-layer-radial-chart-native.svg)](./LICENSE)

Give it an array of `{ value, max, color, label }` and it renders concentric rings — like Apple Watch activity rings — with smooth `requestAnimationFrame` animations, responsive sizing, gradients, overflow laps, goal markers, and a built-in legend. All the math is pure and framework-agnostic; the view layer is a thin `react-native-svg` wrapper.

> **Using React on the web?** See the sibling package [`multi-layer-radial-chart`](https://www.npmjs.com/package/multi-layer-radial-chart) — this is its **React Native** port. Same core engine and API surface, adapted to `react-native-svg` and native platform APIs.

<p align="center">
  <img src="https://raw.githubusercontent.com/MosheHatab/multi-layer-radial-chart-native/main/docs/demo.gif" alt="Multi-Layer Radial Chart Native — animated activity rings with live controls" width="360" />
</p>

### Demo

A runnable **Expo** demo lives in [`example/`](./example) — it showcases activity rings with a count-up center, live controls (animate, rounded, legend, overflow), plus gradient, overflow, goal-marker, gauge, and dashed cards with automatic light/dark theming:

```sh
cd example
npm install
npm run start        # press a / i / w for Android / iOS / web
```

> Prefer a hosted playground? Try it on [**Expo Snack**](https://snack.expo.dev/@moshehat/multi-layer-radial-chart-native) — the React Native equivalent of StackBlitz (runs in the browser and on a device via QR).

---

## Features

- **Multi-layer rings** — any number of concentric series, outermost first.
- **Smooth animation** — `requestAnimationFrame` tween with ease-out cubic; honors the OS "Reduce Motion" setting via `AccessibilityInfo`.
- **Responsive** — omit `size` and the chart measures its container with `onLayout`, or pass a fixed `size`.
- **Gradients** — per-ring `linear` / `radial` gradients using native `<LinearGradient>` / `<RadialGradient>`.
- **Overflow laps** — Apple-Watch-style overlapping extra lap when a value exceeds `max` (`allowOverflow`).
- **Goal / threshold markers** — a tick on the track marking a target, with a light outline so it stays visible on any color.
- **Gauge & semicircle** — set `maxSweepDegrees` (e.g. `270` gauge, `180` semicircle).
- **Interactivity** — `onSegmentPress(datum, index)` makes each ring pressable.
- **Center content** — render any node (count-up total, icon, label) in the middle.
- **Accessible** — the chart exposes an `image` role with a summary label, and each ring exposes a `progressbar` role with `accessibilityValue`. The legend is color-independent.
- **Headless** — `useRadialChart()` returns validated geometry and ready-to-use SVG path strings so you can draw the rings yourself.
- **Framework-agnostic core** — import `multi-layer-radial-chart-native/core` for pure geometry/scale/validation with **zero React/RN** at runtime.
- **Strict typing** — no `any`, fully typed public API, math fully decoupled from the UI.

---

## Architecture highlights

> **Challenge:** An SVG elliptical arc (`A` command) cannot draw a full 360° circle — the start and end points coincide, so the arc collapses and renders nothing.
> **Solution:** `describeArc` detects a full sweep and emits **two half-arcs** instead, while still supporting partial sweeps (gauges/semicircles) through a single `sweepDegrees` parameter. This lives in a pure, unit-tested `core/geometry` module with **zero React/RN**, keeping trigonometry completely separate from the rendering layer.

> **Challenge:** Animating many rings without stale closures or leaked animation frames.
> **Solution:** A dedicated `useAnimatedValue` hook owns one `requestAnimationFrame` loop per ring, restarts cleanly from the currently displayed value when the target changes, and always cancels the frame on cleanup. Per-ring hooks live inside the `RadialRing` component (never inside a `.map()`), respecting the Rules of Hooks.

> **Challenge:** The web version leans on the DOM (`ResizeObserver`, `matchMedia`, CSS variables) that don't exist in React Native.
> **Solution:** Only the thin adapter layer changed — sizing moved to `View` `onLayout`, reduced-motion to `AccessibilityInfo`, and theming to explicit props. The entire `core/` + `utils/` math layer is shared **verbatim** with the web package.

## Tech stack

- **Language / UI:** TypeScript (strict), React, React Native
- **Rendering:** [`react-native-svg`](https://github.com/software-mansion/react-native-svg)
- **Native APIs:** `requestAnimationFrame`, `View` `onLayout`, `AccessibilityInfo`
- **Tooling:** [`react-native-builder-bob`](https://github.com/callstack/react-native-builder-bob) (build), Vitest (core tests), ESLint, Changesets, Expo (demo)

---

## Installation

```sh
npm install multi-layer-radial-chart-native react-native-svg
# or
yarn add multi-layer-radial-chart-native react-native-svg
```

`react`, `react-native`, and `react-native-svg` are **peer dependencies**.

**Expo:**

```sh
npx expo install react-native-svg
npm install multi-layer-radial-chart-native
```

**Bare React Native:** after installing `react-native-svg`, run `cd ios && pod install` (iOS).

---

## Quick start

```tsx
import { RadialChart } from "multi-layer-radial-chart-native";
import { View } from "react-native";

const data = [
	{ value: 82, max: 100, color: "#fb2576", label: "Move" },
	{ value: 45, max: 60, color: "#22d3ee", label: "Exercise" },
	{ value: 9, max: 12, color: "#a3e635", label: "Stand" },
];

export function Activity() {
	return (
		<View style={{ padding: 24 }}>
			<RadialChart data={data} size={220} showLegend />
		</View>
	);
}
```

---

## Props (`RadialChart`)

| Prop                 | Type                                        | Default        | Description                                                       |
| -------------------- | ------------------------------------------- | -------------- | ---------------------------------------------------------------- |
| `data`               | `RadialDatum[]`                             | —              | Series to render, **outermost ring first**. (required)           |
| `size`               | `number`                                    | container width | Fixed square size in px. Omit to size responsively via `onLayout`. |
| `startAngle`         | `number`                                    | `-90`          | Angle (deg) where every arc begins (`-90` = 12 o'clock).         |
| `gap`                | `number`                                    | `6`            | Pixel gap between adjacent rings.                                 |
| `ringWidth`          | `number`                                    | auto           | Fixed stroke width; auto-derived from `size`/count when omitted. |
| `rounded`            | `boolean`                                   | `true`         | Round the arc line caps.                                          |
| `allowOverflow`      | `boolean`                                   | `false`        | Let values above `max` overrun as an overlapping extra lap.      |
| `animate`            | `boolean`                                   | `true`         | Animate value transitions.                                       |
| `animationDurationMs`| `number`                                    | `800`          | Tween duration in ms.                                            |
| `clockwise`          | `boolean`                                   | `true`         | Draw arcs clockwise.                                             |
| `maxSweepDegrees`    | `number`                                    | `360`          | Total sweep in deg (`270` gauge, `180` semicircle).             |
| `showLegend`         | `boolean`                                   | `false`        | Render the built-in legend below the chart.                     |
| `percentDecimals`    | `number`                                    | `0`            | Decimal places for legend percentages.                          |
| `onSegmentPress`     | `(datum, index) => void`                    | —              | Press a ring. Providing this makes each ring pressable.         |
| `trackColor`         | `string`                                    | translucent gray | Background track color when a datum omits `trackColor`.       |
| `markerColor`        | `string`                                    | dark           | Inner (dark) goal/threshold marker tick color.                  |
| `markerOutlineColor` | `string`                                    | light          | Outer (light) outline of the marker tick.                       |
| `legendTextColor`    | `string`                                    | `#111827`      | Text color for the built-in legend.                             |
| `style`              | `StyleProp<ViewStyle>`                      | —              | Extra style for the outer container `View`.                     |
| `children`           | `ReactNode`                                 | —              | Content rendered in the centre (absolutely positioned).        |

### `RadialDatum`

```ts
interface RadialDatum {
	value: number; // current value (clamped to [0, max] unless allowOverflow)
	max: number; // upper bound (> 0)
	color: string; // progress color
	label: string; // legend + accessible name
	trackColor?: string; // per-ring track override
	pattern?: "solid" | "dashed"; // color-independent differentiation
	gradient?: RingGradient; // overrides `color`
	threshold?: number; // goal marker, in the same units as `value`
}
```

---

## Recipes

### Responsive sizing

Omit `size` and wrap the chart in a container with a known width — it measures itself via `onLayout`:

```tsx
<View style={{ width: "100%" }}>
	<RadialChart data={data} />
</View>
```

### Center content with a count-up total

```tsx
import { RadialChart, useCountUp } from "multi-layer-radial-chart-native";
import { Text } from "react-native";

function CenteredChart() {
	const total = 82;
	const shown = useCountUp(total, { durationMs: 900 });
	return (
		<RadialChart data={data} size={220}>
			<Text style={{ fontSize: 34, fontWeight: "700" }}>{shown}%</Text>
		</RadialChart>
	);
}
```

### Gauge / semicircle

```tsx
<RadialChart data={data} maxSweepDegrees={270} startAngle={135} />
```

### Gradients

```tsx
const data = [
	{
		value: 82,
		max: 100,
		label: "Move",
		color: "#fb2576", // fallback for the legend swatch
		gradient: {
			type: "linear",
			angle: 45,
			stops: [
				{ offset: 0, color: "#fb2576" },
				{ offset: 1, color: "#7b2ff7" },
			],
		},
	},
];
```

### Overflow (values above 100%)

```tsx
<RadialChart data={[{ value: 140, max: 100, color: "#fb2576", label: "Move" }]} allowOverflow />
```

### Goal / threshold marker

```tsx
<RadialChart data={[{ value: 68, max: 100, color: "#22d3ee", label: "Exercise", threshold: 80 }]} />
```

### Interactivity

```tsx
<RadialChart
	data={data}
	onSegmentPress={(datum, index) => console.log("pressed", index, datum.label)}
/>
```

---

## Headless usage (`useRadialChart`)

Compute geometry and draw the rings with your own `react-native-svg` markup:

```tsx
import { useRadialChart } from "multi-layer-radial-chart-native";
import Svg, { Path } from "react-native-svg";

function Headless() {
	const { center, rings } = useRadialChart(data, { size: 240, gap: 8 });
	return (
		<Svg width={240} height={240} viewBox="0 0 240 240">
			{rings.map((ring) => (
				<Path
					key={ring.datum.label}
					d={ring.progressPath}
					fill="none"
					stroke={ring.datum.color}
					strokeWidth={ring.strokeWidth}
					strokeLinecap="round"
				/>
			))}
		</Svg>
	);
}
```

---

## Framework-agnostic core (`/core`)

The math is fully decoupled from React and React Native. Import the `/core` subpath for pure geometry, scaling, layout, validation and color helpers with **zero React/RN** in the runtime graph — use it from a `<canvas>`/Skia renderer, a worker, or the server:

```ts
import { validateData, computeRingLayout, describeArc } from "multi-layer-radial-chart-native/core";

const rings = validateData([{ value: 82, max: 100, color: "#fb2576", label: "Move" }]);
const layout = computeRingLayout(rings.length, 240, 6);
const path = describeArc(120, 120, layout[0].radius, rings[0].fraction, -90, true);
```

---

## Differences from the web version

This port keeps the same core engine and API names where they make sense on native. Web-only concepts were adapted:

| Web (`multi-layer-radial-chart`)            | Native (`-native`)                                      |
| ------------------------------------------- | ------------------------------------------------------- |
| SVG DOM elements (`<svg>`, `<path>`, `<g>`) | `react-native-svg` (`Svg`, `Path`, `G`, `Line`, …)      |
| `ResizeObserver`                            | `View` `onLayout`                                       |
| `prefers-reduced-motion` (`matchMedia`)     | `AccessibilityInfo.isReduceMotionEnabled()`             |
| CSS variables / stylesheet                  | Props: `trackColor`, `markerColor`, `legendTextColor`, … |
| `className`                                 | `style` (`StyleProp<ViewStyle>`)                        |
| `onSegmentClick` + keyboard focus           | `onSegmentPress`                                         |
| Hover tooltip (`onSegmentHover`, tooltip)   | Not applicable on touch — omitted                       |
| CSS `blur()` on the overflow shadow         | Approximated with a contrast-colored tip segment        |

---

## Accessibility

- The chart `<Svg>` carries `accessibilityRole="image"` with a summary `accessibilityLabel` (`"Move 82%, Exercise 75%, …"`).
- Each ring carries `accessibilityRole="progressbar"`, an `accessibilityLabel` of `"{label}: {value}/{max} ({percent}%)"`, and `accessibilityValue`.
- Motion honors the OS **Reduce Motion** setting (rings snap instead of tween).
- The legend is color-independent (labels + values), and `pattern: "dashed"` differentiates rings without relying on color alone.

---

## Project structure

```
src/
  core/          # pure math — geometry, scale, layout, constants (no React/RN)
  utils/         # math, color (WCAG contrast), validation (no React/RN)
  hooks/         # useAnimatedValue, useCountUp, useReducedMotion, useElementSize, useRadialChart
  components/    # RadialChart, RadialRing, RadialChartLabels (react-native-svg)
  types.ts       # public types
  index.ts       # main entry
  core.ts        # framework-agnostic /core entry
example/         # runnable Expo demo app (imports the library from ../src)
```

The `core/` and `utils/` folders are copied verbatim from the web package — the geometry and math are identical. Only the hooks and components differ.

---

## Development

```sh
npm install          # install deps

# verify everything (same as CI)
npm run typecheck && npm run lint && npm run test && npm run build && npm run check:package

# run the demo app
cd example
npm install
npm run start        # press a / i / w for Android / iOS / web
```

- `npm run test` runs the pure-`core` unit tests with **Vitest** (no React Native needed — the geometry/scale math is framework-agnostic).
- `npm run build` uses [`react-native-builder-bob`](https://github.com/callstack/react-native-builder-bob) to emit ESM, CommonJS, and TypeScript declaration outputs. Metro consumes the TypeScript `source` directly during development, so edits hot-reload in the demo without a rebuild.
- `npm run check:package` validates the published package layout with [`publint`](https://publint.dev).

CI (`.github/workflows/ci.yml`) runs the same checks on every PR.

---

## Publishing to npm

The package is versioned with [Changesets](https://github.com/changesets/changesets) and published automatically from CI.

```sh
npm run changeset    # describe the change; pick the semver bump
git commit -am "feat: ..." && git push
```

On push to `main`, the `Release` workflow opens a **"Version Packages"** PR. Merging that PR bumps the version, updates `CHANGELOG.md`, and publishes to npm with provenance. Publishing uses npm **OIDC trusted publishing** (configure the package's trusted publisher on npm, or set an `NPM_TOKEN` repository secret).

---

## License

[MIT](./LICENSE) © Moshe Hatab
