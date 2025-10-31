/**
 * Authentication Utilities
 */

import { clearAuthCookies, isAuthenticated } from "./cookies";

/**
 * Logout user - clear cookies and redirect to login
 */
export const logout = () => {
  clearAuthCookies();
  
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

/**
 * Check if user is logged in
 */
export const checkAuth = (): boolean => {
  return isAuthenticated();
};
