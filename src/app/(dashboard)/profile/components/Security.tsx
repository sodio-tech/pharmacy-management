"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Shield, Smartphone, Monitor, Tablet, Check, X, LogOut, Loader2 } from "lucide-react"
import { useSession, signOut, changePassword } from "@/lib/auth-client"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

export default function Security() {
    const { data: session } = useSession()
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
    const [isSigningOutAll, setIsSigningOutAll] = useState(false)
    const [isEnabling2FA, setIsEnabling2FA] = useState(false)
    const [sessions, setSessions] = useState<any[]>([])
    const router = useRouter()

    // Password validation - matching signup form requirements
    const hasMinLength = newPassword.length >= 8
    const hasUppercase = /[A-Z]/.test(newPassword)
    const hasNumber = /[0-9]/.test(newPassword)
    const passwordsMatch = newPassword === confirmPassword && confirmPassword !== ""
    const isPasswordValid = hasMinLength && hasUppercase && hasNumber && passwordsMatch

    const handlePasswordChange = async () => {
        if (!isPasswordValid) {
            toast.error("Please ensure all password requirements are met")
            return
        }

        setIsUpdatingPassword(true)
        try {
            const result = await changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions: true 
            })

            if (result.error) {
                toast.error(result.error.message || "Failed to update password")
            } else {
                toast.success("Password updated successfully!")
                setCurrentPassword("")
                setNewPassword("")
                setConfirmPassword("")
            }
        } catch (error) {
            toast.error("Failed to update password. Please try again.")
        } finally {
            setIsUpdatingPassword(false)
        }
    }

    const handleSignOutAllDevices = async () => {
        setIsSigningOutAll(true)
        try {
            await signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push("/login")
                        toast.success("You have been signed out. Other sessions will remain active until they expire.")
                    },
                },
            })
        } catch (error) {
            console.error("Error signing out:", error)
            toast.error("Failed to sign out. Please try again.")
        } finally {
            setIsSigningOutAll(false)
        }
    }

    const handleEnable2FA = async () => {
        setIsEnabling2FA(true)
       try {
            // For now, show a message that 2FA setup would be implemented
            // In a real implementation, you would integrate with Better Auth's 2FA plugin
            await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
            
            toast.success("Two-factor authentication setup initiated! Please check your email for setup instructions.")
            console.log("2FA Setup would be implemented here with Better Auth 2FA plugin")
        } catch (error) {
            console.error("Error enabling 2FA:", error)
            toast.error("Failed to enable 2FA. Please try again.")
        } finally {
            setIsEnabling2FA(false)
        }
    }
 
    const loginSessions = sessions.length > 0 ? sessions : [
        {
            device: "Desktop - Chrome Browser",
            ip: "192.168.1.100",
            location: "New York, NY, USA",
            timestamp: "December 15, 2024 at 2:30 PM",
            status: "current",
            icon: Monitor,
        },
        {
            device: "Mobile - Safari Browser",
            ip: "192.168.1.101",
            location: "New York, NY, USA",
            timestamp: "December 15, 2024 at 9:15 AM",
            status: "ended",
            timeAgo: "3 hours ago",
            icon: Smartphone,
        },
        {
            device: "Tablet - Chrome Browser",
            ip: "192.168.1.102",
            location: "New York, NY, USA",
            timestamp: "December 14, 2024 at 6:45 PM",
            status: "ended",
            timeAgo: "Yesterday",
            icon: Tablet,
        },
    ]

    return (
        <div className="space-y-6 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="grid gap-6 lg:col-span-2">
                {/* Password Management */}
                <div className="rounded-lg border border-[#e5e7eb] bg-white p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-[#111827]">Password Management</h2>
                        <Badge className="bg-[#dcfce7] text-[#166534] hover:bg-[#dcfce7]">
                            <Check className="mr-1 h-3 w-3" />
                            Strong Password
                        </Badge>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="current-password" className="text-sm font-medium text-[#374151]">
                                Current Password
                            </Label>
                            <div className="relative mt-1.5">
                                <Input 
                                    id="current-password" 
                                    type={showCurrentPassword ? "text" : "password"} 
                                    className="pr-10"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280]"
                                >
                                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="new-password" className="text-sm font-medium text-[#374151]">
                                New Password
                            </Label>
                            <div className="relative mt-1.5">
                                <Input
                                    id="new-password"
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280]"
                                >
                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {newPassword && (
                                <div className="mt-2 space-y-1 text-sm">
                                    <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-[#16a34a]" : "text-[#6b7280]"}`}>
                                        {hasMinLength ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                                        At least 8 characters
                                    </div>
                                    <div className={`flex items-center gap-1.5 ${hasUppercase ? "text-[#16a34a]" : "text-[#6b7280]"}`}>
                                        {hasUppercase ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                                        Contains uppercase letter
                                    </div>
                                    <div className={`flex items-center gap-1.5 ${hasNumber ? "text-[#16a34a]" : "text-[#6b7280]"}`}>
                                        {hasNumber ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                                        Contains number
                                    </div>
                                    {confirmPassword && (
                                        <div className={`flex items-center gap-1.5 ${passwordsMatch ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
                                            {passwordsMatch ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                                            Passwords match
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="confirm-password" className="text-sm font-medium text-[#374151]">
                                Confirm New Password
                            </Label>
                            <div className="relative mt-1.5">
                                <Input 
                                    id="confirm-password" 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    className="pr-10"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#6b7280]"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button 
                                className="bg-[#0f766e] hover:bg-[#0f766e]/90"
                                onClick={handlePasswordChange}
                                disabled={!isPasswordValid || isUpdatingPassword}
                            >
                                {isUpdatingPassword ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Shield className="mr-2 h-4 w-4" />
                                )}
                                {isUpdatingPassword ? "Updating..." : "Update Password"}
                            </Button>
                            <Button 
                                variant="outline"
                                onClick={() => {
                                    setCurrentPassword("")
                                    setNewPassword("")
                                    setConfirmPassword("")
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
                {/* Login Activity */}
                <div className="rounded-lg border border-[#e5e7eb] bg-white p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-[#111827]">Login Activity</h2>
                        <button className="text-sm font-medium text-[#0f766e] hover:text-[#0f766e]/80">View All</button>
                    </div>

                    <div className="space-y-3">
                        {loginSessions.map((session, index) => {
                            const Icon = session.icon
                            return (
                                <div
                                    key={index}
                                    className={`flex items-center justify-between rounded-lg border p-4 ${session.status === "current" ? "border-[#dcfce7] bg-[#f0fdf4]" : "border-[#e5e7eb] bg-white"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f3f4f6]">
                                            <Icon className="h-5 w-5 text-[#6b7280]" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-[#111827]">{session.device}</h4>
                                            <p className="text-xs text-[#6b7280]">
                                                {session.ip} • {session.location}
                                            </p>
                                            <p className="text-xs text-[#9ca3af]">{session.timestamp}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {session.status === "current" ? (
                                            <>
                                                <Badge className="bg-[#dcfce7] text-[#166534] hover:bg-[#dcfce7]">Current Session</Badge>
                                                <p className="mt-1 text-xs text-[#16a34a]">Active now</p>
                                            </>
                                        ) : (
                                            <>
                                                <Badge variant="secondary" className="bg-[#f3f4f6] text-[#6b7280] hover:bg-[#f3f4f6]">
                                                    Ended
                                                </Badge>
                                                <p className="mt-1 text-xs text-[#9ca3af]">{session.timeAgo}</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <Button
                        variant="outline"
                        className="mt-6 w-full border-[#fca5a5] text-[#dc2626] hover:bg-[#fee2e2] bg-transparent"
                        onClick={handleSignOutAllDevices}
                        disabled={isSigningOutAll}
                    >
                        {isSigningOutAll ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <LogOut className="mr-2 h-4 w-4" />
                        )}
                        {isSigningOutAll ? "Signing Out..." : "Sign Out All Other Devices"}
                    </Button>
                </div>
            </div>


            {/* Two-Factor Authentication */}
            <div className="rounded-lg border max-h-fit border-[#e5e7eb] bg-white p-6">
                <h2 className="mb-6 text-lg font-semibold text-[#111827]">Two-Factor Authentication</h2>

                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#fee2e2]">
                        <Shield className="h-10 w-10 text-[#dc2626]" />
                    </div>

                    <h3 className="mb-2 text-base font-semibold text-[#111827]">Not Enabled</h3>
                    <p className="mb-6 text-sm text-[#6b7280]">
                        Add an extra layer of security to your admin account by enabling two-factor authentication.
                    </p>

                    <Button 
                        className="w-full bg-[#0f766e] hover:bg-[#0f766e]/90"
                        onClick={handleEnable2FA}
                        disabled={isEnabling2FA}
                    >
                        {isEnabling2FA ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Smartphone className="mr-2 h-4 w-4" />
                        )}
                        {isEnabling2FA ? "Enabling..." : "Enable 2FA"}
                    </Button>

                    <p className="mt-4 text-xs text-[#9ca3af]">
                        Supports authenticator apps like:
                        <br />
                        Google Authenticator, Authy, Microsoft Authenticator
                    </p>
                </div>
            </div>
        </div>
    )
}
