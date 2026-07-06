import { type ReactNode, useCallback, useMemo, useState } from "react";
import {
	Pressable,
	ScrollView,
	StyleSheet,
	Switch,
	Text,
	useColorScheme,
	View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
	RadialChart,
	useCountUp,
	type RadialDatum,
} from "multi-layer-radial-chart-native";

const HERO_DATA: RadialDatum[] = [
	{ value: 82, max: 100, color: "#fb2576", label: "Move" },
	{ value: 45, max: 60, color: "#22d3ee", label: "Exercise" },
	{ value: 9, max: 12, color: "#a3e635", label: "Stand" },
];

const GRADIENT_DATA: RadialDatum[] = [
	{
		value: 88,
		max: 100,
		label: "Focus",
		color: "#7b2ff7",
		gradient: {
			type: "linear",
			angle: 45,
			stops: [
				{ offset: 0, color: "#7b2ff7" },
				{ offset: 1, color: "#f107a3" },
			],
		},
	},
	{
		value: 64,
		max: 100,
		label: "Calm",
		color: "#00c6ff",
		gradient: {
			type: "linear",
			angle: 45,
			stops: [
				{ offset: 0, color: "#00c6ff" },
				{ offset: 1, color: "#0072ff" },
			],
		},
	},
];

const OVERFLOW_DATA: RadialDatum[] = [
	{ value: 145, max: 100, color: "#fb2576", label: "Move" },
	{ value: 72, max: 60, color: "#22d3ee", label: "Exercise" },
];

const THRESHOLD_DATA: RadialDatum[] = [
	{ value: 68, max: 100, color: "#22d3ee", label: "Exercise", threshold: 80 },
];

const GAUGE_DATA: RadialDatum[] = [
	{ value: 73, max: 100, color: "#a3e635", label: "Battery" },
];

const DASHED_DATA: RadialDatum[] = [
	{ value: 70, max: 100, color: "#fb2576", label: "Solid" },
	{ value: 50, max: 100, color: "#22d3ee", label: "Dashed", pattern: "dashed" },
];

function clampedAverage(data: readonly RadialDatum[]): number {
	const sum = data.reduce((acc, datum) => acc + Math.min(datum.value / datum.max, 1), 0);
	return Math.round((sum / data.length) * 100);
}

interface Theme {
	bg: string;
	card: string;
	text: string;
	muted: string;
	border: string;
	track: string;
}

const LIGHT: Theme = {
	bg: "#f4f5f7",
	card: "#ffffff",
	text: "#0f172a",
	muted: "#64748b",
	border: "#e2e8f0",
	track: "rgba(15, 23, 42, 0.08)",
};

const DARK: Theme = {
	bg: "#0b1120",
	card: "#111a2e",
	text: "#e2e8f0",
	muted: "#94a3b8",
	border: "#1e293b",
	track: "rgba(148, 163, 184, 0.18)",
};

function CenterTotal({
	target,
	animate,
	theme,
}: {
	target: number;
	animate: boolean;
	theme: Theme;
}) {
	const shown = useCountUp(target, { durationMs: 900, animate });
	return (
		<View style={styles.centerBox}>
			<Text style={[styles.centerValue, { color: theme.text }]}>{shown}%</Text>
			<Text style={[styles.centerLabel, { color: theme.muted }]}>closed</Text>
		</View>
	);
}

function Card({
	title,
	subtitle,
	theme,
	children,
}: {
	title: string;
	subtitle?: string;
	theme: Theme;
	children: ReactNode;
}) {
	return (
		<View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
			<Text style={[styles.cardTitle, { color: theme.text }]}>{title}</Text>
			{subtitle ? <Text style={[styles.cardSubtitle, { color: theme.muted }]}>{subtitle}</Text> : null}
			<View style={styles.cardBody}>{children}</View>
		</View>
	);
}

function Toggle({
	label,
	value,
	onValueChange,
	theme,
}: {
	label: string;
	value: boolean;
	onValueChange: (next: boolean) => void;
	theme: Theme;
}) {
	return (
		<View style={styles.toggleRow}>
			<Text style={[styles.toggleLabel, { color: theme.text }]}>{label}</Text>
			<Switch value={value} onValueChange={onValueChange} trackColor={{ true: "#fb2576" }} />
		</View>
	);
}

