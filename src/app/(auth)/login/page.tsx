"use client"
import BrandingPanel from "../_components/BrandingPanel"
import LoginForm from "../_components/login-form"
import SocialProviders from "../_components/SocialProviders"
import { motion } from "motion/react"
import Link from "next/link"

export default function LoginPage() {
    return (
        <div className="h-screen flex bg-gray-50 overflow-hidden">
            <BrandingPanel />
            
            <div className="flex-1 h-screen overflow-y-auto">
                <div className="min-h-full flex items-center justify-center p-6 lg:p-12">
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
                            <LoginForm />

                            {/* Divider */}
                            <motion.div
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

                                {/* Social Providers */}
                                <div className="mt-6">
                                    <SocialProviders />
                                </div>
                            </motion.div>

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
                </div>
            </div>
        </div>
    )
}
