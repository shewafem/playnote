import { getChordsByKey } from "@/actions/chords/get-chords";
import { NextResponse } from "next/server";
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ key: string }> }
) {
	const { key } = await params;

	if (!key) {
		return NextResponse.json({ error: "Параметр 'key' отсутствует" }, { status: 400 });
	}

	try {
		const chords = await getChordsByKey(key);

		if (!chords || chords.length === 0) {
			return NextResponse.json({ error: `Аккорды для тональности '${key}' не найдены` }, { status: 404 });
		}

		return NextResponse.json(chords);
	} catch (error) {
		console.error(`Ошибка при получении аккордов для тональности ${key}:`, error);
		return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
	}
}
