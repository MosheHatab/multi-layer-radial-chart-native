/** Angular constants (degrees). */
export const DEGREES_IN_CIRCLE = 360;
export const DEGREES_IN_HALF_CIRCLE = 180;

/** Percentage scale (fraction -> percent). */
export const PERCENT_SCALE = 100;

/** Cubic easing exponent used by {@link easeOutCubic}. */
export const EASE_CUBIC_EXPONENT = 3;

/** Decimal precision for SVG path coordinates. */
export const PATH_PRECISION = 3;

/** Default configuration values for the chart. */
export const DEFAULT_START_ANGLE = -90;
export const DEFAULT_GAP = 6;
export const DEFAULT_ANIMATION_MS = 800;
export const DEFAULT_MAX_SWEEP = DEGREES_IN_CIRCLE;

/** Responsive fallback size (px) when the container has not been measured yet. */
export const MIN_SIZE = 120;

/** Layout guard rails (px). */
export const MIN_RADIUS = 1;
export const MIN_STROKE_WIDTH = 2;
export const MIN_CENTER_HOLE = 16;

/** Dash pattern applied when a datum uses `pattern: "dashed"`. */
export const DASH_ARRAY: number[] = [8, 6];

/** Default direction (degrees) for a linear ring gradient. */
export const DEFAULT_GRADIENT_ANGLE = 0;

/** Stroke width (px) of the inner (dark) goal/threshold marker tick. */
export const MARKER_WIDTH = 2;

/** Stroke width (px) of the outer (light) outline of the marker tick. */
export const MARKER_OUTLINE_WIDTH = 5;

/** How far (px) a marker tick extends beyond each edge of the ring stroke. */
export const MARKER_OVERHANG = 3;

/**
 * Angular length (degrees) of the shadow segment drawn under the leading tip
 * of an overflow lap, giving the second lap a subtle "depth" edge.
 */
export const OVERFLOW_SHADOW_DEGREES = 22;

/** Default tween duration (ms) for {@link useCountUp}. */
export const DEFAULT_COUNT_UP_MS = 800;

/** Default background track color (used when a datum omits `trackColor`). */
export const DEFAULT_TRACK_COLOR = "rgba(120, 120, 128, 0.2)";

/** Default color of the inner (dark) goal/threshold marker tick. */
export const DEFAULT_MARKER_COLOR = "rgba(0, 0, 0, 0.65)";

/** Default color of the outer (light) outline of the marker tick. */
export const DEFAULT_MARKER_OUTLINE_COLOR = "rgba(255, 255, 255, 0.92)";
