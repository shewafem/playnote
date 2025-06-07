import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
	const { nextUrl } = req;
	const isLoggedIn = !!req.auth;

	if (!isLoggedIn) {
		return NextResponse.redirect(new URL("/sign-in", nextUrl));
	}

	const role = req.auth?.user?.role;
	if (role !== "ADMIN") {
		// Перенаправляем на главную страницу или страницу с ошибкой доступа
		return NextResponse.redirect(new URL("/", nextUrl));
	}

	return NextResponse.next();
});


export const config = {
	matcher: ["/admin/:path*"],
};
