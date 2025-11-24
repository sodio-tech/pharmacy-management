/**
 * Authentication Utilities
 */

import { clearAuthCookies, isAuthenticated } from "./cookies";
import { backendApi } from "./axios-config";

/**
 * Logout user - clear cookies, localStorage, and redirect to login
 */
export const logout = () => {
  clearAuthCookies();
  
  // Clear entire localStorage
  if (typeof window !== "undefined") {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
    }
  }
  
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

/**
 * Resend verification email
 * @param email - Email address to send verification email to
 * @returns Promise that resolves when email is sent successfully
 */
export const resendVerificationEmail = async (email: string): Promise<void> => {
  try {
    await backendApi.post('/v1/auth/resend-verification-email', {
      email: email
    });
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    const errorMessage = err.response?.data?.message || 'Failed to resend verification email';
    throw new Error(errorMessage);
  }
};
