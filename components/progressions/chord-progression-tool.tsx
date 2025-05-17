"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
	NOTES,
	getDiatonicChords,
	getRandomProgression,
	RomanNumeral,
	ScaleChord,
	POPULAR_PROGRESSIONS,
} from "@/lib/music-theory";
import { ControlPanel } from "./control-panel";
import { ProgressionDisplay } from "./progression-display";
import { Separator } from "@/components/ui/separator";
import { InteractiveChordBuilder } from "./interactive-chord-builder";
import { CustomProgressionToolbar } from "./custom-progression-toolbar";
import { ExportControls } from "./export-controls";
import { toPng } from "html-to-image";
import { downloadImage } from "@/data/image";

type ProgressionSource = "popular" | "random" | "custom";
const MAX_CUSTOM_PROGRESSION_LENGTH = 12;

export function ChordProgressionTool() {
	const [rootNote, setRootNote] = useState<string>(NOTES[0]);
	const [diatonicChords, setDiatonicChords] = useState<ScaleChord[]>([]);

	const [activeProgressionNumerals, setActiveProgressionNumerals] = useState<RomanNumeral[]>([]);
	const [customProgressionNumerals, setCustomProgressionNumerals] = useState<RomanNumeral[]>([]);

	const [activeProgressionSource, setActiveProgressionSource] = useState<ProgressionSource>("popular");
	const [currentPopularProgressionName, setCurrentPopularProgressionName] = useState<string | undefined>(undefined);

	const [isGeneratingRandom, setIsGeneratingRandom] = useState<boolean>(false);
	const [isLoadingPng, setIsLoadingPng] = useState<boolean>(false);

	const progressionDisplayRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		try {
			setDiatonicChords(getDiatonicChords(rootNote));
		} catch (error) {
			console.error("Ошибка получения диатонических аккордов:", error);
			setDiatonicChords([]);
		}
	}, [rootNote]);

	const progressionChordsToDisplay = useMemo<(ScaleChord | undefined)[]>(() => {
		const sourceNumerals = activeProgressionSource === "custom" ? customProgressionNumerals : activeProgressionNumerals;

		if (!sourceNumerals.length || !diatonicChords.length) return [];
		return sourceNumerals.map((numeral) => diatonicChords.find((chord) => chord.numeral === numeral));
	}, [activeProgressionNumerals, customProgressionNumerals, diatonicChords, activeProgressionSource]);

	const handleRootNoteChange = useCallback((newRoot: string) => {
		setRootNote(newRoot);
	}, []);

	const handlePopularProgressionSelect = useCallback((progression: RomanNumeral[], name: string) => {
		setActiveProgressionNumerals(progression);
		setCurrentPopularProgressionName(name);
		setActiveProgressionSource("popular");
	}, []);

	const handleGenerateRandom = useCallback(() => {
		setIsGeneratingRandom(true);
		setCurrentPopularProgressionName(undefined);
		setTimeout(() => {
			const randomNumerals = getRandomProgression(8);
			setActiveProgressionNumerals(randomNumerals);
			setActiveProgressionSource("random");
			setIsGeneratingRandom(false);
		}, 300);
	}, []);

	const handleChordAddToCustom = useCallback(
		(chord: ScaleChord) => {
			if (customProgressionNumerals.length < MAX_CUSTOM_PROGRESSION_LENGTH) {
				setCustomProgressionNumerals((prev) => [...prev, chord.numeral]);
				setActiveProgressionSource("custom");
				setCurrentPopularProgressionName(undefined);
			}
		},
		[customProgressionNumerals]
	);

	const handleClearCustomProgression = useCallback(() => {
		setCustomProgressionNumerals([]);
		if (POPULAR_PROGRESSIONS.length > 0) {
			handlePopularProgressionSelect(POPULAR_PROGRESSIONS[0].progression, POPULAR_PROGRESSIONS[0].name);
		} else {
			setActiveProgressionNumerals([]);
		}
	}, [handlePopularProgressionSelect]);

	const handleRemoveLastCustomChord = useCallback(() => {
		setCustomProgressionNumerals((prev) => prev.slice(0, -1));
		if (customProgressionNumerals.length <= 1 && POPULAR_PROGRESSIONS.length > 0) {
		} else if (customProgressionNumerals.length <= 1) {
			// setActiveProgressionNumerals([]);
		}
	}, [customProgressionNumerals.length]);

	useEffect(() => {
		if (POPULAR_PROGRESSIONS.length > 0) {
			handlePopularProgressionSelect(POPULAR_PROGRESSIONS[0].progression, POPULAR_PROGRESSIONS[0].name);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSaveAsPng = useCallback(async () => {
		if (!progressionDisplayRef.current) {
			console.error("Элемент прогрессии не найден для экспорта в PNG.");
			return;
		}
		setIsLoadingPng(true);
		try {
			const dataUrl = await toPng(progressionDisplayRef.current, {
				quality: 0.95,
				backgroundColor: "white",
			});
			downloadImage(dataUrl, `chord-progression-${rootNote}-${activeProgressionSource}.png`);
		} catch (error) {
			console.error("Ошибка генерации PNG:", error);
			// TODO: Добавить Toast-уведомление
		} finally {
			setIsLoadingPng(false);
		}
	}, [rootNote, activeProgressionSource]);

	return (
		<div className="container mx-auto flex flex-col gap-4">
			<header className="text-center print:hidden">
				<h1 className="text-4xl font-bold tracking-tight lg:text-5xl text-primary">Прогрессии аккордов</h1>
				<p className="mt-3 text-lg text-muted-foreground">Изучайте, создавайте и экспортируйте прогрессии!</p>
			</header>
			<div className="flex flex-col sm:flex-row gap-4 items-center">
				<ControlPanel
					currentRootNote={rootNote}
					onRootNoteChange={handleRootNoteChange}
					onPopularProgressionSelect={(prog, name) => handlePopularProgressionSelect(prog, name as string)}
					onGenerateRandom={handleGenerateRandom}
					isGenerating={isGeneratingRandom}
					currentPopularProgressionName={currentPopularProgressionName}
				/>
				<div
					id="progression-to-export"
					className="flex flex-col justify-center items-center bg-background w-full rounded-lg print:p-0 print:shadow-none print:border-none"
				>
					{activeProgressionSource === "custom" && (
						<div className="print:hidden">
							<CustomProgressionToolbar
								onClearProgression={handleClearCustomProgression}
								onRemoveLastChord={handleRemoveLastCustomChord}
								hasCustomChords={customProgressionNumerals.length > 0}
							/>
						</div>
					)}
					<div ref={progressionDisplayRef} className="bg-background print:bg-transparent">
						<ProgressionDisplay progressionChords={progressionChordsToDisplay} />
					</div>
					<ExportControls onSaveAsPng={handleSaveAsPng} isLoadingPng={isLoadingPng} />
				</div>
			</div>

			<Separator className="print:hidden" />

			<div className="print:hidden">
				<InteractiveChordBuilder
					diatonicChords={diatonicChords}
					onChordSelect={handleChordAddToCustom}
					currentKey={rootNote}
					currentCustomProgressionLength={customProgressionNumerals.length}
					maxCustomProgressionLength={MAX_CUSTOM_PROGRESSION_LENGTH}
				/>
			</div>
		</div>
	);
}
