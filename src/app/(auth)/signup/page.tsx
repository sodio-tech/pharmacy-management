
"use client"
import { motion } from 'motion/react';
import Link from 'next/link';
import SocialProviders from '../_components/SocialProviders';
import SignUpForm from '../_components/signup-form';

const SignupPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            {/* Animated background blobs */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-8 lg:p-10">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-center mb-8"
                        >
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
                        </motion.div>

                        <SignUpForm />
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="mt-8"
                        >

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                                </div>
                            </div>

                            <SocialProviders />
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                            className="mt-8 text-center text-sm text-gray-500"
                        >
                            Already have an account?{' '}
                            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                                Sign in
                            </Link>
                        </motion.p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SignupPage;