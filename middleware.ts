import { auth } from "@/auth";
import { NextResponse } from "next/server";

//callback req будет вызвана для каждого запроса, который соответствует matcher
export default auth((req) => {
	const { nextUrl } = req;
	const isLoggedIn = !!req.auth; // boolean req.auth информация о сессии

	const isAdminPath = nextUrl.pathname.startsWith("/admin");

	const userRole = req.auth?.user?.role;

	if (!isLoggedIn) {
		return NextResponse.redirect(new URL("/sign-in", nextUrl));
	} else if (isAdminPath) {
		if (userRole !== "ADMIN") {
			return NextResponse.redirect(new URL("/profile", nextUrl));
		}
	}

	return NextResponse.next();
});

export const config = {
	matcher: ["/admin/:path*", "/profile/:path*"],
};
