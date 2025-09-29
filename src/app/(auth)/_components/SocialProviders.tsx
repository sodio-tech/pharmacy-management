import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { signIn } from '@/auth-client'
import { DEFAULT_REDIRECT_PATH } from '@/app/utils/constants'
import { toast } from 'react-toastify'
import { Loader2 } from 'lucide-react'

const SocialProviders = () => {
    const [googleLoading, setGoogleLoading] = useState(false)
    const [githubLoading, setGithubLoading] = useState(false)

    const handleSocialLogin = async (provider: "google" | "github") => {
        try {
            if (provider === "google") {
                setGoogleLoading(true)
            } else {
                setGithubLoading(true)
            }
            const { error } = await signIn.social({ provider, callbackURL: DEFAULT_REDIRECT_PATH }, {
                body: {
                    username: "testusername"
                }
            })
            if (error) {
                toast.error(error.message)
            } else {
                toast.success("Login successful")
            }
        } catch (error) {
            console.log(error)
        } finally {
            if (provider === "google") {
                setGoogleLoading(false)
            } else {
                setGithubLoading(false)
            }
        }
    }

    return (
        <div className="mt-6 grid grid-cols-2 gap-4">
            <Button
                type="button"
                onClick={() => handleSocialLogin("google")}
                disabled={googleLoading}
                className="flex bg-blue-500 hover:bg-blue-400 text-white items-center justify-center gap-2"
            >
                {googleLoading ? <Loader2 className="animate-spin" /> : <FcGoogle />}
                Google
            </Button>
            <Button
                type="button"
                onClick={() => handleSocialLogin("github")}
                variant="outline"
                disabled={githubLoading}
                className="flex items-center justify-center gap-2"
            >
                {githubLoading ? <Loader2 className="animate-spin" /> : <FaGithub />}
                GitHub
            </Button>
        </div>
    )
}

export default SocialProviders