"use client";

import { toggleLearnedPosition } from "@/actions/toggle-learned";
import { guitar } from "@/lib/chords/constants";
import { downloadPng, downloadSvg } from "@/lib/chords/image";
import { playChord } from "@/lib/chords/player";
import { Position } from "@prisma/client";
import Chord from "@techies23/react-chords";
import { CheckCircle, Download, GraduationCap, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState, useTransition } from "react";
import { Note } from "tonal";
//import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { toast } from "sonner";
import { redirect } from "next/navigation";

interface ChordElementProps {
	position: Position;
	chordKey: string;
	suffix: string;
	posIndex: number;
	isInitiallyLearned: boolean;
}

const ChordElement: React.FC<ChordElementProps> = ({ position, chordKey, suffix, posIndex, isInitiallyLearned }) => {
	const chordRef = useRef<HTMLDivElement>(null);
	const fileName = `${chordKey}${suffix.replace(/[^a-zA-Z0-9]/g, "")}_pos${posIndex + 1}`;
	const notes = position["midi"].map((midi) => Note.fromMidi(midi)).join(" ");
	const formattedNotes = notes.replace(/\d/g, "");

	const [isLearned, setIsLearned] = useState(isInitiallyLearned);
	const [isPending, startTransition] = useTransition();

	const { data: session } = useSession();

	useEffect(() => {
		setIsLearned(isInitiallyLearned);
	}, [isInitiallyLearned]);

	const handleToggleLearned = () => {
		startTransition(async () => {
			const result = await toggleLearnedPosition(position.id);
			if (result.success) {
				setIsLearned(result.learned!);
			} else {
				console.error("Ошибка переключения:", result.error);
			}
		});
	};

	const handleDownloadSvg = () => {
		const svgElement = chordRef.current?.querySelector("svg");
		if (svgElement) {
			downloadSvg(svgElement, fileName);
		} else {
			console.error("SVG не найден");
		}
	};

	const handleDownloadPng = () => {
		const svgElement = chordRef.current?.querySelector("svg");
		if (svgElement) {
			downloadPng(svgElement, fileName);
		} else {
			console.error("SVG не найден");
		}
	};

	return (
		<div className="rounded-md flex flex-col items-center justify-center">
			<p className="text-center text-sm">{formattedNotes}</p>
			<div
				ref={chordRef}
				onClick={() => playChord(position.midi)}
				className="w-full flex-grow flex items-center justify-center rounded-lg transition-all duration-200 ease-in-out cursor-pointer hover:-translate-y-2 mb-1"
			>
				<Chord chord={position} instrument={guitar} />
			</div>
			<div className="flex justify-center items-center w-full gap-2 ml-[-12px]">
				<Download size={16} />
				<button
					type="button"
					onClick={handleDownloadSvg}
					className="text-xs rounded cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110"
				>
					SVG
				</button>
				<button
					type="button"
					onClick={handleDownloadPng}
					className="text-xs rounded cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110"
				>
					PNG
				</button>
			</div>
			<div className="mt-2 w-[75%]">
				{session ? (
					<button
						type="button"
						onClick={handleToggleLearned}
						disabled={isPending}
						className={`w-full cursor-pointer border py-1.5 px-3 text-xs rounded-md font-medium flex items-center justify-center gap-1.5 transition-colors duration-150 ease-in-out
            ${
							isLearned
								? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-700 dark:text-green-100 dark:hover:bg-green-600"
								: "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
						}
            ${isPending ? "cursor-not-allowed opacity-70" : ""}`}
					>
            <span>{isPending ? "Обновление" : isLearned ? "Выучено" : "Выучить"}</span>
						{isPending ? (
							<Loader2 size={14} className="animate-spin" />
						) : isLearned ? (
							<CheckCircle size={14} />
						) : (
							<GraduationCap size={14}/>
						)}
					</button>
				) : (
					<button
						className="w-full cursor-pointer border py-1.5 px-3 text-xs rounded-md font-medium flex items-center justify-center gap-1.5 transition-colors duration-150 ease-in-out"
						type="button"
						onClick={() =>
							toast.warning("Ошибка", {
								description: "Сначала войдите в свой аккаунт.",
								action: {
									label: "Войти",
									onClick: () => redirect("/sign-in"),
								},
							})
						}
					>
						Выучить
					</button>
				)}
			</div>
		</div>
	);
};

export default ChordElement;
