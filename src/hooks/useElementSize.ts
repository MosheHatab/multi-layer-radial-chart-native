import { useCallback, useState } from "react";
import type { LayoutChangeEvent } from "react-native";

export interface ElementSize {
	readonly width: number;
	readonly height: number;
}

const INITIAL_SIZE: ElementSize = { width: 0, height: 0 };

/**
 * Track a `View`'s measured size via its `onLayout` event — the React Native
 * equivalent of the web `ResizeObserver`. Spread the returned `onLayout`
 * handler onto the container you want to measure and read the latest `size`.
 *
 * ```tsx
 * const [onLayout, size] = useElementSize();
 * return <View onLayout={onLayout}>{size.width}</View>;
 * ```
 */
export function useElementSize(): [(event: LayoutChangeEvent) => void, ElementSize] {
	const [size, setSize] = useState<ElementSize>(INITIAL_SIZE);

	const onLayout = useCallback((event: LayoutChangeEvent): void => {
		const { width, height } = event.nativeEvent.layout;
		setSize((previous) =>
			previous.width === width && previous.height === height ? previous : { width, height },
		);
	}, []);

	return [onLayout, size];
}
