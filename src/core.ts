/**
 * Framework-agnostic core for `multi-layer-radial-chart-native`.
 *
 * This entry point ships only pure geometry, scaling, layout, validation and
 * color helpers — **no React and no React Native**. Import it to compute
 * radial-chart geometry and render it with any view layer (a `<canvas>`,
 * Skia, a server, or another framework):
 *
 * ```ts
 * import {
 *   validateData,
 *   computeRingLayout,
 *   describeArc,
 * } from "multi-layer-radial-chart-native/core";
 * ```
 */

export type { GradientVector, MarkerLine } from "./core/geometry";
export {
	describeArc,
	describeArcSegment,
	gradientVector,
	markerLine,
	polarToCartesian,
} from "./core/geometry";
export { computeRingLayout } from "./core/layout";
export { toFraction, toPercent, toRawFraction } from "./core/scale";
export type {
	NormalizedDatum,
	Point,
	RadialDatum,
	RingGradient,
	RingGradientStop,
	RingGradientType,
	RingLayout,
	RingPattern,
} from "./types";
export { contrastingColor, contrastShadow } from "./utils/color";
export { normalizeDatum, validateData } from "./utils/validation";
