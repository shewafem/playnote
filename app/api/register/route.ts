import { NextResponse } from "next/server";
import { RegisterSchema } from "@/schemas/auth-schema";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const validatedFields = RegisterSchema.safeParse(body);
		if (!validatedFields.success) {
			return NextResponse.json({ error: "Невалидные данные" }, { status: 400 });
		}

		const { email, password } = validatedFields.data;
		const normalizedEmail = email.toLowerCase();
		const existingUser = await prisma.user.findUnique({
			where: { email: normalizedEmail },
		});

		if (existingUser) {
			return NextResponse.json(
				{ error: "Аккаунт с таким адресом электронной почты уже существует." },
				{ status: 409 }
			);
		}

		let hashedPassword;
		try {
			hashedPassword = await bcrypt.hash(password, 10);
		} catch (hashError) {
			console.error("PASSWORD_HASHING_ERROR", hashError);
			return NextResponse.json(
				{ error: "Не удалось обработать регистрацию. Пожалуйста, попробуйте еще раз." },
				{ status: 500 }
			);
		}

		await prisma.user.create({
			data: {
				email: normalizedEmail,
				hashedPassword,
			},
		});

		return NextResponse.json(
			{ success: "Аккаунт успешно создан. Перенаправляем вас в профиль..." },
			{ status: 201 }
		);
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("REGISTRATION_ROUTE_ERROR", {
				message: error.message,
				stack: error.stack,
				name: error.name,
			});
		} else {
			console.error("REGISTRATION_ROUTE_ERROR", { message: "Неизвестная ошибка" });
		}
		return NextResponse.json({ error: "Произошла внутренняя ошибка сервера при регистрации." }, { status: 500 });
	}
}