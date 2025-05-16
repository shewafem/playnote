import * as React from "react";

interface InfiniteScrollProps {
	isLoading: boolean;
	hasMore: boolean;
	next: () => unknown;
	threshold?: number;
	root?: Element | Document | null;
	rootMargin?: string;
	reverse?: boolean;
	children?: React.ReactNode;
}

export default function InfiniteScroll({
	isLoading,
	hasMore,
	next,
	threshold = 1,
	root = null,
	rootMargin = "0px",
	reverse,
	children,
}: InfiniteScrollProps) {
	const observer = React.useRef<IntersectionObserver | null>(null); // Initialize with null for clarity
	const observerRef = React.useCallback(
		(element: HTMLElement | null) => {
			let safeThreshold = threshold;
			if (threshold < 0 || threshold > 1) {
				console.warn("threshold should be between 0 and 1. You are exceed the range. will use default value: 1");
				safeThreshold = 1;
			}

			if (observer.current) {
				observer.current.disconnect();
			}

			if (element) {
				// Only create and observe if the element exists
				observer.current = new IntersectionObserver(
					(entries) => {
						// Check if still mounted and conditions are met
						if (entries[0].isIntersecting && hasMore && !isLoading) {
							// Added !isLoading check before calling next
							next();
						}
					},
					{ threshold: safeThreshold, root, rootMargin }
				);
				observer.current.observe(element);
			}
		},
		[hasMore, isLoading, next, threshold, root, rootMargin]
	);

	const flattenChildren = React.useMemo(() => React.Children.toArray(children), [children]);

	return (
		<>
			{flattenChildren.map((child, index) => {
				if (!React.isValidElement(child)) {
					return child;
				}

				const isObserveTarget = reverse ? index === 0 : index === flattenChildren.length - 1;

				const refToPass = isObserveTarget ? observerRef : null;

				const propsWithRef = { ref: refToPass };

				return React.cloneElement(child, propsWithRef as React.Attributes & { ref?: React.Ref<HTMLElement> });
			})}
		</>
	);
}
