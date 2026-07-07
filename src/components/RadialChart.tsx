import { type JSX, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Svg from "react-native-svg";

import {
	DEFAULT_ANIMATION_MS,
	DEFAULT_GAP,
	DEFAULT_MARKER_COLOR,
	DEFAULT_MARKER_OUTLINE_COLOR,
	DEFAULT_MAX_SWEEP,
	DEFAULT_START_ANGLE,
	DEFAULT_TRACK_COLOR,
	MIN_SIZE,
} from "../core/constants";
import { computeRingLayout } from "../core/layout";
import { useElementSize } from "../hooks/useElementSize";
import { useReducedMotion } from "../hooks/useReducedMotion";
import type { NormalizedDatum, RadialChartProps } from "../types";
import { validateData } from "../utils/validation";
import { RadialChartLabels } from "./RadialChartLabels";
import { RadialRing } from "./RadialRing";

const HALF = 2;

/** Build a concise accessible description of the whole chart. */
function buildChartLabel(data: readonly NormalizedDatum[]): string {
	if (data.length === 0) {
		return "Radial chart with no data";
	}
	const parts = data.map((datum) => `${datum.label} ${datum.percent}%`);
	return `Radial chart: ${parts.join(", ")}`;
}

/**
 * A responsive, animated multi-layer radial (activity-ring) chart for React
 * Native, rendered with `react-native-svg`. Pass an array of `data` (outermost
 * ring first); everything else is optional.
 */
export function RadialChart(props: RadialChartProps): JSX.Element {
	const {
		data,
		size,
		startAngle = DEFAULT_START_ANGLE,
		gap = DEFAULT_GAP,
		ringWidth,
		rounded = true,
		allowOverflow = false,
		animate = true,
		animationDurationMs = DEFAULT_ANIMATION_MS,
		clockwise = true,
		maxSweepDegrees = DEFAULT_MAX_SWEEP,
		showLegend = false,
		percentDecimals,
		onSegmentPress,
		trackColor = DEFAULT_TRACK_COLOR,
		markerColor = DEFAULT_MARKER_COLOR,
		markerOutlineColor = DEFAULT_MARKER_OUTLINE_COLOR,
		legendTextColor,
		style,
		children,
	} = props;

	const normalized = useMemo(() => validateData(data), [data]);
	const [onLayout, measured] = useElementSize();
	const prefersReducedMotion = useReducedMotion();

	const resolvedSize = size ?? (measured.width > 0 ? measured.width : MIN_SIZE);
	const center = resolvedSize / HALF;

	const rings = useMemo(
		() => computeRingLayout(normalized.length, resolvedSize, gap, ringWidth),
		[normalized.length, resolvedSize, gap, ringWidth],
	);

	const shouldAnimate = animate && !prefersReducedMotion;

	return (
		<View style={[styles.container, style]} onLayout={size === undefined ? onLayout : undefined}>
			<View style={{ width: resolvedSize, height: resolvedSize }}>
				<Svg
					width={resolvedSize}
					height={resolvedSize}
					viewBox={`0 0 ${resolvedSize} ${resolvedSize}`}
					accessibilityRole="image"
					accessibilityLabel={buildChartLabel(normalized)}
				>
					{rings.map((ring, index) => {
						const datum = normalized[index];
						return (
							<RadialRing
								key={`${datum.label}-${index}`}
								center={center}
								radius={ring.radius}
								strokeWidth={ring.strokeWidth}
								datum={datum}
								startAngle={startAngle}
								clockwise={clockwise}
								rounded={rounded}
								allowOverflow={allowOverflow}
								animate={shouldAnimate}
								durationMs={animationDurationMs}
								maxSweepDegrees={maxSweepDegrees}
								trackColor={trackColor}
								markerColor={markerColor}
								markerOutlineColor={markerOutlineColor}
								onPress={
									onSegmentPress ? (clicked) => onSegmentPress(clicked, index) : undefined
								}
							/>
						);
					})}
				</Svg>
				{children ? (
					<View style={styles.center} pointerEvents="box-none">
						{children}
					</View>
				) : null}
			</View>
			{showLegend ? (
				<RadialChartLabels
					data={normalized}
					textColor={legendTextColor}
					percentDecimals={percentDecimals}
				/>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
	},
	center: {
		...StyleSheet.absoluteFillObject,
		alignItems: "center",
		justifyContent: "center",
	},
});
