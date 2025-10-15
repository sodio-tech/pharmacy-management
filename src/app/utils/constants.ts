export const DEFAULT_REDIRECT_PATH = "/dashboard";

export const DEFAULT_RESTRICTED_REDIRECT_PATH = "/login";

export const RESTRICTED_PATHS = [
    "/",
    "/about",
    "/pricing",
    "/features",
    "/reviews",
    "/contact",
    "/login",
    "/signup",
    "/reset-password",
    "/forgot-password",
    "/verify-email",
    "/2fa-verification"
];

export const API = process.env.NEXT_PUBLIC_API || 'http://localhost:8080/api';
