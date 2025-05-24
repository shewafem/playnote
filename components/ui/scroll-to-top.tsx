"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpToLine } from "lucide-react";
import React, { useEffect, useState } from "react";
export function ScrollToTop({
	minHeight,
	scrollTo,
	size,
	className,
}: {
	minHeight?: number;
	scrollTo?: number;
	size?: number;
	className?: string;
}) {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const onScroll = () => {
			setVisible(document.documentElement.scrollTop >= (minHeight ?? 0));
		};

		onScroll();
		document.addEventListener("scroll", onScroll);

		return () => document.removeEventListener("scroll", onScroll);
	}, [minHeight]);

	return (
		<>
			{visible && (
				<Button
					onClick={() =>
						window.scrollTo({
							top: scrollTo ?? 0,
							behavior: "smooth",
						})
					}
					className={cn(
						"fixed rounded-full right-4 bottom-4 z-10 cursor-pointer transition-all duration-200 ease-in-out",
						className
					)}
				>
					<ArrowUpToLine size={size} />
				</Button>
			)}
		</>
	);
}
