"use client";
import React, { useState, useEffect, useCallback, useTransition } from "react";
import * as Tone from "tone";
import ChordElement from "@/components/chords/chord-element";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import { Loader2 } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ChordWithPositions } from "@/lib/chords/types";
import { fetchMoreChordsAction } from "@/actions/chords/get-chords";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { translateChordName } from "@/lib/translations";

type ChordListProps = {
	initialChords: ChordWithPositions[];
	initialLearnedPositionIds: number[];
	totalChordsCount: number;
	chordKey: string;
	itemsPerPage: number;
};

const ChordList: React.FC<ChordListProps> = ({
	initialChords,
	initialLearnedPositionIds,
	totalChordsCount,
	chordKey,
	itemsPerPage,
}) => {
	const [displayedChords, setDisplayedChords] = useState<ChordWithPositions[]>(initialChords);
	const [allLearnedPositionIds, setAllLearnedPositionIds] = useState<Set<number>>(new Set(initialLearnedPositionIds));
	const [isFetchingMore, startFetchingMoreTransition] = useTransition();
	const [offset, setOffset] = useState(initialChords.length);
	const [hasMore, setHasMore] = useState(initialChords.length < totalChordsCount);

	useEffect(() => {
		setDisplayedChords(initialChords);
		setAllLearnedPositionIds(new Set(initialLearnedPositionIds));
		setOffset(initialChords.length);
		setHasMore(initialChords.length < totalChordsCount);
	}, [initialChords, initialLearnedPositionIds, totalChordsCount, chordKey]);

	useEffect(() => {
		const startTone = async () => {
			await Tone.start();
		};
		startTone();
	}, []);

	const loadMoreChords = useCallback(async () => {
		if (isFetchingMore || !hasMore) return;

		startFetchingMoreTransition(async () => {
			const result = await fetchMoreChordsAction(chordKey, offset, itemsPerPage);

			if (result.error) {
				console.error("Ошибка загруки аккордов:", result.error);
				setHasMore(false);
				return;
			}

			if (result.newChords && result.newChords.length > 0) {
				setDisplayedChords((prevChords) => [...prevChords, ...result.newChords]);

				setAllLearnedPositionIds((prevIds) => {
					const updatedIds = new Set(prevIds);
					result.newLearnedPositionIds.forEach((id) => updatedIds.add(id));
					return updatedIds;
				});
				const newOffset = offset + result.newChords.length;
				setOffset(newOffset);
				setHasMore(newOffset < totalChordsCount);
			} else {
				setHasMore(false);
			}
		});
	}, [isFetchingMore, hasMore, chordKey, offset, itemsPerPage, totalChordsCount, startFetchingMoreTransition]);

	return (
		<TooltipProvider>
			<Container>
				<div className="bg-background text-foreground min-h-screen">
					<div className="grid grid-cols-1 xs:grid-cols-2 gap-6 md:gap-8 grid-flow-dense">
						<InfiniteScroll hasMore={hasMore} isLoading={isFetchingMore} next={loadMoreChords} threshold={0.5}>
							{displayedChords.map((chord, chordIndex) => (
								<div
									key={`${chord.id}-${chordIndex}`}
									className="self-start flex flex-col gap-4 bg-card text-card-foreground rounded-lg border border-border shadow-sm p-4 md:p-6"
								>
									<Tooltip>
										<TooltipTrigger asChild>
											<Link href={`/chords/${chord.key}/${chord.suffix}`}>
												<h2 className="text-xl text-center md:text-2xl font-semibold cursor-pointer hover:text-primary transition-colors">
													{`${chord.key} ${chord.suffix}`}
												</h2>
											</Link>
										</TooltipTrigger>
										<TooltipContent>
											<p>{translateChordName(chord.key, chord.suffix)}</p>
										</TooltipContent>
									</Tooltip>

									<div className="grid gap-y-8 grid-cols-2 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
										{chord.positions.map((position, posIndex) => (
											<ChordElement
												key={`${position.id}-${posIndex}`}
												position={position}
												chordKey={chord.key}
												suffix={chord.suffix}
												posIndex={posIndex}
												isInitiallyLearned={allLearnedPositionIds.has(position.id)}
											/>
										))}
									</div>
								</div>
							))}
							{isFetchingMore && hasMore && (
								<div className="col-span-full flex justify-center items-center py-8">
									<Loader2 className="h-8 w-8 animate-spin text-primary" />
									<span className="ml-2">Загружаем аккорды... 🎸</span>
								</div>
							)}
						</InfiniteScroll>
					</div>

					{!hasMore && !isFetchingMore && displayedChords.length > 0 && (
						<div className="text-center pt-8 text-muted-foreground">Вы дошли до конца!</div>
					)}
					{displayedChords.length === 0 && !isFetchingMore && totalChordsCount > 0 && (
						<div className="text-center py-8 text-muted-foreground">
							Загрузка аккордов... Если это сообщение остается, проверьте консоль.
						</div>
					)}
				</div>
			</Container>
		</TooltipProvider>
	);
};

export default ChordList;