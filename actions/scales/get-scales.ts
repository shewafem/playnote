"use server"
import prisma from "@/lib/prisma";

export async function getScales() {
	const scales = await prisma.scale.findMany({
		select: {
			id: true,
			name: true,
			formula: true,
		},
	});

	return scales;
}
