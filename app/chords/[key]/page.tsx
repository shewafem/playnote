// app/chords/[key]/page.tsx
//import { auth } from "@/auth";
import ChordList from "@/components/chords/chord-list"; 
import { getChordsByKey, formatItem } from "@/lib/chords/utils";
import { ChordWithPositions } from "@/lib/chords/types";

export default async function ChordsOfKey({ params }: { params: Promise<{ key: string }> }) {
  //const session = await auth();
  //const userId = session?.user?.id; 

  const { key: rawKeyFromUrl } = await params;
  const displayKey = formatItem(rawKeyFromUrl);

  const chordsOfKey: ChordWithPositions[] = await getChordsByKey(rawKeyFromUrl);

  if (!chordsOfKey || chordsOfKey.length === 0) {
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
      <ChordList chords={chordsOfKey} />
    </section>
  );
}