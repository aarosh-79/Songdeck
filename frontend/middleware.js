import { NextRequest, NextResponse } from "next/server";
import { auth } from "./src/app/api/auth/[...nextauth]/auth";

async function middleware(req) {
	const session = await auth();
	const path = req.nextUrl.pathname;

	const isPublicPath = path === "/" || path === "/login" || path === "/signup";

	if (isPublicPath && session) {
		return NextResponse.redirect(new URL("/map", req.url));
	}

	if (!isPublicPath && !session) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/signup", "/login", "workspace", "reqsongs"],
};

export default middleware;
