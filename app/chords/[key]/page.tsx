import { auth } from "@/auth";
import ChordList from "@/components/chords/chord-list";
import { formatItem, getChordsByKeyPaginated } from "@/lib/chords/utils";
import { ChordWithPositions } from "@/lib/chords/types";
import prisma from "@/lib/prisma";

const ITEMS_PER_PAGE = 4;
async function getLearnedPositionIdsForChords(userId: string | undefined, chords: ChordWithPositions[]): Promise<number[]> {
  if (!userId || chords.length === 0) {
    return [];
  }
  const allPositionIds = chords.flatMap(chord => chord.positions.map(p => p.id));
  if (allPositionIds.length === 0) return [];

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        learnedPositions: {
          where: { id: { in: allPositionIds } },
          select: { id: true },
        },
      },
    });
    return user?.learnedPositions.map((p) => p.id) || [];
  } catch (error) {
    console.error("Error fetching learned positions for initial chords:", error);
    return [];
  }
}

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