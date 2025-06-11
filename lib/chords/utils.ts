export function formatItem(item: string): string {
	if (item === undefined) {
		return item;
	}
	const formattedItem = item.replace(/sharp/g, "#").replace(/over/g, "/"); // Csharp -> C#
	return formattedItem;
}

export function formatItemReverse(suffix: string): string {
  if (suffix === undefined) {
    return suffix;
  }
  const formattedSuffix = suffix.replace(/\//g, "over").replace(/#/g, "sharp") // C# -> Csharp
  return formattedSuffix;
}