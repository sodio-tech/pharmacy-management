import type React from "react"

type LayoutSkeletonProps = {
  header?: React.ReactNode
  children: React.ReactNode
}

const LayoutSkeleton = ({ header, children }: LayoutSkeletonProps) => {
  return (
    <div className="flex flex-col min-h-full">
      {header && <div className="sticky top-0 z-10 bg-white">{header}</div>}

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
    </div>
  )
}

export default LayoutSkeleton
