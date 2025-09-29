import type React from "react"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"

interface DashboardLayoutProps {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="flex h-screen bg-[#f9fafb] overflow-hidden">
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Fixed Header */}
                <Header />

                {/* Scrollable Content Area */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-8">{children}</div>
                </main>
            </div>
        </div>
    )
}
