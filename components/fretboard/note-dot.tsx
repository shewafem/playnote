// components/interactive-fretboard/note-dot.tsx
import React from "react";
import { motion } from "framer-motion";
import { midiToNoteName } from "@/lib/music-utils";
import { cn } from "@/lib/utils";

interface NoteDotProps {
	identifier: string;
	midiValue: number;
	isHighlighted: boolean;
	isRoot: boolean;
  isThird: boolean;
  isFifth: boolean;
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
  isThird,
  isFifth,
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
		"w-8 h-8 rounded-full flex items-center justify-center relative", // Base transition for other state changes
		{
			"bg-muted-foreground/20 border-secondary-foreground/30": !isHighlighted && !isSelected && !isPlaying, // Ensure isPlaying doesn't also get this
		},
		// Подсвеченная
		{ "bg-primary/80 border-primary": isHighlighted && !isSelected && !isPlaying },
		// Выбранная
		{ "bg-yellow-500 shadow-md": isSelected && !isPlaying },
		// Тоника
		{ "bg-green-500 rounded-sm border-primary": isRoot && !isSelected && !isPlaying },
    { "rounded-sm": isRoot && isSelected && !isPlaying },
    //third
    { "bg-ring shadow-md border-0": isThird && !isSelected },
    { "bg-pink-400 border-0": isFifth && !isSelected},
		// Курсор
		{ "cursor-pointer": canClick },
		{ "hover:shadow-lg": canClick && !isPlaying }, // Prevent hover effect when playing
		{ "opacity-70": !isToneReady }
	);

	// Когда показывать ноту
	// Keep showing note name if it's playing, highlighted, or selected
	const showNoteName = isHighlighted || isSelected || isPlaying;

	return (
		<motion.div className={cn(className, isPlaying && "transition-duration-300 ease-in-outtransform-scale-110")}
    onClick={handleClick}
    whileHover={{ scale: 1.2 }}
    whileTap={{ scale: 0.85 }}
    >
			{showNoteName && (
				<span className="text-md font-bold pointer-events-none select-none text-primary-foreground">{displayName}</span>
			)}
		</motion.div>
	);
};

export default NoteDot;