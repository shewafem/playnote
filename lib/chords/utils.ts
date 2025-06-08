// Структура базы данных:
// {
//   "C": [
//     { key: "C", suffix: "major", positions: [...] }, // Аккорд c тональностью, суффиксом и позициями
//     { key: "C", suffix: "minor", positions: [...] },
//     ...
//   ],
//   "C#": [...],
//   "D": [...],
//   ...
// }
export function formatItem(item: string): string {
	if (item === undefined) {
		return item;
	}
	const formattedItem = item.replace(/sharp/g, "#").replace(/over/g, "/");
	return formattedItem;
}

export function formatItemReverse(suffix: string): string {
  if (suffix === undefined) {
    return suffix;
  }
  const formattedSuffix = suffix.replace(/\//g, "over").replace(/#/g, "sharp")
  return formattedSuffix;
}