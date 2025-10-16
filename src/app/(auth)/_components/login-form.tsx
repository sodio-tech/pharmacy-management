"use client"
import { FaEnvelope, FaLock } from "react-icons/fa"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signIn, twoFactor } from "@/lib/auth-client"
import { toast } from "react-toastify"
import Link from "next/link"
import { useRouter } from "next/navigation"

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

const LoginForm = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [rememberMe, setRememberMe] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "fsayush100@gmail.com",
            password: "Ayushdixit@123",
        },
    })

    const onSubmit = async (userData: LoginFormValues) => {
        try {
            setIsLoading(true)

            await signIn.email(
                {
                    email: userData.email,
                    password: userData.password,
                    rememberMe: rememberMe,
                    callbackURL: "/dashboard",
                },
                {
                    onSuccess: async (ctx) => {
                        const { user, twoFactorRedirect } = ctx.data || {}

                        if (twoFactorRedirect) {
                            toast.success("Otp sent to " + userData.email + " Please check your email")
                            await twoFactor.sendOtp()
                            router.push(`/2fa-verification?email=${encodeURIComponent(userData.email)}`)
                            return
                        }

                        if (!user) {
                            toast.error("Login failed. Please try again.")
                            return
                        }

                        if (!user.emailVerified) {
                            toast.error("Please verify your email before logging in.")
                            return
                        }

                        toast.success(`Welcome back, ${user.name || user.email}!`)
                    },
                    onError: (ctx) => {
                        if (ctx.error.status === 403) {
                            toast.error("Please verify your email address before logging in.")
                        } else if (ctx.error.status === 401) {
                            toast.error("Incorrect email or password.")
                        } else {
                            console.log(ctx.error,"error")
                            toast.error(ctx.error.message || "Login failed due to server error.")
                        }
                    },
                },
            )
        } catch (err: any) {
            toast.error(err.message || "An unexpected error occurred.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5">
                {/* Email Field */}
                <div>
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FaEnvelope className="h-4 w-4 text-teal-500" />
                        </div>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none w-full"
                            {...form.register("email")}
                        />
                        {form.formState.errors.email && (
                            <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
                        )}
                    </div>
                </div>

                {/* Password Field */}
                <div>
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FaLock className="h-4 w-4 text-teal-500" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none w-full"
                            {...form.register("password")}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                            tabIndex={-1}
                        >
                            {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                        </button>
                    </div>
                    {form.formState.errors.password && (
                        <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
                    )}
                </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-2">
                <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
                    <input
                        type="checkbox"
                        className="h-4 w-4 border-gray-300 rounded accent-teal-600"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                    Forgot password?
                </Link>
            </div>

            {/* Submit Button */}
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-lg shadow-md bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-colors"
                >
                    {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white mx-auto" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                            <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    ) : (
                        "Sign in"
                    )}
                </Button>
            </motion.div>
        </form>
    )
}

export default LoginForm
