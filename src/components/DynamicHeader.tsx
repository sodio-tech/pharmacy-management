
import React from 'react'
const DynamicHeader = ({
    maintext = "Dashboard",
    para = "Welcome to your dashboard",
    children
}: {
    maintext?: string
    para?: string
    children?: React.ReactNode
}) => {
    return (
        <header className="bg-white border-b border-[#e5e7eb] px-8 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#111827]">{maintext}</h1>
                    <p className="text-[#6b7280] mt-1">{para}</p>
                </div>
                {children}
            </div>
        </header>

    )
}

export default DynamicHeader