import { ChordWithPositions } from "@/lib/chords/types";
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

type JsonChordsDatabase = {
	[noteKey: string]: ChordWithPositions[];
};

// Your provided tunings data
const tuningsData: { [key: string]: string[] } = {
	// --- 6-Струнная гитара: Стандартные и пониженные строи ---
	"E Стандартный (E-A-D-G-B-E)": ["E2", "A2", "D3", "G3", "B3", "E4"],
	"E♭ Стандартный (E♭-A♭-D♭-G♭-B♭-E♭)": ["Eb2", "Ab2", "Db3", "Gb3", "Bb3", "Eb4"],
	"D Стандартный (D-G-C-F-A-D)": ["D2", "G2", "C3", "F3", "A3", "D4"],
	"D♭ Стандартный (D♭-G♭-B-E-A♭-D♭)": ["Db2", "Gb2", "B2", "E3", "Ab3", "Db4"],
	"C Стандартный (C-F-B♭-E♭-G-C)": ["C2", "F2", "Bb2", "Eb3", "G3", "C4"],

	// --- 6-Струнная гитара: Drop строи ---
	"Drop D (D-A-D-G-B-E)": ["D2", "A2", "D3", "G3", "B3", "E4"],
	"Drop C♯ / Drop D♭ (D♭-A♭-D♭-G♭-B♭-E♭)": ["Db2", "Ab2", "Db3", "Gb3", "Bb3", "Eb4"], // Также C#2-G#2-C#3-F#3-A#3-D#4
	"Drop C (C-G-C-F-A-D)": ["C2", "G2", "C3", "F3", "A3", "D4"], // Исправлено с ["C2", "G2", "C3", "D3", "G3", "C4"]
	"Drop B (B-F♯-B-E-G♯-C♯)": ["B1", "F#2", "B2", "E3", "G#3", "C#4"],
	// "Drop A (A-E-A-D-F♯-B)" - Очень низкий для 6 струн, чаще для 7-ми: ["A1", "E2", "A2", "D3", "F#3", "B3"] - пока убрал, чтобы не перегружать

	// --- 6-Струнная гитара: Открытые строи (Open Tunings) ---
	"Open G (D-G-D-G-B-D)": ["D2", "G2", "D3", "G3", "B3", "D4"],
	"Open D (D-A-D-F♯-A-D)": ["D2", "A2", "D3", "F#3", "A3", "D4"],
	"Open E (E-B-E-G♯-B-E)": ["E2", "B2", "E3", "G#3", "B3", "E4"],
	"Open A (E-A-E-A-C♯-E)": ["E2", "A2", "E3", "A3", "C#4", "E4"], // Один из вариантов
	"Open C (C-G-C-G-C-E)": ["C2", "G2", "C3", "G3", "C4", "E4"],
	"Open Dm (D-A-D-F-A-D)": ["D2", "A2", "D3", "F3", "A3", "D4"],
	"Open Gm (D-G-D-G-B♭-D)": ["D2", "G2", "D3", "G3", "Bb3", "D4"],

	// --- 6-Струнная гитара: Другие популярные строи ---
	"Double Drop D (D-A-D-G-B-D)": ["D2", "A2", "D3", "G3", "B3", "D4"],
	"Кельтский (D-A-D-G-A-D)": ["D2", "A2", "D3", "G3", "A3", "D4"],
	"Нэшвилл (E3-A3-D4-G4-B3-E4)": ["E3", "A3", "D4", "G4", "B3", "E4"],
	"F Major 9 (Мат-рок) (F-A-C-G-B-E)": ["F2", "A2", "C3", "G3", "B3", "E4"], // Из вашего списка

	// --- 7-Струнная гитара ---
	"Стандартный 7-струн (B-E-A-D-G-B-E)": ["B1", "E2", "A2", "D3", "G3", "B3", "E4"],
	"Русская семиструнная (D-G-B-D-G-B-D)": ["D2", "G2", "B2", "D3", "G3", "B3", "D4"],
};

