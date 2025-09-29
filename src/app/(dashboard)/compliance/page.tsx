import { ComplianceDashboard } from '@/components/compliance-dashboard'
import DynamicHeader from '@/components/DynamicHeader'
import LayoutSkeleton from '@/components/layout-skeleton'
import { FileText } from 'lucide-react'
import React from 'react'

const page = () => {
    return (
        <LayoutSkeleton
            children={
                <ComplianceDashboard />
            }

            header={<DynamicHeader
                maintext="Regulatory Compliance"
                para="Monitor and maintain regulatory compliance across all operations"
                children={<div className="flex items-center gap-4">
                    {/* Status Badge */}
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-600"></span>
                        <span className="text-sm font-medium">All Systems Compliant</span>
                    </div>

                    {/* Generate Report Button */}
                    <button className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white px-5 py-2 rounded-lg transition">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm font-medium">Generate Report</span>
                    </button>
                </div>}
            />}
        />
    )
}

export default page