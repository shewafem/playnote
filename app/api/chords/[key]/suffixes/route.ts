import { getSuffixes } from "@/lib/chords/utils";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ key: string }> }) {
	const { key } = await params;
	if (!key) {
		return NextResponse.json({ error: "Параметр 'key' отсутствует" }, { status: 400 });
	}

	try {
		const suffixes = await getSuffixes(key);

		if (!suffixes || suffixes.length === 0) {
			return NextResponse.json({ error: `Суффиксы для тональности '${key}' не найдены` }, { status: 404 });
		}

		return NextResponse.json(suffixes);
	} catch (error) {
		console.error(`Ошибка при получении суффиксов для тональности ${key}:`, error);
		return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
	}
}
