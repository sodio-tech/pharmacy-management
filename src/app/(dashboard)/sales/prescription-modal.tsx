"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Upload, X } from "lucide-react"
import { toast } from "react-toastify"

interface Prescription {
  prescription?: File
  prescription_notes?: string
  doctor_name?: string
  doctor_contact?: string
}

interface PrescriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (prescription: Prescription) => void
  existingPrescription?: Prescription | null
}

export function PrescriptionModal({ isOpen, onClose, onSave, existingPrescription }: PrescriptionModalProps) {
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null)
  const [prescriptionNotes, setPrescriptionNotes] = useState("")
  const [doctorName, setDoctorName] = useState("")
  const [doctorContact, setDoctorContact] = useState("")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Helper function to remove "Dr." prefix if present
  const removeDrPrefix = (name: string): string => {
    if (!name) return ""
    return name.trim().replace(/^Dr\.?\s*/i, "")
  }

  // Helper function to add "Dr." prefix
  const addDrPrefix = (name: string): string => {
    if (!name.trim()) return ""
    const cleanedName = removeDrPrefix(name)
    return cleanedName ? `Dr. ${cleanedName}` : ""
  }

  useEffect(() => {
    if (existingPrescription) {
      setPrescriptionFile(existingPrescription.prescription || null)
      setPrescriptionNotes(existingPrescription.prescription_notes || "")
      // Remove "Dr." prefix when loading existing data to avoid duplication
      setDoctorName(removeDrPrefix(existingPrescription.doctor_name || ""))
      setDoctorContact(existingPrescription.doctor_contact || "")
    } else {
      setPrescriptionFile(null)
      setPrescriptionNotes("")
      setDoctorName("")
      setDoctorContact("")
      setPreviewUrl(null)
    }
  }, [existingPrescription, isOpen])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB")
        return
      }

      setPrescriptionFile(file)

      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleRemoveFile = () => {
    setPrescriptionFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSave = () => {
    // All fields are optional, so we just save whatever is provided
    const prescriptionData: Prescription = {}

    if (prescriptionFile) {
      prescriptionData.prescription = prescriptionFile
    }
    if (prescriptionNotes.trim()) {
      prescriptionData.prescription_notes = prescriptionNotes.trim()
    }
    if (doctorName.trim()) {
      // Add "Dr." prefix when saving
      prescriptionData.doctor_name = addDrPrefix(doctorName.trim())
    }
    if (doctorContact.trim()) {
      prescriptionData.doctor_contact = doctorContact.trim()
    }

    onSave(prescriptionData)
    toast.success("Prescription details saved")
    onClose()
  }

  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-teal-600" />
            {existingPrescription ? "Edit Prescription" : "Add Prescription"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Prescription Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="prescription" className="text-sm font-medium">
              Prescription Image <span className="text-muted-foreground text-xs">(Optional)</span>
            </Label>

            {previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl || "/placeholder.svg"}
                  alt="Prescription preview"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-teal-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-1">Click to upload prescription image</p>
                <p className="text-xs text-muted-foreground">PNG, JPG or JPEG (max. 5MB)</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              id="prescription"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Prescription Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Prescription Notes <span className="text-muted-foreground text-xs">(Optional)</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Enter any prescription notes or instructions..."
              value={prescriptionNotes}
              onChange={(e) => setPrescriptionNotes(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Doctor Name */}
          <div className="space-y-2">
            <Label htmlFor="doctor-name" className="text-sm font-medium">
              Doctor Name <span className="text-muted-foreground text-xs">(Optional)</span>
            </Label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-500 font-medium pointer-events-none">Dr.</span>
              <Input
                id="doctor-name"
                placeholder="Enter doctor's name"
                value={doctorName}
                onChange={(e) => {
                  // Remove "Dr." if user tries to type it
                  const value = e.target.value.replace(/^Dr\.?\s*/i, "")
                  setDoctorName(value)
                }}
                className="pl-10"
              />
            </div>
          </div>

          {/* Doctor Contact */}
          <div className="space-y-2">
            <Label htmlFor="doctor-contact" className="text-sm font-medium">
              Doctor Contact <span className="text-muted-foreground text-xs">(Optional)</span>
            </Label>
            <Input
              id="doctor-contact"
              placeholder="Enter doctor's contact number"
              value={doctorContact}
              onChange={(e) => setDoctorContact(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700">
            Save Prescription
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
