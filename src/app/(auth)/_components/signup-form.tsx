"use client";
import { motion, type Variants } from "motion/react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Check, X, ShieldAlert, ArrowRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API, DEFAULT_REDIRECT_PATH } from "@/app/utils/constants";

const signupSchema = z
    .object({
        firstName: z
            .string()
            .min(2, { message: "First name must be at least 2 characters" }),
        lastName: z
            .string()
            .min(2, { message: "Last name must be at least 2 characters" }),
        email: z.string().email({ message: "Please enter a valid email address" }),
        phoneNumber: z
            .string()
            .min(10, { message: "Please enter a valid phone number" }),
        pharmacyName: z.string().min(2, { message: "Pharmacy name is required" }),
        drugLicenseNumber: z
            .string()
            .min(5, { message: "Drug license number is required" }),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters" })
            .regex(/[A-Z]/, {
                message: "Password must contain at least one uppercase letter",
            })
            .regex(/[0-9]/, { message: "Password must contain at least one number" }),
        confirmPassword: z.string(),
        agreeToTerms: z
            .boolean()
            .refine((val) => val === true, {
                message: "You must agree to the terms",
            }),
        receiveUpdates: z.boolean().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

type SignUpFormValues = z.infer<typeof signupSchema>;

const SignUpForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const form = useForm<SignUpFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            pharmacyName: "",
            drugLicenseNumber: "",
            password: "",
            confirmPassword: "",
            agreeToTerms: false,
            receiveUpdates: false,
        },
    });

    const password = form.watch("password");

    const passwordChecks = {
        length: password?.length >= 8,
        uppercase: /[A-Z]/.test(password || ""),
        number: /[0-9]/.test(password || ""),
    };

    const onSubmit = async (signupData: SignUpFormValues) => {
        try {
            setIsLoading(true);

            const { email, password, firstName, lastName, pharmacyName, phoneNumber, drugLicenseNumber } = signupData;

        const response = await axios.post(`${API}/api/v1/auth/sign-up`, {
            "first_name": firstName,
            "last_name": lastName,
            "pharmacy_name": pharmacyName,
            "email": email,
            "password": password,
            "phone_number": phoneNumber,
            "drug_license_number": drugLicenseNumber
        })
        if (response.status === 200) {
            toast.success("Registration successful!")
            // router.push(DEFAULT_REDIRECT_PATH)
        } else {
            toast.error(response.data.message || "An unexpected error occurred.")
        }
        } catch (err: any) {
            toast.error(err.response.data.message || err.message || "An unexpected error occurred.")
            toast.error("Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { y: 10, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 24 },
        },
    };

    return (
        <Form {...form}>
            <motion.form
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
            >
                <motion.div
                    variants={itemVariants}
                    className="bg-[#e0f2f1] border border-[#b2dfdb] rounded-lg p-4 flex gap-3"
                >
                    <ShieldAlert className="w-5 h-5 text-[#0f766e] flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">
                            Admin Registration
                        </h3>
                        <p className="text-xs text-gray-700">
                            Only pharmacy administrators can create accounts. Pharmacist
                            accounts are created by admins.
                        </p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                    <motion.div variants={itemVariants}>
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                        First Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="John"
                                            {...field}
                                            className="border-gray-300 focus:border-[#0f766e] focus:ring-[#0f766e]"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                        Last Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Doe"
                                            {...field}
                                            className="border-gray-300 focus:border-[#0f766e] focus:ring-[#0f766e]"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                    </motion.div>
                </div>

                {/* Email */}
                <motion.div variants={itemVariants}>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                    Email Address
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="john@pharmacy.com"
                                        {...field}
                                        className="border-gray-300 focus:border-[#0f766e] focus:ring-[#0f766e]"
                                    />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                    Phone Number
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="tel"
                                        placeholder="+1 (555) 000-0000"
                                        {...field}
                                        className="border-gray-300 focus:border-[#0f766e] focus:ring-[#0f766e]"
                                    />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <FormField
                        control={form.control}
                        name="pharmacyName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                    Pharmacy Name
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Your Pharmacy Name"
                                        {...field}
                                        className="border-gray-300 focus:border-[#0f766e] focus:ring-[#0f766e]"
                                    />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <FormField
                        control={form.control}
                        name="drugLicenseNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                    Drug License Number
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="DL-XXXXXXXX"
                                        {...field}
                                        className="border-gray-300 focus:border-[#0f766e] focus:ring-[#0f766e]"
                                    />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                </motion.div>

                {/* Password */}
                <motion.div variants={itemVariants}>
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                    Password
                                </FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="pr-10 border-gray-300 focus:border-[#0f766e] focus:ring-[#0f766e]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <FiEyeOff className="h-4 w-4" />
                                        ) : (
                                            <FiEye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                        {passwordChecks.length ? (
                            <Check className="w-4 h-4 text-green-500" />
                        ) : (
                            <X className="w-4 h-4 text-red-400" />
                        )}
                        <span
                            className={
                                passwordChecks.length ? "text-green-600" : "text-red-500"
                            }
                        >
                            At least 8 characters
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        {passwordChecks.uppercase ? (
                            <Check className="w-4 h-4 text-green-500" />
                        ) : (
                            <X className="w-4 h-4 text-red-400" />
                        )}
                        <span
                            className={
                                passwordChecks.uppercase ? "text-green-600" : "text-red-500"
                            }
                        >
                            One uppercase letter
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        {passwordChecks.number ? (
                            <Check className="w-4 h-4 text-green-500" />
                        ) : (
                            <X className="w-4 h-4 text-red-400" />
                        )}
                        <span
                            className={
                                passwordChecks.number ? "text-green-600" : "text-red-500"
                            }
                        >
                            One number
                        </span>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                    Confirm Password
                                </FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="pr-10 border-gray-300 focus:border-[#0f766e] focus:ring-[#0f766e]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? (
                                            <FiEyeOff className="h-4 w-4" />
                                        ) : (
                                            <FiEye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-3">
                    <FormField
                        control={form.control}
                        name="agreeToTerms"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="border-gray-300 data-[state=checked]:bg-[#0f766e] data-[state=checked]:border-[#0f766e]"
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel className="text-xs font-normal text-gray-700">
                                        I agree to the{" "}
                                        <Link
                                            href="/terms"
                                            className="text-[#0f766e] hover:underline"
                                        >
                                            Terms of Service
                                        </Link>{" "}
                                        and{" "}
                                        <Link
                                            href="/privacy"
                                            className="text-[#0f766e] hover:underline"
                                        >
                                            Privacy Policy
                                        </Link>
                                    </FormLabel>
                                    <FormMessage className="text-xs" />
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="receiveUpdates"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="border-gray-300 data-[state=checked]:bg-[#0f766e] data-[state=checked]:border-[#0f766e]"
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel className="text-xs font-normal text-gray-700">
                                        I want to receive updates about new features and pharmacy
                                        regulations
                                    </FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#0f766e] hover:bg-[#0d5f5a] text-white font-medium py-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <svg
                                    className="animate-spin h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Creating account...
                            </>
                        ) : (
                            <>
                                Create Account
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </Button>
                </motion.div>
            </motion.form>
        </Form>
    );
};

export default SignUpForm;
