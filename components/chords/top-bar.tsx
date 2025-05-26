"use client";

import { cn } from "@/lib/utils";
import { keyNotes } from "@/lib/chords/constants";
import { Categories } from "@/components/chords/categories";
import { SearchBox } from "@/components/chords/search";
// formatItem might still be useful on the client for display purposes
import { formatItem } from "@/lib/chords/utils"; // Or keep it in a client-side utils if it's purely for formatting
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Props {
	className?: string;
}

export const TopBar: React.FC<Props> = ({ className }) => {
	const [suffixes, setSuffixes] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false); // Optional: for loading state
	const params = useParams<{ key?: string; type?: string }>();
	const keyFromUrl = params?.key;
	const typeFromUrl = params?.type as string;

	const formattedKeyForDisplay = keyFromUrl ? formatItem(keyFromUrl) : undefined;

	useEffect(() => {
		if (keyFromUrl) {
			setIsLoading(true);
			fetch(`/api/chords/${encodeURIComponent(keyFromUrl)}/suffixes`)
				.then((res) => {
					if (!res.ok) {
						throw new Error(`HTTP error! status: ${res.status}`);
					}
					return res.json();
				})
				.then((data: string[]) => {
					setSuffixes(data);
				})
				.catch((error) => {
					console.error("Error fetching suffixes via API:", error);
					setSuffixes([]);
				})
				.finally(() => {
					setIsLoading(false);
				});
		} else {
			setSuffixes([]);
		}
	}, [keyFromUrl]);

	return (
		<div
			className={cn(
				"p-4 flex flex-col gap-6 items-center justify-center rounded-lg bg-background shadow-x shadow-black/5 z-10",
				className
			)}
		>
			<p>Выберите тональность</p>
			<Categories items={keyNotes} selected={formattedKeyForDisplay} />
			{/* You might want to show a loading indicator for SearchBox items */}
			{keyFromUrl &&
				(isLoading ? (
					<p>Загружаю суффиксы...</p>
				) : (
					<SearchBox keyNote={keyFromUrl} items={suffixes} value={typeFromUrl} />
				))}
		</div>
	);
};

export default React.memo(TopBar);
