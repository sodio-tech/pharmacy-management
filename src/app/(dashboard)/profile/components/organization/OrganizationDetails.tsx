"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ExternalLink, Loader2, Save, X } from "lucide-react"
import { backendApi } from "@/lib/axios-config"
import { toast } from "react-toastify"

interface OrganizationData {
  pharmacy_name: string
  license_number: string
  address: string
  phone_number: string
  email: string
  gstin: string
  pan: string
}

export default function OrganizationDetails() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<OrganizationData>({
    pharmacy_name: "",
    license_number: "",
    address: "",
    phone_number: "",
    email: "",
    gstin: "",
    pan: "",
  })

  // Fetch organization profile data
  useEffect(() => {
    const fetchOrganizationProfile = async () => {
      try {
        setIsLoading(true)
        const response = await backendApi.get("/v1/org/profile")
        
        if (response.data?.success && response.data?.data) {
          const data = response.data.data
          setFormData({
            pharmacy_name: data.pharmacy_name || "",
            license_number: data.license_number || "",
            address: data.address || "",
            phone_number: data.phone_number || "",
            email: data.email || "",
            gstin: data.gstin || "",
            pan: data.pan || "",
          })
        }
      } catch (error: any) {
        console.error("Error fetching organization profile:", error)
        toast.error(
          error.response?.data?.message || "Failed to fetch organization details"
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrganizationProfile()
  }, [])

  const handleInputChange = (field: keyof OrganizationData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      // Prepare payload according to API specification
      const payload: any = {}
      
      if (formData.pharmacy_name) payload.pharmacy_name = formData.pharmacy_name
      if (formData.license_number) payload.license_number = formData.license_number
      if (formData.address) payload.address = formData.address
      if (formData.phone_number) payload.phone_number = formData.phone_number
      if (formData.email) payload.email = formData.email
      if (formData.gstin) payload.gstin = formData.gstin
      if (formData.pan) payload.pan = formData.pan

      const response = await backendApi.put("/v1/org/profile", payload)
      
      if (response.data?.success) {
        toast.success("Organization details updated successfully!")
        setIsEditing(false)
        // Optionally refetch to get updated data
        const refreshResponse = await backendApi.get("/v1/org/profile")
        if (refreshResponse.data?.success && refreshResponse.data?.data) {
          const data = refreshResponse.data.data
          setFormData({
            pharmacy_name: data.pharmacy_name || "",
            license_number: data.license_number || "",
            address: data.address || "",
            phone_number: data.phone_number || "",
            email: data.email || "",
            gstin: data.gstin || "",
            pan: data.pan || "",
          })
        }
      }
    } catch (error: any) {
      console.error("Error updating organization profile:", error)
      toast.error(
        error.response?.data?.message || "Failed to update organization details"
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Refetch original data
    const fetchOriginalData = async () => {
      try {
        const response = await backendApi.get("/v1/org/profile")
        if (response.data?.success && response.data?.data) {
          const data = response.data.data
          setFormData({
            pharmacy_name: data.pharmacy_name || "",
            license_number: data.license_number || "",
            address: data.address || "",
            phone_number: data.phone_number || "",
            email: data.email || "",
            gstin: data.gstin || "",
            pan: data.pan || "",
          })
        }
      } catch (error) {
        console.error("Error fetching original data:", error)
      }
    }
    fetchOriginalData()
  }

  if (isLoading) {
    return (
      <div className="xl:col-span-2 bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[#0f766e]" />
        </div>
      </div>
    )
  }

  return (
    <div className="xl:col-span-2 bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Organization Details</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="text-gray-700 border-gray-300 hover:bg-gray-50 bg-transparent w-full sm:w-auto"
                onClick={handleCancel}
                disabled={isSaving}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-[#0f766e] hover:bg-[#0f766e]/90 text-white w-full sm:w-auto"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="text-[#0f766e] border-[#0f766e] hover:bg-[#0f766e]/5 bg-transparent w-full sm:w-auto"
              onClick={() => setIsEditing(true)}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Edit Details
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="pharmacy-name" className="text-sm font-medium text-gray-700">
              Pharmacy Name
            </Label>
            <Input
              id="pharmacy-name"
              value={formData.pharmacy_name}
              onChange={(e) => handleInputChange("pharmacy_name", e.target.value)}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="license-number" className="text-sm font-medium text-gray-700">
              License Number
            </Label>
            <Input
              id="license-number"
              value={formData.license_number}
              onChange={(e) => handleInputChange("license_number", e.target.value)}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address" className="text-sm font-medium text-gray-700">
            Address
          </Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            disabled={!isEditing}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Phone
            </Label>
            <Input
              id="phone"
              value={formData.phone_number}
              onChange={(e) => handleInputChange("phone_number", e.target.value)}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="gstin" className="text-sm font-medium text-gray-700">
              GSTIN
            </Label>
            <Input
              id="gstin"
              value={formData.gstin}
              onChange={(e) => handleInputChange("gstin", e.target.value)}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="pan" className="text-sm font-medium text-gray-700">
              PAN
            </Label>
            <Input
              id="pan"
              value={formData.pan}
              onChange={(e) => handleInputChange("pan", e.target.value)}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

