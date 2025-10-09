"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileImage, FileText, Scan, X, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  PrescriptionUploadProps, 
  CreatePrescriptionMedicationRequest,
  ExtractedMedication,
  OCRResult 
} from "./types";

interface Medication extends CreatePrescriptionMedicationRequest {
  // No id field - backend will generate it
}

export function PrescriptionUpload({ onUpload, onCancel, loading = false }: PrescriptionUploadProps) {
  const [step, setStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    patient_name: "Sarah Johnson",
    patient_phone: "+1 (555) 123-4567",
    patient_email: "sarah.johnson@email.com",
    patient_dob: "1985-03-15",
    patient_address: "123 Oak Street, Springfield, IL 62701",
    doctor_name: "Dr. Michael Chen",
    doctor_license: "MD123456789",
    doctor_phone: "+1 (555) 987-6543",
    doctor_specialty: "Internal Medicine",
    clinic_name: "Springfield Medical Center",
    type: "IMAGE" as "IMAGE" | "PDF" | "SCANNED"
  });
  const [medications, setMedications] = useState<Medication[]>([
    {
      medication_name: "Lisinopril",
      generic_name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      duration: "30 days",
      instructions: "Take with food in the morning",
      quantity: 30,
      unit: "tablets",
      substitution_allowed: true
    },
    {
      medication_name: "Metformin",
      generic_name: "Metformin HCl",
      dosage: "500mg",
      frequency: "Twice daily",
      duration: "90 days",
      instructions: "Take with meals to reduce stomach upset",
      quantity: 180,
      unit: "tablets",
      substitution_allowed: false
    }
  ]);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addMedication = () => {
    const newMedication: Medication = {
      medication_name: "",
      generic_name: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
      quantity: 1,
      unit: "tablets",
      substitution_allowed: false
    };
    setMedications(prev => [...prev, newMedication]);
  };

  const updateMedication = (index: number, field: string, value: any) => {
    setMedications(prev => 
      prev.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    );
  };

  const removeMedication = (index: number) => {
    setMedications(prev => prev.filter((_, i) => i !== index));
  };

  const processOCR = async () => {
    if (uploadedFiles.length === 0) return;
    
    setIsProcessing(true);
    try {
      // Simulate OCR processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockOCRResult = {
        text: "Dr. John Smith\nMedical License: MD12345\nPatient: Jane Doe\nDOB: 01/15/1985\n\nPrescription:\n1. Lisinopril 10mg - Take 1 tablet daily\n2. Metformin 500mg - Take 1 tablet twice daily",
        confidence: 0.85,
        medications: [
          {
            name: "Lisinopril",
            dosage: "10mg",
            frequency: "Once daily",
            duration: "30 days",
            instructions: "Take 1 tablet daily",
            quantity: 30,
            unit: "tablets",
            confidence: 0.9
          },
          {
            name: "Metformin",
            dosage: "500mg",
            frequency: "Twice daily",
            duration: "30 days",
            instructions: "Take 1 tablet twice daily with meals",
            quantity: 60,
            unit: "tablets",
            confidence: 0.85
          }
        ],
        patient_info: {
          name: "Jane Doe",
          dob: "01/15/1985"
        },
        doctor_info: {
          name: "Dr. John Smith",
          license: "MD12345"
        }
      };
      
      setOcrResult(mockOCRResult);
      
      // Auto-populate form with OCR data
      if (mockOCRResult.patient_info.name) {
        setFormData(prev => ({ ...prev, patient_name: mockOCRResult.patient_info.name }));
      }
      if (mockOCRResult.doctor_info.name) {
        setFormData(prev => ({ ...prev, doctor_name: mockOCRResult.doctor_info.name }));
      }
      
      // Auto-populate medications (remove id field - backend will generate it)
      const extractedMedications = mockOCRResult.medications.map((med: ExtractedMedication, index: number) => ({
        medication_name: med.name,
        generic_name: "",
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
        instructions: med.instructions,
        quantity: med.quantity,
        unit: med.unit,
        substitution_allowed: false
      }));
      
      setMedications(extractedMedications);
      setStep(3);
    } catch (error) {
      console.error("OCR processing failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = () => {
    const prescriptionData = {
      ...formData,
      file_url: uploadedFiles[0] ? URL.createObjectURL(uploadedFiles[0]) : "",
      file_name: uploadedFiles[0]?.name || "",
      file_size: uploadedFiles[0]?.size || 0,
      mime_type: uploadedFiles[0]?.type || "",
      medications: medications.filter(med => med.medication_name.trim() !== "")
    };
    
    onUpload(prescriptionData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= stepNumber 
                ? "bg-[#0f766e] text-white" 
                : "bg-gray-200 text-gray-600"
            }`}>
              {stepNumber}
            </div>
            {stepNumber < 3 && (
              <div className={`w-16 h-1 mx-2 ${
                step > stepNumber ? "bg-[#0f766e]" : "bg-gray-200"
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: File Upload */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Prescription
            </CardTitle>
            <CardDescription>
              Upload prescription images or PDF files for processing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="mb-4"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Files
              </Button>
              <p className="text-sm text-gray-500">
                Supported formats: JPG, PNG, PDF (Max 10MB each)
              </p>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Uploaded Files:</h4>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {file.type.startsWith('image/') ? (
                        <FileImage className="w-4 h-4 text-blue-500" />
                      ) : (
                        <FileText className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm">{file.name}</span>
                      <Badge variant="secondary">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                onClick={() => setStep(2)}
                disabled={uploadedFiles.length === 0}
              >
                Next: Patient & Doctor Info
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Patient & Doctor Information */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Patient & Doctor Information</CardTitle>
            <CardDescription>
              Enter patient and doctor details for the prescription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient_name">Patient Name *</Label>
                <Input
                  id="patient_name"
                  value={formData.patient_name}
                  onChange={(e) => handleInputChange("patient_name", e.target.value)}
                  placeholder="Enter patient name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient_phone">Patient Phone</Label>
                <Input
                  id="patient_phone"
                  value={formData.patient_phone}
                  onChange={(e) => handleInputChange("patient_phone", e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient_email">Patient Email</Label>
                <Input
                  id="patient_email"
                  type="email"
                  value={formData.patient_email}
                  onChange={(e) => handleInputChange("patient_email", e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient_dob">Date of Birth</Label>
                <Input
                  id="patient_dob"
                  type="date"
                  value={formData.patient_dob}
                  onChange={(e) => handleInputChange("patient_dob", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="patient_address">Patient Address</Label>
              <Textarea
                id="patient_address"
                value={formData.patient_address}
                onChange={(e) => handleInputChange("patient_address", e.target.value)}
                placeholder="Enter patient address"
                rows={2}
              />
            </div>

            <div className="border-t pt-6">
              <h4 className="font-medium mb-4">Doctor Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor_name">Doctor Name *</Label>
                  <Input
                    id="doctor_name"
                    value={formData.doctor_name}
                    onChange={(e) => handleInputChange("doctor_name", e.target.value)}
                    placeholder="Enter doctor name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor_license">License Number</Label>
                  <Input
                    id="doctor_license"
                    value={formData.doctor_license}
                    onChange={(e) => handleInputChange("doctor_license", e.target.value)}
                    placeholder="Enter license number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor_phone">Doctor Phone</Label>
                  <Input
                    id="doctor_phone"
                    value={formData.doctor_phone}
                    onChange={(e) => handleInputChange("doctor_phone", e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor_specialty">Specialty</Label>
                  <Input
                    id="doctor_specialty"
                    value={formData.doctor_specialty}
                    onChange={(e) => handleInputChange("doctor_specialty", e.target.value)}
                    placeholder="Enter specialty"
                  />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="clinic_name">Clinic Name</Label>
                <Input
                  id="clinic_name"
                  value={formData.clinic_name}
                  onChange={(e) => handleInputChange("clinic_name", e.target.value)}
                  placeholder="Enter clinic name"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={processOCR}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Scan className="w-4 h-4 mr-2 animate-spin" />
                      Processing OCR...
                    </>
                  ) : (
                    <>
                      <Scan className="w-4 h-4 mr-2" />
                      Process with OCR
                    </>
                  )}
                </Button>
                <Button 
                  onClick={() => setStep(3)}
                  disabled={!formData.patient_name || !formData.doctor_name}
                >
                  Next: Medications
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Medications */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Prescription Medications</CardTitle>
            <CardDescription>
              Add medications to the prescription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {medications.map((medication, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Medication {index + 1}</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeMedication(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Medication Name *</Label>
                    <Input
                      value={medication.medication_name}
                      onChange={(e) => updateMedication(index, "medication_name", e.target.value)}
                      placeholder="Enter medication name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Generic Name</Label>
                    <Input
                      value={medication.generic_name}
                      onChange={(e) => updateMedication(index, "generic_name", e.target.value)}
                      placeholder="Enter generic name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Dosage *</Label>
                    <Input
                      value={medication.dosage}
                      onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                      placeholder="e.g., 10mg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Frequency *</Label>
                    <Select
                      value={medication.frequency}
                      onValueChange={(value) => updateMedication(index, "frequency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Once daily">Once daily</SelectItem>
                        <SelectItem value="Twice daily">Twice daily</SelectItem>
                        <SelectItem value="Three times daily">Three times daily</SelectItem>
                        <SelectItem value="As needed">As needed</SelectItem>
                        <SelectItem value="As directed">As directed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input
                      value={medication.duration}
                      onChange={(e) => updateMedication(index, "duration", e.target.value)}
                      placeholder="e.g., 30 days"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={medication.quantity}
                      onChange={(e) => updateMedication(index, "quantity", parseInt(e.target.value) || 0)}
                      placeholder="Enter quantity"
                    />
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label>Instructions</Label>
                  <Textarea
                    value={medication.instructions}
                    onChange={(e) => updateMedication(index, "instructions", e.target.value)}
                    placeholder="Enter special instructions"
                    rows={2}
                  />
                </div>
              </Card>
            ))}

            <Button
              variant="outline"
              onClick={addMedication}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Medication
            </Button>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={loading || medications.length === 0 || medications.some(med => !med.medication_name || !med.dosage || !med.frequency)}
              >
                {loading ? 'Uploading...' : 'Upload Prescription'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
