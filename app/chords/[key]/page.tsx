import { auth } from "@/auth";
import ChordList from "@/components/chords/chord-list";
import { getChordsByKeyPaginated } from "@/actions/chords/get-chords";
import { getLearnedPositionIdsForChords } from "@/actions/chords/get-chords";
import { formatItem } from "@/lib/chords/utils";
import { Suspense } from "react";

const ITEMS_PER_PAGE = 4;
export default async function ChordsOfKey({ params }: { params: Promise<{ key: string }> }) {
	const session = await auth();
	const userId = session?.user?.id;

	const { key: rawKeyFromUrl } = await params;
	const displayKey = formatItem(rawKeyFromUrl);

	const { chords: initialChords, totalCount } = await getChordsByKeyPaginated(rawKeyFromUrl, 0, ITEMS_PER_PAGE);

	const initialLearnedPositionIds: number[] = await getLearnedPositionIdsForChords(userId, initialChords); //какие позиция уже выучены

	if (totalCount === 0) {
		return (
			<div className="text-center py-8 text-muted-foreground">Аккорды для тональности {displayKey} не найдены 😔</div>
		);
	}

	return (
		<section className="flex flex-col">
			<h1 className="text-center mb-4 font-bold text-4xl">{`Аккорды тональности ${displayKey}`}</h1>
			<p className="text-center text-muted-foreground mb-2 text-sm">
				(нажмите на схему аккорда для его воспроизведения)
			</p>
			<Suspense>
				<ChordList
					initialChords={initialChords}
					initialLearnedPositionIds={initialLearnedPositionIds}
					totalChordsCount={totalCount}
					chordKey={rawKeyFromUrl}
					itemsPerPage={ITEMS_PER_PAGE}
				/>
			</Suspense>
		</section>
	);
}
