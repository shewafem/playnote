import React from "react";
import { Button } from "../ui/button";
import { model } from "@coderline/alphatab";
import { Volume2, VolumeX, Eye, ListMusic } from "lucide-react";

interface TrackSelectorContentProps {
	tracks: model.Track[];
	trackMuteStates: boolean[];
	toggleTrackMute: (index: number) => void;
	isPlayerReady: boolean;
	selectedRenderTrackIndex: number | null;
	onTrackSelectForRendering: (track: model.Track) => void;
}

const TrackSelectorContent: React.FC<TrackSelectorContentProps> = ({
	tracks,
	trackMuteStates,
	toggleTrackMute,
	isPlayerReady,
	selectedRenderTrackIndex,
	onTrackSelectForRendering,
}) => {
	const isTrackSoloed = (track: model.Track) => {
		return selectedRenderTrackIndex === track.index;
	};

	const handleTrackContainerClick = (e: React.MouseEvent<HTMLDivElement>, track: model.Track) => {
		if ((e.target as HTMLElement).closest("button")) {
			return;
		}
		if (isPlayerReady) {
			onTrackSelectForRendering(track);
		}
	};

	return (
		<div className="p-2 w-fit truncate h-full bg-card">
			{tracks.length > 0 && (
				<>
					<h3 className="text-[10px] font-semibold mb-2 md:gap-2 text-card-foreground/80 flex items-center bg-card  z-10">
						<ListMusic className="h-4 w-4" /> Дорожки
					</h3>
					<div className="flex flex-col gap-1.5">
						{tracks.map((track, arrayIndex) => (
							<div
								key={track.index}
								onClick={(e) => handleTrackContainerClick(e, track)}
								className={`flex flex-col p-1.5 border bg-card rounded-md shadow-sm text-xs group transition-colors 
                            ${!isPlayerReady ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
                            ${
															isTrackSoloed(track)
																? "bg-blue-100 dark:bg-blue-800 border-blue-500 ring-2 ring-blue-500"
																: "bg-background hover:bg-muted/50"
														}`}
								title={
									!isPlayerReady
										? "Плеер не готов"
										: isTrackSoloed(track)
											? `Показана только дорожка: ${
													track.name || `Дорожка ${track.index + 1}`
												}. Кликните снова, чтобы показать все.`
											: `Кликните, чтобы показать только: ${track.name || `Дорожка ${track.index + 1}`}`
								}
							>
								<div className="flex justify-between items-center mb-0.5">
									<span
										className={`truncate font-medium group-hover:text-accent-foreground
                                ${isTrackSoloed(track) ? "text-blue-700 dark:text-blue-300" : "text-foreground"}`}
										title={track.name}
									>
										{track.name || `Дорожка ${track.index + 1}`}
									</span>
									{isTrackSoloed(track) && <Eye className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />}
								</div>
								<Button
									variant={trackMuteStates[arrayIndex] ? "destructive" : "outline"}
									onClick={(e) => {
										e.stopPropagation(); // отмена баббла
										toggleTrackMute(arrayIndex);
									}}
									disabled={!isPlayerReady}
									className="mt-1 w-full h-auto py-1 text-[10px] leading-tight px-1.5"
									title={trackMuteStates[arrayIndex] ? "Включить звук дорожки" : "Выключить звук дорожки"}
								>
									{trackMuteStates[arrayIndex] ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
								</Button>
							</div>
						))}
					</div>
				</>
			)}
			{tracks.length === 0 && <p className="text-xs text-muted-foreground text-center mt-4 px-1">Нет дорожек</p>}
		</div>
	);
};

export default TrackSelectorContent;
