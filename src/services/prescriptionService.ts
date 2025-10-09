import {
  Prescription,
  PrescriptionMedication,
  CreatePrescriptionRequest,
  CreatePrescriptionMedicationRequest,
  UpdatePrescriptionRequest,
  PrescriptionFilters,
  ValidatePrescriptionRequest,
  DispensePrescriptionRequest,
  PrescriptionStats
} from '@/app/(dashboard)/prescriptions/types';
import backendApi from '@/lib/axios-config';

// Re-export types for backward compatibility
export type {
  Prescription,
  PrescriptionMedication,
  CreatePrescriptionRequest,
  CreatePrescriptionMedicationRequest,
  UpdatePrescriptionRequest,
  PrescriptionFilters,
  ValidatePrescriptionRequest,
  DispensePrescriptionRequest,
  PrescriptionStats
};


class PrescriptionService {
  private baseUrl = '/prescriptions';

  // Upload prescription
  async uploadPrescription(data: CreatePrescriptionRequest): Promise<Prescription> {
    try {
      const response = await backendApi.post(`${this.baseUrl}/upload`, data);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response.data.error || 'Failed to upload prescription');
    }

  }

  // Process prescription with OCR
  async processWithOCR(prescriptionId: string, fileUrl: string, type: 'IMAGE' | 'PDF' | 'SCANNED'): Promise<any> {
    try {
      const response = await backendApi.post(`${this.baseUrl}/${prescriptionId}/process-ocr`, {
        file_url: fileUrl,
        type
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response.data.error || 'Failed to process prescription with OCR');
    }
  }

  // Get all prescriptions
  async getPrescriptions(filters: PrescriptionFilters = {}): Promise<{
    prescriptions: Prescription[];
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
      total_pages: number;
    };
  }> {
    try {
      const response = await backendApi.get(this.baseUrl, { params: filters });
      const prescriptions = response.data.data;
      
      // Fetch medications for each prescription
      const prescriptionsWithMedications = await Promise.all(
        prescriptions.map(async (prescription: Prescription) => {
          try {
            const medications = await this.getPrescriptionMedications(prescription.id);
            return {
              ...prescription,
              medications
            };
          } catch (error) {
            // If medications fetch fails, return prescription without medications
            console.warn(`Failed to fetch medications for prescription ${prescription.id}:`, error);
            return prescription;
          }
        })
      );
      
      return {
        prescriptions: prescriptionsWithMedications,
        pagination: response.data.pagination
      };
    } catch (error: any) {
      throw new Error(error.response.data.error || 'Failed to get prescriptions');
    }
  }

  // Get prescription by ID
  async getPrescriptionById(id: string): Promise<Prescription & {
    medications: PrescriptionMedication[];
    audit_logs: any[];
  }> {
    try {
      const response = await backendApi.get(`${this.baseUrl}/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response.data.error || 'Failed to get prescription by ID');
    }
  }

  // Update prescription
  async updatePrescription(id: string, data: Partial<Prescription>): Promise<Prescription> {
    try {
      const response = await backendApi.put(`${this.baseUrl}/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response.data.error || 'Failed to update prescription');
    }
  }

  // Validate prescription
  async validatePrescription(id: string, data: ValidatePrescriptionRequest): Promise<Prescription> {
    try {
      const response = await backendApi.post(`${this.baseUrl}/${id}/validate`, data);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response.data.error || 'Failed to validate prescription');
    }
  }

  // Dispense prescription
  async dispensePrescription(id: string, data: DispensePrescriptionRequest): Promise<Prescription> {
    try {
      const response = await backendApi.post(`${this.baseUrl}/${id}/dispense`, data);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response.data.error || 'Failed to dispense prescription');
    }
  }

  // Reject prescription
  async rejectPrescription(id: string, rejectionReason: string): Promise<Prescription> {
    try {
      const response = await backendApi.post(`${this.baseUrl}/${id}/reject`, {
        rejection_reason: rejectionReason
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response.data.error || 'Failed to reject prescription');
    }
  }

  // Link prescription to sale
  async linkToSale(id: string, saleId: string, totalAmount: number): Promise<any> {
    const response = await backendApi.post(`${this.baseUrl}/${id}/link-sale`, {
      sale_id: saleId,
      total_amount: totalAmount
    });
    return response.data.data;
  }

  // Search products for medication matching
  async searchProductsForMedication(medicationName: string, dosage?: string): Promise<any[]> {
    const response = await backendApi.get(`${this.baseUrl}/search/products`, {
      params: { medication_name: medicationName, dosage }
    });
    return response.data.data;
  }

  // Get prescription statistics
  async getPrescriptionStats(filters: any = {}): Promise<PrescriptionStats> {
    const response = await backendApi.get(`${this.baseUrl}/stats/overview`, {
      params: filters
    });
    return response.data.data;
  }

  // Upload file to server
  async uploadFile(file: File): Promise<{ file_url: string; file_name: string; file_size: number; mime_type: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await backendApi.post('/api/upload/prescription', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  }

  // Get prescription medications
  async getPrescriptionMedications(prescriptionId: string): Promise<PrescriptionMedication[]> {
    const response = await backendApi.get(`${this.baseUrl}/${prescriptionId}/medications`);
    return response.data.data;
  }

  // Get prescription audit logs
  async getPrescriptionAuditLogs(prescriptionId: string): Promise<any[]> {
    const response = await backendApi.get(`${this.baseUrl}/${prescriptionId}/audit-logs`);
    return response.data.data;
  }
}

export const prescriptionService = new PrescriptionService();
