"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleLearnedPosition(positionId: number) {
	const session = await auth();

	if (!session?.user?.id) {
		return { error: "Неавторизован", success: false };
	}

	const userId = session.user.id;

	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { learnedPositions: { where: { id: positionId }, select: { id: true } } },
		});

		if (!user) {
			return { error: "Пользователь не найден", success: false };
		}

		const isCurrentlyLearned = user.learnedPositions.length > 0;
		let newLearnedState: boolean;

		if (isCurrentlyLearned) {
			await prisma.user.update({
				where: { id: userId },
				data: {
					learnedPositions: {
						disconnect: { id: positionId },
					},
				},
			});
			newLearnedState = false;
		} else {
			await prisma.user.update({
				where: { id: userId },
				data: {
					learnedPositions: {
						connect: { id: positionId },
					},
				},
			});
			newLearnedState = true;
		}
        revalidatePath("/chords", "layout");
		return {
            success: true,
            learned: newLearnedState,
            message: `Позиция ${newLearnedState ? 'выучена' : 'не выучена'}.`
        };

	} catch (error) {
		console.error("Ошибка смены статуса позиции", error);
		return { error: "Ошибка базы данных", success: false };
	}
}