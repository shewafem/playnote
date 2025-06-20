import { auth } from "@/auth";
import { NextResponse } from "next/server";

//callback req будет вызвана для каждого пути matcher
export default auth((req) => {
	const { nextUrl } = req;
	const isLoggedIn = !!req.auth;

	const isAdminPath = nextUrl.pathname.startsWith("/admin");
  const isActionsPath = nextUrl.pathname.startsWith("/list-actions");

	const userRole = req.auth?.user?.role;

	if (!isLoggedIn) {
		return NextResponse.redirect(new URL("/sign-in", nextUrl));
	} else if (isAdminPath || isActionsPath) {
		if (userRole !== "ADMIN") {
			return NextResponse.redirect(new URL("/profile", nextUrl));
		}
	}

	return NextResponse.next();
});

export const config = {
	matcher: ["/admin/:path*", "/profile/:path*", "/list-actions/:path*",],
};
