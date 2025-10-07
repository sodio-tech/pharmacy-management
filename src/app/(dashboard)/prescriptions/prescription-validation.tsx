"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, AlertTriangle, Eye, FileText, User, Stethoscope } from "lucide-react";
import { PrescriptionValidationProps } from "./types";

export function PrescriptionValidation({ 
  prescription, 
  onValidate, 
  onReject, 
  onCancel 
}: PrescriptionValidationProps) {
  const [validationStatus, setValidationStatus] = useState<'APPROVED' | 'REJECTED' | 'NEEDS_REVISION'>('APPROVED');
  const [validationNotes, setValidationNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showOCRText, setShowOCRText] = useState(false);

  const handleValidate = () => {
    if (validationStatus === 'REJECTED') {
      onReject({
        rejection_reason: rejectionReason
      });
    } else {
      onValidate({
        validation_status: validationStatus,
        validation_notes: validationNotes
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'NEEDS_REVISION':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4" />;
      case 'NEEDS_REVISION':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prescription Validation</h1>
          <p className="text-gray-600">Review and validate prescription #{prescription.prescription_number}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={`${getStatusColor(prescription.validation_status)} border-0`}>
            {getStatusIcon(prescription.validation_status)}
            <span className="ml-1">{prescription.validation_status}</span>
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prescription Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Patient Name</Label>
                  <p className="text-lg font-semibold">{prescription.patient_name}</p>
                </div>
                {prescription.patient_phone && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Phone</Label>
                    <p className="text-lg">{prescription.patient_phone}</p>
                  </div>
                )}
                {prescription.patient_email && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Email</Label>
                    <p className="text-lg">{prescription.patient_email}</p>
                  </div>
                )}
                {prescription.patient_dob && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Date of Birth</Label>
                    <p className="text-lg">{prescription.patient_dob}</p>
                  </div>
                )}
              </div>
              {prescription.patient_address && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Address</Label>
                  <p className="text-lg">{prescription.patient_address}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Doctor Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                Doctor Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Doctor Name</Label>
                  <p className="text-lg font-semibold">{prescription.doctor_name}</p>
                </div>
                {prescription.doctor_license && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">License Number</Label>
                    <p className="text-lg">{prescription.doctor_license}</p>
                  </div>
                )}
                {prescription.doctor_phone && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Phone</Label>
                    <p className="text-lg">{prescription.doctor_phone}</p>
                  </div>
                )}
                {prescription.doctor_specialty && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Specialty</Label>
                    <p className="text-lg">{prescription.doctor_specialty}</p>
                  </div>
                )}
              </div>
              {prescription.clinic_name && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Clinic Name</Label>
                  <p className="text-lg">{prescription.clinic_name}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Prescription File */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Prescription File
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{prescription.file_name || 'Prescription File'}</p>
                  <p className="text-sm text-gray-600">Uploaded on {new Date(prescription.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowOCRText(!showOCRText)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {showOCRText ? 'Hide' : 'Show'} OCR Text
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(prescription.file_url, '_blank')}
                  >
                    View File
                  </Button>
                </div>
              </div>
              
              {showOCRText && prescription.ocr_text && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <Label className="text-sm font-medium text-gray-600">OCR Extracted Text:</Label>
                  <pre className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                    {prescription.ocr_text}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Medications */}
          <Card>
            <CardHeader>
              <CardTitle>Prescribed Medications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prescription.medications?.map((medication, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg">{medication.medication_name}</h4>
                      {medication.generic_name && (
                        <Badge variant="secondary">{medication.generic_name}</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Dosage:</span> {medication.dosage}
                      </div>
                      <div>
                        <span className="font-medium">Frequency:</span> {medication.frequency}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span> {medication.duration || 'As directed'}
                      </div>
                      {medication.quantity && (
                        <div>
                          <span className="font-medium">Quantity:</span> {medication.quantity} {medication.unit}
                        </div>
                      )}
                    </div>
                    {medication.instructions && (
                      <div className="mt-2">
                        <span className="font-medium">Instructions:</span>
                        <p className="text-gray-700">{medication.instructions}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Validation Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Validation</CardTitle>
              <CardDescription>
                Review and validate this prescription
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="validation_status">Validation Status</Label>
                <Select
                  value={validationStatus}
                  onValueChange={(value: any) => setValidationStatus(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="APPROVED">Approve</SelectItem>
                    <SelectItem value="NEEDS_REVISION">Needs Revision</SelectItem>
                    <SelectItem value="REJECTED">Reject</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {validationStatus === 'REJECTED' ? (
                <div className="space-y-2">
                  <Label htmlFor="rejection_reason">Rejection Reason</Label>
                  <Textarea
                    id="rejection_reason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter reason for rejection..."
                    rows={3}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="validation_notes">Validation Notes</Label>
                  <Textarea
                    id="validation_notes"
                    value={validationNotes}
                    onChange={(e) => setValidationNotes(e.target.value)}
                    placeholder="Enter validation notes..."
                    rows={3}
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleValidate}
                  className={`${
                    validationStatus === 'REJECTED' 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {validationStatus === 'REJECTED' ? 'Reject Prescription' : 'Validate Prescription'}
                </Button>
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Prescription History */}
          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Prescription uploaded</span>
                  <span className="text-gray-500 ml-auto">
                    {new Date(prescription.created_at).toLocaleDateString()}
                  </span>
                </div>
                {prescription.validation_status !== 'PENDING' && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Validation completed</span>
                    <span className="text-gray-500 ml-auto">Today</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
