import type React from "react"

interface LoadingFallbackProps {
  message?: string
  fullHeight?: boolean
  variant?: "default" | "compact" | "minimal"
}

export function LoadingFallback({ 
  message = "Loading...", 
  fullHeight = false,
  variant = "default"
}: LoadingFallbackProps) {
  const containerClass = fullHeight 
    ? "flex items-center justify-center min-h-screen" 
    : "flex items-center justify-center h-64"
  
  if (variant === "minimal") {
    return (
      <div className={containerClass}>
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#0f766e] border-t-transparent"></div>
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <div className={containerClass}>
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0f766e] border-t-transparent"></div>
          <p className="text-sm text-[#6b7280]">{message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0f766e] border-t-transparent"></div>
        <p className="text-[#6b7280] font-medium">{message}</p>
      </div>
    </div>
  )
}

