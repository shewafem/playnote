import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { ProfileInfoSchema } from "@/schemas/auth-schema";

export async function GET() {
	const session = await auth();
	if (!session) return NextResponse.json({ error: "Неавторизован" }, { status: 401 });
	const user = await prisma.user.findUnique({
		where: {
			id: session.user.id,
		},
		select: {
			id: true,
			name: true,
			email: true,
			image: true,
		},
	});
	if (!user) return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
	return NextResponse.json(user);
}

export async function PATCH(req: Request) {
	const session = await auth();
	if (!session?.user?.id) {
		return NextResponse.json({ error: "Неавторизован" }, { status: 401 });
	}
	const body = await req.json();
	const parsed = ProfileInfoSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: "Неверная информация" }, { status: 400 });
	}
	const { name, email } = parsed.data;
	try {
		const updated = await prisma.user.update({
			where: { id: session.user.id },
			data: { name, email },
			select: { id: true, email: true, name: true, image: true },
		});
		return NextResponse.json(updated);
	} catch {
		return NextResponse.json({ error: "Ошибка обновления профиля" }, { status: 500 });
	}
}
