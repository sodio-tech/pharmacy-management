"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type PrescriptionStatus = "UPLOADED" | "PENDING_VALIDATION" | "VALIDATED" | "REJECTED"

export interface DashboardPrescription {
  id: string
  patientName: string
  status: PrescriptionStatus
  amount?: number
  itemCount: number
  prescription_link?: string
}

interface RecentPrescriptionsProps {
  prescriptions: DashboardPrescription[]
}

export function RecentPrescriptions({ prescriptions }: RecentPrescriptionsProps) {
  const router = useRouter()

  return (
    <Card className="bg-white border-[#e5e7eb] h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl font-semibold text-[#111827]">Recent Prescriptions</CardTitle>
        <Button 
          onClick={() => router.push("/prescriptions")}
          variant="ghost" 
          className="text-[#0f766e] hover:text-[#0f766e]/80 text-sm sm:text-base"
        >
          View All
        </Button>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 flex-1">
        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-[#f9fafb] rounded-lg"
            >
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                {prescription.prescription_link ? (
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                    <AvatarImage src={prescription.prescription_link} alt={`Prescription ${prescription.id}`} className="object-cover" />
                    <AvatarFallback className="text-white font-bold text-sm sm:text-base bg-[#6b7280]">
                      Rx
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div
                    className={cn(
                      "w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0",
                      "bg-[#6b7280]",
                    )}
                  >
                    <span className="text-white font-bold text-sm sm:text-base">Rx</span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#111827] text-sm sm:text-base truncate">
                    Prescription ID: {prescription.id}
                  </p>
                  <p className="text-xs sm:text-sm text-[#6b7280]">Patient: {prescription.patientName}</p>
                </div>
              </div>
            </div>
          ))}
          {prescriptions.length === 0 && (
            <div className="text-center py-8 text-[#6b7280] text-sm sm:text-base">No recent prescriptions</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

