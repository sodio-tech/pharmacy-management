"use client"
import { motion } from "motion/react"
import Link from "next/link"
import SignUpForm from "../../_components/signup-form"

const SignupPage = () => {
    return (
        <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-xl"
    >
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-center mb-8"
            >
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                <p className="text-gray-600">Join thousands of pharmacies worldwide</p>
            </motion.div>

            <SignUpForm />

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="mt-8 text-center text-sm text-gray-600"
            >
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-[#0f766e] hover:text-[#0d5f5a] hover:underline">
                    Sign in
                </Link>
            </motion.p>

            {/* Security Badges */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mt-8 flex items-center justify-center gap-4 text-xs text-gray-500"
            >
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>SSL Secured</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>HIPAA Compliant</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>ISO 27001</span>
                </div>
            </motion.div>
        </div>
    </motion.div>
    )
}

export default SignupPage
