"use client";

import React, { useMemo, useEffect, useRef, useCallback } from "react";
import * as Tone from "tone";
import Controls from "./controls";
import FretboardDisplay from "./fretboard-display";
import PlaybackControls from "./playback-controls";
import { getNoteValue, getNoteValuesInShape, mapIdsToNoteObjects } from "@/lib/fretboard-utils";
import { NoteValue, NoteObject } from "@/lib/fretboard-utils";
import { useFretboardStore } from "@/lib/fretboard-store";
import { usePathname, useRouter } from "next/navigation";

const InteractiveFretboard: React.FC = () => {
	const selectedKey = useFretboardStore((s) => s.selectedKey);
	const selectedShapeType = useFretboardStore((s) => s.selectedShapeType);
	const selectedShapeName = useFretboardStore((s) => s.selectedShapeName);
	const selectedTuning = useFretboardStore((s) => s.selectedTuning);
	const startFret = useFretboardStore((s) => s.startFret);
	const endFret = useFretboardStore((s) => s.endFret);
	const allTunings = useFretboardStore((s) => s.allTunings);
	const allShapes = useFretboardStore((s) => s.allShapes);

	const isToneReady = useFretboardStore((s) => s.isToneReady);
	const isSelectingNotes = useFretboardStore((s) => s.isSelectingNotes);
	const selectedNotesForPlayback = useFretboardStore((s) => s.selectedNotesForPlayback);
	const bpm = useFretboardStore((s) => s.bpm);
	const isPlayingSequence = useFretboardStore((s) => s.isPlayingSequence);
	const currentPlaybackType = useFretboardStore((s) => s.currentPlaybackType);
	const toggleNoteSelection = useFretboardStore((s) => s.toggleNoteSelection);
	const setIsSelectingNotes = useFretboardStore((s) => s.setIsSelectingNotes);
	const setCurrentlySelectingNotes = useFretboardStore((s) => s.setCurrentlySelectingNotes);
	const setIsToneReady = useFretboardStore((s) => s.setIsToneReady);
	const setIsPlayingSequence = useFretboardStore((s) => s.setIsPlayingSequence);
	const setCurrentPlaybackType = useFretboardStore((s) => s.setCurrentPlaybackType);
	const setCurrentlyPlayingNoteId = useFretboardStore((s) => s.setCurrentlyPlayingNoteId);

	const router = useRouter();
	const pathname = usePathname();

	const isUpdatingUrlRef = useRef(false);
	useEffect(() => {
		if (!allShapes || !allTunings || isUpdatingUrlRef.current) return;
		if (!selectedKey || !selectedShapeType || !selectedTuning) return;
		if (allShapes[selectedShapeType] && Object.keys(allShapes[selectedShapeType]).length > 0 && !selectedShapeName)
			return;

		isUpdatingUrlRef.current = true;
		const newParams = new URLSearchParams();
		newParams.set("key", selectedKey);

		if (allShapes[selectedShapeType]) {
			newParams.set("type", selectedShapeType);
			if (allShapes[selectedShapeType][selectedShapeName]) {
				newParams.set("name", selectedShapeName);
			} else if (Object.keys(allShapes[selectedShapeType]).length > 0) {
				newParams.set("name", Object.keys(allShapes[selectedShapeType])[0]);
			}
		} else if (Object.keys(allShapes).length > 0) {
			newParams.set("type", Object.keys(allShapes)[0]);
		}

		if (allTunings[selectedTuning]) {
			newParams.set("tuning", selectedTuning);
		} else if (Object.keys(allTunings).length > 0) {
			newParams.set("tuning", Object.keys(allTunings)[0]);
		}

		newParams.set("startFret", startFret.toString());
		newParams.set("endFret", endFret.toString());

		const currentUrlSearchParams = new URLSearchParams(window.location.search);
		if (currentUrlSearchParams.toString() !== newParams.toString()) {
			router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
		}
		isUpdatingUrlRef.current = false;
	}, [
		selectedKey,
		selectedShapeType,
		selectedShapeName,
		selectedTuning,
		startFret,
		endFret,
		router,
		pathname,
		allShapes,
		allTunings,
	]);

	const synthRef = useRef<Tone.PolySynth | null>(null);
	const sequenceRef = useRef<Tone.Sequence<NoteObject> | null>(null);
	//tonejs
	useEffect(() => {
		Tone.start();
		if (Tone && !synthRef.current) {
			const initTone = async () => {
				try {
					synthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
					Tone.getTransport().bpm.value = 30;
					setIsToneReady(true);
				} catch (error) {
					console.error("Ошибка инициализации Tone.js synth:", error);
					setIsToneReady(false);
				}
			};
			initTone();
		}

		return () => {
			if (sequenceRef.current) {
				sequenceRef.current.dispose();
				sequenceRef.current = null;
			}
			if (synthRef.current) {
				synthRef.current.dispose();
				synthRef.current = null;
				setIsToneReady(false);
			}
			setIsPlayingSequence(false);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const rootNoteValue: NoteValue = getNoteValue(selectedKey);

	const highlightedNoteValues: Set<NoteValue> = useMemo(() => {
		if (!allShapes || !selectedShapeType || !selectedShapeName) return new Set();
		return getNoteValuesInShape(rootNoteValue, selectedShapeType, selectedShapeName, allShapes);
	}, [rootNoteValue, selectedShapeType, selectedShapeName, allShapes]);

	const currentTuningMidi = useMemo(() => {
		return allTunings && selectedTuning && allTunings[selectedTuning] ? allTunings[selectedTuning] : [];
	}, [allTunings, selectedTuning]);

	const playSingleNote = useCallback(
		async (noteNameWithOctave: string) => {
			if (!synthRef.current || !isToneReady || !noteNameWithOctave || isSelectingNotes) {
				return;
			}
			if (Tone.getContext().state !== "running") {
				await Tone.start();
			}
			const now = Tone.now();
			synthRef.current.triggerAttackRelease(noteNameWithOctave, "8n", now);
		},
		[isToneReady, isSelectingNotes]
	);

	const handleNoteSelection = useCallback(
		(identifier: string) => {
			if (!isSelectingNotes || !identifier) return;
			toggleNoteSelection(identifier);
		},
		[isSelectingNotes, toggleNoteSelection]
	);

	const stopPlayback = useCallback(() => {
		if (Tone && Tone.getTransport() && Tone.getContext()?.state !== "closed") {
			Tone.getTransport().stop();
			Tone.getTransport().cancel(0);
			if (sequenceRef.current) {
				sequenceRef.current.stop(0);
				sequenceRef.current.dispose();
				sequenceRef.current = null;
			}
		}
		setIsPlayingSequence(false);
		setCurrentPlaybackType(null);
	}, [setIsPlayingSequence, setCurrentPlaybackType]);

	const toggleSelectionMode = useCallback(() => {
		if (isPlayingSequence) {
			stopPlayback();
		}
		const nextState = !isSelectingNotes;
		if (nextState) {
			setCurrentlySelectingNotes([...selectedNotesForPlayback]);
		} else {
			setCurrentlySelectingNotes([]);
		}
		setIsSelectingNotes(nextState);
	}, [
		isPlayingSequence,
		selectedNotesForPlayback,
		stopPlayback,
		isSelectingNotes,
		setIsSelectingNotes,
		setCurrentlySelectingNotes,
	]);

	const startPlayback = useCallback(
		async (sequenceEvents: NoteObject[], loop: boolean = true, type: string = "pingpong") => {
			if (
				!synthRef.current ||
				!isToneReady ||
				!Array.isArray(sequenceEvents) ||
				sequenceEvents.length === 0 ||
				!sequenceEvents.every(
					(event) => typeof event === "object" && event !== null && "note" in event && "id" in event
				)
			) {
				stopPlayback();
				return;
			}

			try {
				if (Tone.getContext().state !== "running") {
					await Tone.start();
				}
				if (isPlayingSequence || sequenceRef.current) {
					stopPlayback();
				}

				setIsPlayingSequence(true);
				setCurrentPlaybackType(type);

				sequenceRef.current = new Tone.Sequence<NoteObject>(
					(time: number, event: NoteObject) => {
						if (synthRef.current && event) {
							const { id, note } = event;
							const nonNegativeTime = Math.max(0, time);

							Tone.getDraw().schedule(() => {
								setCurrentlyPlayingNoteId(id);
							}, time);

							const highlightDuration = Tone.Time("16n").toSeconds();
							Tone.getDraw().schedule(() => {
								setCurrentlyPlayingNoteId(null);
							}, time + highlightDuration);

							try {
								synthRef.current.triggerAttackRelease(note, "8n", nonNegativeTime);
							} catch (synthError) {
								console.error(`Ошибка при воспроизведении ноты ${note} в последовательности:`, synthError);
							}
						}
					},
					sequenceEvents,
					"4n" // четвертная нота)
				);

				sequenceRef.current.loop = loop;
				sequenceRef.current.start(0); // времени старта транспорта (0)

				Tone.getTransport().start();
				//console.log(`Воспроизведение начато. BPM: ${Tone.getTransport().bpm.value}`);
			} catch (error) {
				console.error("Ошибка при настройке startPlayback:", error);
				stopPlayback();
			}
		},
		[
			stopPlayback,
			isToneReady,
			isPlayingSequence,
			setIsPlayingSequence,
			setCurrentPlaybackType,
			setCurrentlyPlayingNoteId,
		]
	);

	const playPingPongSequence = useCallback(() => {
		const forwardEvents = mapIdsToNoteObjects(selectedNotesForPlayback, currentTuningMidi);
		if (forwardEvents.length === 0) {
			return;
		}

		let sequenceEvents: NoteObject[];
		if (forwardEvents.length <= 1) {
			sequenceEvents = forwardEvents;
		} else {
			const reversedEvents = [...forwardEvents].reverse().slice(1, -1);
			sequenceEvents = [...forwardEvents, ...reversedEvents];
		}
		startPlayback(sequenceEvents, true, "pingpong");
	}, [selectedNotesForPlayback, startPlayback, currentTuningMidi]);

	const playSelectedNotes = useCallback(() => {
		const events = mapIdsToNoteObjects(selectedNotesForPlayback, currentTuningMidi);
		if (events.length === 0) {
			return;
		}
		const forwardEvents = [...events];
		startPlayback(forwardEvents, true, "forward");

		if (Tone && Tone.getTransport() && sequenceRef.current && !sequenceRef.current.loop) {
			const subdivisionDuration = Tone.Time(sequenceRef.current.subdivision).toSeconds();
			const totalDurationInSeconds = sequenceRef.current.length * subdivisionDuration;

			if (totalDurationInSeconds > 0) {
				try {
					Tone.getTransport().scheduleOnce(() => {
						if (currentPlaybackType === "forward" && !sequenceRef.current?.loop) {
							stopPlayback();
						}
					}, `+${totalDurationInSeconds}`);
				} catch (e) {
					console.error("Ошибка планирования остановки последовательности:", e);
					console.warn("Не удалось запланировать остановку. Возможно, потребуется остановить вручную.");
				}
			}
		}
	}, [selectedNotesForPlayback, startPlayback, stopPlayback, currentPlaybackType, currentTuningMidi]);

	const noteClickHandler = isSelectingNotes ? handleNoteSelection : playSingleNote;

	useEffect(() => {
		if (Tone && Tone.getTransport()) {
			Tone.getTransport().bpm.value = bpm;
		}
	}, [bpm]);

	return (
		<section className="flex flex-col gap-4 justify-center items-center">
			<h1 className="text-4xl font-bold mb-4 tracking-tight lg:text-5xl bg-clip-text text-center text-transparent bg-gradient-to-r from-foreground to-primary">
				Интерактивный гриф
			</h1>
			<Controls />
			<PlaybackControls
				playPingPongSequence={playPingPongSequence}
				playSelectedNotes={playSelectedNotes}
				stopPlayback={stopPlayback}
				toggleSelectionMode={toggleSelectionMode}
			/>
			<FretboardDisplay
				highlightedNotes={highlightedNoteValues}
				rootNoteValue={rootNoteValue}
				onNoteClick={noteClickHandler}
			/>
		</section>
	);
};

export default React.memo(InteractiveFretboard);