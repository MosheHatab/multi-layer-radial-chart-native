import { type JSX, useId } from "react";
import { Defs, G, Line, LinearGradient, Path, RadialGradient, Stop } from "react-native-svg";

import {
	DASH_ARRAY,
	DEFAULT_GRADIENT_ANGLE,
	MARKER_OUTLINE_WIDTH,
	MARKER_OVERHANG,
	MARKER_WIDTH,
	OVERFLOW_SHADOW_DEGREES,
} from "../core/constants";
import { describeArc, describeArcSegment, gradientVector, markerLine } from "../core/geometry";
import { useAnimatedValue } from "../hooks/useAnimatedValue";
import type { NormalizedDatum, RingGradient } from "../types";
import { contrastShadow } from "../utils/color";
import { clamp } from "../utils/math";

const ARIA_MIN = 0;
const ARIA_MAX = 100;
const FULL_OPACITY = 1;
const FULL_FRACTION = 1;

function RingGradientDef({ id, gradient }: { id: string; gradient: RingGradient }): JSX.Element {
	const stops = gradient.stops.map((stop, index) => (
		<Stop
			key={`${id}-${index}`}
			offset={stop.offset}
			stopColor={stop.color}
			stopOpacity={stop.opacity ?? FULL_OPACITY}
		/>
	));

	if (gradient.type === "radial") {
		return (
			<RadialGradient id={id} cx="50%" cy="50%" r="50%">
				{stops}
			</RadialGradient>
		);
	}

	const vector = gradientVector(gradient.angle ?? DEFAULT_GRADIENT_ANGLE);
	return (
		<LinearGradient id={id} x1={vector.x1} y1={vector.y1} x2={vector.x2} y2={vector.y2}>
			{stops}
		</LinearGradient>
	);
}

export interface RadialRingProps {
	/** Centre coordinate (both axes) in SVG user space. */
	center: number;
	/** Centre-line radius of this ring. */
	radius: number;
	/** Stroke width of this ring. */
	strokeWidth: number;
	/** Normalized datum for this ring. */
	datum: NormalizedDatum;
	/** Angle (degrees) where the arc begins. */
	startAngle: number;
	/** Draw the arc clockwise. */
	clockwise: boolean;
	/** Round the stroke line caps. */
	rounded: boolean;
	/** Allow the arc to overrun as an overlapping extra lap when past 100%. */
	allowOverflow: boolean;
	/** Animate transitions of the progress value. */
	animate: boolean;
	/** Tween duration in milliseconds. */
	durationMs: number;
	/** Total sweep in degrees (360 = full circle). */
	maxSweepDegrees: number;
	/** Background track color used when the datum omits its own `trackColor`. */
	trackColor: string;
	/** Color of the inner (dark) goal/threshold marker tick. */
	markerColor: string;
	/** Color of the outer (light) outline of the goal/threshold marker tick. */
	markerOutlineColor: string;
	/** Press callback. When provided the ring becomes pressable. */
	onPress?: (datum: NormalizedDatum) => void;
}

/**
 * A single concentric ring: a background track plus an animated progress arc,
 * rendered with `react-native-svg`. Pure/presentational — all geometry comes
 * from `core/`.
 */
