import ChordElement from "@/components/chords/chord-element";
import { getChord } from "@/data/utils";
import React from "react";

export default async function TypeOfChordsOfKey({ params }: { params: Promise<{ key: string; type: string }> }) {
	const { key, type } = await params;
	const formattedKey = key === "Csharp" ? "C#" : key === "Fsharp" ? "F#" : key;
	const formattedType = type.replace(/sharp/g, "#").replace(/over/g, "/");
	const chord = await getChord(formattedKey, formattedType);

  if (!chord) {
    return <div className="text-center py-8 text-muted-foreground">Аккорд не найден 😔</div>;
  }

	return (
		<div className="self-start flex flex-col gap-4 bg-card text-card-foreground rounded-lg border border-border shadow-sm p-4 md:p-6">
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
	);
}
