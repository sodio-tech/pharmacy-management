/**
 * Cookie Management Utilities
 * Note: refresh_token cookie is now set by backend via HTTP-only cookie.
 * This file is used for reading and clearing cookies in client-side code.
 */

import Cookies from "js-cookie";

export interface UserCookieData {
  refresh_token?: string;
}

/**
 * Cookie options with basic security
 */
const getCookieOptions = (expires?: number | Date): Cookies.CookieAttributes => {
  return {
    expires: expires || 7, // Default 7 days
    path: "/",
    sameSite: "strict",
    secure: true, // HTTPS only
  };
};

/**
 * Set authentication cookies
 * Note: This function may not be needed since backend sets the refresh_token cookie.
 * Keeping it for backward compatibility or edge cases.
 */
export const setAuthCookies = (data: UserCookieData) => {
  // Set refresh_token in cookie (7 days expiry)
  // Note: Backend typically sets this cookie, so this may not be necessary
  if (data.refresh_token) {
    const refreshExpiryDate = new Date();
    refreshExpiryDate.setTime(refreshExpiryDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    Cookies.set("refresh_token", data.refresh_token, getCookieOptions(refreshExpiryDate));
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
  return getCookie("refresh_token");
};

/**
 * Get user data from cookies
 * Note: access_token is no longer stored in cookies, only refresh_token
 */
export const getUserFromCookies = (): UserCookieData | null => {
  const refresh_token = getCookie("refresh_token");

  if (!refresh_token) return null;

  return {
    refresh_token,
  };
};

/**
 * Clear all authentication cookies (logout)
 */
export const clearAuthCookies = () => {
  const cookieOptions: Cookies.CookieAttributes = {
    path: "/",
    sameSite: "strict",
    secure: true,
  };

  // Clear refresh_token cookie
  Cookies.remove("refresh_token", cookieOptions);
};

/**
 * Check if user is authenticated (deprecated - use Redux state instead)
 * This checks for refresh_token in cookies as a fallback
 * For proper authentication check, use Redux state access_token
 */
export const isAuthenticated = (): boolean => {
  return !!getRefreshToken();
};
