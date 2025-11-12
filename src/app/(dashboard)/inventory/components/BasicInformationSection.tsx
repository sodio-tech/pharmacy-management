"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface BasicInformationSectionProps {
  formData: {
    name: string
    generic_name: string
    manufacturer: string
    description: string
    requires_prescription: boolean
  }
  onInputChange: (field: string, value: any) => void
}

export function BasicInformationSection({ formData, onInputChange }: BasicInformationSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <span className="w-1.5 h-6 bg-teal-600 rounded-full"></span>
        Basic Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Product Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onInputChange("name", e.target.value)}
            placeholder="e.g., Paracetamol 500mg"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="generic_name" className="text-sm font-medium">
            Generic Name
          </Label>
          <Input
            id="generic_name"
            value={formData.generic_name}
            onChange={(e) => onInputChange("generic_name", e.target.value)}
            placeholder="e.g., Acetaminophen"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="manufacturer" className="text-sm font-medium">
            Manufacturer
          </Label>
          <Input
            id="manufacturer"
            value={formData.manufacturer}
            onChange={(e) => onInputChange("manufacturer", e.target.value)}
            placeholder="e.g., Pfizer Inc."
            className="mt-1.5"
          />
        </div>

        <div className="flex items-center space-x-2 pt-6">
          <input
            type="checkbox"
            id="requires_prescription"
            checked={formData.requires_prescription}
            onChange={(e) => onInputChange("requires_prescription", e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
          />
          <Label htmlFor="requires_prescription" className="text-sm font-medium cursor-pointer">
            Requires Prescription
          </Label>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => onInputChange("description", e.target.value)}
            placeholder="Product description, usage instructions, etc."
            rows={3}
            className="mt-1.5 resize-none"
          />
        </div>
      </div>
    </div>
  )
}

