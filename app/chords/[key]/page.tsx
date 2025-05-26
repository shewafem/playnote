// app/chords/[key]/page.tsx (или где находится ваш компонент)

import ChordList from "@/components/chords/chord-list";
// 1. Обновляем импорт, чтобы использовать новые функции из вашего Prisma-сервиса
import { getChordsByKey, formatItem } from "@/data/utils"; 

export default async function ChordsOfKey({ params }: { params: Promise<{ key: string }> }) {
  // Обработка params, если это Promise (стандарт для Next.js < 13.4 или при определенных конфигурациях)
  // или уже разрешенный объект (Next.js 13.4+ App Router по умолчанию)
  const resolvedParams = await params;
  const { key: rawKeyFromUrl } = resolvedParams; // Например, "Csharp", "Fsharp", "C"

  // 2. Используем функцию formatItem для преобразования ключа, полученного из URL,
  // в формат, который ожидает база данных (например, "Csharp" -> "C#").
  // Эта же функция formatItem используется внутри getChordsByKey,
  // но нам также нужен отформатированный ключ для отображения в заголовке.
  const displayKey = formatItem(rawKeyFromUrl);

  // 3. Вызываем новую функцию getChordsByKey.
  // Сама getChordsByKey уже вызывает formatItem для ключа, который ей передается,
  // так что мы можем передать rawKeyFromUrl или displayKey - результат будет одинаков для запроса.
  // Передадим rawKeyFromUrl, чтобы formatItem внутри getChordsByKey отработал.
  const chordsOfKey = await getChordsByKey(rawKeyFromUrl);

  if (!chordsOfKey || chordsOfKey.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Аккорды для тональности {displayKey} не найдены 😔
      </div>
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