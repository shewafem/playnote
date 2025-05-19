// components/interactive-fretboard/note-dot.tsx
import React from "react";
import { midiToNoteName } from "@/lib/music-utils";
import { cn } from "@/lib/utils"; 

interface NoteDotProps {
	identifier: string; 
	midiValue: number;
	isHighlighted: boolean;
	isRoot: boolean; 
	isSelected: boolean; 
	isPlaying: boolean;
	isSelectingMode: boolean;
	onClick?: (value: string) => void;
	isToneReady: boolean; 
}

const NoteDot: React.FC<NoteDotProps> = ({
	identifier,
	midiValue,
	isHighlighted,
	isRoot,
	isSelected,
	isPlaying,
	isSelectingMode,
	onClick,
	isToneReady,
}) => {
	const noteNameWithOctave = midiToNoteName(midiValue);
  //Убрать октаву
	const displayName = noteNameWithOctave ? noteNameWithOctave.replace(/\d+$/, "") : "";

	const canClick = isToneReady && !!onClick;

	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation(); 
		if (canClick) {
			if (isSelectingMode) {
				onClick(identifier); // Идентификатор при выборе
			} else if (noteNameWithOctave) {
				onClick(noteNameWithOctave); // Передать название ноты
			}
		}
	};

	const className = cn(
		"w-8 h-8 rounded-full flex items-center justify-center relative border",
		"transition-all duration-100 ease-in-out", 
		{
			"bg-secondary border-secondary-foreground/30": !isHighlighted && !isSelected,
		},
		// Подсвеченная
		{ "bg-primary/80 border-primary": isHighlighted && !isSelected },
		// Выбранная
		{ "bg-yellow-400 border-yellow-600 shadow-md": isSelected },
		// Тоника
		{ "outline-red-500 outline-2 outline-offset-1": isRoot },
		// Анимация проигрыша
		{ "bg-yellow-200 border-yellow-500 shadow-lg animate-note-pulse": isPlaying },
		// Курсор
		{ "cursor-pointer": canClick },
		{ "hover:shadow-lg": canClick && !isPlaying },
		{ "opacity-70": !isToneReady } 
	);

	// Когда показывать ноту
	const showNoteName = isHighlighted || isSelected || isPlaying || !isSelected;

	return (
		<div className={className} onClick={handleClick}>
			{showNoteName && (
				<span className="text-md font-bold pointer-events-none select-none text-primary-foreground">{displayName}</span>
			)}
		</div>
	);
};

export default NoteDot;
