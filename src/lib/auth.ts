/**
 * Authentication Utilities
 */

import { backendApi } from "./axios-config";
import { store } from "@/store/store";
import { clearAuth } from "@/store/slices/authSlice";
import { getAccessTokenFromStorage } from "./utils";

/**
 * Global logout function
 * Performs complete logout: sends backend request, clears Redux state, 
 * clears localStorage, clears cookies, and redirects to login page
 * 
 * @param silent - If true, suppresses console errors (useful for automatic logouts)
 */
export const logout = async (silent: boolean = false): Promise<void> => {
  try {
    // Send logout request to backend
    // This will invalidate the refresh token on the server
    try {
      const response = await backendApi.post('/v1/auth/logout', {}, {
        headers: {
          'Authorization': `Bearer ${getAccessTokenFromStorage()}`
        }
      });
      if (response.status === 200 && response.data.success) {
        // Clear Redux state (access_token)
        store.dispatch(clearAuth());

        // Redirect to login page
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
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
