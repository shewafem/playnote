// app/chords/[key]/[type]/page.tsx (или где находится ваш компонент)

import ChordElement from "@/components/chords/chord-element";
// 1. Обновляем импорты, чтобы использовать новые функции из вашего Prisma-сервиса
import { getChord, formatItem } from "@/data/utils"; // <-- Укажите правильный путь
import React from "react";

export default async function TypeOfChordsOfKey({ params }: { params: Promise<{key: string, type: string}> }) {
  // Обработка params
  const { key: rawKeyFromUrl, type: rawTypeFromUrl } = await params

  // 2. Форматируем 'type' (суффикс) из URL перед передачей в getChord.
  //    Функция getChord ожидает, что суффикс уже будет в корректном формате (например, "major", "minor#7"),
  //    но она сама отформатирует 'key'.
  const formattedSuffixForQuery = formatItem(rawTypeFromUrl);

  // 3. Вызываем новую функцию getChord.
  //    Передаем 'rawKeyFromUrl' (getChord отформатирует его внутри себя с помощью formatItem)
  //    и 'formattedSuffixForQuery'.
  const chord = await getChord(rawKeyFromUrl, formattedSuffixForQuery);

  if (!chord) {
    const displayKey = formatItem(rawKeyFromUrl);
    return (
      <div className="text-center py-8 text-muted-foreground">
        Аккорд {displayKey} {formattedSuffixForQuery} не найден 😔
      </div>
    );
  }
  return (
    <div className="self-start flex flex-col gap-4 bg-card text-card-foreground rounded-lg border border-border shadow-sm p-4 md:p-6">
      <h2 className="text-xl text-center md:text-2xl font-semibold">
        {`${chord.key} ${chord.suffix}`}
      </h2>
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