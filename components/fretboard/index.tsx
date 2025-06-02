"use client";

import React, { useMemo, useEffect, useRef, useCallback } from "react";
import * as Tone from "tone";
import Controls from "./controls";
import FretboardDisplay from "./fretboard-display";
import PlaybackControls from "./playback-controls";
import {
	GUITAR_TUNINGS_MIDI,
	NOTE_NAMES,
	SHAPES,
	getNoteValue,
	getNoteValuesInShape,
	mapIdsToNoteObjects,
} from "@/lib/fretboard-utils";
import { NoteValue, NoteObject } from "@/lib/fretboard-utils";
import { useFretboardStore } from "@/lib/fretboard-store";

const InteractiveFretboard: React.FC = () => {
	const selectedKey = useFretboardStore((s) => s.selectedKey);
	const selectedShapeType = useFretboardStore((s) => s.selectedShapeType);
	const selectedShapeName = useFretboardStore((s) => s.selectedShapeName);
	const selectedTuning = useFretboardStore((s) => s.selectedTuning);
	const setSelectedTuning = useFretboardStore((s) => s.setSelectedTuning);
	const setSelectedShapeName = useFretboardStore((s) => s.setSelectedShapeName);
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
	const fretCount = useFretboardStore((s) => s.fretCount);
	//обычный тюнинг
	useEffect(() => {
		if (!selectedTuning) {
			setSelectedTuning(Object.keys(GUITAR_TUNINGS_MIDI)[0]);
		}
	}, [selectedTuning, setSelectedTuning]);

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

	const highlightedNoteValues: Set<NoteValue> = useMemo(() => {
		const rootNoteValue = getNoteValue(selectedKey);
		if (rootNoteValue === undefined) {
			console.warn(`Неверно указана тоника: ${selectedKey}`);
			return new Set();
		}
		if (SHAPES[selectedShapeType] && SHAPES[selectedShapeType][selectedShapeName]) {
			return getNoteValuesInShape(rootNoteValue, selectedShapeType, selectedShapeName);
		}
		const availableShapes = Object.keys(SHAPES[selectedShapeType] || {});
		if (availableShapes.length > 0) {
			const firstShapeName = availableShapes[0];
			console.warn(
				`Выбранная форма "${selectedShapeName}" не найдена для типа "${selectedShapeType}". Фоллбэк: "${firstShapeName}".`
			);
			return getNoteValuesInShape(rootNoteValue, selectedShapeType, firstShapeName);
		}
		console.warn(`Для типа "${selectedShapeType}" не найдено доступных форм/гамм.`);
		return new Set();
	}, [selectedKey, selectedShapeType, selectedShapeName]);

	const rootNoteValue: NoteValue = getNoteValue(selectedKey);

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
		console.log("Остановка воспроизведения...");
		if (Tone && Tone.getTransport() && Tone.getContext()?.state !== "closed") {
			Tone.getTransport().stop();
			Tone.getTransport().cancel(0);
			if (sequenceRef.current) {
				sequenceRef.current.stop(0);
				sequenceRef.current.dispose();
				sequenceRef.current = null;
			}
		} else {
			console.warn("Tone.js недоступен для остановки воспроизведения.");
		}

		setIsPlayingSequence(false);
		setCurrentPlaybackType(null);
		console.log("Воспроизведение остановлено.");
	}, [setIsPlayingSequence, setCurrentPlaybackType]);

	const toggleSelectionMode = useCallback(() => {
		if (isPlayingSequence) {
			stopPlayback();
		}
		const nextState = !isSelectingNotes;
		if (nextState) {
			setCurrentlySelectingNotes([...selectedNotesForPlayback]);
			console.log("Включен режим выбора нот.");
		} else {
			setCurrentlySelectingNotes([]);
			console.log("Выход из режима выбора нот (отменено).");
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
				!Tone ||
				!Array.isArray(sequenceEvents) ||
				sequenceEvents.length === 0 ||
				!sequenceEvents.every(
					(event) => typeof event === "object" && event !== null && "note" in event && "id" in event
				)
			) {
				console.error("Не выполнены условия для начала воспроизведения или неверные данные последовательности.");
				stopPlayback();
				return;
			}

			try {
				if (Tone.getContext().state !== "running") {
					await Tone.start();
					console.log("Аудиоконтекст Tone.js запущен из startPlayback.");
				}
				if (isPlayingSequence || sequenceRef.current) {
					console.log("Остановка предыдущего воспроизведения перед запуском нового.");
					stopPlayback();
				}

				setIsPlayingSequence(true);
				setCurrentPlaybackType(type);

				console.log(
					`Создание новой последовательности: ${type}, Цикл: ${loop}, Количество событий: ${sequenceEvents.length}`
				);
				sequenceRef.current = new Tone.Sequence<NoteObject>(
					(time: number, event: NoteObject) => {
						if (synthRef.current && event) {
							const { id, note } = event;
							const nonNegativeTime = Math.max(0, time);

							Tone.Draw.schedule(() => {
								setCurrentlyPlayingNoteId(id);
							}, time);

							const highlightDuration = Tone.Time("16n").toSeconds();
							Tone.Draw.schedule(() => {
								setCurrentlyPlayingNoteId(null);
							}, time + highlightDuration);

							try {
								synthRef.current.triggerAttackRelease(note, "8n", nonNegativeTime);
							} catch (synthError) {
								console.error(`Ошибка при воспроизведении ноты ${note} в последовательности:`, synthError);
							}
						} else {
							console.warn("Синтезатор или событие не доступно в колбэке последовательности.");
						}
					},
					sequenceEvents,
					"4n" // четвертная нота)
				);

				sequenceRef.current.loop = loop;
				sequenceRef.current.start(0); // времени старта транспорта (0)

				Tone.getTransport().start();
				console.log(`Воспроизведение начато. BPM: ${Tone.getTransport().bpm.value}`);
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
		const forwardEvents = mapIdsToNoteObjects(selectedNotesForPlayback);
		if (forwardEvents.length === 0) {
			console.warn("Нет выбранных нот для пинг-понг воспроизведения.");
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
	}, [selectedNotesForPlayback, startPlayback]);

	const playSelectedNotes = useCallback(() => {
		const events = mapIdsToNoteObjects(selectedNotesForPlayback);
		if (events.length === 0) {
			console.warn("Нет выбранных нот для воспроизведения.");
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
					console.error("Ошибка планирования остановки обратной последовательности:", e);
					console.warn("Не удалось запланировать остановку. Возможно, потребуется остановить вручную.");
				}
			} else {
				console.warn("Не удалось определить длительность последовательности для планирования остановки.");
			}
		}
	}, [selectedNotesForPlayback, startPlayback, stopPlayback, currentPlaybackType]);

	const noteClickHandler = isSelectingNotes ? handleNoteSelection : playSingleNote;

	useEffect(() => {
		if (Tone && Tone.getTransport()) {
			Tone.getTransport().bpm.value = bpm;
		}
	}, [bpm]);

	useEffect(() => {
		const availableShapes = Object.keys(SHAPES[selectedShapeType] || {});
		if (availableShapes.length > 0 && !availableShapes.includes(selectedShapeName)) {
			setSelectedShapeName(availableShapes[0]);
		}
	}, [selectedShapeType, selectedShapeName, setSelectedShapeName]);

	return (
		<section className="flex flex-col gap-4 justify-center items-center">
			<h1 className="text-4xl font-bold tracking-tight lg:text-5xl bg-clip-text text-center text-transparent bg-gradient-to-r from-foreground to-primary">
				Интерактивный гриф
			</h1>
			<Controls
				availableKeys={NOTE_NAMES}
				availableShapeTypes={Object.keys(SHAPES)}
				availableShapeNames={Object.keys(SHAPES[selectedShapeType] || {})}
			/>
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
				fretCount={fretCount}
			/>
		</section>
	);
};

export default React.memo(InteractiveFretboard);
