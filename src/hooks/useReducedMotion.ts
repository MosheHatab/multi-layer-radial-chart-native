import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

/**
 * Reactively report whether the user prefers reduced motion, backed by the
 * platform accessibility setting (`AccessibilityInfo.isReduceMotionEnabled`).
 * Defaults to `false` and updates when the OS setting changes.
 */
export function useReducedMotion(): boolean {
	const [reduced, setReduced] = useState(false);

	useEffect(() => {
		let mounted = true;

		AccessibilityInfo.isReduceMotionEnabled().then((value) => {
			if (mounted) {
				setReduced(value);
			}
		});

		const subscription = AccessibilityInfo.addEventListener(
			"reduceMotionChanged",
			(value: boolean) => {
				setReduced(value);
			},
		);

		return () => {
			mounted = false;
			subscription.remove();
		};
	}, []);

	return reduced;
}
