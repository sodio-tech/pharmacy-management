import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_REDIRECT_PATH,
  DEFAULT_RESTRICTED_REDIRECT_PATH,
  RESTRICTED_PATHS,
} from "./app/utils/constants";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;

  // 🧠 If already on a restricted path like /login or /signup and not logged in, allow access
  if (RESTRICTED_PATHS.includes(pathname)) {
    if (!accessToken) return NextResponse.next(); // allow access
    return NextResponse.redirect(new URL(DEFAULT_REDIRECT_PATH, request.url)); // already logged in
  }

  // 🧠 For all other paths, redirect to login if not authenticated
  if (!accessToken) {
    return NextResponse.redirect(new URL(DEFAULT_RESTRICTED_REDIRECT_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next|.*\\.(?:ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|map|json|txt)).*)",
	],
};