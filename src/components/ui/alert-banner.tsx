"use client"

import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AlertBannerProps {
  /** The message to display */
  message: string
  /** Days remaining (optional) */
  daysRemaining?: number
  /** Action button text */
  actionText?: string
  /** Callback when action button is clicked */
  onAction?: () => void
  /** Callback when close button is clicked */
  onClose?: () => void
  /** Variant of the alert */
  variant?: "warning" | "danger" | "info"
  /** Custom className */
  className?: string
}

export function AlertBanner({
  message,
  daysRemaining,
  actionText = "Upgrade Now",
  onAction,
  onClose,
  variant = "warning",
  className,
}: AlertBannerProps) {
  const variantStyles = {
    warning: "bg-gradient-to-r from-[#f97316] to-[#ea580c]",
    danger: "bg-gradient-to-r from-[#dc2626] to-[#b91c1c]",
    info: "bg-gradient-to-r from-[#0f766e] to-[#0d9488]",
  }

  return (
    <div className={cn("rounded-lg p-4 sm:p-6 text-white shadow-lg", variantStyles[variant], className)}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base sm:text-lg mb-1">
            {daysRemaining !== undefined ? `Free Trial Ending Soon!` : "Membership Expired"}
          </h3>
          <p className="text-sm sm:text-base opacity-95">
            {daysRemaining !== undefined
              ? `Your free trial expires in ${daysRemaining} ${daysRemaining === 1 ? "day" : "days"}. ${message}`
              : message}
          </p>
        </div>

        {/* Action button */}
        {onAction && (
          <Button
            onClick={onAction}
            variant="secondary"
            className="bg-white text-[#111827] hover:bg-white/90 font-semibold flex-shrink-0"
          >
            {actionText}
          </Button>
        )}

        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
            aria-label="Close banner"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}