export function RadialRing(props: RadialRingProps): JSX.Element {
	const {
		center,
		radius,
		strokeWidth,
		datum,
		startAngle,
		clockwise,
		rounded,
		allowOverflow,
		animate,
		durationMs,
		maxSweepDegrees,
		trackColor,
		markerColor,
		markerOutlineColor,
		onPress,
	} = props;

	const targetFraction = allowOverflow ? datum.rawFraction : datum.fraction;
	const animatedFraction = useAnimatedValue(targetFraction, durationMs, animate);
	const baseFraction = Math.min(animatedFraction, FULL_FRACTION);
	const overflowFraction = allowOverflow ? clamp(animatedFraction - FULL_FRACTION, 0, 1) : 0;

	const gradientId = useId();
	const strokePaint = datum.gradient ? `url(#${gradientId})` : datum.color;

	const trackPath = describeArc(center, center, radius, 1, startAngle, clockwise, maxSweepDegrees);
	const progressPath = describeArc(
		center,
		center,
		radius,
		baseFraction,
		startAngle,
		clockwise,
		maxSweepDegrees,
	);
	const overflowPath =
		overflowFraction > 0
			? describeArc(center, center, radius, overflowFraction, startAngle, clockwise, maxSweepDegrees)
			: "";

	const marker =
		datum.thresholdFraction !== undefined
			? markerLine(
					center,
					center,
					radius,
					strokeWidth,
					datum.thresholdFraction,
					startAngle,
					clockwise,
					maxSweepDegrees,
					MARKER_OVERHANG,
				)
			: null;

	// Shadow segment: a short sub-arc at the leading tip, drawn UNDER the full
	// overflow lap so the second lap reads as sitting on top of the first, with
	// a subtle depth edge only at the end (never at the 12 o'clock start).
	// react-native-svg has no CSS blur filter, so we approximate depth with a
	// contrast-colored segment (light on dark rings, dark on light rings).
	const shadowFraction = OVERFLOW_SHADOW_DEGREES / maxSweepDegrees;
	const overflowShadowPath =
		overflowFraction > 0
			? describeArcSegment(
					center,
					center,
					radius,
					Math.max(overflowFraction - shadowFraction, 0),
					overflowFraction,
					startAngle,
					clockwise,
					maxSweepDegrees,
				)
			: "";
	const overflowShadowColor = contrastShadow(datum.color);

	const accessibleName = `${datum.label}: ${datum.value}/${datum.max} (${datum.percent}%)`;
	const lineCap = rounded ? "round" : "butt";
	const dashArray = datum.pattern === "dashed" ? DASH_ARRAY : undefined;
	const isPressable = typeof onPress === "function";

	const handlePress = (): void => {
		onPress?.(datum);
	};

	return (
		<G
			accessible
			accessibilityRole="progressbar"
			accessibilityLabel={accessibleName}
			accessibilityValue={{ min: ARIA_MIN, max: ARIA_MAX, now: datum.percent }}
			onPress={isPressable ? handlePress : undefined}
		>
			{datum.gradient ? (
				<Defs>
					<RingGradientDef id={gradientId} gradient={datum.gradient} />
				</Defs>
			) : null}
			{trackPath ? (
				<Path
					d={trackPath}
					fill="none"
					stroke={datum.trackColor ?? trackColor}
					strokeWidth={strokeWidth}
					strokeLinecap={lineCap}
				/>
			) : null}
			{progressPath ? (
				<Path
					d={progressPath}
					fill="none"
					stroke={strokePaint}
					strokeWidth={strokeWidth}
					strokeLinecap={lineCap}
					strokeDasharray={dashArray}
				/>
			) : null}
			{overflowPath ? (
				<G>
					{overflowShadowPath ? (
						<Path
							d={overflowShadowPath}
							fill="none"
							stroke={overflowShadowColor}
							strokeWidth={strokeWidth}
							strokeLinecap={lineCap}
						/>
					) : null}
					<Path
						d={overflowPath}
						fill="none"
						stroke={strokePaint}
						strokeWidth={strokeWidth}
						strokeLinecap={lineCap}
						strokeDasharray={dashArray}
					/>
				</G>
			) : null}
			{marker ? (
				<G>
					<Line
						x1={marker.inner.x}
						y1={marker.inner.y}
						x2={marker.outer.x}
						y2={marker.outer.y}
						stroke={markerOutlineColor}
						strokeWidth={MARKER_OUTLINE_WIDTH}
						strokeLinecap="round"
					/>
					<Line
						x1={marker.inner.x}
						y1={marker.inner.y}
						x2={marker.outer.x}
						y2={marker.outer.y}
						stroke={markerColor}
						strokeWidth={MARKER_WIDTH}
						strokeLinecap="round"
					/>
				</G>
			) : null}
		</G>
	);
}
