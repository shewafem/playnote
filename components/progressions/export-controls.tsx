import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ExportControlsProps {
	onSaveAsPng: () => void;
	onPrint: () => void;
	isLoadingPng: boolean;
}

export function ExportControls({ onSaveAsPng, onPrint, isLoadingPng }: ExportControlsProps) {
	return (
		<TooltipProvider delayDuration={100}>
			<div className="flex gap-3 items-center p-4 border rounded-lg bg-card shadow">
				<h3 className="text-sm font-medium text-muted-foreground mr-2">Экспорт:</h3>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="outline" onClick={onSaveAsPng} disabled={isLoadingPng}>
							<Download className="w-4 h-4 mr-2" />
							{isLoadingPng ? "Сохраняю..." : "PNG"}
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Скачать текущую прогрессию как PNG изображение.</p>
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="outline" onClick={onPrint}>
							<Printer className="w-4 h-4 mr-2" />
							Печать
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Печать текущей прогрессии</p>
					</TooltipContent>
				</Tooltip>
			</div>
		</TooltipProvider>
	);
}
