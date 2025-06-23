"use client";

import { cn } from "@/lib/utils";
import { keyNotes } from "@/lib/chords/constants";
import { Categories } from "@/components/chords/categories";
import { SearchBox } from "@/components/chords/search";
import { formatItem } from "@/lib/chords/utils";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Props {
	className?: string;
}

export const TopBar: React.FC<Props> = ({ className }) => {
  const [suffixes, setSuffixes] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
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
						throw new Error(`Ошибка: ${res.status}`);
					}
					return res.json();
				})
				.then((data: string[]) => {
					setSuffixes(data);
				})
				.catch((error) => {
					console.error("Ошибка запроса аккордов:", error);
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
			{keyFromUrl && <SearchBox isLoading={isLoading} keyNote={keyFromUrl} items={suffixes} value={typeFromUrl} />}
		</div>
	);
};

export default React.memo(TopBar);
