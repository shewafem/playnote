"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Chord as ChordType } from "@/data/types";
import * as Tone from "tone";
import ChordElement from "@/components/chords/chord-element";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import { Loader2 } from "lucide-react";
import { Container } from "../utils/container";

interface ChordListProps {
	chords: ChordType[];
}

const ITEMS_PER_PAGE = 4;

const ChordList: React.FC<ChordListProps> = ({ chords }) => {
	const [displayedChords, setDisplayedChords] = useState<ChordType[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [offset, setOffset] = useState(0);

	useEffect(() => {
		const startTone = async () => {
			try {
				await Tone.start();
				console.log("Tone.js инициализирован");
			} catch (e) {
				console.error("Ошибка при инициализации Tone.js", e);
			}
		};
		startTone();
	}, []);

	const loadMoreChords = useCallback(async () => {
		if (isLoading || !hasMore) return;

		setIsLoading(true);

		const nextOffset = offset + ITEMS_PER_PAGE;
		const newChords = chords.slice(offset, nextOffset);

		setDisplayedChords((prevChords) => [...prevChords, ...newChords]);
		setOffset(nextOffset);
		setHasMore(nextOffset < chords.length);
		setIsLoading(false);
	}, [chords, isLoading, hasMore, offset]);

	useEffect(() => {
		setDisplayedChords([]);
		setOffset(0);
		setHasMore(chords.length > 0);

		if (chords.length > 0) {
			const initialChords = chords.slice(0, ITEMS_PER_PAGE);
			setDisplayedChords(initialChords);
			setOffset(ITEMS_PER_PAGE);
			setHasMore(ITEMS_PER_PAGE < chords.length);
		}
	}, [chords]);

	return (
		<Container>
			<div className="bg-background text-foreground min-h-screen">
				<div className="grid grid-cols-1 xs:grid-cols-2 gap-6 md:gap-8 grid-flow-dense">
					<InfiniteScroll hasMore={hasMore} isLoading={isLoading} next={loadMoreChords} threshold={0.5}>
						{displayedChords.map((chord, index) => (
							<div
								key={`${chord.key}-${chord.suffix}-${index}`}
								className="self-start flex flex-col gap-4 bg-card text-card-foreground rounded-lg border border-border shadow-sm p-4 md:p-6"
							>
								<h2 className="text-xl text-center md:text-2xl font-semibold">{`${chord.key} ${chord.suffix}`}</h2>
								<div className="grid gap-y-8 grid-cols-2 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
									{chord.positions.map((position, posIndex) => (
										<ChordElement
											key={posIndex}
											position={position}
											chordKey={chord.key}
											suffix={chord.suffix}
											posIndex={posIndex}
										/>
									))}
								</div>
							</div>
						))}
						{isLoading && hasMore && (
							<div className="col-span-full flex justify-center items-center py-8">
								<Loader2 className="h-8 w-8 animate-spin text-primary" />
								<span className="ml-2">Загружаем аккорды... 🎸</span>
							</div>
						)}
					</InfiniteScroll>
				</div>

				{!hasMore && !isLoading && displayedChords.length > 0 && (
					<div className="text-center pt-8 text-muted-foreground">Вы дошли до конца!</div>
				)}

				{displayedChords.length === 0 && !isLoading && (
					<div className="flex justify-center items-center py-8">
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
						<span className="ml-2">Загружаем аккорды... 🎸</span>
					</div>
				)}
			</div>
		</Container>
	);
};

export default ChordList;
