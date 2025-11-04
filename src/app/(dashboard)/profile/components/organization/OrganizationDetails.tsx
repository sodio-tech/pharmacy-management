"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ExternalLink } from "lucide-react"

export default function OrganizationDetails() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="xl:col-span-2 bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Organization Details</h2>
        <Button
          variant="outline"
          size="sm"
          className="text-[#0f766e] border-[#0f766e] hover:bg-[#0f766e]/5 bg-transparent w-full sm:w-auto"
          onClick={() => setIsEditing(!isEditing)}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Edit Details
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="pharmacy-name" className="text-sm font-medium text-gray-700">
              Pharmacy Name
            </Label>
            <Input
              id="pharmacy-name"
              defaultValue="Wilson's Care Pharmacy"
              disabled={!isEditing}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="license-number" className="text-sm font-medium text-gray-700">
              License Number
            </Label>
            <Input id="license-number" defaultValue="PH-2024-NY-8756" disabled={!isEditing} className="mt-1" />
          </div>
        </div>

        <div>
          <Label htmlFor="address" className="text-sm font-medium text-gray-700">
            Address
          </Label>
          <Input
            id="address"
            defaultValue="123 Healthcare Avenue, Medical District, New York, NY 10001"
            disabled={!isEditing}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Phone
            </Label>
            <Input id="phone" defaultValue="+1 (555) 123-4567" disabled={!isEditing} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input id="email" defaultValue="contact@wilsonspharmacy.com" disabled={!isEditing} className="mt-1" />
          </div>
        </div>
      </div>
    </div>
  )
}

