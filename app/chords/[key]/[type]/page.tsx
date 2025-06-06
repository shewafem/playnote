import ChordElement from "@/components/chords/chord-element";
import { formatItem } from "@/lib/chords/utils";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Position } from "@prisma/client";
import React, { Suspense } from "react";
import { getChord } from "@/actions/chords/get-chords";
async function getCurrentUserLearnedPositionIds(userId: string | undefined): Promise<number[]> {
	if (!userId) {
		return [];
	}
	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				learnedPositions: {
					select: {
						id: true,
					},
				},
			},
		});
		return user?.learnedPositions.map((p) => p.id) || [];
	} catch (error) {
		console.error("Ошибка получения аккордов с позициями дял пользователя", error);
		return [];
	}
}

export default async function TypeOfChordsOfKey({ params }: { params: Promise<{ key: string; type: string }> }) {
	const session = await auth();
	const userId = session?.user?.id;

	const { key: rawKeyFromUrl, type: rawTypeFromUrl } = await params;
	const formattedSuffixForQuery = formatItem(rawTypeFromUrl); // "major", "minor"
	const displayKey = formatItem(rawKeyFromUrl); // "C", "G#"

	const chord = await getChord(rawKeyFromUrl, formattedSuffixForQuery);

	if (!chord) {
		return (
			<div className="text-center py-8 text-muted-foreground">
				Аккорд {displayKey} {formattedSuffixForQuery} не найден 😔
			</div>
		);
	}

	const learnedPositionIds: number[] = await getCurrentUserLearnedPositionIds(userId);
	const learnedIdsSet = new Set(learnedPositionIds);

	return (
		<div className="self-start flex flex-col gap-4 bg-card text-card-foreground rounded-lg border border-border shadow-sm p-4 md:p-6">
			<h2 className="text-xl text-center md:text-2xl font-semibold">{`${chord.key} ${chord.suffix}`}</h2>
			<Suspense>
				<div className="grid gap-y-8 grid-cols-2 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{chord.positions.map((position: Position, posIndex: number) => (
						<ChordElement
							key={`${position.id}-${posIndex}`}
							position={position}
							chordKey={chord.key}
							suffix={chord.suffix}
							posIndex={posIndex}
							isInitiallyLearned={learnedIdsSet.has(position.id)}
						/>
					))}
				</div>
			</Suspense>
		</div>
	);
}
