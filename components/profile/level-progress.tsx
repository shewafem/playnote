// components/profile/LevelProgress.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LevelInfo } from "@/lib/levels";
import { Trophy } from "lucide-react";

interface LevelProgressProps {
	levelInfo: LevelInfo;
}

export function LevelProgress({ levelInfo }: LevelProgressProps) {
	const { level, levelName, progress, toNextLevel, currentLevelTotal, nextLevelThreshold } = levelInfo;

	return (
		<div className="w-full mb-6">
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Card className="shadow-md dark:shadow-none hover:shadow-primary/20 dark:hover:border-primary/50 transition-all duration-300">
							<CardHeader>
								<CardTitle className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Trophy className="text-yellow-500" />
										<span>{levelName} (Уровень {level})</span>
									</div>
									<span className="text-sm font-normal text-muted-foreground">
										{currentLevelTotal} / {nextLevelThreshold}
									</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<Progress value={progress} className="w-full" />
								<p className="text-sm text-muted-foreground mt-2 text-center">
									{progress < 100
										? `Еще ${toNextLevel} аккордов до следующего уровня!`
										: "Вы достигли максимального уровня! Поздравляем!"}
								</p>
							</CardContent>
						</Card>
					</TooltipTrigger>
					<TooltipContent>
						<p>Продолжайте учить аккорды, чтобы повышать свой уровень!</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
}