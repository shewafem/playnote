import ChordList from "@/components/chords/chord-list";
import { getChordsByKey } from "@/data/utils";

export default async function ChordsOfKey({ params }: { params: Promise<{ key: string }> }) {
	const { key } = await params;
	const formattedKey = key === "Csharp" ? "C#" : key === "Fsharp" ? "F#" : key;
	const chordsOfKey = await getChordsByKey(formattedKey);
  if (chordsOfKey.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Такой тональности нет 😔</div>;
  }
	return (
		<section className="flex flex-col">
			<h1 className="text-center mb-4 font-bold text-4xl">{`Аккорды тональности ${formattedKey}`}</h1>
				<ChordList chords={chordsOfKey}></ChordList>
		</section>
	);
}
