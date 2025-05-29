"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PositionWithChord } from "@/lib/chords/types";
import { Enrollment } from "@prisma/client";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Guitar, PlayCircle } from "lucide-react";

interface StudentInfoProps {
	user: {
		enrollments: Enrollment[];
		learnedPositions: PositionWithChord[];
	};
}

export default function StudentInfo({ user }: StudentInfoProps) {
	const enrolledCourses = user.enrollments || [];
	const learnedPositions = user.learnedPositions || [];

	const cardItems = [
		{
			title: "Мои курсы",
			icon: <BookOpen size={16} className="text-primary" />,
			description: (
				<p>
					Вы записаны на <span className="text-primary text-lg"> {enrolledCourses.length}</span> курсов
				</p>
			),
			link: "/profile/courses",
		},
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
	];

	return (
		<div className="flex max-w-200 mx-auto flex-col sm:flex-row align-center justify-between gap-4">
			{cardItems.map((card, index) => (
				<motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} className="flex-grow ">
					<Link href={card.link}>
						<Card className="flex flex-col gap-2 transition-all duration-300 ease-in-out shadow-md hover:shadow-primary/20 dark:shadow-none dark:hover:border-primary/50">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									{card.title} {card.icon}
								</CardTitle>
							</CardHeader>
							<CardContent>{card.description}</CardContent>
						</Card>
					</Link>
				</motion.div>
			))}
		</div>
	);
}
