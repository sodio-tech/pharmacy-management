/**
 * Cookie Management Utilities
 */

export interface UserCookieData {
  refresh_token?: string;
}

/**
 * Set authentication cookies
 */
export const setAuthCookies = (
  data: UserCookieData,
) => {
  const expiryHours = 11; 
  const expiryDate = new Date();
  expiryDate.setTime(expiryDate.getTime() + expiryHours * 60 * 60 * 1000);
  
  // Set domain for production (.sodio.tech) or leave empty for localhost
  const hostname = typeof window !== "undefined" ? window.location.hostname : "";
  const isProduction = hostname.includes("sodio.tech");
  const domainOption = isProduction ? `domain=.sodio.tech;` : "";
  
  // Set refresh_token in cookie (longer expiry - 7 days)
  if (data.refresh_token) {
    const refreshExpiryDate = new Date();
    refreshExpiryDate.setTime(refreshExpiryDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const refreshCookieOptions = `expires=${refreshExpiryDate.toUTCString()}; path=/; ${domainOption}SameSite=Strict`;
    document.cookie = `refresh_token=${data.refresh_token}; ${refreshCookieOptions}`;
  }
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
 * Get access token from cookie (deprecated - use Redux state instead)
 * This function is kept for backward compatibility but always returns null
 * Use Redux state to get access_token instead
 */
export const getAccessToken = (): string | null => {
  return null; // access_token is no longer stored in cookies
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
  const pastDate = new Date(0).toUTCString();
  
  // Set domain for production (.sodio.tech) or leave empty for localhost
  const hostname = typeof window !== "undefined" ? window.location.hostname : "";
  const isProduction = hostname.includes("sodio.tech");
  const domainOption = isProduction ? `domain=.sodio.tech;` : "";
  
  const cookieOptions = `expires=${pastDate}; path=/; ${domainOption}SameSite=Strict`;

  // Clear refresh_token cookie
  document.cookie = `refresh_token=; ${cookieOptions}`;
};

/**
 * Check if user is authenticated (deprecated - use Redux state instead)
 * This checks for refresh_token in cookies as a fallback
 * For proper authentication check, use Redux state access_token
 */
export const isAuthenticated = (): boolean => {
  return !!getRefreshToken();
};

