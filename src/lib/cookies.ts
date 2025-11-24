/**
 * Cookie Management Utilities using js-cookie
 */

import Cookies from "js-cookie";

export interface UserCookieData {
  refresh_token?: string;
}

/**
 * Get cookie options based on environment
 */
const getCookieOptions = (expires?: number | Date): Cookies.CookieAttributes => {
  const hostname = typeof window !== "undefined" ? window.location.hostname : "";
  const isProduction = hostname.includes("sodio.tech");
  
  return {
    expires: expires || 7, // Default 7 days
    path: "/",
    sameSite: "strict",
    ...(isProduction && { domain: ".sodio.tech" }),
  };
};

/**
 * Set authentication cookies
 */
export const setAuthCookies = (data: UserCookieData) => {
  // Set refresh_token in cookie (7 days expiry)
  if (data.refresh_token) {
    const refreshExpiryDate = new Date();
    refreshExpiryDate.setTime(refreshExpiryDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    Cookies.set("token", data.refresh_token, getCookieOptions(refreshExpiryDate));
  }
};

/**
 * Get a specific cookie value
 */
export const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;
  return Cookies.get(name) || null;
};

/**
 * Get refresh token from cookie
 */
export const getRefreshToken = (): string | null => {
  return getCookie("token");
};

/**
 * Get user data from cookies
 * Note: access_token is no longer stored in cookies, only refresh_token
 */
export const getUserFromCookies = (): UserCookieData | null => {
  const refresh_token = getCookie("token");

  if (!refresh_token) return null;

  return {
    refresh_token,
  };
};

/**
 * Clear all authentication cookies (logout)
 */
export const clearAuthCookies = () => {
  const hostname = typeof window !== "undefined" ? window.location.hostname : "";
  const isProduction = hostname.includes("sodio.tech");
  
  const cookieOptions: Cookies.CookieAttributes = {
    path: "/",
    sameSite: "strict",
    ...(isProduction && { domain: ".sodio.tech" }),
  };

  // Clear refresh_token cookie
  Cookies.remove("token", cookieOptions);
};

/**
 * Check if user is authenticated (deprecated - use Redux state instead)
 * This checks for refresh_token in cookies as a fallback
 * For proper authentication check, use Redux state access_token
 */
export const isAuthenticated = (): boolean => {
  return !!getRefreshToken();
};
