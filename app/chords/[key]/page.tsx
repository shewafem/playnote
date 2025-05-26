// app/chords/[key]/page.tsx (или где находится ваш компонент)

import ChordList from "@/components/chords/chord-list";
// 1. Обновляем импорт, чтобы использовать новые функции из вашего Prisma-сервиса
import { getChordsByKey, formatItem } from "@/lib/chords/utils";

export default async function ChordsOfKey({ params }: { params: Promise<{ key: string }> }) {
	const { key: rawKeyFromUrl } = await params; // Например, "Csharp", "Fsharp"
	const displayKey = formatItem(rawKeyFromUrl); // Например, "C#", "F#"

	const chordsOfKey = await getChordsByKey(rawKeyFromUrl);
	if (!chordsOfKey || chordsOfKey.length === 0) {
		return (
			<div className="text-center py-8 text-muted-foreground">Аккорды для тональности {displayKey} не найдены 😔</div>
		);
	}

	return (
		<section className="flex flex-col">
			<h1 className="text-center mb-4 font-bold text-4xl">
				{/* Используем displayKey для корректного отображения */}
				{`Аккорды тональности ${displayKey}`}
			</h1>
			<ChordList chords={chordsOfKey}></ChordList>
		</section>
	);
}