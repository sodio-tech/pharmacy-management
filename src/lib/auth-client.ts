import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:8080",
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

