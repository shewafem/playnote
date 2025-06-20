"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PositionWithChord } from "@/lib/chords/types";
import Link from "next/link";
import { motion } from "framer-motion";
import { Guitar, PlayCircle, Save } from "lucide-react";
import { SavedFretboard } from "@prisma/client";
import { calculateLevelInfo } from "@/lib/levels"; // <-- Import the calculator
import { LevelProgress } from "@/components/profile/level-progress"; // <-- Import the new component

interface StudentInfoProps {
	user: {
		learnedPositions: PositionWithChord[];
		savedFretboards: SavedFretboard[];
	};
}

export default function StudentInfo({ user }: StudentInfoProps) {
	const learnedPositions = user.learnedPositions || [];
	const savedFretboards = user.savedFretboards || [];

	// Calculate level information
	const levelInfo = calculateLevelInfo(learnedPositions.length);

	const cardItems = [
		{
			title: "Мои аккорды",
			icon: <Guitar size={16} className="text-primary" />,
			description: (
				<p>
					Вы выучили <span className="text-primary text-lg"> {learnedPositions.length}</span> аккордов
				</p>
			),
			link: "/profile/chords",
		},
		{
			title: "Практика песен",
			icon: <PlayCircle size={16} className="text-primary" />,
			description: "Нажмите для начала практики",
			link: "/profile/player",
		},
		{
			title: "Сохраненные схемы",
			icon: <Save size={16} className="text-primary" />,
			description: (
				<p>
					Вы добавили <span className="text-primary text-lg"> {savedFretboards.length}</span> схем грифа
				</p>
			),
			link: "/profile/fretboards",
		},
	];

	return (
		<div className="flex max-w-4xl mx-auto flex-col align-center justify-between gap-4">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{cardItems.map((card, index) => (
					<motion.div key={index} whileHover={{ y: -5, scale: 1.03 }} whileTap={{ scale: 0.98 }} className="flex-grow">
						<Link href={card.link}>
							<Card className="h-full flex flex-col gap-2 transition-all duration-300 ease-in-out shadow-md hover:shadow-primary/20 dark:shadow-none dark:hover:border-primary/50">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										{card.icon} {card.title}
									</CardTitle>
								</CardHeader>
								<CardContent>{card.description}</CardContent>
							</Card>
						</Link>
					</motion.div>
				))}
			</div>
			<LevelProgress levelInfo={levelInfo} />
		</div>
	);
}
