// components/interactive-fretboard/playback-controls.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GUITAR_TUNINGS_MIDI, mapIdsToNoteObjects } from "@/lib/music-utils"; // Assuming this is now in lib/musicUtils.ts

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

	return (
		<div className="flex flex-col gap-4 p-4 border border-dashed border-border rounded-md bg-card">
			<h4 className="text-lg font-semibold text-center">Выбор нот и воспроизведение 🎶</h4>
			{!isSelectingNotes && selectedNotesForPlayback.length === 0 && (
				<p className="italic text-muted-foreground text-sm text-center">Сначала выберите ноты...</p>
			)}
			<div className="flex flex-wrap items-center gap-3">
				<Button
					onClick={resetSelection}
					disabled={currentlySelectingNotes.length === 0 && selectedNotesForPlayback.length === 0 && !isPlayingSequence}
					variant="destructive"
					className="cursor-pointer"
				>
					Сбросить
				</Button>
				<Button className="cursor-pointer grow-1" onClick={toggleSelectionMode} disabled={isPlayingSequence} variant="outline">
					{isSelectingNotes ? "Отменить" : "Выбрать"}
				</Button>
				{isSelectingNotes && (
					<Button onClick={confirmSelection} className="bg-green-600 text-white hover:bg-green-600/90 cursor-pointer">
						Подтвердить выбор ({currentlySelectingNotes.length} нот)
					</Button>
				)}
			</div>

			{!isSelectingNotes && selectedNotesForPlayback.length > 0 && (
				<div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border">
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
						onClick={isPlayingSequence ? stopPlayback : playPingPongSequence}
						disabled={!isToneReady || selectedNotesForPlayback.length === 0}
						variant={isPlayingSequence && currentPlaybackType === "pingpong" ? "secondary" : "default"}
					>
						{isPlayingSequence && currentPlaybackType === "pingpong" ? "Остановить" : "Зациклить"}
					</Button>

					<Button
						onClick={isPlayingSequence ? stopPlayback : playSelectedNotes}
						disabled={!isToneReady || selectedNotesForPlayback.length === 0}
						variant={isPlayingSequence && currentPlaybackType === "forward" ? "secondary" : "default"}
					>
						{isPlayingSequence && currentPlaybackType === "forward" ? "Остановить" : "Сыграть"}
					</Button>
				</div>
			)}

			{selectedNotesForPlayback.length > 0 && !isSelectingNotes && (
				<div className="pt-2 border-t border-border">
					<p className="text-sm text-muted-foreground">
						Выбранные ноты: <span className="text-foreground font-mono text-xs">{selectedNoteNames || "Нет"}</span>
					</p>
				</div>
			)}
		</div>
	);
};

export default PlaybackControls;
