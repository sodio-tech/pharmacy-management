import DynamicHeader from '@/components/DynamicHeader'
import LayoutSkeleton from '@/components/layout-skeleton'
import { Button } from '@/components/ui/button'
import { Download, Scan, Upload } from 'lucide-react'
import React from 'react'
import PrescriptionContent from './prescription-content'

const page = () => {
    return (
        <LayoutSkeleton
            header={
                <DynamicHeader
                    maintext="Prescription Management"
                    para="Manage patient prescriptions and medication orders"
                    children={
                        <div className="flex items-center gap-3">
                            <Button className="bg-[#0f766e] hover:bg-[#0d6660] text-white gap-2">
                                <Upload className="w-4 h-4" />
                                Upload Prescription
                            </Button>
                            <Button className="bg-[#14b8a6] hover:bg-[#0f9488] text-white gap-2">
                                <Scan className="w-4 h-4" />
                                Scan Prescription
                            </Button>
                            <Button className="bg-[#06b6d4] hover:bg-[#0891b2] text-white gap-2">
                                <Download className="w-4 h-4" />
                                Export
                            </Button>
                        </div>
                    }
                />
            }
        >
            <PrescriptionContent />
        </LayoutSkeleton>
    )
}

export default page