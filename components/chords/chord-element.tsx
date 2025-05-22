"use client"

import { guitar } from "@/data/constants";
import { downloadPng, downloadSvg } from "@/data/image";
import { playChord } from "@/data/player";
import { Position } from "@/data/types";
import Chord from "@techies23/react-chords";
import { Download } from "lucide-react";
import { useRef } from "react";
import { Note } from "tonal";

interface ChordElementProps {
	position: Position;
	chordKey: string;
	suffix: string;
	posIndex: number;
}

const ChordElement: React.FC<ChordElementProps> = ({ position, chordKey, suffix, posIndex }) => {
	const chordRef = useRef<HTMLDivElement>(null);
	const fileName = `${chordKey}${suffix.replace(/[^a-zA-Z0-9]/g, "")}_pos${posIndex + 1}`;
  const notes = position["midi"].map((midi) => Note.fromMidi(midi)).join(" ")
  const formattedNotes = notes.replace(/\d/g, "")

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
				<button type="button" onClick={handleDownloadSvg} className="text-xs rounded cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110">
					SVG
				</button>
				<button type="button" onClick={handleDownloadPng} className="text-xs rounded cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110">
					PNG
				</button>
			</div>
		</div>
	);
};

export default ChordElement;
