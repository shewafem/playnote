import { auth } from "@/auth";
import LearnedChordsTable from "@/components/profile/learned-chords-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
//import { Toaster } from "sonner";

export default async function ProfileChords() {
	const session = await auth();

	if (!session?.user?.id) {
		redirect("/sign-in");
	}

	const userId = session.user.id;

	const userWithPositions = await prisma.user.findUnique({
		where: { id: userId },
		include: {
			learnedPositions: {
				include: {
					chord: true,
				},
				orderBy: {
					chord: {
						key: "asc",
					},
				},
			},
		},
	});

	if (!userWithPositions) {
		notFound();
	}

	const learnedPositions = userWithPositions.learnedPositions.map((lp) => ({
		...lp,
		chord: lp.chord!,
	}));

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-center text-2xl">Мои выученные аккорды 🎸</CardTitle>
				</CardHeader>
				<CardContent>
					<LearnedChordsTable learnedPositions={learnedPositions} />
				</CardContent>
			</Card>
		</div>
	);
}
