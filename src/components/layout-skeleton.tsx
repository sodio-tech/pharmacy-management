"use client"

import type React from "react"
import { useMemo } from "react"
import { AlertBanner } from "@/components/ui/alert-banner"
import { useUser } from "@/contexts/UserContext"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { setTrialBannerHidden } from "@/store/slices/uiSlice"

type LayoutSkeletonProps = {
  header?: React.ReactNode
  children: React.ReactNode
}

const LayoutSkeleton = ({ header, children }: LayoutSkeletonProps) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  
  // Get banner visibility state from Redux
  const isTrialBannerHidden = useAppSelector((state) => state.ui.isTrialBannerHidden)
  const showTrialBanner = !isTrialBannerHidden

  const trialDaysRemaining = 3
  const isMembershipExpired = useAppSelector((state) => state.ui.isMembershipExpired)


  const handleUpgrade = () => {
    // Navigate to pricing/subscription page
    router.push("/pricing")
  }

  const handleCloseBanner = () => {
    // Update Redux state (which will also persist to localStorage)
    dispatch(setTrialBannerHidden(true))
  }

  return (
    <div className="flex flex-col min-h-full">
      {header && <div className="sticky top-0 z-10 bg-white">{header}</div>}
{/* 
     
      <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8 pt-4 pb-2 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto">
          {showTrialBanner && trialDaysRemaining > 0 && !isMembershipExpired && (
            <AlertBanner
              message="Upgrade now to continue using PharmaCare."
              daysRemaining={trialDaysRemaining}
              actionText="Upgrade Now"
              onAction={handleUpgrade}
              onClose={handleCloseBanner}
              variant="warning"
            />
          )}
         
          {isMembershipExpired && (
            <AlertBanner
              message="Please upgrade your membership to continue accessing all features."
              onAction={handleUpgrade}
              variant="danger"
            />
          )}
        </div>
      </div> */}

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
    </div>
  )
}

export default LayoutSkeleton