const scalesData: { [key: string]: number[] } = {
	//ФУНДАМЕНТАЛЬНАЯ
	Хроматическая: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],

	//ОСНОВНЫЕ ДИАТОНИЧЕСКИЕ ЛАДЫ (ЛАДЫ НАТУРАЛЬНОГО МАЖОРА)
	"Натуральный мажор (Ионийский)": [0, 2, 4, 5, 7, 9, 11], // I лад
	Дорийский: [0, 2, 3, 5, 7, 9, 10], // II лад
	Фригийский: [0, 1, 3, 5, 7, 8, 10], // III лад
	Лидийский: [0, 2, 4, 6, 7, 9, 11], // IV лад
	"Миксолидийский (Доминантовый)": [0, 2, 4, 5, 7, 9, 10], // V лад
	"Натуральный минор (Эолийский)": [0, 2, 3, 5, 7, 8, 10], // VI лад
	Локрийский: [0, 1, 3, 5, 6, 8, 10], // VII лад

	// --- ОСНОВНЫЕ ВИДЫ МИНОРА ---
	// Натуральный минор уже есть выше (Эолийский)
	"Гармонический минор": [0, 2, 3, 5, 7, 8, 11],
	"Мелодический минор (восходящий)": [0, 2, 3, 5, 7, 9, 11], // Также известен как джазовый минор

	// --- ПЕНТАТОНИКИ И БЛЮЗОВЫЕ ГАММЫ ---
	"Мажорная пентатоника": [0, 2, 4, 7, 9],
	"Минорная пентатоника": [0, 3, 5, 7, 10],
	"Блюзовая (минорная)": [0, 3, 5, 6, 7, 10],
	"Блюзовая (мажорная)": [0, 2, 3, 4, 7, 9],

	// --- СИММЕТРИЧНЫЕ ГАММЫ ---
	Целотонная: [0, 2, 4, 6, 8, 10],
	"Уменьшенная (полутон-тон)": [0, 1, 3, 4, 6, 7, 9, 10],
	"Уменьшенная (тон-полутон)": [0, 2, 3, 5, 6, 8, 9, 11],

	// --- БИБОП-ГАММЫ (8 нот, с проходящим тоном) ---
	"Мажорный бибоп": [0, 2, 4, 5, 7, 8, 9, 11], // Натуральный мажор + проходящая b6 (#5)
	"Доминантный бибоп (Миксолидийский бибоп)": [0, 2, 4, 5, 7, 9, 10, 11], // Миксолидийский + проходящая мажорная септима
	"Минорный бибоп (Дорийский бибоп)": [0, 2, 3, 5, 7, 8, 9, 10], // Дорийский + проходящая мажорная секста (или b6 в другом варианте)
	"Мелодический минор бибоп": [0, 2, 3, 5, 7, 9, 10, 11], // Мелодический минор (восх.) + проходящая b7

	"Венгерский минор (Цыганский минор)": [0, 2, 3, 6, 7, 8, 11], // Гармонический минор с #IV
	"Неаполитанский мажор": [0, 1, 4, 5, 7, 9, 11], // Мажор с bII
	"Неаполитанский минор": [0, 1, 3, 5, 7, 8, 10], // Натуральный минор с bII
};

const arpeggiosData: { [key: string]: number[] } = {
	// Трезвучия
	"Мажорное трезвучие (maj)": [0, 4, 7],
	"Минорное трезвучие (min)": [0, 3, 7],
	"Увеличенное трезвучие (aug)": [0, 4, 8],
	"Уменьшенное трезвучие (dim)": [0, 3, 6],

	// Септаккорды
	"Мажорный септаккорд (maj7)": [0, 4, 7, 11],
	"Минорный септаккорд (min7)": [0, 3, 7, 10],
	"Доминантсептаккорд (7)": [0, 4, 7, 10],
	"Полууменьшенный септаккорд (m7b5)": [0, 3, 6, 10],
	"Уменьшенный септаккорд (dim7)": [0, 3, 6, 9],
	"Увеличенный мажорный септаккорд (maj7#5)": [0, 4, 8, 11],
	"Увеличенный септаккорд (7#5)": [0, 4, 8, 10],
	"Минорно-мажорный септаккорд (min(maj7))": [0, 3, 7, 11],

	// Секстаккорды и другие
	"Мажорный с секстой (maj6)": [0, 4, 7, 9],
	"Минорный с секстой (min6)": [0, 3, 7, 9],
	"Септаккорд с задержанием (7sus4)": [0, 5, 7, 10],
	"Доминантсептаккорд с пониженной квинтой (7b5)": [0, 4, 6, 10],
	"Мажорный септаккорд с пониженной квинтой (maj7b5)": [0, 4, 6, 11],
	"Трезвучие с задержанием (sus4)": [0, 5, 7],
	"Трезвучие с задержанием (sus2)": [0, 2, 7],
};

async function seedArpeggios() {
	console.log("Заполнение арпеджио...");
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
	console.log("Заполнение гамм...");
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
	console.log("Заполнение тюнингов...");
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
	console.log("Заполнение тюнингов завершено.");
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
