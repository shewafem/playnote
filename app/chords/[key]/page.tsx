import { auth } from "@/auth";
import ChordList from "@/components/chords/chord-list";
import { formatItem, getChordsByKeyPaginated } from "@/lib/chords/utils";
import {getLearnedPositionIdsForChords} from "@/lib/chords/utils";

const ITEMS_PER_PAGE = 4;
export default async function ChordsOfKey({ params }: { params: Promise<{ key: string }> }) {
  const session = await auth();
  const userId = session?.user?.id;

  const { key: rawKeyFromUrl } = await params;
  const displayKey = formatItem(rawKeyFromUrl);

  const { chords: initialChords, totalCount } = await getChordsByKeyPaginated(
    rawKeyFromUrl,
    0,
    ITEMS_PER_PAGE
  );

  const initialLearnedPositionIds: number[] = await getLearnedPositionIdsForChords(userId, initialChords);

  if (totalCount === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Аккорды для тональности {displayKey} не найдены 😔
      </div>
    );
  }

  return (
    <section className="flex flex-col">
      <h1 className="text-center mb-4 font-bold text-4xl">
        {`Аккорды тональности ${displayKey}`}
      </h1>
      <p className="text-center text-muted-foreground mb-2 text-sm">(нажмите на схему аккорда для его воспроизведения)</p>
      <ChordList
        initialChords={initialChords}
        initialLearnedPositionIds={initialLearnedPositionIds}
        totalChordsCount={totalCount}
        chordKey={rawKeyFromUrl}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </section>
  );
}