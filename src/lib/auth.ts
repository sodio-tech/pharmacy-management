import { betterAuth } from "better-auth";
import { prismaAdapter } from 'better-auth/adapters/prisma'
import prisma from '@/lib/prisma'
import { sendEmail } from "@/lib/send-mail";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    emailVerification: {
        autoSignInAfterVerification: true,
        enabled: true,
        sendVerificationEmail: async ({ user, url }) => {
            const verificationUrl = new URL(url);
            verificationUrl.searchParams.set("callbackURL", "/email-verification");
            await sendEmail({
                sendTo: user.email,
                subject: "Verify your email",
                text: `Click here to verify your email: ${verificationUrl.toString()}`,
            });
        },
        sendOnSignUp: true
    },
    secret: process.env.BETTER_AUTH_SECRET as string,
    emailAndPassword: {
        enabled: true,
        disableSignUp: false,
        requireEmailVerification: true,
        minPasswordLength: 8,
        maxPasswordLength: 128,
        autoSignIn: true,
        sendResetPassword: async ({ user, url, token }, request) => {
            await sendEmail({
                sendTo: user.email,
                subject: "Reset your password",
                text: `Click the link to reset your password: ${url}`,
            });
        },
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }

    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
        },
    },
})

export type User = typeof auth.$Infer.Session.user