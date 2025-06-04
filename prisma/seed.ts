import { ChordWithPositions } from "@/lib/chords/types";
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// Описываем структуру всего JSON файла
type JsonChordsDatabase = {
	[noteKey: string]: ChordWithPositions[]; // e.g. "C": [ { key: "C", suffix: "major", ... } ]
};

// Your provided tunings data
const tuningsData: { [key: string]: string[] } = {
	"Стандартный (E-A-D-G-B-E)": ["E2", "A2", "D3", "G3", "B3", "E4"],
	"Drop D (D-A-D-G-B-E)": ["D2", "A2", "D3", "G3", "B3", "E4"],
	"Double Drop D (D-A-D-G-B-D)": ["D2", "A2", "D3", "G3", "B3", "D4"],
	"Drop C (C-G-C-F-A-D)": ["C2", "G2", "C3", "D3", "G3", "C4"],
	"Open G (D-G-D-G-B-D)": ["D2", "G2", "D3", "G3", "B3", "D4"],
	"Open D (D-A-D-F♯-A-D)": ["D2", "A2", "D3", "F#3", "A3", "D4"],
	"Фолк (D-A-D-G-A-D)": ["D2", "A2", "D3", "G3", "A3", "D4"],
	"E♭ (E♭-A♭-D♭-G♭-B♭-E♭)": ["Eb2", "Ab2", "Db3", "Gb3", "Bb3", "Eb4"],
	"Math rock (F-A-C-G-B-E)": ["F2", "A2", "C3", "G3", "B3", "E4"],
	"Семиструнная (D-G-B-D-G-B-D)": ["D2", "G2", "B2", "D3", "G3", "B3", "D4"],
};

const scalesData: { [key: string]: number[] } = {
	Хроматическая: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
	Мажор: [0, 2, 4, 5, 7, 9, 11],
	"Натуральный Минор": [0, 2, 3, 5, 7, 8, 10],
	"Гармонический Минор": [0, 2, 3, 5, 7, 8, 11],
	"Мелодический Минор": [0, 2, 3, 5, 7, 9, 11],
	"Мажорная Пентатоника": [0, 2, 4, 7, 9],
	"Минорная Пентатоника": [0, 3, 5, 7, 10],
	Блюз: [0, 3, 5, 6, 7, 10],
	Дорийский: [0, 2, 3, 5, 7, 9, 10],
	Фригийский: [0, 1, 3, 5, 7, 8, 10],
	Лидийский: [0, 2, 4, 6, 7, 9, 11],
	Миксолидийский: [0, 2, 4, 5, 7, 9, 10],
	Локрийский: [0, 1, 3, 5, 6, 8, 10],
	Целотон: [0, 2, 4, 6, 8, 10],
	"Уменьшенный (H-W)": [0, 1, 3, 4, 6, 7, 9, 10],
	Альтерированный: [0, 1, 3, 4, 6, 8, 10],
	"Лидийский Доминант": [0, 2, 4, 6, 7, 9, 10],
	"Мажорный Бебоп": [0, 2, 4, 5, 7, 8, 9, 11],
	"Минорный Бебоп": [0, 2, 3, 5, 7, 9, 10, 11],
	"Доминантный Бебоп": [0, 2, 4, 5, 7, 9, 10, 11],
};

const arpeggiosData: { [key: string]: number[] } = {
	"Major 7": [0, 4, 7, 11],
	"Minor 7": [0, 3, 7, 10],
	"Dominant 7": [0, 4, 7, 10],
	"Minor 7b5": [0, 3, 6, 10],
	"Diminished 7": [0, 3, 6, 9],
	"Augmented Major 7": [0, 4, 8, 11],
	"Augmented 7": [0, 4, 8, 10],
	"Minor Major 7": [0, 3, 7, 11],
};

async function seedArpeggios() {
	console.log('Заполнение арпеджио...');
	const arpeggiosToCreate = [];
	for (const [name, formulaArray] of Object.entries(arpeggiosData)) {
		arpeggiosToCreate.push({
			name: name,
			formula: formulaArray,
		});
	}
	await prisma.arpeggio.createMany({
		data: arpeggiosToCreate,
		skipDuplicates: true,
	});
	console.log(`Заполнено ${arpeggiosToCreate.length} арпеджио.`);
}

async function seedScales() {
	console.log('Заполнение гамм...');
	const scalesToCreate = [];
	for (const [name, formulaArray] of Object.entries(scalesData)) {
		scalesToCreate.push({
			name: name,
			formula: formulaArray,
		});
	}
	await prisma.scale.createMany({
		data: scalesToCreate,
		skipDuplicates: true, // Because 'formula' is unique
	});
	console.log(`Заполнено ${scalesToCreate.length} гамм.`);
}



async function seedChords() {
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
}

async function seedTunings() {
	console.log('Заполнение тюнингов...');
	const tuningsToCreate = [];
	for (const [name, notes] of Object.entries(tuningsData)) {
		tuningsToCreate.push({
			name: name,
			notes: notes,
		});
	}

	await prisma.tuning.createMany({
		data: tuningsToCreate,
		skipDuplicates: true,
	});

	console.log(`Заполнен ${tuningsToCreate.length} тюнинг.`);
	console.log('Заполнение тюнингов завершено.');
}
async function main() {
	console.log("Начинаем заполнение базы данных...");
	await seedChords();
  await seedTunings();
  await seedArpeggios();
  await seedScales();
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
