"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
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
import { NoteValue, NoteObject } from "@/lib/types";
const InteractiveFretboard: React.FC = () => {
	//state for shapes
	const [selectedKey, setSelectedKey] = useState<string>("C");
	const [selectedShapeType, setSelectedShapeType] = useState<string>("Гаммы");
	const [selectedShapeName, setSelectedShapeName] = useState<string>("Мажор");

	//state for guitar settings
	//"Стандартный (E-A-D-G-B-E)"
	const [selectedTuning, setSelectedTuning] = useState(Object.keys(GUITAR_TUNINGS_MIDI)[0]);

	//state for tonejs
	const [isToneReady, setIsToneReady] = useState<boolean>(false);

	//states for notes
	const [isSelectingNotes, setIsSelectingNotes] = useState<boolean>(false);
	const [currentlySelectingNotes, setCurrentlySelectingNotes] = useState<string[]>([]);
	const [selectedNotesForPlayback, setSelectedNotesForPlayback] = useState<string[]>([]);

	//states for playback
	const [bpm, setBpm] = useState<number>(120);
	const [isPlayingSequence, setIsPlayingSequence] = useState<boolean>(false);
	const [currentPlaybackType, setCurrentPlaybackType] = useState<string | null>(null);
	const [currentlyPlayingNoteId, setCurrentlyPlayingNoteId] = useState<string | null>(null);

	//refs for tone
	const synthRef = useRef<Tone.PolySynth | null>(null);
	const sequenceRef = useRef<Tone.Sequence<NoteObject> | null>(null);

	useEffect(() => {
		Tone.start();
		if (Tone && !synthRef.current) {
			const initTone = async () => {
				try {
					synthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
					Tone.getTransport().bpm.value = 30;
					setIsToneReady(true);
					//console.log("Tone.js инициализирован.");
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
			// Tone.Transport.cancel() и stop()
			setIsToneReady(false);
			setIsPlayingSequence(false);
			setCurrentlyPlayingNoteId(null);
			//console.log("Tone.js очищен.");
		};
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
			setSelectedShapeName(firstShapeName); // Автоматически выбрать первую доступную форму
			return getNoteValuesInShape(rootNoteValue, selectedShapeType, firstShapeName);
		}
		console.warn(`Для типа "${selectedShapeType}" не найдено доступных форм/гамм.`);
		return new Set();
	}, [selectedKey, selectedShapeType, selectedShapeName, setSelectedShapeName]);

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
			setCurrentlySelectingNotes((prev) => {
				const existingIndex = prev.indexOf(identifier);
				if (existingIndex > -1) {
					// удалить, если уже существует
					return [...prev.slice(0, existingIndex), ...prev.slice(existingIndex + 1)];
				} else {
					// добавить, если не существует
					return [...prev, identifier];
				}
			});
		},
		[isSelectingNotes]
	);

	const stopPlayback = useCallback(() => {
		console.log("Остановка воспроизведения...");
		if (Tone && Tone.getTransport() && Tone.getContext()?.state !== "closed") {
			Tone.getTransport().stop();
			Tone.getTransport().cancel(0); // Отменить все запланированные события
			if (sequenceRef.current) {
				sequenceRef.current.stop(0); // Остановить последовательность немедленно
				sequenceRef.current.dispose();
				sequenceRef.current = null;
			}
		} else {
			console.warn("Tone.js недоступен для остановки воспроизведения.");
		}

		setIsPlayingSequence(false);
		setCurrentPlaybackType(null);
		setCurrentlyPlayingNoteId(null); // Сброс подсвеченной ноты
		console.log("Воспроизведение остановлено.");
	}, []);

	const toggleSelectionMode = useCallback(() => {
		if (isPlayingSequence) {
			stopPlayback();
		}
		setIsSelectingNotes((prev) => {
			const nextState = !prev;
			if (nextState) {
				// При входе в режим выбора, инициализировать текущий выбор подтвержденными нотами
				setCurrentlySelectingNotes([...selectedNotesForPlayback]);
				console.log("Включен режим выбора нот.");
			} else {
				// При выходе из режима выбора без подтверждения, очистить временный выбор
				setCurrentlySelectingNotes([]);
				console.log("Выход из режима выбора нот (отменено).");
			}
			return nextState;
		});
	}, [isPlayingSequence, selectedNotesForPlayback, stopPlayback]);

	const confirmSelection = useCallback(() => {
		// Установить подтвержденный выбор для воспроизведения
		setSelectedNotesForPlayback([...currentlySelectingNotes]);
		setIsSelectingNotes(false); // Выйти из режима выбора
		console.log(`Выбор подтвержден: ${currentlySelectingNotes.length} нот.`);
	}, [currentlySelectingNotes]);

	const resetSelection = useCallback(() => {
		console.log("Сброс выбранных нот...");
		setCurrentlySelectingNotes([]);
		setSelectedNotesForPlayback([]);
		if (isPlayingSequence) {
			stopPlayback();
		}
		setCurrentlyPlayingNoteId(null);
		console.log("Выбор нот сброшен.");
	}, [isPlayingSequence, stopPlayback]);

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
				stopPlayback(); // Очистить состояние, если запуск не удался
				return;
			}

			try {
				if (Tone.getContext().state !== "running") {
					await Tone.start();
					console.log("Аудиоконтекст Tone.js запущен из startPlayback.");
				}

				// Всегда останавливать предыдущее воспроизведение перед началом нового
				if (isPlayingSequence || sequenceRef.current) {
					console.log("Остановка предыдущего воспроизведения перед запуском нового.");
					stopPlayback(); // Используем существующую функцию stopPlayback
				}

				setIsPlayingSequence(true);
				setCurrentPlaybackType(type);
				setCurrentlyPlayingNoteId(null);

				// Tone.getTransport().cancel() уже вызывается в stopPlayback

				console.log(
					`Создание новой последовательности: ${type}, Цикл: ${loop}, Количество событий: ${sequenceEvents.length}`
				);
				sequenceRef.current = new Tone.Sequence<NoteObject>(
					(time: number, event: NoteObject) => {
						if (synthRef.current && event) {
							const { id, note } = event;
							const nonNegativeTime = Math.max(0, time);

							Tone.getTransport().schedule(() => {
								setCurrentlyPlayingNoteId(id);
							}, time);

							const highlightDuration = Tone.Time("16n").toSeconds();
							Tone.getTransport().schedule(() => {
								setCurrentlyPlayingNoteId((prevId) => (prevId === id ? null : prevId));
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
					"4n" // Интервал между событиями (четвертная нота)
				);

				sequenceRef.current.loop = loop;
				sequenceRef.current.start(0); // Начать последовательность относительно времени старта транспорта (0)

				Tone.getTransport().start();
				console.log(`Воспроизведение начато. BPM: ${Tone.getTransport().bpm.value}`);
			} catch (error) {
				console.error("Ошибка при настройке startPlayback:", error);
				stopPlayback();
			}
		},
		[stopPlayback, isToneReady, isPlayingSequence] // Добавил isPlayingSequence в зависимости
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
			// Исключаем первую и последнюю ноту из перевернутой части, чтобы избежать дублирования на стыках
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

		// Запланировать остановку транспорта после завершения последовательности
		if (Tone && Tone.getTransport() && sequenceRef.current && !sequenceRef.current.loop) {
			// Расчет длительности последовательности
			// sequenceRef.current.subdivision содержит интервал, например "4n"
			// sequenceRef.current.length содержит количество событий
			const subdivisionDuration = Tone.Time(sequenceRef.current.subdivision).toSeconds();
			const totalDurationInSeconds = sequenceRef.current.length * subdivisionDuration;

			if (totalDurationInSeconds > 0) {
				console.log(
					`Планирование остановки для обратной последовательности через: ${totalDurationInSeconds.toFixed(2)}с`
				);
				try {
					Tone.getTransport().scheduleOnce(() => {
						// Проверяем, действительно ли это та самая последовательность, которую нужно остановить
						if (currentPlaybackType === "forward" && !sequenceRef.current?.loop) {
							stopPlayback();
							console.log("Обратная последовательность завершена, воспроизведение остановлено по расписанию.");
						}
					}, `+${totalDurationInSeconds}`); // Запланировать относительно текущего времени транспорта + длительность
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
	const notesToVisuallySelect = isSelectingNotes ? currentlySelectingNotes : selectedNotesForPlayback;

	useEffect(() => {
		if (Tone && Tone.getTransport()) {
			Tone.getTransport().bpm.value = bpm;
		}
	}, [bpm]);

	return (
		<section className="flex flex-col gap-4 justify-center items-center">
			<h1 className="text-4xl font-bold tracking-tight lg:text-5xl bg-clip-text text-center text-transparent bg-gradient-to-r from-foreground to-primary">
				Интерактивный гриф
			</h1>
			<Controls
				selectedKey={selectedKey}
				setSelectedKey={setSelectedKey}
				selectedShapeType={selectedShapeType}
				setSelectedShapeType={setSelectedShapeType}
				selectedShapeName={selectedShapeName}
				setSelectedShapeName={setSelectedShapeName}
				selectedTuning={selectedTuning}
				setSelectedTuning={setSelectedTuning}
				availableKeys={NOTE_NAMES}
				availableShapeTypes={Object.keys(SHAPES)}
				availableShapeNames={Object.keys(SHAPES[selectedShapeType] || {})}
			/>
			<PlaybackControls
				isSelectingNotes={isSelectingNotes}
				currentlySelectingNotes={currentlySelectingNotes}
				selectedNotesForPlayback={selectedNotesForPlayback}
				isPlayingSequence={isPlayingSequence}
				currentPlaybackType={currentPlaybackType}
				bpm={bpm}
				setBpm={setBpm}
				toggleSelectionMode={toggleSelectionMode}
				confirmSelection={confirmSelection}
				resetSelection={resetSelection}
				playPingPongSequence={playPingPongSequence}
				playSelectedNotes={playSelectedNotes}
				stopPlayback={stopPlayback}
				isToneReady={isToneReady}
				selectedTuning={selectedTuning}
			/>
			<FretboardDisplay
				highlightedNotes={highlightedNoteValues}
				rootNoteValue={rootNoteValue}
				onNoteClick={noteClickHandler}
				selectedNotesForPlayback={notesToVisuallySelect} // Ноты, которые выбраны пользователем
				currentlyPlayingNoteId={currentlyPlayingNoteId} // ID текущей воспроизводимой ноты для подсветки
				isSelectingMode={isSelectingNotes}
				isToneReady={isToneReady}
				selectedTuning={selectedTuning}
			/>
		</section>
	);
};

export default InteractiveFretboard;
