import { getChord } from "@/lib/chords/utils";
import { NextResponse } from "next/server";

export async function GET(
	request: Request, // Объект входящего запроса (может понадобиться для query-параметров в будущем)
	{ params }: { params: Promise<{ key: string; type: string }> }
) {
	const { key, type } = await params;

	if (!key || !type) {
		return NextResponse.json({ error: "Параметры 'key' и 'type' отсутствуют" }, { status: 400 });
	}

	try {
		const chord = await getChord(key, type);

		if (!chord) {
			return NextResponse.json({ error: "Аккорд не найден" }, { status: 404 });
		}

		return NextResponse.json(chord);
	} catch (error) {
		console.error(`Ошибка при получении аккорда ${key} ${type} :`, error);
		return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
	}
}
