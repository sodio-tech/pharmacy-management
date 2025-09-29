import { Bell, ChevronDown, Search } from 'lucide-react'
import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

const Header = () => {
    return (
        <header className="bg-white border-b border-[#e5e7eb] px-8 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#111827]">Pharmacy Dashboard</h1>
                    <p className="text-[#6b7280] mt-1">Welcome back, manage your pharmacy operations</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9ca3af] w-4 h-4" />
                        <Input placeholder="Search medicines, orders..." className="pl-10 w-80 bg-[#f9fafb] border-[#e5e7eb]" />
                    </div>
                    <div className="relative">
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="w-5 h-5 text-[#6b7280]" />
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#dc2626] text-white text-xs rounded-full flex items-center justify-center">
                                3
                            </span>
                        </Button>
                    </div>
                    <div className="flex items-center gap-2 text-[#6b7280]">
                        <span>Branch: Main Store</span>
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </header>

    )
}

export default Header