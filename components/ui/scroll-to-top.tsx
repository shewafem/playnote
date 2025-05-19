"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpToLine } from "lucide-react";
import React, { useEffect, useState } from "react";

export function ScrollToTop({
	minHeight,
	scrollTo, 
  size,
	...props
}: {
	minHeight?: number;
	scrollTo?: number;
  className?: string;
  size?: number;
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
          className="bg-fixed justify-items-stretch rounded-full right-4 bottom-4 z-10 cursor-pointer w-12 h-12 transition-all duration-200 ease-in-out"
					{...props}
				>
        <ArrowUpToLine size={size}/>
        </Button>
			)}
		</>
	);
}