export default function App() {
	const scheme = useColorScheme();
	const theme = scheme === "dark" ? DARK : LIGHT;

	const [animate, setAnimate] = useState(true);
	const [rounded, setRounded] = useState(true);
	const [showLegend, setShowLegend] = useState(true);
	const [allowOverflow, setAllowOverflow] = useState(false);
	const [heroData, setHeroData] = useState<RadialDatum[]>(HERO_DATA);
	const [message, setMessage] = useState<string | null>(null);

	const heroTarget = useMemo(() => clampedAverage(heroData), [heroData]);

	const randomize = useCallback(() => {
		setHeroData((current) =>
			current.map((datum) => ({
				...datum,
				value: Math.round(datum.max * (0.3 + Math.random() * 0.9)),
			})),
		);
	}, []);

	return (
		<View style={[styles.root, { backgroundColor: theme.bg }]}>
			<StatusBar style={scheme === "dark" ? "light" : "dark"} />
			<ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
				<Text style={[styles.h1, { color: theme.text }]}>Multi-Layer Radial Chart</Text>
				<Text style={[styles.h2, { color: theme.muted }]}>React Native · react-native-svg</Text>

				<Card title="Activity rings" subtitle="Tap a ring · toggle the controls below" theme={theme}>
					<RadialChart
						data={heroData}
						size={240}
						gap={8}
						rounded={rounded}
						animate={animate}
						allowOverflow={allowOverflow}
						showLegend={showLegend}
						legendTextColor={theme.text}
						trackColor={theme.track}
						onSegmentPress={(datum, index) =>
							setMessage(`Pressed ${datum.label} — ${datum.value}/${datum.max} (ring ${index + 1})`)
						}
					>
						<CenterTotal target={heroTarget} animate={animate} theme={theme} />
					</RadialChart>

					<Text style={[styles.message, { color: message ? "#fb2576" : theme.muted }]}>
						{message ?? "Press a ring to fire onSegmentPress"}
					</Text>

					<View style={styles.controls}>
						<Toggle label="Animate" value={animate} onValueChange={setAnimate} theme={theme} />
						<Toggle label="Rounded caps" value={rounded} onValueChange={setRounded} theme={theme} />
						<Toggle label="Legend" value={showLegend} onValueChange={setShowLegend} theme={theme} />
						<Toggle
							label="Allow overflow"
							value={allowOverflow}
							onValueChange={setAllowOverflow}
							theme={theme}
						/>
					</View>

					<Pressable
						style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
						onPress={randomize}
					>
						<Text style={styles.buttonText}>Randomize values</Text>
					</Pressable>
				</Card>

				<Card title="Gradients" subtitle="Per-ring linear gradients" theme={theme}>
					<RadialChart data={GRADIENT_DATA} size={200} trackColor={theme.track} animate={animate} />
				</Card>

				<Card title="Overflow laps" subtitle="Values above 100% overlap (Apple-Watch style)" theme={theme}>
					<RadialChart
						data={OVERFLOW_DATA}
						size={200}
						allowOverflow
						trackColor={theme.track}
						animate={animate}
						showLegend
						legendTextColor={theme.text}
					/>
				</Card>

				<Card title="Goal marker" subtitle="threshold={80} draws a target tick" theme={theme}>
					<RadialChart
						data={THRESHOLD_DATA}
						size={200}
						ringWidth={22}
						trackColor={theme.track}
						animate={animate}
					/>
				</Card>

				<Card title="Gauge" subtitle="maxSweepDegrees={270}" theme={theme}>
					<RadialChart
						data={GAUGE_DATA}
						size={200}
						maxSweepDegrees={270}
						startAngle={135}
						ringWidth={22}
						trackColor={theme.track}
						animate={animate}
					/>
				</Card>

				<Card title="Dashed pattern" subtitle="Color-independent differentiation" theme={theme}>
					<RadialChart
						data={DASHED_DATA}
						size={200}
						trackColor={theme.track}
						animate={animate}
						showLegend
						legendTextColor={theme.text}
					/>
				</Card>

				<Text style={[styles.footer, { color: theme.muted }]}>
					multi-layer-radial-chart-native
				</Text>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
	},
	scroll: {
		padding: 20,
		paddingTop: 64,
		gap: 16,
		alignItems: "stretch",
	},
	h1: {
		fontSize: 26,
		fontWeight: "800",
		textAlign: "center",
	},
	h2: {
		fontSize: 14,
		textAlign: "center",
		marginBottom: 8,
	},
	card: {
		borderRadius: 20,
		borderWidth: StyleSheet.hairlineWidth,
		padding: 20,
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: "700",
	},
	cardSubtitle: {
		fontSize: 13,
		marginTop: 2,
	},
	cardBody: {
		marginTop: 16,
		alignItems: "center",
	},
	centerBox: {
		alignItems: "center",
	},
	centerValue: {
		fontSize: 40,
		fontWeight: "800",
	},
	centerLabel: {
		fontSize: 12,
		letterSpacing: 1,
		textTransform: "uppercase",
	},
	message: {
		marginTop: 14,
		fontSize: 12,
		textAlign: "center",
	},
	controls: {
		alignSelf: "stretch",
		marginTop: 16,
		gap: 4,
	},
	toggleRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 4,
	},
	toggleLabel: {
		fontSize: 15,
	},
	button: {
		marginTop: 16,
		backgroundColor: "#fb2576",
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 999,
		alignSelf: "stretch",
	},
	buttonPressed: {
		opacity: 0.8,
	},
	buttonText: {
		color: "#ffffff",
		fontWeight: "700",
		textAlign: "center",
		fontSize: 15,
	},
	footer: {
		fontSize: 12,
		textAlign: "center",
		marginTop: 8,
		marginBottom: 24,
	},
});
