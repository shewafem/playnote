import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mapIdsToNoteObjects } from "@/lib/fretboard-utils";
import { Chord } from "tonal";
import { Pause, Play } from "lucide-react";
import { useFretboardStore } from "@/lib/fretboard-store";

interface PlaybackControlsProps {
	playPingPongSequence: () => void;
	playSelectedNotes: () => void;
	stopPlayback: () => void;
	toggleSelectionMode: () => void;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
	playPingPongSequence,
	playSelectedNotes,
	stopPlayback,
	toggleSelectionMode,
}) => {
	const isSelectingNotes = useFretboardStore((s) => s.isSelectingNotes);
	const currentlySelectingNotes = useFretboardStore((s) => s.currentlySelectingNotes);
	const selectedNotesForPlayback = useFretboardStore((s) => s.selectedNotesForPlayback);
	const isPlayingSequence = useFretboardStore((s) => s.isPlayingSequence);
	const currentPlaybackType = useFretboardStore((s) => s.currentPlaybackType);
	const bpm = useFretboardStore((s) => s.bpm);
	const setBpm = useFretboardStore((s) => s.setBpm);
	const confirmSelection = useFretboardStore((s) => s.confirmSelection);
	const resetSelection = useFretboardStore((s) => s.resetSelection);
	const isToneReady = useFretboardStore((s) => s.isToneReady);
	const selectedTuning = useFretboardStore((s) => s.selectedTuning);
  const allTunings = useFretboardStore((s) => s.allTunings)

	const currentTuningMidi = useMemo(() => {
        return (allTunings && selectedTuning && allTunings[selectedTuning]) ? allTunings[selectedTuning] : [];
    }, [allTunings, selectedTuning]);

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
			mapIdsToNoteObjects(selectedNotesForPlayback, currentTuningMidi)
				.map((item) => item.note)
				.join(", "),
		[selectedNotesForPlayback, currentTuningMidi]
	);

	const detectableNotes = mapIdsToNoteObjects(currentlySelectingNotes, currentTuningMidi).map((item) =>
		item.note.replace(/[0-9]/g, "")
	);

	const handleReset = React.useCallback(() => {
		stopPlayback();
		resetSelection();
	}, [stopPlayback, resetSelection]);

	return (
		<div className="flex gap-8 flex-col sm:flex-row p-4 border border-dashed border-border rounded-md bg-card">
			<div className="flex flex-col gap-5">
				<h4 className="text-lg font-semibold text-center">Выбор нот и воспроизведение 🎶</h4>
				<div className="flex flex-wrap items-center gap-3">
					{currentlySelectingNotes.length !== 0 && (
						<Button
							onClick={handleReset}
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
					<p className="text-sm text-muted-foreground max-w-[30ch]">
						Выбранные ноты: <span className="text-foreground font-bold font-mono text-md">{selectedNoteNames || "Нет"}</span>
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
							Вероятные аккорды:
							<p className="font-mono font-black text-primary text-sm">
								{Chord.detect(detectableNotes).join(", ") || "пока неизвестно"}
							</p>
						</div>
					</div>
					<div className="">
						<div className="text-sm text-muted-foreground">
							Выбранные ноты:
							<p className="text-primary font-bold font-mono text-sm max-w-[30ch]">
								{detectableNotes.join(", ") || "выберите ноты"}
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default React.memo(PlaybackControls);
