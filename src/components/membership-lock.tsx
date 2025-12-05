"use client"

import type { ReactNode } from "react"
import { Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface MembershipLockProps {
  /** Whether the content should be locked */
  isLocked: boolean
  /** The content to be locked */
  children: ReactNode
  /** Custom title for the lock message */
  title?: string
  /** Custom description for the lock message */
  description?: string
  /** Custom action button text */
  actionText?: string
  /** Callback when action button is clicked */
  onAction?: () => void
  /** Custom className for the wrapper */
  className?: string
  /** Whether to blur the background content */
  blurBackground?: boolean
}

export function MembershipLock({
  isLocked,
  children,
  description = "Your membership has expired. Please upgrade to continue accessing this feature.",
  className,
  blurBackground = true,
}: MembershipLockProps) {
  if (!isLocked) {
    return <>{children}</>
  }

  return (
    <div className={cn("relative w-full", className)}>
      {/* Blurred content - maintains original dimensions */}
      <div className={cn("pointer-events-none select-none blur-md", blurBackground && "opacity-60")} aria-hidden="true">
        {children}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-lg z-10">
        {/* Lock icon */}
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <Lock className="w-6 h-6 text-gray-500" />
          </div>
        </div>

        {/* Description text */}
        <p className="text-sm text-gray-700 font-medium">{description}</p>
      </div>
    </div>
  )
}
