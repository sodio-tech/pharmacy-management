/**
 * Cookie Management Utilities
 */

export interface UserCookieData {
  access_token: string;
}

/**
 * Set authentication cookies
 */
export const setAuthCookies = (
  data: UserCookieData,
) => {
  const expiryHours = 11; // Cookie validity for 23 hours
  const expiryDate = new Date();
  expiryDate.setTime(expiryDate.getTime() + expiryHours * 60 * 60 * 1000);
  
  const cookieOptions = `expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
  document.cookie = `access_token=${data.access_token}; ${cookieOptions}`;
};

/**
 * Get a specific cookie value
 */
export const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }

  return null;
};

/**
 * Get access token from cookie
 */
export const getAccessToken = (): string | null => {
  return getCookie("access_token");
};

/**
 * Get user data from cookies
 */
export const getUserFromCookies = (): UserCookieData | null => {
  const access_token = getCookie("access_token");

  if (!access_token) return null;

  return {
    access_token,
  };
};

/**
 * Clear all authentication cookies (logout)
 */
export const clearAuthCookies = () => {
  const pastDate = new Date(0).toUTCString();
  const cookieOptions = `expires=${pastDate}; path=/; SameSite=Strict`;

  document.cookie = `access_token=; ${cookieOptions}`;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

