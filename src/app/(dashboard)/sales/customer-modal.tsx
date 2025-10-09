"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Upload, Camera, User, Phone, Mail, Stethoscope, FileText } from "lucide-react"
import { toast } from "react-toastify"

interface CustomerData {
  id: string
  patientName: string
  patientPhone: string
  patientEmail: string
  doctorName: string
  doctorLicense?: string
  doctorPhone?: string
  prescriptionPhoto?: string
  prescriptionText?: string
  createdAt: string
}

interface CustomerModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (customerData: CustomerData) => void
  existingCustomer?: CustomerData | null
}

export function CustomerModal({ isOpen, onClose, onSave, existingCustomer }: CustomerModalProps) {
  const [formData, setFormData] = useState({
    patientName: existingCustomer?.patientName || "",
    patientPhone: existingCustomer?.patientPhone || "",
    patientEmail: existingCustomer?.patientEmail || "",
    doctorName: existingCustomer?.doctorName || "",
    doctorLicense: existingCustomer?.doctorLicense || "",
    doctorPhone: existingCustomer?.doctorPhone || "",
    prescriptionText: existingCustomer?.prescriptionText || ""
  })

  const [prescriptionPhoto, setPrescriptionPhoto] = useState<string | null>(existingCustomer?.prescriptionPhoto || null)
  const [isUploading, setIsUploading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    setIsUploading(true)
    try {
      // Convert to base64 for demo purposes
      // In production, you would upload to S3 or your preferred storage
      const reader = new FileReader()
      reader.onload = (e) => {
        setPrescriptionPhoto(e.target?.result as string)
        setIsUploading(false)
        toast.success('Prescription photo uploaded successfully')
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading photo:', error)
      toast.error('Failed to upload photo')
      setIsUploading(false)
    }
  }

  const handleSave = () => {
    // Validate required fields
    if (!formData.patientName.trim()) {
      toast.error('Patient name is required')
      return
    }
    if (!formData.patientPhone.trim()) {
      toast.error('Patient phone number is required')
      return
    }
    if (!formData.doctorName.trim()) {
      toast.error('Doctor name is required')
      return
    }

    const customerData: CustomerData = {
      id: existingCustomer?.id || `customer_${Date.now()}`,
      patientName: formData.patientName.trim(),
      patientPhone: formData.patientPhone.trim(),
      patientEmail: formData.patientEmail.trim(),
      doctorName: formData.doctorName.trim(),
      doctorLicense: formData.doctorLicense.trim(),
      doctorPhone: formData.doctorPhone.trim(),
      prescriptionPhoto: prescriptionPhoto || undefined,
      prescriptionText: formData.prescriptionText.trim(),
      createdAt: existingCustomer?.createdAt || new Date().toISOString()
    }

    onSave(customerData)
    toast.success('Customer information saved successfully')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">
            {existingCustomer ? 'Edit Customer' : 'Add New Customer'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Patient Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-teal-600" />
              <h3 className="text-lg font-semibold">Patient Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name *</Label>
                <Input
                  id="patientName"
                  value={formData.patientName}
                  onChange={(e) => handleInputChange('patientName', e.target.value)}
                  placeholder="Enter patient name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="patientPhone">Phone Number *</Label>
                <Input
                  id="patientPhone"
                  value={formData.patientPhone}
                  onChange={(e) => handleInputChange('patientPhone', e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="patientEmail">Email Address</Label>
                <Input
                  id="patientEmail"
                  type="email"
                  value={formData.patientEmail}
                  onChange={(e) => handleInputChange('patientEmail', e.target.value)}
                  placeholder="patient@example.com"
                />
              </div>
            </div>
          </div>

          {/* Doctor Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Stethoscope className="h-5 w-5 text-teal-600" />
              <h3 className="text-lg font-semibold">Doctor Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doctorName">Doctor Name *</Label>
                <Input
                  id="doctorName"
                  value={formData.doctorName}
                  onChange={(e) => handleInputChange('doctorName', e.target.value)}
                  placeholder="Dr. John Smith"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="doctorLicense">License Number</Label>
                <Input
                  id="doctorLicense"
                  value={formData.doctorLicense}
                  onChange={(e) => handleInputChange('doctorLicense', e.target.value)}
                  placeholder="MD12345"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="doctorPhone">Doctor Phone</Label>
                <Input
                  id="doctorPhone"
                  value={formData.doctorPhone}
                  onChange={(e) => handleInputChange('doctorPhone', e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>

          {/* Prescription Photo */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Camera className="h-5 w-5 text-teal-600" />
              <h3 className="text-lg font-semibold">Prescription Photo</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="prescriptionPhoto"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  {prescriptionPhoto ? (
                    <div className="relative w-full h-full">
                      <img
                        src={prescriptionPhoto}
                        alt="Prescription"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          setPrescriptionPhoto(null)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> prescription photo
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                    </div>
                  )}
                  <input
                    id="prescriptionPhoto"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Prescription Notes */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-teal-600" />
              <h3 className="text-lg font-semibold">Prescription Notes</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="prescriptionText">Additional Notes</Label>
              <Textarea
                id="prescriptionText"
                value={formData.prescriptionText}
                onChange={(e) => handleInputChange('prescriptionText', e.target.value)}
                placeholder="Enter any additional prescription notes or instructions..."
                rows={3}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700">
              {existingCustomer ? 'Update Customer' : 'Save Customer'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
