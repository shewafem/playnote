import ChordList from "@/components/chords/chord-list";
import { getChordsByKey } from "@/data/utils";

export default async function ChordsOfKey({ params }: { params: Promise<{ key: string }> }) {
	const { key } = await params;
	const formattedKey = key === "Csharp" ? "C#" : key === "Fsharp" ? "F#" : key;
	const chordsOfKey = await getChordsByKey(formattedKey);
	return (
		<section className="flex flex-col">
			<h1 className="text-center mb-12 font-bold text-4xl">{`Аккорды тональности ${formattedKey}`}</h1>
				<ChordList chords={chordsOfKey}></ChordList>
		</section>
	);
}
