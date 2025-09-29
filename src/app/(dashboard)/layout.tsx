import type React from "react"
import Sidebar from "@/components/Sidebar"

interface DashboardLayoutProps {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="flex h-screen bg-[#f9fafb] overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {children}
            </div>
        </div>
    )
}
