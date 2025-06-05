"use client";

import { useEffect, useRef, useState } from "react";
import {
	AlphaTabApi,
	Settings,
	LayoutMode,
	model, // для Track
} from "@coderline/alphatab";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Toggle } from "../ui/toggle";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
	Play,
	Pause,
	LayoutDashboard,
	ZoomIn,
	Gauge,
	Timer,
	Repeat,
	Triangle,
	Printer,
	Music2,
	UserCircle2,
	UploadCloud,
} from "lucide-react";
import TrackSelectorContent from "./track-selector-content";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function AlphaTabPlayer() {
	const alphaTabMainRef = useRef<HTMLDivElement>(null);
	const viewportRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [api, setApi] = useState<AlphaTabApi | null>(null);

	const [isPlayerReady, setIsPlayerReady] = useState(false);
	const [songInfo, setSongInfo] = useState({ title: "", artist: "" });
	const [isPlaying, setIsPlaying] = useState(false);

	const [tracks, setTracks] = useState<model.Track[]>([]);
	const [trackMuteStates, setTrackMuteStates] = useState<boolean[]>([]);

	const [zoomLevel, setZoomLevel] = useState("100");
	const [currentLayoutMode, setCurrentLayoutMode] = useState<LayoutMode>(LayoutMode.Page);
	const [isCountInActive, setIsCountInActive] = useState(false);
	const [isMetronomeActive, setIsMetronomeActive] = useState(false);
	const [playbackSpeed, setPlaybackSpeed] = useState<string>("1.0");
	const [isLoopingActive, setIsLoopingActive] = useState<boolean>(false);
	const [renderOnlyTrackIndex, setRenderOnlyTrackIndex] = useState<number>(0);

	useEffect(() => {
		const api = new AlphaTabApi(alphaTabMainRef.current!, {
			core: {
				fontDirectory: "/alphatab/font/",
			},
			player: {
				enablePlayer: true,
				enableCursor: true,
				enableUserInteraction: true,
				soundFont: "/alphatab/soundfont/sonivox.sf2",
				scrollElement: viewportRef.current ? viewportRef.current : "",
			},
			display: {
				layoutMode: currentLayoutMode,
				scale: parseInt(zoomLevel) / 100,
			},
		} as Settings);

		setApi(api);

		if (api) {
			api.countInVolume = isCountInActive ? 0.5 : 0;
			api.metronomeVolume = isMetronomeActive ? 2 : 0;
			api.playbackSpeed = parseFloat(playbackSpeed);
			api.isLooping = isLoopingActive;
		}

		api.scoreLoaded.on((score) => {
			setSongInfo({
				title: score.title || "Неизвестно",
				artist: score.artist || "Неизвестный исполнитель",
			});
			setTracks(score.tracks);
			setTrackMuteStates(score.tracks.map(() => false));
			setIsPlayerReady(false);
			setRenderOnlyTrackIndex(0);
		});

		api.playerReady.on(() => {
			setIsPlayerReady(true);
			console.log("Проигрыватель готов");
		});

		api.playerStateChanged.on((stateObj) => {
			setIsPlaying(stateObj.state === 1);
		});

		//api.playerPositionChanged.on((pos) => {
		//	const current = formatTime(pos.currentTime);
		//	const total = formatTime(pos.endTime);
		//});

		return () => {
			console.log("очистка плеера");
			setApi(null);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // при маунте

	//const formatTime = (ms: number) => {
	//	const seconds = Math.floor(ms / 1000);
	//	const minutes = Math.floor(seconds / 60);
	//	const remainingSeconds = seconds % 60;
	//	return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
	//};

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!api) {
			console.warn("API не готово", api);
			return;
		}
		const selectedFile = event.target.files?.[0];
		console.log("выбранный файл:", selectedFile);
		if (selectedFile) {
			try {
				const fileData = await selectedFile.arrayBuffer();
				api.load(fileData);
			} catch (e) {
				console.error("ошибка загрузки файла", e);
			}
		}
	};

	const playPause = () => {
		api?.playPause();
	};

	const handlePrint = () => {
		api?.print();
	};

	const handleZoomChange = (value: string) => {
		if (!api) return;
		const newZoom = parseInt(value);
		setZoomLevel(value);
		api.settings.display.scale = newZoom / 100;
		api.updateSettings();
		api.render();
	};

	const handleLayoutChange = (value: string) => {
		if (!api || !viewportRef.current) return;
		const newLayout = value === "horizontal" ? LayoutMode.Horizontal : LayoutMode.Page;
		setCurrentLayoutMode(newLayout);
		api.settings.display.layoutMode = newLayout;
		api.updateSettings();
		api.render();
	};

	const toggleCountIn = (pressed: boolean) => {
		if (!api) return;
		setIsCountInActive(pressed);
		api.countInVolume = pressed ? 0.3 : 0;
	};

	const toggleMetronome = (pressed: boolean) => {
		if (!api) return;
		setIsMetronomeActive(pressed);
		api.metronomeVolume = pressed ? 2 : 0; // 0-16
	};

	const toggleLooping = (pressed: boolean) => {
		if (!api) return;
		setIsLoopingActive(pressed);
		api.isLooping = pressed;
	};

	const toggleTrackMute = (trackIndex: number) => {
		if (!api || !tracks[trackIndex]) return;
		const newMuteStates = [...trackMuteStates];
		newMuteStates[trackIndex] = !newMuteStates[trackIndex];
		setTrackMuteStates(newMuteStates);
		api.changeTrackMute([tracks[trackIndex]], newMuteStates[trackIndex]);
	};

	const handlePlaybackSpeedChange = (value: string) => {
		if (!api) return;
		const newSpeed = parseFloat(value);
		setPlaybackSpeed(value);
		api.playbackSpeed = newSpeed;
	};

	const handleTrackClickForRendering = (clickedTrack: model.Track) => {
		api?.renderTracks([clickedTrack]);
		setRenderOnlyTrackIndex(clickedTrack.index);
	};
	const ControlPanelContent = () => (
		<div className="playback-controls flex items-center flex-col sm:flex-row justify-between gap-4 p-2">
			<div className="flex items-center justify-center gap-4">
				<div className="file-controls flex items-center gap-2 ">
					<Input
						type="file"
						ref={fileInputRef}
						onChange={handleFileChange}
						accept=".gp,.gp3,.gp4,.gp5,.gpx,.gpif,.ptb,.musicxml,.xml,.mxl"
						className="text-sm file:rounded-md cursor-pointer w-10 hidden "
						id="file-input"
					/>
					<Label htmlFor="file-input" className="cursor-pointer p-2 rounded-lg">
						<UploadCloud className="h-6 w-6" />
					</Label>
				</div>
				<div className="song-info">
					<h2 className="text-md font-bold flex items-center gap-1" title={songInfo.title || "Песня не загружена"}>
						<Music2 className="h-3 w-3 text-primary-foreground/90" />
						{songInfo.title || "Песня не загружена"}
					</h2>
					<p
						className="text-sm text-primary-foreground/70 flex gap-1 items-center"
						title={songInfo.artist || "Неизвестный исполнитель"}
					>
						<UserCircle2 className="h-3 w-3 " />
						{songInfo.artist || "Неизвестно"}
					</p>
				</div>
				<div className="flex gap-2 items-center justify-center">
					<Button
						onClick={playPause}
						disabled={!isPlayerReady || tracks.length === 0}
						className="cursor-pointer border"
					>
						{isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
					</Button>
					{/*<span className="text-sm min-w-[100px] bg-primary-foreground/10 px-3 py-1.5 rounded-md text-center">
						{songPosition}
					</span>*/}
				</div>
			</div>
			<div className="settings-flex-container flex flex-wrap items-center gap-x-4 gap-y-3">
				{/* Вид отображения */}
						<div className="flex gap-1.5 cursor-pointer">
							<Label
								htmlFor="layout-select"
								className="text-xs font-medium text-primary-foreground/80 flex items-center"
							>
								<LayoutDashboard className="h-4 w-4" />
							</Label>
							<Select
								onValueChange={handleLayoutChange}
								value={currentLayoutMode === LayoutMode.Horizontal ? "horizontal" : "page"}
								disabled={!api || tracks.length === 0}
							>
								<SelectTrigger
									id="layout-select"
									className="bg-primary-foreground/10 cursor-pointer border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 data-[disabled]:opacity-60"
								>
									<SelectValue placeholder="Макет" />
								</SelectTrigger>
								<SelectContent className="bg-popover text-popover-foreground border-border">
									<SelectItem value="page">Страница</SelectItem>
									<SelectItem value="horizontal">Горизонтальный</SelectItem>
								</SelectContent>
							</Select>
						</div>
				{/* Масштаб */}
				<div className="flex gap-1.5 cursor-pointer">
					<Label htmlFor="zoom-select" className="text-xs font-medium text-primary-foreground/80 flex items-center">
						<ZoomIn className="h-4 w-4" />
					</Label>
					<Select onValueChange={handleZoomChange} value={zoomLevel} disabled={!api || tracks.length === 0}>
						<SelectTrigger
							id="zoom-select"
							className="cursor-pointer bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 data-[disabled]:opacity-60"
						>
							<SelectValue placeholder="Масштаб" />
						</SelectTrigger>
						<SelectContent className="bg-popover text-popover-foreground border-border">
							{["50", "75", "100", "125", "150", "200"].map((val) => (
								<SelectItem key={val} value={val}>
									{val}%
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				{/* Скорость */}
				<div className="flex gap-1.5 cursor-pointer">
					<Label htmlFor="speed-select" className="text-xs font-medium text-primary-foreground/80 flex items-center">
						<Gauge className="h-4 w-4" />
					</Label>
					<Select
						onValueChange={handlePlaybackSpeedChange}
						value={playbackSpeed}
						disabled={!isPlayerReady || tracks.length === 0}
					>
						<SelectTrigger
							id="speed-select"
							className="cursor-pointer bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 data-[disabled]:opacity-60"
						>
							<SelectValue placeholder="Скорость" />
						</SelectTrigger>
						<SelectContent className="bg-popover text-popover-foreground border-border">
							{["0.5", "0.75", "1.0", "1.25", "1.5", "2.0"].map((val) => (
								<SelectItem key={val} value={val}>
									{val}x
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				{/*  Отсчёт */}
				<Tooltip>
					<TooltipTrigger asChild>
						<div className="flex items-center">
							<Toggle
								aria-label="Переключить Отсчёт"
								pressed={isCountInActive}
								onPressedChange={toggleCountIn}
								disabled={!isPlayerReady || tracks.length === 0}
								variant="outline"
								className="data-[state=on]:bg-accent cursor-pointer data-[state=on]:text-accent-foreground text-primary-foreground hover:bg-primary-foreground/10 border-primary-foreground/40 hover:text-primary-foreground data-[disabled]:opacity-60"
							>
								<Timer className="h-4 w-4" />
							</Toggle>
						</div>
					</TooltipTrigger>
					<TooltipContent className="border">
						<p>Отсчёт</p>
					</TooltipContent>
				</Tooltip>
				{/* цикл */}
				<Tooltip>
					<TooltipTrigger asChild>
						<div className="flex items-center">
							<Toggle
								aria-label="Переключить цикл"
								pressed={isLoopingActive}
								onPressedChange={toggleLooping}
								disabled={!isPlayerReady || tracks.length === 0}
								variant="outline"
								className="data-[state=on]:bg-accent cursor-pointer data-[state=on]:text-accent-foreground text-primary-foreground hover:bg-primary-foreground/10 border-primary-foreground/40 hover:text-primary-foreground data-[disabled]:opacity-60"
							>
								<Repeat className="h-4 w-4" />
							</Toggle>
						</div>
					</TooltipTrigger>
					<TooltipContent className="border">
						<p>Выделите фрагмент для повтора</p>
					</TooltipContent>
				</Tooltip>
				{/* Метроном */}
				<Tooltip>
					<TooltipTrigger asChild>
						<div className="flex items-center">
							<Toggle
								aria-label="Переключить метроном"
								pressed={isMetronomeActive}
								onPressedChange={toggleMetronome}
								disabled={!isPlayerReady || tracks.length === 0}
								variant="outline"
								className="data-[state=on]:bg-accent cursor-pointer data-[state=on]:text-accent-foreground text-primary-foreground hover:bg-primary-foreground/10 border-primary-foreground/40 hover:text-primary-foreground data-[disabled]:opacity-60"
							>
								<Triangle className="h-4 w-4" />
							</Toggle>
						</div>
					</TooltipTrigger>
					<TooltipContent className="border">
						<p>Метроном</p>
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							onClick={handlePrint}
							className="cursor-pointer"
							disabled={!api || tracks.length === 0}
							variant="ghost"
						>
							<Printer className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent className="border">
						<p>Печать</p>
					</TooltipContent>
				</Tooltip>
			</div>
		</div>
	);
	return (
		<div className="at-wrap w-[80vw] h-[80vh] mx-auto border border-border flex flex-col overflow-hidden relative bg-background text-foreground shadow-lg rounded-lg">
			<div className="at-content relative overflow-hidden flex-1 flex">
				<div className="at-sidebar border-border max-w-30  bg-card text-card-foreground ">
					<TrackSelectorContent
						onTrackSelectForRendering={handleTrackClickForRendering}
						selectedRenderTrackIndex={renderOnlyTrackIndex}
						tracks={tracks}
						trackMuteStates={trackMuteStates}
						toggleTrackMute={toggleTrackMute}
						isPlayerReady={isPlayerReady}
					/>
				</div>
				<div ref={viewportRef} className="at-viewport overflow-y-auto absolute top-0 right-0 bottom-0 bg-background">
					<div ref={alphaTabMainRef} className="at-main h-fit">
						{!api && <p className="p-4 text-center text-lg text-muted-foreground">Инициализация AlphaTab...</p>}
						{api && tracks.length === 0 && (
							<div className="flex flex-col items-center justify-center h-full p-4 text-center">
								<p className="text-muted-foreground text-lg mb-2">Музыка не загружена.</p>
								<p className="text-sm text-muted-foreground/80">
									Загрузите файл, нажав на иконку слева в панели управления.
								</p>
							</div>
						)}
						{/* AlphaTab */}
					</div>
				</div>
			</div>
			<div className="at-controls bg-primary text-primary-foreground border-t border-border">
				<ControlPanelContent />
			</div>
		</div>
	);
}
