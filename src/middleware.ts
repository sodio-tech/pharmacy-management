// import { NextRequest, NextResponse } from "next/server";
// import {
//   DEFAULT_REDIRECT_PATH,
//   DEFAULT_RESTRICTED_REDIRECT_PATH,
//   RESTRICTED_PATHS,
// } from "./app/utils/constants";

// // Landing page routes that should be on main domain (pharmy.one)
// const LANDING_PATHS = [
//   "/",
//   "/about",
//   "/pricing",
//   "/privacy",
//   "/terms",
//   "/features",
//   "/refund",
//   "/contact",
// ];

// // Dashboard and auth routes that should be on app subdomain (app.pharmy.one)
// const APP_PATHS = [
//   "/dashboard",
//   "/inventory",
//   "/sales",
//   "/prescriptions",
//   "/suppliers",
//   "/users",
//   "/reports",
//   "/compliance",
//   "/profile",
//   "/login",
//   "/signup",
//   "/change-password",
//   "/forgot-password",
//   "/verify-email",
//   "/2fa-verification",
// ];

// function getSubdomain(hostname: string): string | null {
//   // Remove port if present
//   const host = hostname.split(":")[0];
//   const parts = host.split(".");

//   // For localhost development
//   if (host === "localhost" || host.startsWith("127.0.0.1")) {
//     return null;
//   }

//   // For production: pharmy.one or app.pharmy.one
//   // If parts.length >= 3, we have a subdomain (e.g., app.pharmy.one)
//   if (parts.length >= 3) {
//     return parts[0]; // Return the subdomain part
//   }

//   return null; // Main domain
// }

// function isAppSubdomain(subdomain: string | null): boolean {
//   return subdomain === "app";
// }

// function isLandingPath(pathname: string): boolean {
//   return LANDING_PATHS.some(path => pathname === path || pathname.startsWith(path + "/"));
// }

// function isAppPath(pathname: string): boolean {
//   return APP_PATHS.some(path => pathname === path || pathname.startsWith(path + "/"));
// }

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const hostname = request.headers.get("host") || "";
//   const subdomain = getSubdomain(hostname);
//   const isApp = isAppSubdomain(subdomain);

//   const refreshTokenCookie = request.cookies.get("refresh_token");
//   const isCookieExpired = !refreshTokenCookie || !refreshTokenCookie.value;

//   // Determine target domain and protocol
//   const protocol = request.nextUrl.protocol;
//   const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1");
//   const mainDomain = isLocalhost ? hostname : "pharmy.one";
//   const appDomain = isLocalhost ? hostname : "app.pharmy.one";

//   // Handle subdomain routing
//   if (isApp) {
//     // On app subdomain (app.pharmy.one)

//     // If trying to access landing page, redirect to main domain
//     if (isLandingPath(pathname)) {
//       const url = new URL(request.nextUrl.pathname + request.nextUrl.search, `${protocol}//${mainDomain}`);
//       return NextResponse.redirect(url);
//     }

//     // Handle auth routes (login, signup, etc.) - allow without auth
//     const authPaths = ["/login", "/signup", "/forgot-password", "/change-password", "/verify-email", "/2fa-verification"];
//     const isAuthPath = authPaths.some(path => pathname === path || pathname.startsWith(path + "/"));

//     if (isAuthPath) {
//       // Allow access to auth pages
//       return NextResponse.next();
//     }

//     // Protect dashboard routes - require authentication
//     if (isAppPath(pathname) && isCookieExpired) {
//       const url = new URL(DEFAULT_RESTRICTED_REDIRECT_PATH, `${protocol}//${appDomain}`);
//       return NextResponse.redirect(url);
//     }

//     return NextResponse.next();
//   } else {
//     // On main domain (pharmy.one)

//     // If trying to access dashboard/auth routes, redirect to app subdomain
//     if (isAppPath(pathname)) {
//       const url = new URL(request.nextUrl.pathname + request.nextUrl.search, `${protocol}//${appDomain}`);
//       return NextResponse.redirect(url);
//     }

//     // Allow landing pages on main domain
//     if (isLandingPath(pathname)) {
//       return NextResponse.next();
//     }

//     // For any other path, allow it (might be API routes, etc.)
//     return NextResponse.next();
//   }
// }

// export const config = {
// 	matcher: [
// 		"/((?!api|_next|.*\\.(?:ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|map|json|txt|mp3|wav|ogg)).*)",
// 	],
// };

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
    "/((?!api|_next|.\\.(?:ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|map|json|txt|mp3|wav|ogg)).)",
  ],
};
