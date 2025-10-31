"use client"
import LoginForm from "../../_components/login-form"
import { motion } from "motion/react"
import Link from "next/link"
import { Suspense } from "react"

function LoginFormWrapper() {
    return <LoginForm />
}

export default function LoginPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full max-w-xl"
        >
            <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                    <p className="text-gray-600">Sign in to continue your journey</p>
                </motion.div>

                {/* Login Form */}
                <Suspense fallback={
                    <div className="flex justify-center items-center py-12">
                        <svg className="animate-spin h-8 w-8 text-teal-600" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                            <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    </div>
                }>
                    <LoginFormWrapper />
                </Suspense>

                {/* Divider */}
                {/* <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mt-8"
                >
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <SocialProviders />
                    </div>
                </motion.div> */}

                {/* Sign Up Link */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="mt-8 text-center text-sm text-gray-600"
                >
                    Don't have an account?{" "}
                    <Link href="/signup" className="font-medium text-teal-600 hover:text-teal-700">
                        Sign up
                    </Link>
                </motion.p>
            </div>
        </motion.div>
    )
}
