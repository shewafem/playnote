"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpToLine } from "lucide-react";
import React, { useEffect, useState } from "react";

export function ScrollToTop({
	minHeight, // Height from which button will be visible
	scrollTo,
  className, // Height to go on scroll to top
	...props
}: {
	minHeight?: number;
	scrollTo?: number;
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
          className={className}
					{...props}
				>
        <ArrowUpToLine size={40}/>
        </Button>
			)}
		</>
	);
}
