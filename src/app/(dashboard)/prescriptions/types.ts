export interface Prescription {
  id: string;
  prescription_number: string;
  patient_name: string;
  patient_phone?: string;
  patient_email?: string;
  patient_dob?: string;
  patient_address?: string;
  doctor_name: string;
  doctor_license?: string;
  doctor_phone?: string;
  doctor_specialty?: string;
  clinic_name?: string;
  status: 'UPLOADED' | 'PENDING_VALIDATION' | 'VALIDATED' | 'DISPENSED' | 'REJECTED' | 'EXPIRED';
  type: 'IMAGE' | 'PDF' | 'SCANNED';
  file_url: string;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
  ocr_text?: string;
  extracted_data?: any;
  validation_status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NEEDS_REVISION';
  validation_notes?: string;
  validated_by?: string;
  validated_at?: string;
  dispensed_by?: string;
  dispensed_at?: string;
  rejected_by?: string;
  rejected_at?: string;
  rejection_reason?: string;
  uploaded_by?: string;
  is_active: boolean;
  medications?: PrescriptionMedication[];
  created_at: string;
  updated_at: string;
}

export interface PrescriptionMedication {
  id: string;
  prescription_id: string;
  medication_name: string;
  generic_name?: string;
  dosage: string;
  frequency: string;
  duration?: string;
  instructions?: string;
  quantity?: number;
  unit?: string;
  substitution_allowed: boolean;
  product_id?: string;
  batch_id?: string;
  unit_price?: number;
  total_price?: number;
  is_dispensed: boolean;
  dispensed_by?: string;
  dispensed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePrescriptionRequest {
  patient_name: string;
  patient_phone?: string;
  patient_email?: string;
  patient_dob?: string;
  patient_address?: string;
  doctor_name: string;
  doctor_license?: string;
  doctor_phone?: string;
  doctor_specialty?: string;
  clinic_name?: string;
  type: 'IMAGE' | 'PDF' | 'SCANNED';
  file_url: string;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
  medications: CreatePrescriptionMedicationRequest[];
}

export interface CreatePrescriptionMedicationRequest {
  medication_name: string;
  generic_name?: string;
  dosage: string;
  frequency: string;
  duration?: string;
  instructions?: string;
  quantity?: number;
  unit?: string;
  substitution_allowed?: boolean;
}

export interface UpdatePrescriptionRequest {
  patient_name?: string;
  patient_phone?: string;
  patient_email?: string;
  patient_dob?: string;
  patient_address?: string;
  doctor_name?: string;
  doctor_license?: string;
  doctor_phone?: string;
  doctor_specialty?: string;
  clinic_name?: string;
  status?: 'UPLOADED' | 'PENDING_VALIDATION' | 'VALIDATED' | 'DISPENSED' | 'REJECTED' | 'EXPIRED';
  validation_status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NEEDS_REVISION';
  validation_notes?: string;
  rejection_reason?: string;
}

export interface PrescriptionFilters {
  status?: string;
  validation_status?: string;
  patient_name?: string;
  doctor_name?: string;
  uploaded_by?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}

export interface ValidatePrescriptionRequest {
  validation_status: 'APPROVED' | 'REJECTED' | 'NEEDS_REVISION';
  validation_notes: string;
}

export interface DispensePrescriptionRequest {
  medications: {
    medication_id: string;
    product_id: string;
    batch_id: string;
    quantity: number;
    unit_price: number;
  }[];
}

export interface PrescriptionStats {
  total_prescriptions: number;
  pending_validation: number;
  validated: number;
  dispensed: number;
  rejected: number;
  today_uploads: number;
  this_week_uploads: number;
  this_month_uploads: number;
}

export interface OCRResult {
  text: string;
  confidence: number;
  medications: ExtractedMedication[];
  patient_info: {
    name?: string;
    phone?: string;
    email?: string;
    dob?: string;
    address?: string;
  };
  doctor_info: {
    name?: string;
    license?: string;
    phone?: string;
    specialty?: string;
    clinic?: string;
  };
}

export interface ExtractedMedication {
  name: string;
  dosage: string;
  frequency: string;
  duration?: string;
  instructions?: string;
  quantity?: number;
  unit?: string;
  confidence: number;
}

export interface Product {
  id: string;
  name: string;
  generic_name?: string;
  selling_price: number;
  stock_available: number;
  batches: {
    id: string;
    batch_number: string;
    expiry_date: string;
    current_quantity: number;
  }[];
}

export interface PrescriptionContentProps {
  onViewPrescription?: (prescription: Prescription) => void;
}

export interface PrescriptionTableProps {
  onViewPrescription?: (prescription: Prescription) => void;
  searchTerm?: string;
  statusFilter?: string;
  dateFilter?: string;
}

export interface PrescriptionUploadProps {
  onUpload: (data: CreatePrescriptionRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}

export interface PrescriptionValidationProps {
  prescription: Prescription;
  onValidate: (validationData: ValidatePrescriptionRequest) => void;
  onReject: (rejectionData: { rejection_reason: string }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export interface PrescriptionDispenseProps {
  prescription: Prescription;
  onDispense: (dispenseData: DispensePrescriptionRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}
