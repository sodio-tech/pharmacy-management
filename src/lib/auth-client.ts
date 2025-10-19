import { createAuthClient } from "better-auth/react";
import { twoFactorClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "https://pharmacy-backend.sodio.tech/api/auth",
  // baseURL: "http://localhost:8080",
  plugins: [
    twoFactorClient(),
  ],
  fetchOptions: {
    credentials: 'include',
  },
});

// Export all available methods from Better Auth client
export const { 
  signIn, 
  signUp, 
  signOut, 
  useSession, 
  resetPassword, 
  forgetPassword, 
  getSession, 
  listSessions,
  sendVerificationEmail,
  updateUser,
  changePassword,
  revokeSession,
  revokeSessions,
  changeEmail,
} = authClient;

// Export 2FA methods
export const { twoFactor } = authClient;

