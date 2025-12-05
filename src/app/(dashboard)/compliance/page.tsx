"use client"

import { Suspense } from "react"
import { ComplianceDashboard } from '@/app/(dashboard)/compliance/compliance-dashboard'
import DynamicHeader from '@/components/DynamicHeader'
import LayoutSkeleton from '@/components/layout-skeleton'
import { LoadingFallback } from '@/components/loading-fallback'
// import { FileText } from 'lucide-react'

const page = () => {
    return (
        <LayoutSkeleton
            children={
                <Suspense fallback={<LoadingFallback />}>
                    <ComplianceDashboard />
                </Suspense>
            }

            header={<DynamicHeader
                maintext="Regulatory Compliance"
                para="Monitor and maintain regulatory compliance across all operations"
            // children={
            //     <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-center w-full gap-2 lg:gap-3">
            //         {/* Status Badge */}
            //         <div className="flex items-center justify-center gap-2 bg-green-50 text-green-700 px-3 sm:px-4 h-10 sm:h-11 rounded-lg">
            //             <span className="w-2.5 h-2.5 rounded-full bg-green-600 flex-shrink-0"></span>
            //             <span className="text-xs sm:text-sm font-medium truncate">All Systems Compliant</span>
            //         </div>

            //         {/* Generate Report Button */}
            //         <button className="flex items-center justify-center gap-1.5 sm:gap-2 bg-teal-700 hover:bg-teal-800 text-white px-4 sm:px-5 h-10 sm:h-11 rounded-lg transition text-sm">
            //             <FileText className="w-4 h-4 flex-shrink-0" />
            //             <span className="font-medium truncate">Generate Report</span>
            //         </button>
            //     </div>
            // }
            />}
        />
    )
}

export default page