import type { JSX } from "react";
import { StyleSheet, Text, View } from "react-native";

import { PERCENT_SCALE } from "../core/constants";
import type { NormalizedDatum } from "../types";

export interface RadialChartLabelsProps {
	/** Normalized data to describe in the legend. */
	data: readonly NormalizedDatum[];
	/** Text color for labels/values. Defaults to a neutral dark tone. */
	textColor?: string;
}

const DEFAULT_TEXT_COLOR = "#111827";

/** Solid swatch color for a datum (first gradient stop, or its color). */
function swatchColor(datum: NormalizedDatum): string {
	if (datum.gradient && datum.gradient.stops.length > 0) {
		return datum.gradient.stops[0].color;
	}
	return datum.color;
}

/** Percentage to show — the true (possibly > 100) value when overflowing. */
function displayPercent(datum: NormalizedDatum): number {
	return datum.rawFraction > 1 ? Math.round(datum.rawFraction * PERCENT_SCALE) : datum.percent;
}

/** Accessible, color-independent legend rendered below the chart. */
export function RadialChartLabels(props: RadialChartLabelsProps): JSX.Element | null {
	const { data, textColor = DEFAULT_TEXT_COLOR } = props;

	if (data.length === 0) {
		return null;
	}

	return (
		<View style={styles.legend}>
			{data.map((datum, index) => (
				<View key={`${datum.label}-${index}`} style={styles.item}>
					<View style={[styles.swatch, { backgroundColor: swatchColor(datum) }]} />
					<Text style={[styles.label, { color: textColor }]} numberOfLines={1}>
						{datum.label}
					</Text>
					<Text style={[styles.value, { color: textColor }]} numberOfLines={1}>
						{datum.value}/{datum.max} ({displayPercent(datum)}%)
					</Text>
				</View>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	legend: {
		marginTop: 12,
		gap: 6,
		alignSelf: "stretch",
	},
	item: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	swatch: {
		width: 12,
		height: 12,
		borderRadius: 3,
	},
	label: {
		fontSize: 13,
		fontWeight: "600",
		flexShrink: 1,
	},
	value: {
		fontSize: 13,
		marginLeft: "auto",
		opacity: 0.7,
	},
});
