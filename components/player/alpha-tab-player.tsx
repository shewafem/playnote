"use client";

import { useEffect, useRef, useState } from "react";
import { AlphaTabApi, Settings} from "@coderline/alphatab"; //LayoutMode, CountInMode, Metronome
import { Button } from "../ui/button";
import { Container } from "../layout/container";
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export default function AlphaTabPlayer() {
	const elementRef = useRef<HTMLDivElement>(null);
	const [api, setApi] = useState<AlphaTabApi>();

	const [isPlayerReady, setIsPlayerReady] = useState(false);
	const [songInfo, setSongInfo] = useState({ title: "", artist: "" });
	const [isPlaying, setIsPlaying] = useState(false);
	const [songPosition, setSongPosition] = useState("00:00 / 00:00");
	//const [zoom, setZoom] = useState("100");
	//const [layout, setLayout] = useState("page");
	//const [isCountInActive, setIsCountInActive] = useState(false);
	//const [isMetronomeActive, setIsMetronomeActive] = useState(false);

	useEffect(() => {
		const api = new AlphaTabApi(elementRef.current!, {
			core: {
				file: "https://www.alphatab.net/files/canon.gp",
				fontDirectory: "/alphatab/font/",
			},
			player: {
				enablePlayer: true,
				enableCursor: true,
				enableUserInteraction: true,
				soundFont: "/alphatab/soundfont/sonivox.sf2",
			},
		} as Settings);

		api.scoreLoaded.on((score) => {
			setSongInfo({
				title: score.title || "Untitled",
				artist: score.artist || "Unknown Artist",
			});
		});

		api.playerReady.on(() => {
			setIsPlayerReady(true);
		});

		api.playerStateChanged.on((stateObj) => {
			setIsPlaying(stateObj.state === 1);
		});

		api.playerPositionChanged.on((pos) => {
			console.log("player position changed", pos);
			const current = formatTime(pos.currentTime);
			const total = formatTime(pos.endTime);
			setSongPosition(`${current} / ${total}`);
		});

		setApi(api);

		return () => {
			console.log("destroy", elementRef, api);
			api.destroy();
		};
	}, []);

	const formatTime = (ms: number) => {
		const seconds = Math.floor(ms / 1000);
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	const handlePrint = () => {
		api?.print();
	};

	function playPause() {
		api?.playPause();
	}

	//const handleZoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
	//	if (!api) return;
	//	const newZoom = e.target.value; // Keep as string for state
	//	console.log("Changing zoom:", newZoom);
	//	setZoom(newZoom);
	//	const zoomLevel = parseInt(newZoom) / 100;
	//	api.settings.display.scale = zoomLevel;
	//	api.updateSettings();
	//	api.render(); // Re-render needed for zoom changes
	//};

	//const handleLayoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
	//	if (!api) return;
	//	const newLayout = e.target.value; // Keep as string for state
	//	console.log("Changing layout:", newLayout);
	//	setLayout(newLayout);
	//	switch (newLayout) {
	//		case "horizontal":
	//			api.settings.display.layoutMode = LayoutMode.Horizontal;
	//			break;
	//		case "page":
	//			api.settings.display.layoutMode = LayoutMode.Page;
	//			break;
	//		default:
	//			// Handle unexpected values or default to page
	//			api.settings.display.layoutMode = LayoutMode.Page;
	//			break;
	//	}
	//	api.updateSettings();
	//	api.render(); // Re-render needed for layout changes
	//};

	return (
		<>
			<Container className="at-content overflow-auto flex flex-col gap-4">
				<div className="control-panel flex flex-col gap-4">
					<div className="song-info text-lg font-bold">
						{songInfo.title} by {songInfo.artist}
					</div>
					<div className="playback-controls flex items-center gap-4">
						<Button onClick={playPause} disabled={!isPlayerReady}>
							{isPlaying ? "Pause" : "Play"}
						</Button>
						<span className="text-sm">{songPosition}</span>
						{/*<Slider
            value={endTime ? [(currentTime / endTime) * 100] : [0]}
            min={0}
            max={100}
            step={0.1}
            disabled={!isPlayerReady}
            className="w-1/3"
          />*/}
					</div>
					<div className="settings flex flex-wrap items-center gap-4">
						{/*
          <div className="flex items-center gap-2">
            <span className="text-sm">Zoom:</span>
            <Slider
              value={[zoom]}
              onValueChange={([val]) => setZoom(val)}
              min={50}
              max={200}
              step={10}
              disabled={!isPlayerReady}
              className="w-32"
            />
            <span className="text-sm">{zoom}%</span>
          </div>*/}
						{/*<Toggle
            pressed={isCountInActive}
            onPressedChange={setIsCountInActive}
            disabled={!isPlayerReady}
          >
            Count In
          </Toggle>
          <Toggle
            pressed={isMetronomeActive}
            onPressedChange={setIsMetronomeActive}
            disabled={!isPlayerReady}
          >
            Metronome
          </Toggle>*/}
					</div>
				</div>
				{/*<Select onValueChange={() => handleLayoutChange} value={layout} disabled={!isPlayerReady}>
					<SelectTrigger>
						<SelectValue  placeholder="Layout" />
					</SelectTrigger>
					<SelectContent >
						<SelectItem value="page">Page</SelectItem>
						<SelectItem value="horizontal">Horizontal</SelectItem>
					</SelectContent>
				</Select>*/}
				<Button
					className="bg-primary p-3 text-background w-fit rounded-lg"
					onClick={handlePrint}
					disabled={!isPlayerReady}
				>
					Print
				</Button>
				<div ref={elementRef} className="player h-[500px] border rounded-lg shadow-md"></div>
			</Container>
		</>
	);
}
