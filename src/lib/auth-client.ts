import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
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
  sendVerificationEmail,
  updateUser,
  changePassword,
  changeEmail,
} = authClient;