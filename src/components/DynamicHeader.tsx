import type React from "react"
const DynamicHeader = ({
  maintext = "Dashboard",
  para = "Welcome to your dashboard",
  children,
}: {
  maintext?: string
  para?: string
  children?: React.ReactNode
}) => {
  return (
    <header className="bg-white border-b border-[#e5e7eb] px-4 sm:px-6 lg:px-8 py-4 flex-shrink-0">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="pl-12 lg:pl-0">
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827]">{maintext}</h1>
          <p className="text-sm sm:text-base text-[#6b7280] mt-1">{para}</p>
        </div>
        {children && <div className="flex-shrink-0">{children}</div>}
      </div>
    </header>
  )
}

export default DynamicHeader
