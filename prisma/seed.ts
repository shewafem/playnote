import { ChordWithPositions } from "@/lib/chords/types";
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// Описываем структуру всего JSON файла
type JsonChordsDatabase = {
	[noteKey: string]: ChordWithPositions[]; // e.g. "C": [ { key: "C", suffix: "major", ... } ]
};

async function main() {
	console.log("Начинаем заполнение базы данных...");

	const filePath = path.join(__dirname, "..", "chords.json"); // пут к JSON файлу
	// Предполагается, что chords.json лежит в корне проекта,
	// а seed.ts в prisma/seed.ts

	if (!fs.existsSync(filePath)) {
		console.error(`Файл данных не найден по пути: ${filePath}`);
		return;
	}

	const jsonDataString = fs.readFileSync(filePath, "utf-8");
	const chordsDatabase: JsonChordsDatabase = JSON.parse(jsonDataString);

	for (const noteKey in chordsDatabase) {
		if (Object.prototype.hasOwnProperty.call(chordsDatabase, noteKey)) {
			const chordsByKey = chordsDatabase[noteKey]; // ChordData[]

			for (const chord of chordsByKey) {
				// Проверяем, существует ли уже такой аккорд
				// Имя уникального индекса @@unique([key, suffix]) по умолчанию будет key_suffix
				const existingChord = await prisma.chord.findUnique({
					where: {
						key_suffix: {
							key: chord.key,
							suffix: chord.suffix,
						},
					},
				});

				if (existingChord) {
					console.log(`Аккорд ${chord.key} ${chord.suffix} уже существует. Пропускаем.`);
					continue; // Пропускаем, если аккорд уже есть, чтобы избежать дубликатов
				}

				// Создаем аккорд и его позиции в одной транзакции (вложенная запись)
				try {
					const createdChord = await prisma.chord.create({
						data: {
							key: chord.key,
							suffix: chord.suffix,
							positions: {
								// Prisma связанные записи таким образом
								create: chord.positions.map((pos) => ({
									frets: pos.frets,
									fingers: pos.fingers,
									baseFret: pos.baseFret,
									barres: pos.barres,
									midi: pos.midi,
									capo: pos.capo, // Prisma обработает undefined как отсутствие значения для Boolean?
								})),
							},
						},
						include: {
							// включить созданные позиции в результат
							positions: true,
						},
					});
					console.log(
						`Создан аккорд: ${createdChord.key} ${createdChord.suffix} с ${createdChord.positions.length} позициями.`
					);
				} catch (e) {
					console.error(`Ошибка при создании аккорда ${chord.key} ${chord.suffix}:`, e);
				}
			}
		}
	}

	console.log("Заполнение базы данных завершено.");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
