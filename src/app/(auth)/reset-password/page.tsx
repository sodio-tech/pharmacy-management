'use client'
import { useState, FormEvent, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { resetPassword } from '@/lib/auth-client';

interface PasswordState {
    password: string;
    confirmPassword: string;
}

function ResetPassword() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    const [passwords, setPasswords] = useState<PasswordState>({
        password: 'Password1234',
        confirmPassword: 'Password1234',
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswords((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (passwordError) {
            setPasswordError(null);
        }
    };

    const validatePasswords = (): boolean => {
        if (passwords.password !== passwords.confirmPassword) {
            setPasswordError('Passwords do not match');
            return false;
        }

        if (passwords.password.length < 8) {
            setPasswordError('Password must be at least 8 characters long');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validatePasswords()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const { error: resetError } = await resetPassword({
                newPassword: passwords.password,
                token: token as string,
            });
            if (resetError) {
                toast.error(resetError.message);
            } else {
                toast.success('Password reset successful');
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            }
            setPasswords({ password: '', confirmPassword: '' });
        } catch (err) {
            toast.error('Failed to reset password');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (!token) {
            toast.error('Token is missing or invalid');
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        }

        if (error === 'invalid_token') {
            toast.error('Token is invalid or expired');
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        }
    }, [token, error, router]);

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-lg bg-white rounded-xl shadow-lg p-6 w-full space-y-8">
                    <div>
                        <h2 className=" text-center text-3xl font-extrabold text-gray-900">
                            Set new password
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Enter your new password below
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    New Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="New password"
                                    value={passwords.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Confirm new password"
                                    value={passwords.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>

                            {passwordError && (
                                <div className="text-sm text-red-600">{passwordError}</div>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </div>

                        <div className="text-sm text-center">
                            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Return to login
                            </Link>
                        </div>
                    </form>

                </div>
            </div>
        </>
    );
}

export default async function ResetPasswordPage() {
    return <>
        <Suspense fallback={<div className='flex items-center justify-center w-full h-screen'>Loading...</div>}>
            <ResetPassword />
        </Suspense>
    </>
}