import React from 'react'
import BrandingPanel from '../_components/BrandingPanel'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-screen flex bg-gray-50 fixed w-screen overflow-hidden">
            <BrandingPanel />
            <div className="flex-1 h-screen overflow-y-auto">
                <div className="min-h-full flex items-center justify-center p-6 lg:p-12">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default AuthLayout