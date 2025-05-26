// components/interactive-fretboard/playback-controls.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GUITAR_TUNINGS_MIDI, mapIdsToNoteObjects } from "@/lib/fretboard-utils"; // Assuming this is now in lib/musicUtils.ts
import { Chord } from "tonal";
import { Pause, Play } from "lucide-react";

interface PlaybackControlsProps {
	isSelectingNotes: boolean;
	currentlySelectingNotes: string[];
	selectedNotesForPlayback: string[];
	isPlayingSequence: boolean;
	currentPlaybackType: string | null;
	bpm: number;
	setBpm: (bpm: number) => void;
	toggleSelectionMode: () => void;
	confirmSelection: () => void;
	resetSelection: () => void;
	playPingPongSequence: () => void;
	playSelectedNotes: () => void;
	stopPlayback: () => void;
	isToneReady: boolean;
	selectedTuning: string;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
	isSelectingNotes,
	currentlySelectingNotes,
	selectedNotesForPlayback,
	isPlayingSequence,
	currentPlaybackType,
	bpm,
	setBpm,
	toggleSelectionMode,
	confirmSelection,
	resetSelection,
	playPingPongSequence,
	playSelectedNotes,
	stopPlayback,
	isToneReady,
	selectedTuning,
}) => {
	const midiTuning = GUITAR_TUNINGS_MIDI[selectedTuning];
	const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value, 10);
		if (!isNaN(value)) {
			setBpm(Math.min(Math.max(value, 0), 300));
		} else {
			if (e.target.value === "") {
				setBpm(30);
			}
		}
	};

	const selectedNoteNames = React.useMemo(
		() =>
			mapIdsToNoteObjects(selectedNotesForPlayback, midiTuning)
				.map((item) => item.note)
				.join(", "),
		[selectedNotesForPlayback, midiTuning]
	);

	const detectableNotes = mapIdsToNoteObjects(currentlySelectingNotes, midiTuning).map((item) =>
		item.note.replace(/[0-9]/g, "")
	);

	return (
		<div className="flex gap-8 p-4 border border-dashed border-border rounded-md bg-card">
			<div className="flex flex-col gap-5">
				<h4 className="text-lg font-semibold text-center">Выбор нот и воспроизведение 🎶</h4>
				<div className="flex flex-wrap items-center gap-3">
					{currentlySelectingNotes.length !== 0 && (
						<Button
							onClick={resetSelection}
							disabled={
								currentlySelectingNotes.length === 0 && selectedNotesForPlayback.length === 0 && !isPlayingSequence
							}
							className="cursor-pointer"
						>
							Сбросить
						</Button>
					)}
					<Button className="cursor-pointer grow-1" onClick={toggleSelectionMode} disabled={isPlayingSequence}>
						{isSelectingNotes ? "Отменить" : "Выбрать"}
					</Button>
					{isSelectingNotes && (
						<Button onClick={confirmSelection} className="bg-green-600 text-white hover:bg-green-600/90 cursor-pointer">
							Подтвердить выбор ({currentlySelectingNotes.length} нот)
						</Button>
					)}
				</div>
				{selectedNotesForPlayback.length > 0 && !isSelectingNotes && (
					<p className="text-sm text-muted-foreground">
						Выбранные ноты: <span className="text-foreground font-mono text-xs">{selectedNoteNames || "Нет"}</span>
					</p>
				)}
			</div>

			{!isSelectingNotes && selectedNotesForPlayback.length > 0 && (
				<div className="flex flex-col flex-wrap items-center gap-3">
					<div className="flex items-center gap-1.5">
						<Label htmlFor="bpm-input">BPM:</Label>
						<Input
							id="bpm-input"
							type="number"
							value={bpm}
							onChange={handleBpmChange}
							min={30}
							max={300}
							step={1}
							disabled={isPlayingSequence}
							className="w-20 text-center"
						/>
					</div>

					<Button
						className="cursor-pointer"
						onClick={isPlayingSequence ? stopPlayback : playPingPongSequence}
						disabled={!isToneReady || selectedNotesForPlayback.length === 0}
						variant={isPlayingSequence && currentPlaybackType === "pingpong" ? "outline" : "default"}
					>
						{isPlayingSequence && currentPlaybackType === "pingpong" ? "Остановить" : "Вперед-назад"}
						{isPlayingSequence && currentPlaybackType === "pingpong" ? <Pause></Pause> : <Play></Play>}
					</Button>

					<Button
						className="cursor-pointer"
						onClick={isPlayingSequence ? stopPlayback : playSelectedNotes}
						disabled={!isToneReady || selectedNotesForPlayback.length === 0}
						variant={isPlayingSequence && currentPlaybackType === "forward" ? "outline" : "default"}
					>
						{isPlayingSequence && currentPlaybackType === "forward" ? "Остановить" : "Играть"}
						{isPlayingSequence && currentPlaybackType === "forward" ? <Pause></Pause> : <Play></Play>}
					</Button>
				</div>
			)}
			{isSelectingNotes && (
				<div className="flex flex-col gap-2">
					<div className="">
						<div className="text-sm text-muted-foreground">
							Вероятные аккорды:{" "}
							<p className="font-mono font-black text-primary text-sm">
								{" "}
								{Chord.detect(detectableNotes).join(", ") || "пока неизвестно"}
							</p>
						</div>
					</div>
					<div className="">
						<div className="text-sm text-muted-foreground">
							Выбранные ноты:{" "}
							<p className="text-primary font-bold font-mono text-sm">
								{" "}
								{detectableNotes.join(", ") || "выберите ноты"}
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default PlaybackControls;
