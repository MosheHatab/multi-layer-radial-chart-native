import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import {
	AccessibilityInfo,
	ActivityIndicator,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	useColorScheme,
	useWindowDimensions,
	View,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Slider from "@react-native-community/slider";
import { useFonts } from "expo-font";
import {
	FiraCode_500Medium,
	FiraCode_600SemiBold,
	FiraCode_700Bold,
} from "@expo-google-fonts/fira-code";
import {
	FiraSans_400Regular,
	FiraSans_500Medium,
	FiraSans_600SemiBold,
} from "@expo-google-fonts/fira-sans";
import {
	RadialChart,
	useCountUp,
	type RadialDatum,
} from "multi-layer-radial-chart-native";

const FONT = {
	display: "FiraCode_700Bold",
	mono: "FiraCode_500Medium",
	monoSemi: "FiraCode_600SemiBold",
	body: "FiraSans_400Regular",
	bodyMed: "FiraSans_500Medium",
	bodySemi: "FiraSans_600SemiBold",
} as const;

const WIDE_BREAKPOINT = 900;
const CONTENT_MAX_NARROW = 560;
const CONTENT_MAX_WIDE = 1200;
const HERO_CHART_SIZE = 300;
const SHOWCASE_CHART_SIZE = 200;

const HERO_DATA: RadialDatum[] = [
	{ value: 53.85, max: 100, color: "#FFD700", label: "Stand" },
	{ value: 82, max: 100, color: "#FF96C5", label: "Move" },
	{ value: 45, max: 60, color: "#0065A2", label: "Exercise" }
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

const SEMI_DATA: RadialDatum[] = [
	{ value: 64, max: 100, color: "#7b2ff7", label: "Download" },
	{ value: 39, max: 100, color: "#22d3ee", label: "Upload" },
];

const LAYOUT_PRESETS = [
	{ label: "Rings", maxSweepDegrees: 360, startAngle: -90 },
	{ label: "Gauge", maxSweepDegrees: 270, startAngle: 135 },
	{ label: "Semi", maxSweepDegrees: 180, startAngle: 180 },
] as const;

const FULL_CIRCLE_DEGREES = 360;

function clampedAverage(data: readonly RadialDatum[]): number {
	const sum = data.reduce((acc, datum) => acc + Math.min(datum.value / datum.max, 1), 0);
	return Math.round((sum / data.length) * 100);
}

interface Theme {
	bg: string;
	bgAccent: string;
	card: string;
	elevated: string;
	text: string;
	muted: string;
	border: string;
	track: string;
	accent: string;
	accentSoft: string;
	glow: string;
	isDark: boolean;
}

const LIGHT: Theme = {
	bg: "#eef1f6",
	bgAccent: "#e2e8f0",
	card: "#ffffff",
	elevated: "#f8fafc",
	text: "#0b1120",
	muted: "#475569",
	border: "#dbe2ea",
	track: "rgba(15, 23, 42, 0.08)",
	accent: "#e11d63",
	accentSoft: "rgba(225, 29, 99, 0.10)",
	glow: "rgba(225, 29, 99, 0.18)",
	isDark: false,
};

const DARK: Theme = {
	bg: "#070b16",
	bgAccent: "#0a1120",
	card: "#0d1526",
	elevated: "#111c33",
	text: "#e6edf7",
	muted: "#8ea2c0",
	border: "#1b2740",
	track: "rgba(142, 162, 192, 0.16)",
	accent: "#fb2576",
	accentSoft: "rgba(251, 37, 118, 0.14)",
	glow: "rgba(251, 37, 118, 0.55)",
	isDark: true,
};

function CenterTotal({
	target,
	animate,
	durationMs,
	theme,
}: {
	target: number;
	animate: boolean;
	durationMs: number;
	theme: Theme;
}) {
	const shown = useCountUp(target, { durationMs, animate });
	return (
		<View style={styles.centerBox}>
			<Text style={[styles.centerValue, { color: theme.text }]}>{shown}%</Text>
			<Text style={[styles.centerLabel, { color: theme.accent }]}>closed</Text>
		</View>
	);
}

function Card({
	index,
	title,
	subtitle,
	theme,
	hero,
	bodyRow,
	containerStyle,
	children,
}: {
	index: string;
	title: string;
	subtitle?: string;
	theme: Theme;
	hero?: boolean;
	bodyRow?: boolean;
	containerStyle?: StyleProp<ViewStyle>;
	children: ReactNode;
}) {
	return (
		<View
			style={[
				styles.card,
				{ backgroundColor: theme.card, borderColor: theme.border },
				hero && styles.cardHero,
				hero && { borderColor: theme.accent, shadowColor: theme.glow },
				containerStyle,
			]}
		>
			<View style={styles.cardHead}>
				<View style={[styles.indexChip, { backgroundColor: theme.accentSoft, borderColor: theme.border }]}>
					<Text style={[styles.indexText, { color: theme.accent }]}>{index}</Text>
				</View>
				<View style={styles.cardHeadText}>
					<Text style={[styles.cardTitle, { color: theme.text }]}>{title}</Text>
					{subtitle ? (
						<Text style={[styles.cardSubtitle, { color: theme.muted }]}>{subtitle}</Text>
					) : null}
				</View>
			</View>
			<View style={[styles.cardBody, bodyRow && styles.cardBodyRow]}>{children}</View>
		</View>
	);
}

function ToggleSwitch({
	value,
	onValueChange,
	disabled = false,
	label,
	theme,
}: {
	value: boolean;
	onValueChange: (next: boolean) => void;
	disabled?: boolean;
	label: string;
	theme: Theme;
}) {
	return (
		<Pressable
			onPress={() => onValueChange(!value)}
			disabled={disabled}
			accessibilityRole="switch"
			accessibilityState={{ checked: value, disabled }}
			accessibilityLabel={label}
			style={[
				styles.switchTrack,
				{ backgroundColor: value ? theme.accent : theme.border },
			]}
		>
			<View style={[styles.switchThumb, value ? styles.switchThumbOn : styles.switchThumbOff]} />
		</Pressable>
	);
}

function Toggle({
	label,
	value,
	onValueChange,
	theme,
	disabled = false,
	noDivider = false,
}: {
	label: string;
	value: boolean;
	onValueChange: (next: boolean) => void;
	theme: Theme;
	disabled?: boolean;
	noDivider?: boolean;
}) {
	return (
		<View
			style={[
				styles.controlRow,
				!noDivider && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.border },
				disabled && styles.controlDisabled,
			]}
		>
			<Text style={[styles.controlLabel, { color: theme.text }]}>{label}</Text>
			<ToggleSwitch
				value={value}
				onValueChange={onValueChange}
				disabled={disabled}
				label={label}
				theme={theme}
			/>
		</View>
	);
}

const DECIMAL_OPTIONS = [0, 1, 2, 3] as const;

function DecimalsControl({
	label,
	value,
	onChange,
	disabled = false,
	theme,
}: {
	label: string;
	value: number;
	onChange: (next: number) => void;
	disabled?: boolean;
	theme: Theme;
}) {
	const [focused, setFocused] = useState<number | null>(null);
	return (
		<View
			style={[
				styles.controlRow,
				{ borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.border },
				disabled && styles.controlDisabled,
			]}
		>
			<Text style={[styles.controlLabel, { color: theme.text }]}>{label}</Text>
			<View style={[styles.segment, { borderColor: theme.border, backgroundColor: theme.elevated }]}>
				{DECIMAL_OPTIONS.map((option) => {
					const active = option === value;
					return (
						<Pressable
							key={option}
							disabled={disabled}
							onPress={() => onChange(option)}
							onFocus={() => setFocused(option)}
							onBlur={() => setFocused(null)}
							accessibilityRole="button"
							accessibilityState={{ selected: active, disabled }}
							accessibilityLabel={`${option} decimals`}
							style={[
								styles.segmentItem,
								active && { backgroundColor: theme.accent },
								!active && focused === option && { backgroundColor: theme.accentSoft },
							]}
						>
							<Text style={[styles.segmentText, { color: active ? "#ffffff" : theme.muted }]}>
								{option}
							</Text>
						</Pressable>
					);
				})}
			</View>
		</View>
	);
}

type LayoutPreset = (typeof LAYOUT_PRESETS)[number];

function LayoutControl({
	label,
	maxSweep,
	startAngle,
	onApply,
	theme,
}: {
	label: string;
	maxSweep: number;
	startAngle: number;
	onApply: (preset: LayoutPreset) => void;
	theme: Theme;
}) {
	const [focused, setFocused] = useState<number | null>(null);
	return (
		<View style={[styles.rangeRow, { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.border }]}>
			<Text style={[styles.controlLabel, { color: theme.text }]}>{label}</Text>
			<View
				style={[
					styles.segment,
					styles.segmentFull,
					{ borderColor: theme.border, backgroundColor: theme.elevated },
				]}
			>
				{LAYOUT_PRESETS.map((preset, index) => {
					const active = preset.maxSweepDegrees === maxSweep && preset.startAngle === startAngle;
					return (
						<Pressable
							key={preset.label}
							onPress={() => onApply(preset)}
							onFocus={() => setFocused(index)}
							onBlur={() => setFocused(null)}
							accessibilityRole="button"
							accessibilityState={{ selected: active }}
							accessibilityLabel={`${preset.label} layout`}
							style={[
								styles.segmentItem,
								styles.segmentItemFull,
								active && { backgroundColor: theme.accent },
								!active && focused === index && { backgroundColor: theme.accentSoft },
							]}
						>
							<Text style={[styles.segmentText, { color: active ? "#ffffff" : theme.muted }]}>
								{preset.label}
							</Text>
						</Pressable>
					);
				})}
			</View>
		</View>
	);
}

function RangeControl({
	label,
	value,
	min,
	max,
	step = 1,
	suffix = "",
	disabled = false,
	onChange,
	theme,
}: {
	label: string;
	value: number;
	min: number;
	max: number;
	step?: number;
	suffix?: string;
	disabled?: boolean;
	onChange: (next: number) => void;
	theme: Theme;
}) {
	return (
		<View
			style={[
				styles.rangeRow,
				{ borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.border },
				disabled && styles.controlDisabled,
			]}
		>
			<View style={styles.rangeHead}>
				<Text style={[styles.controlLabel, { color: theme.text }]}>{label}</Text>
				<Text style={[styles.rangeValue, { color: theme.muted }]}>
					{value}
					{suffix}
				</Text>
			</View>
			<Slider
				style={styles.slider}
				minimumValue={min}
				maximumValue={max}
				step={step}
				value={value}
				disabled={disabled}
				onValueChange={(next) => onChange(Math.round(next))}
				minimumTrackTintColor={theme.accent}
				maximumTrackTintColor={theme.border}
				thumbTintColor={theme.accent}
			/>
		</View>
	);
}

const MODE_OPTIONS = ["system", "light", "dark"] as const;
type ThemeMode = (typeof MODE_OPTIONS)[number];

function ModeSwitch({
	mode,
	onChange,
	theme,
}: {
	mode: ThemeMode;
	onChange: (next: ThemeMode) => void;
	theme: Theme;
}) {
	const [focused, setFocused] = useState<ThemeMode | null>(null);
	return (
		<View style={[styles.segment, { borderColor: theme.border, backgroundColor: theme.elevated }]}>
			{MODE_OPTIONS.map((option) => {
				const active = option === mode;
				return (
					<Pressable
						key={option}
						onPress={() => onChange(option)}
						onFocus={() => setFocused(option)}
						onBlur={() => setFocused(null)}
						accessibilityRole="button"
						accessibilityState={{ selected: active }}
						accessibilityLabel={`${option} theme`}
						style={[
							styles.segmentItem,
							active && { backgroundColor: theme.accent },
							!active && focused === option && { backgroundColor: theme.accentSoft },
						]}
					>
						<Text style={[styles.segmentText, { color: active ? "#ffffff" : theme.muted }]}>
							{option[0].toUpperCase() + option.slice(1)}
						</Text>
					</Pressable>
				);
			})}
		</View>
	);
}

function PrimaryButton({
	label,
	onPress,
	theme,
}: {
	label: string;
	onPress: () => void;
	theme: Theme;
}) {
	const [focused, setFocused] = useState(false);
	return (
		<Pressable
			onPress={onPress}
			onFocus={() => setFocused(true)}
			onBlur={() => setFocused(false)}
			accessibilityRole="button"
			style={({ pressed }) => [
				styles.button,
				{ backgroundColor: theme.accent, shadowColor: theme.glow },
				focused && styles.buttonFocused,
				pressed && styles.buttonPressed,
			]}
		>
			<Text style={styles.buttonText}>{label}</Text>
		</Pressable>
	);
}

function ControlGroup({
	title,
	theme,
	children,
}: {
	title: string;
	theme: Theme;
	children: ReactNode;
}) {
	return (
		<View style={[styles.controlGroup, { backgroundColor: theme.bgAccent, borderColor: theme.border }]}>
			<Text style={[styles.groupLabel, { color: theme.accent }]}>{title}</Text>
			{children}
		</View>
	);
}

export default function App() {
	const scheme = useColorScheme();
	const { width } = useWindowDimensions();
	const isWide = width >= WIDE_BREAKPOINT;

	const [mode, setMode] = useState<ThemeMode>("dark");
	const resolved = mode === "system" ? scheme : mode;
	const theme = resolved === "dark" ? DARK : LIGHT;

	const [fontsLoaded] = useFonts({
		FiraCode_500Medium,
		FiraCode_600SemiBold,
		FiraCode_700Bold,
		FiraSans_400Regular,
		FiraSans_500Medium,
		FiraSans_600SemiBold,
	});

	const [reduceMotion, setReduceMotion] = useState(false);
	useEffect(() => {
		let mounted = true;
		AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
			if (mounted) setReduceMotion(enabled);
		});
		const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
		return () => {
			mounted = false;
			sub.remove();
		};
	}, []);

	const [animate, setAnimate] = useState(true);
	const [animationDurationMs, setAnimationDurationMs] = useState(900);
	const [rounded, setRounded] = useState(true);
	const [clockwise, setClockwise] = useState(true);
	const [showLegend, setShowLegend] = useState(true);
	const [percentDecimals, setPercentDecimals] = useState(0);
	const [allowOverflow, setAllowOverflow] = useState(false);
	const [size, setSize] = useState(HERO_CHART_SIZE);
	const [gap, setGap] = useState(8);
	const [autoRingWidth, setAutoRingWidth] = useState(true);
	const [ringWidth, setRingWidth] = useState(22);
	const [startAngle, setStartAngle] = useState(-90);
	const [maxSweepDegrees, setMaxSweepDegrees] = useState(FULL_CIRCLE_DEGREES);
	const [heroData, setHeroData] = useState<RadialDatum[]>(HERO_DATA);
	const [message, setMessage] = useState<string | null>(null);

	const isFullCircle = maxSweepDegrees === FULL_CIRCLE_DEGREES;
	const effectiveAnimate = animate && !reduceMotion;
	const effectiveDuration = effectiveAnimate ? animationDurationMs : 0;
	const heroTarget = useMemo(() => clampedAverage(heroData), [heroData]);
	const heroChartSize = isWide ? size : Math.min(size, width - 96);

	const applyLayout = useCallback((preset: LayoutPreset) => {
		setMaxSweepDegrees(preset.maxSweepDegrees);
		setStartAngle(preset.startAngle);
	}, []);

	const randomize = useCallback(() => {
		setHeroData((current) =>
			current.map((datum) => ({
				...datum,
				value: Math.round(datum.max * (0.3 + Math.random() * 0.9)),
			})),
		);
	}, []);

	if (!fontsLoaded) {
		return (
			<View style={[styles.root, styles.loading, { backgroundColor: theme.bg }]}>
				<ActivityIndicator color={theme.accent} />
			</View>
		);
	}

	const showcaseCards = [
		<Card
			key="02"
			index="02"
			title="Gradients"
			subtitle="Per-ring linear gradients"
			theme={theme}
			containerStyle={isWide ? styles.gridCard : undefined}
		>
			<RadialChart
				data={GRADIENT_DATA}
				size={SHOWCASE_CHART_SIZE}
				trackColor={theme.track}
				animate={effectiveAnimate}
			/>
		</Card>,
		<Card
			key="03"
			index="03"
			title="Overflow laps"
			subtitle="Values above 100% overlap (Apple-Watch style)"
			theme={theme}
			containerStyle={isWide ? styles.gridCard : undefined}
		>
			<RadialChart
				data={OVERFLOW_DATA}
				size={SHOWCASE_CHART_SIZE}
				allowOverflow
				trackColor={theme.track}
				animate={effectiveAnimate}
				showLegend
				legendTextColor={theme.text}
			/>
		</Card>,
		<Card
			key="04"
			index="04"
			title="Goal marker"
			subtitle="threshold={80} draws a target tick"
			theme={theme}
			containerStyle={isWide ? styles.gridCard : undefined}
		>
			<RadialChart
				data={THRESHOLD_DATA}
				size={SHOWCASE_CHART_SIZE}
				ringWidth={22}
				trackColor={theme.track}
				animate={effectiveAnimate}
			/>
		</Card>,
		<Card
			key="05"
			index="05"
			title="Gauge"
			subtitle="maxSweepDegrees={270}"
			theme={theme}
			containerStyle={isWide ? styles.gridCard : undefined}
		>
			<RadialChart
				data={GAUGE_DATA}
				size={SHOWCASE_CHART_SIZE}
				maxSweepDegrees={270}
				startAngle={135}
				ringWidth={22}
				trackColor={theme.track}
				animate={effectiveAnimate}
			/>
		</Card>,
		<Card
			key="06"
			index="06"
			title="Dashed pattern"
			subtitle="Color-independent differentiation"
			theme={theme}
			containerStyle={isWide ? styles.gridCard : undefined}
		>
			<RadialChart
				data={DASHED_DATA}
				size={SHOWCASE_CHART_SIZE}
				trackColor={theme.track}
				animate={effectiveAnimate}
				showLegend
				legendTextColor={theme.text}
				rounded={false}
			/>
		</Card>,
		<Card
			key="07"
			index="07"
			title="Semicircle"
			subtitle="maxSweepDegrees={180} · startAngle={180}"
			theme={theme}
			containerStyle={isWide ? styles.gridCard : undefined}
		>
			<RadialChart
				data={SEMI_DATA}
				size={SHOWCASE_CHART_SIZE}
				maxSweepDegrees={180}
				startAngle={180}
				ringWidth={20}
				trackColor={theme.track}
				animate={effectiveAnimate}
				showLegend
				legendTextColor={theme.text}
			/>
		</Card>,
	];

	return (
		<View style={[styles.root, { backgroundColor: theme.bg }]}>
			<StatusBar style={resolved === "dark" ? "light" : "dark"} />
			<ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
				<View style={[styles.content, { maxWidth: isWide ? CONTENT_MAX_WIDE : CONTENT_MAX_NARROW }]}>
					<View style={styles.header}>
						<View style={styles.headerTop}>
							<View style={[styles.eyebrow, { backgroundColor: theme.accentSoft, borderColor: theme.border }]}>
								<View style={[styles.eyebrowDot, { backgroundColor: theme.accent }]} />
								<Text style={[styles.eyebrowText, { color: theme.accent }]}>REACT NATIVE · SVG</Text>
							</View>
							<ModeSwitch mode={mode} onChange={setMode} theme={theme} />
						</View>
						<Text style={[styles.h1, { color: theme.text }]}>Multi-Layer{"\n"}Radial Chart</Text>
						<Text style={[styles.h2, { color: theme.muted }]}>
							Composable activity-ring visualizations for data-dense interfaces.
						</Text>
					</View>

					<Card
						index="01"
						title="Activity rings"
						subtitle="Tap a ring · adjust the controls"
						theme={theme}
						hero
						bodyRow={isWide}
					>
						<View style={[styles.heroChartCol, isWide ? styles.heroChartColWide : styles.heroColStack]}>
							<RadialChart
								data={heroData}
								size={heroChartSize}
								gap={gap}
								ringWidth={autoRingWidth ? undefined : ringWidth}
								rounded={rounded}
								clockwise={clockwise}
								startAngle={startAngle}
								maxSweepDegrees={maxSweepDegrees}
								animate={effectiveAnimate}
								animationDurationMs={animationDurationMs}
								allowOverflow={allowOverflow}
								showLegend={showLegend}
								percentDecimals={percentDecimals}
								legendTextColor={theme.text}
								trackColor={theme.track}
								onSegmentPress={(datum, index) =>
									setMessage(
										`Pressed ${datum.label} — ${datum.value}/${datum.max} (ring ${index + 1})`,
									)
								}
							>
								{isFullCircle ? (
									<CenterTotal
										target={heroTarget}
										animate={effectiveAnimate}
										durationMs={effectiveDuration}
										theme={theme}
									/>
								) : null}
							</RadialChart>

							<View
								style={[
									styles.messageBox,
									{
										backgroundColor: theme.elevated,
										borderColor: message ? theme.accent : theme.border,
									},
								]}
							>
								<Text style={[styles.message, { color: message ? theme.accent : theme.muted }]}>
									{message ?? "Press a ring to fire onSegmentPress"}
								</Text>
							</View>
						</View>

						<View style={isWide ? styles.heroControlsColWide : styles.heroColStack}>
							<View style={styles.controlsWrap}>
								<View style={styles.controlsCol}>
									<ControlGroup title="LAYOUT" theme={theme}>
										<LayoutControl
											label="Preset"
											maxSweep={maxSweepDegrees}
											startAngle={startAngle}
											onApply={applyLayout}
											theme={theme}
										/>
										<RangeControl
											label="Size"
											value={size}
											min={160}
											max={360}
											step={10}
											suffix="px"
											onChange={setSize}
											theme={theme}
										/>
										<RangeControl
											label="Gap"
											value={gap}
											min={0}
											max={24}
											suffix="px"
											onChange={setGap}
											theme={theme}
										/>
										<Toggle
											label="Auto ring width"
											value={autoRingWidth}
											onValueChange={setAutoRingWidth}
											theme={theme}
										/>
										<RangeControl
											label="Ring width"
											value={ringWidth}
											min={4}
											max={48}
											suffix="px"
											disabled={autoRingWidth}
											onChange={setRingWidth}
											theme={theme}
										/>
										<RangeControl
											label="Start angle"
											value={startAngle}
											min={-180}
											max={180}
											step={5}
											suffix="°"
											onChange={setStartAngle}
											theme={theme}
										/>
										<RangeControl
											label="Max sweep"
											value={maxSweepDegrees}
											min={90}
											max={360}
											step={10}
											suffix="°"
											onChange={setMaxSweepDegrees}
											theme={theme}
										/>
									</ControlGroup>
								</View>

								<View style={styles.controlsCol}>
									<ControlGroup title="BEHAVIOR" theme={theme}>
										<Toggle
											label="Animate"
											value={animate && !reduceMotion}
											onValueChange={setAnimate}
											disabled={reduceMotion}
											theme={theme}
										/>
										<Toggle
											label="Rounded caps"
											value={rounded}
											onValueChange={setRounded}
											theme={theme}
										/>
										<Toggle
											label="Clockwise"
											value={clockwise}
											onValueChange={setClockwise}
											theme={theme}
										/>
										<RangeControl
											label="Animation duration"
											value={animationDurationMs}
											min={0}
											max={2000}
											step={50}
											suffix="ms"
											disabled={!animate || reduceMotion}
											onChange={setAnimationDurationMs}
											theme={theme}
										/>
										{reduceMotion ? (
											<Text style={[styles.hint, { color: theme.muted }]}>
												Reduce-motion is on — animation disabled.
											</Text>
										) : null}
									</ControlGroup>

									<ControlGroup title="DISPLAY" theme={theme}>
										<Toggle
											label="Legend"
											value={showLegend}
											onValueChange={setShowLegend}
											theme={theme}
										/>
										<DecimalsControl
											label="Decimals"
											value={percentDecimals}
											onChange={setPercentDecimals}
											disabled={!showLegend}
											theme={theme}
										/>
										<Toggle
											label="Allow overflow"
											value={allowOverflow}
											onValueChange={setAllowOverflow}
											theme={theme}
										/>
									</ControlGroup>
								</View>
							</View>

							<PrimaryButton label="Randomize values" onPress={randomize} theme={theme} />
						</View>
					</Card>

					<Text style={[styles.sectionLabel, { color: theme.muted }]}>SHOWCASE</Text>

					{isWide ? <View style={styles.grid}>{showcaseCards}</View> : showcaseCards}

					<View style={[styles.divider, { backgroundColor: theme.border }]} />
					<Text style={[styles.footer, { color: theme.muted }]}>multi-layer-radial-chart-native</Text>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
	},
	loading: {
		alignItems: "center",
		justifyContent: "center",
	},
	scroll: {
		paddingHorizontal: 20,
		paddingTop: 72,
		paddingBottom: 20,
		alignItems: "center",
	},
	content: {
		width: "100%",
		gap: 16,
	},
	header: {
		marginBottom: 4,
		gap: 12,
	},
	headerTop: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		flexWrap: "wrap",
		gap: 12,
	},
	eyebrow: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "flex-start",
		gap: 8,
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: 999,
		borderWidth: StyleSheet.hairlineWidth,
	},
	eyebrowDot: {
		width: 7,
		height: 7,
		borderRadius: 999,
	},
	eyebrowText: {
		fontFamily: FONT.monoSemi,
		fontSize: 11,
		letterSpacing: 1.5,
	},
	h1: {
		fontFamily: FONT.display,
		fontSize: 34,
		lineHeight: 38,
		letterSpacing: -0.5,
	},
	h2: {
		fontFamily: FONT.body,
		fontSize: 15,
		lineHeight: 22,
		maxWidth: 420,
	},
	card: {
		borderRadius: 22,
		borderWidth: 1,
		padding: 20,
		shadowColor: "#0b1120",
		shadowOpacity: 0.06,
		shadowRadius: 16,
		shadowOffset: { width: 0, height: 6 },
		elevation: 2,
	},
	cardHero: {
		shadowOpacity: 1,
		shadowRadius: 28,
		shadowOffset: { width: 0, height: 0 },
		elevation: 14,
	},
	cardHead: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	indexChip: {
		width: 40,
		height: 40,
		borderRadius: 12,
		borderWidth: StyleSheet.hairlineWidth,
		alignItems: "center",
		justifyContent: "center",
	},
	indexText: {
		fontFamily: FONT.monoSemi,
		fontSize: 14,
	},
	cardHeadText: {
		flex: 1,
	},
	cardTitle: {
		fontFamily: FONT.bodySemi,
		fontSize: 18,
		letterSpacing: -0.2,
	},
	cardSubtitle: {
		fontFamily: FONT.body,
		fontSize: 13,
		marginTop: 2,
	},
	cardBody: {
		marginTop: 20,
		alignItems: "center",
	},
	cardBodyRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 28,
	},
	heroChartCol: {
		alignItems: "center",
	},
	heroChartColWide: {
		flex: 1,
		alignSelf: "center",
	},
	heroColStack: {
		alignSelf: "stretch",
		width: "100%",
	},
	heroControlsColWide: {
		flex: 1,
		minWidth: 300,
	},
	centerBox: {
		alignItems: "center",
	},
	centerValue: {
		fontFamily: FONT.display,
		fontSize: 42,
		letterSpacing: -1,
	},
	centerLabel: {
		fontFamily: FONT.monoSemi,
		fontSize: 11,
		letterSpacing: 2,
		textTransform: "uppercase",
		marginTop: 2,
	},
	messageBox: {
		alignSelf: "stretch",
		marginTop: 18,
		paddingVertical: 10,
		paddingHorizontal: 14,
		borderRadius: 12,
		borderWidth: StyleSheet.hairlineWidth,
	},
	message: {
		fontFamily: FONT.mono,
		fontSize: 12,
		textAlign: "center",
	},
	controlsWrap: {
		alignSelf: "stretch",
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 12,
	},
	controlsCol: {
		flexGrow: 1,
		flexBasis: 240,
		gap: 12,
	},
	controlGroup: {
		borderWidth: StyleSheet.hairlineWidth,
		borderRadius: 16,
		paddingHorizontal: 14,
		paddingBottom: 6,
	},
	controlRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 12,
	},
	controlLabel: {
		fontFamily: FONT.bodyMed,
		fontSize: 15,
	},
	controlDisabled: {
		opacity: 0.4,
	},
	switchTrack: {
		width: 46,
		height: 28,
		borderRadius: 999,
		padding: 3,
		justifyContent: "center",
	},
	switchThumb: {
		width: 22,
		height: 22,
		borderRadius: 999,
		backgroundColor: "#ffffff",
		shadowColor: "#000000",
		shadowOpacity: 0.2,
		shadowRadius: 2,
		shadowOffset: { width: 0, height: 1 },
		elevation: 2,
	},
	switchThumbOn: {
		alignSelf: "flex-end",
	},
	switchThumbOff: {
		alignSelf: "flex-start",
	},
	groupLabel: {
		fontFamily: FONT.monoSemi,
		fontSize: 10,
		letterSpacing: 1.5,
		marginTop: 14,
		marginBottom: 2,
	},
	rangeRow: {
		paddingVertical: 12,
	},
	rangeHead: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	rangeValue: {
		fontFamily: FONT.mono,
		fontSize: 13,
	},
	slider: {
		alignSelf: "stretch",
		marginTop: 4,
		height: 32,
	},
	hint: {
		fontFamily: FONT.body,
		fontSize: 12,
		marginTop: 10,
	},
	segment: {
		flexDirection: "row",
		borderWidth: StyleSheet.hairlineWidth,
		borderRadius: 10,
		overflow: "hidden",
	},
	segmentItem: {
		paddingVertical: 6,
		paddingHorizontal: 12,
	},
	segmentFull: {
		alignSelf: "stretch",
		marginTop: 10,
	},
	segmentItemFull: {
		flex: 1,
		alignItems: "center",
		paddingVertical: 8,
	},
	segmentText: {
		fontFamily: FONT.monoSemi,
		fontSize: 13,
	},
	button: {
		marginTop: 20,
		paddingVertical: 14,
		paddingHorizontal: 24,
		borderRadius: 999,
		alignSelf: "stretch",
		borderWidth: 2,
		borderColor: "transparent",
		shadowOpacity: 1,
		shadowRadius: 20,
		shadowOffset: { width: 0, height: 0 },
		elevation: 10,
	},
	buttonFocused: {
		borderColor: "rgba(255, 255, 255, 0.9)",
	},
	buttonPressed: {
		opacity: 0.85,
		transform: [{ scale: 0.99 }],
	},
	buttonText: {
		fontFamily: FONT.bodySemi,
		color: "#ffffff",
		textAlign: "center",
		fontSize: 15,
		letterSpacing: 0.3,
	},
	sectionLabel: {
		fontFamily: FONT.monoSemi,
		fontSize: 12,
		letterSpacing: 2,
		marginTop: 8,
	},
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 16,
	},
	gridCard: {
		flexGrow: 1,
		flexBasis: "47%",
		minWidth: 240,
	},
	divider: {
		height: StyleSheet.hairlineWidth,
		alignSelf: "stretch",
		marginTop: 12,
	},
	footer: {
		fontFamily: FONT.mono,
		fontSize: 12,
		textAlign: "center",
		marginTop: 4,
		marginBottom: 24,
	},
});
