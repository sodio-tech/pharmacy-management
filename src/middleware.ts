import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_REDIRECT_PATH,
  DEFAULT_RESTRICTED_REDIRECT_PATH,
  RESTRICTED_PATHS,
} from "./app/utils/constants";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshTokenCookie = request.cookies.get("refresh_token");
  
  const isCookieExpired = !refreshTokenCookie || !refreshTokenCookie.value;

  if (RESTRICTED_PATHS.includes(pathname)) {
    if (isCookieExpired) return NextResponse.next();
    return NextResponse.redirect(new URL(DEFAULT_REDIRECT_PATH, request.url));
  }

  if (isCookieExpired) {
    return NextResponse.redirect(new URL(DEFAULT_RESTRICTED_REDIRECT_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next|.*\\.(?:ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|map|json|txt|mp3|wav|ogg)).*)",
	],
};