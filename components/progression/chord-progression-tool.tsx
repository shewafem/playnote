// components/ui/chord-progression/chord-progression-tool.tsx
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb} from "lucide-react";
import { InteractiveChordBuilder } from "./interactive-chord-builder";
import { CustomProgressionToolbar } from "./custom-progression-toolbar";
import { ExportControls } from "./export-controls";
import { toPng } from "html-to-image";
import { downloadImage } from "@/data/image";
import { ChordCard } from "./chord-card";

// Define possible sources for the current progression
type ProgressionSource = "popular" | "random" | "custom";
const MAX_CUSTOM_PROGRESSION_LENGTH = 12; // Max length for custom progressions

export function ChordProgressionTool() {
	const [rootNote, setRootNote] = useState<string>(NOTES[0]);
	const [diatonicChords, setDiatonicChords] = useState<ScaleChord[]>([]);

	// State for the displayed progression numerals
	const [activeProgressionNumerals, setActiveProgressionNumerals] = useState<RomanNumeral[]>([]);
	// State for custom built progression
	const [customProgressionNumerals, setCustomProgressionNumerals] = useState<RomanNumeral[]>([]);

	const [activeProgressionSource, setActiveProgressionSource] = useState<ProgressionSource>("popular");
	const [currentPopularProgressionName, setCurrentPopularProgressionName] = useState<string | undefined>(undefined);

	const [isGeneratingRandom, setIsGeneratingRandom] = useState<boolean>(false);
	const [isLoadingPng, setIsLoadingPng] = useState<boolean>(false);

	const progressionDisplayRef = useRef<HTMLDivElement>(null); // Ref for PNG export

	// Update diatonic chords when root note changes
	useEffect(() => {
		try {
			setDiatonicChords(getDiatonicChords(rootNote));
		} catch (error) {
			console.error("Failed to get diatonic chords:", error);
			setDiatonicChords([]);
		}
	}, [rootNote]);

	// Memoize the final chords to display based on the active source and numerals
	const progressionChordsToDisplay = useMemo<(ScaleChord | undefined)[]>(() => {
		const sourceNumerals = activeProgressionSource === "custom" ? customProgressionNumerals : activeProgressionNumerals;

		if (!sourceNumerals.length || !diatonicChords.length) return [];
		return sourceNumerals.map((numeral) => diatonicChords.find((chord) => chord.numeral === numeral));
	}, [activeProgressionNumerals, customProgressionNumerals, diatonicChords, activeProgressionSource]);

	const handleRootNoteChange = useCallback((newRoot: string) => {
		setRootNote(newRoot);
		// Optionally, could clear custom progression if key changes, or try to transpose (more complex)
		// setCustomProgressionNumerals([]);
		// setActiveProgressionSource('popular'); // Revert to popular if key changes? Or let user decide.
	}, []);

	const handlePopularProgressionSelect = useCallback((progression: RomanNumeral[], name: string) => {
		setActiveProgressionNumerals(progression);
		setCurrentPopularProgressionName(name);
		setActiveProgressionSource("popular");
	}, []);

	const handleGenerateRandom = useCallback(() => {
		setIsGeneratingRandom(true);
		setCurrentPopularProgressionName(undefined);
		// Simulate a brief delay for a better UX
		setTimeout(() => {
			const randomNumerals = getRandomProgression(8); // Generate up to 8 chords
			setActiveProgressionNumerals(randomNumerals);
			setActiveProgressionSource("random");
			setIsGeneratingRandom(false);
		}, 300);
	}, []);

	// Handlers for Interactive Chord Builder
	const handleChordAddToCustom = useCallback(
		(chord: ScaleChord) => {
			if (customProgressionNumerals.length < MAX_CUSTOM_PROGRESSION_LENGTH) {
				setCustomProgressionNumerals((prev) => [...prev, chord.numeral]);
				setActiveProgressionSource("custom");
				setCurrentPopularProgressionName(undefined); // Clear popular selection if customizing
			}
		},
		[customProgressionNumerals]
	);

	const handleClearCustomProgression = useCallback(() => {
		setCustomProgressionNumerals([]);
		// Optionally, revert to a default popular progression or leave it blank
		// For now, it will show "Select or generate..." if custom is cleared and no other source picked
		if (POPULAR_PROGRESSIONS.length > 0) {
			handlePopularProgressionSelect(POPULAR_PROGRESSIONS[0].progression, POPULAR_PROGRESSIONS[0].name);
		} else {
			setActiveProgressionNumerals([]); // Clear if no popular default
		}
	}, [handlePopularProgressionSelect]);

	const handleRemoveLastCustomChord = useCallback(() => {
		setCustomProgressionNumerals((prev) => prev.slice(0, -1));
		if (customProgressionNumerals.length <= 1 && POPULAR_PROGRESSIONS.length > 0) {
			// If removing the last chord
			// handlePopularProgressionSelect(POPULAR_PROGRESSIONS[0].progression, POPULAR_PROGRESSIONS[0].name);
		} else if (customProgressionNumerals.length <= 1) {
			// setActiveProgressionNumerals([]);
		}
		// Active source remains 'custom' unless all chords are removed, then it's up to UX decision.
	}, [customProgressionNumerals.length]);

	// Load a default progression on initial mount
	useEffect(() => {
		if (POPULAR_PROGRESSIONS.length > 0) {
			handlePopularProgressionSelect(POPULAR_PROGRESSIONS[0].progression, POPULAR_PROGRESSIONS[0].name);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Run only once

	// Export Handlers
	const handleSaveAsPng = useCallback(async () => {
		if (!progressionDisplayRef.current) {
			console.error("Progression display element not found for PNG export.");
			return;
		}
		setIsLoadingPng(true);
		try {
			const dataUrl = await toPng(progressionDisplayRef.current, {
				quality: 0.95,
				backgroundColor: "white", // Ensure background for consistent output
				// You can adjust width/height or pixelRatio if needed
			});
			downloadImage(dataUrl, `chord-progression-${rootNote}-${activeProgressionSource}.png`);
		} catch (error) {
			console.error("Failed to generate PNG:", error);
			// TODO: Show user feedback (e.g., a toast notification)
		} finally {
			setIsLoadingPng(false);
		}
	}, [rootNote, activeProgressionSource]);

	const handlePrint = useCallback(() => {
		window.print();
	}, []);

	// Determine current progression title
	let progressionTitle = "Current Progression";
	if (activeProgressionSource === "popular" && currentPopularProgressionName) {
		progressionTitle = `${currentPopularProgressionName} Progression`;
	} else if (activeProgressionSource === "random") {
		progressionTitle = "Randomly Generated Progression";
	} else if (activeProgressionSource === "custom" && customProgressionNumerals.length > 0) {
		progressionTitle = "Your Custom Progression";
	}

	return (
		<div className="container mx-auto p-4 md:p-8 space-y-8 print:space-y-4">
			<header className="text-center print:hidden">
				<h1 className="text-4xl font-bold tracking-tight lg:text-5xl text-primary">Прогрессии аккордов</h1>
				<p className="mt-3 text-lg text-muted-foreground">Изучайте, создавайте и экспортируйте прогрессии!</p>
			</header>

			<div className="print:hidden">
				{" "}
				{/* Hide controls when printing */}
				<ControlPanel
					currentRootNote={rootNote}
					onRootNoteChange={handleRootNoteChange}
					onPopularProgressionSelect={(prog, name) => handlePopularProgressionSelect(prog, name as string)} // Casting name as string because POPULAR_PROGRESSIONS guarantees it
					onGenerateRandom={handleGenerateRandom}
					isGenerating={isGeneratingRandom}
					currentPopularProgressionName={currentPopularProgressionName}
				/>
			</div>

			<Separator className="print:hidden" />

			{/* Section for the current progression to be displayed and exported */}
			<div
				id="progression-to-export"
				className="bg-background p-0 md:p-6 rounded-lg print:p-0 print:shadow-none print:border-none"
			>
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
					<div>
						<h2 className="text-2xl font-semibold">{progressionTitle}</h2>
						<p className="text-sm text-muted-foreground">
							Тоника  {rootNote} Major.
							{activeProgressionSource === "custom" &&
								customProgressionNumerals.length === 0 &&
								" Start building by clicking chords below!"}
						</p>
					</div>
					<div className="mt-3 sm:mt-0 print:hidden">
						<ExportControls onSaveAsPng={handleSaveAsPng} onPrint={handlePrint} isLoadingPng={isLoadingPng} />
					</div>
				</div>

				{/* Toolbar for custom progression actions - only shows if source is custom and has chords */}
				{activeProgressionSource === "custom" && (
					<div className="print:hidden">
						<CustomProgressionToolbar
							onClearProgression={handleClearCustomProgression}
							onRemoveLastChord={handleRemoveLastCustomChord}
							hasCustomChords={customProgressionNumerals.length > 0}
						/>
					</div>
				)}

				{/* The actual progression display area */}
				<div ref={progressionDisplayRef} className="bg-background print:bg-transparent">
					{" "}
					{/* Ensure this div has a background for PNG if cards are transparent */}
					<ProgressionDisplay progressionChords={progressionChordsToDisplay} />
				</div>
			</div>

			<Separator className="print:hidden" />

			{/* Interactive Chord Builder Section */}
			<div className="print:hidden">
				<InteractiveChordBuilder
					diatonicChords={diatonicChords}
					onChordSelect={handleChordAddToCustom}
					currentKey={rootNote}
					currentCustomProgressionLength={customProgressionNumerals.length}
					maxCustomProgressionLength={MAX_CUSTOM_PROGRESSION_LENGTH}
				/>
			</div>

			<Separator className="print:hidden" />

			{/* Diatonic Chords Display Section (Optional to hide on print too if desired) */}
			<div className="print:hidden">
				<h2 className="text-2xl font-semibold mb-4">Диатонические аккорды в {rootNote} Major</h2>
				<p className="text-sm text-muted-foreground mb-4">
					Это основные аккорды доступные в {rootNote} Major.
				</p>
				{/* Reusing ProgressionDisplay for diatonic chords, but these are not InteractiveChordCards */}
				<div className="flex flex-wrap gap-4 py-6 justify-center md:justify-start">
					{diatonicChords.map((chord) => (
						<ChordCard key={`diatonic-${chord.numeral}-${chord.rootNote}`} chord={chord} />
					))}
				</div>
			</div>

			<Alert className="mt-8 print:hidden">
				<Lightbulb className="h-4 w-4" />
				<AlertTitle>Обучающая подсказка</AlertTitle>
				<AlertDescription>
        Используйте интерактивный конструктор, чтобы экспериментировать с вашими собственными последовательностями. Попробуйте определить эти прогрессии в ваших любимых песнях!
        <strong>Прогрессия: I - V - vi - IV</strong> является одной из самых распространенных в поп-музыке.
				</AlertDescription>
			</Alert>
		</div>
	);
}