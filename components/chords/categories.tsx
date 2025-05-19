"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

interface CategoriesProps {
	items: string[];
	className?: string;
	selected?: string;
}

export const Categories: React.FC<CategoriesProps> = ({ items, className, selected }) => {
	return (
			<nav className={cn("flex flex-wrap justify-center gap-2 bg-background rounded-2xl", className)} aria-label="Keys">
				{items.map((name) => {
					// Determine the display name based on the key
					const displayName = name === "C#" ? "Csharp" : name === "F#" ? "Fsharp" : name;

					return (
						<Link
							href={`/chords/${displayName}`}
							key={name}
							className={cn(
								"px-4 py-2 text-sm text-background font-mono rounded-md transition-colors duration-200 hover:bg-primary dark:hover:text-foreground",
								selected === name ? "bg-primary dark:text-foreground" : "bg-foreground"
							)}
						>
							{name}
						</Link>
					);
				})}
			</nav>
	);
};

export default React.memo(Categories);
