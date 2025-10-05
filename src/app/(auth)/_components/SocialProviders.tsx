"use client"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { signIn } from "@/lib/auth-client"
import { DEFAULT_REDIRECT_PATH } from "@/app/utils/constants"
import { toast } from "react-toastify"
import { Loader2 } from "lucide-react"

const SocialProviders = () => {
    const [googleLoading, setGoogleLoading] = useState(false)
    const [microsoftLoading, setMicrosoftLoading] = useState(false)

    const handleSocialLogin = async (provider: "google" | "microsoft") => {
        try {
            if (provider === "google") {
                setGoogleLoading(true)
            } else {
                setMicrosoftLoading(true)
            }
            const { error } = await signIn.social(
                { provider, callbackURL: DEFAULT_REDIRECT_PATH },
            )
            if (error) {
                toast.error(error.message || "Something went wrong")
            } else {
                toast.success("Login successful!")
            }
        } catch (error: any) {
            toast.error(error.message || "Something went wrong")
        } finally {
            if (provider === "google") {
                setGoogleLoading(false)
            } else {
                setMicrosoftLoading(false)
            }
        }
    }

    return (
        <div className="mt-6 grid grid-cols-2 gap-4">
            <Button
                type="button"
                onClick={() => handleSocialLogin("google")}
                disabled={googleLoading}
                variant="outline"
                className="flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50"
            >
                {googleLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <FcGoogle className="w-5 h-5" />}
                <span className="text-gray-700">Google</span>
            </Button>
            <Button
                type="button"
                onClick={() => handleSocialLogin("microsoft")}
                variant="outline"
                disabled={microsoftLoading}
                className="flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50"
            >
                {microsoftLoading ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                    <svg className="w-5 h-5" viewBox="0 0 23 23" fill="none">
                        <path d="M11 0H0v11h11V0z" fill="#f25022" />
                        <path d="M23 0H12v11h11V0z" fill="#00a4ef" />
                        <path d="M11 12H0v11h11V12z" fill="#7fba00" />
                        <path d="M23 12H12v11h11V12z" fill="#ffb900" />
                    </svg>
                )}
                <span className="text-gray-700">Microsoft</span>
            </Button>
        </div>
    )
}

export default SocialProviders
