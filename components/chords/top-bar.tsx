"use client";

import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";
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
		<div className={cn("rounded-lg bg-background shadow-xl shadow-black/5 z-10", className)}>
			<Container className="flex flex-col gap-8 pb-8 items-center justify-center">
				<Categories items={keyNotes} selected={formattedKey} />
				{key && <SearchBox keyNote={key} items={suffixes} value={type} />}
			</Container>
		</div>
	);
};

export default React.memo(TopBar);
