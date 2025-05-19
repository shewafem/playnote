"use client";

import { cn } from "@/lib/utils";
import { keyNotes } from "@/data/constants";
import { Categories } from "@/components/chords/categories";
import { SearchBox } from "@/components/chords/search";
import { formatItem, getSuffixes } from "@/data/utils";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Props {
	className?: string;
}

export const TopBar: React.FC<Props> = ({ className }) => {
	const [suffixes, setSuffixes] = useState<string[]>([]);
	const { key, type } = useParams<{ key: string; type: string }>();
	const formattedKey = formatItem(key);

	useEffect(() => {
		getSuffixes(key).then((suffixes) => setSuffixes(suffixes));
	}, [key]);

	return (
		<div
			className={cn(
				"p-4 flex flex-col gap-6 items-center justify-center rounded-lg bg-background shadow-x shadow-black/5 z-10",
				className
			)}
		>
			<p>Выберите тональность</p>
			<Categories items={keyNotes} selected={formattedKey} />
			{key && <SearchBox keyNote={key} items={suffixes} value={type} />}
		</div>
	);
};

export default React.memo(TopBar);
