// components/interactive-fretboard/note-dot.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { midiToNoteName } from "@/lib/fretboard-utils";
import { cn } from "@/lib/utils";
import { useFretboardStore } from "@/lib/fretboard-store";

interface NoteDotProps {
	identifier: string;
	midiValue: number;
	isHighlighted: boolean;
	isRoot: boolean;
	isFlatSecond: boolean;
	isSecond: boolean;
	isFlatThird: boolean;
	isThird: boolean;
	isFourth: boolean;
	isFlatFifth: boolean;
	isFifth: boolean;
	isSharpFifth: boolean;
	isSixth: boolean;
	isFlatSeventh: boolean;
	isSeventh: boolean;
	isSelected: boolean;
	isSelectingMode: boolean;
	onClick?: (value: string) => void;
	isToneReady: boolean;
}

const NoteDot: React.FC<NoteDotProps> = ({
	identifier,
	midiValue,
	isHighlighted,
	isRoot,
	isFlatSecond,
	isSecond,
	isFlatThird,
	isThird,
	isFourth,
	isFlatFifth,
	isFifth,
	isSharpFifth,
	isSixth,
	isFlatSeventh,
	isSeventh,
	isSelected,
	isSelectingMode,
	onClick,
	isToneReady,
}) => {
	const isPlaying = useFretboardStore((state) => state.currentlyPlayingNoteId === identifier);

	const noteNameWithOctave = midiToNoteName(midiValue);
	const displayName = noteNameWithOctave ? noteNameWithOctave.replace(/\d+$/, "") : "";
	const canClick = isToneReady && !!onClick;

	const handleClick = (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
		e.stopPropagation();
		if (canClick) {
			if (isSelectingMode) {
				onClick(identifier);
			} else if (noteNameWithOctave) {
				onClick(noteNameWithOctave);
			}
		}
	};

	// Keyboard accessibility
	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter" || e.key === " ") {
			handleClick(e);
		}
	};

	const noteNames: Record<string, string> = {
		C: "До",
		"C#": "До♯",
		D: "Ре",
		"D#": "Ре♯",
		E: "Ми",
		F: "Фа",
		"F#": "Фа♯",
		G: "Соль",
		"G#": "Соль♯",
		A: "Ля",
		"A#": "Ля♯",
		B: "Си",
	};

	// Interval label for tooltip/aria
	let intervalLabel = "";
	if (isRoot) intervalLabel = "Тоника";
	else if (isFlatSecond) intervalLabel = "♭2";
	else if (isSecond) intervalLabel = "2";
	else if (isFlatThird) intervalLabel = "♭3";
	else if (isThird) intervalLabel = "3";
	else if (isFourth) intervalLabel = "4";
	else if (isFlatFifth) intervalLabel = "♭5";
	else if (isFifth) intervalLabel = "5";
	else if (isSharpFifth) intervalLabel = "♯5";
	else if (isSixth) intervalLabel = "6";
	else if (isFlatSeventh) intervalLabel = "♭7";
	else if (isSeventh) intervalLabel = "7";
	else if (isHighlighted) intervalLabel = "Scale";

	// Show note name on hover, selected, highlighted, or playing
	const [hovered, setHovered] = React.useState(false);
	const showNoteName = hovered || isSelected || isPlaying || isHighlighted;

	const dotClassName = cn(
		"w-8 h-8 flex items-center justify-center outline-none",
		isRoot ? "rounded-md" : "rounded-full",
		// Color hierarchy
		{
			"bg-red-600 border-2 border-red-700 text-white": isRoot && !isSelected,
			"bg-amber-500 border-2 border-amber-700 text-white": isThird && !isRoot && !isSelected,
			"bg-blue-500 border-2 border-blue-700 text-white": isFifth && !isRoot && !isThird && !isSelected,
			"bg-purple-500 border-2 border-purple-700 text-white":
				isSeventh && !isRoot && !isThird && !isFifth && !isSelected,
			"bg-primary/80 border-primary": isHighlighted && !isRoot && !isThird && !isFifth && !isSeventh && !isSelected,
			"bg-yellow-400 border-yellow-600 text-black": isSelected,
			"bg-muted-foreground/20 border-secondary-foreground/30":
				!isRoot && !isThird && !isFifth && !isSeventh && !isHighlighted && !isSelected,
		},
		// приоритет
		{
			"ring-2 ring-yellow-400 ring-offset-1 shadow-lg": isSelected,
			"shadow-xl drop-shadow-lg": isPlaying,
			"cursor-pointer": canClick,
			"opacity-70": !isToneReady,
			"focus-visible:ring-2 focus-visible:ring-primary": canClick,
		}
	);

	return (
		<motion.div
			tabIndex={canClick ? 0 : -1}
			aria-label={`${displayName} ${intervalLabel}`}
			className={dotClassName}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			whileHover={canClick && !isPlaying ? { scale: 1.18 } : {}}
			whileTap={canClick ? { scale: 0.92 } : {}}
			animate={{
				scale: isPlaying ? 1.2 : 1,
			}}
			transition={{ type: "spring", stiffness: 400, damping: 10 }}
		>
			{/* Tooltip */}
			{hovered && (
				<div className="absolute -top-5 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black/90 text-xs text-white z-100 pointer-events-none whitespace-nowrap shadow-lg">
					{noteNames[displayName]} {intervalLabel && <span className="font-bold">({intervalLabel})</span>}
				</div>
			)}
			{/* Note name */}
			{showNoteName && (
				<span className="text-md font-bold pointer-events-none select-none text-primary-foreground drop-shadow">
					{displayName}
				</span>
			)}
		</motion.div>
	);
};

export default React.memo(NoteDot);
