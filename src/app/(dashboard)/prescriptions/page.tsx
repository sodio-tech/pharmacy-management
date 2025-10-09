"use client";

import { useState } from "react";
import { toast } from 'react-toastify';
import DynamicHeader from '@/components/DynamicHeader'
import LayoutSkeleton from '@/components/layout-skeleton'
import { Button } from '@/components/ui/button'
import { Download, Scan, Upload } from 'lucide-react'
import PrescriptionContent from './prescription-content'
import { PrescriptionUpload } from './prescription-upload'
import { PrescriptionValidation } from './prescription-validation'
import { PrescriptionDispense } from './prescription-dispense'
import { prescriptionService } from '@/services/prescriptionService'
import { 
  Prescription, 
  CreatePrescriptionRequest, 
  ValidatePrescriptionRequest, 
  DispensePrescriptionRequest 
} from './types'

const page = () => {
    const [currentView, setCurrentView] = useState<'list' | 'upload' | 'validate' | 'dispense'>('list');
    const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUploadPrescription = async (prescriptionData: CreatePrescriptionRequest) => {
        try {
            setLoading(true);
            setError(null);
             await prescriptionService.uploadPrescription(prescriptionData);  
            // Show success toast
            toast.success('Prescription uploaded successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            
            setCurrentView('list');
        } catch (err: any) {
            // Show error toast
            const errorMessage = err?.response?.data?.error || 'Failed to upload prescription. Please try again.';
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            
            setError(errorMessage);
        } finally {
            // setCurrentView('list');
            setLoading(false);
        }
    };

    const handleValidatePrescription = async (validationData: ValidatePrescriptionRequest) => {
        if (!selectedPrescription) return;
        
        try {
            setLoading(true);
            setError(null);
            const prescription = await prescriptionService.validatePrescription(
                selectedPrescription.id, 
                validationData
            );
            console.log('Prescription validated successfully:', prescription);
            
            // Show success toast
            toast.success('Prescription validated successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            
            setCurrentView('list');
        } catch (err: any) {
            console.error('Failed to validate prescription:', err);
            
            // Show error toast
            const errorMessage = err?.response?.data?.error || 'Failed to validate prescription. Please try again.';
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleRejectPrescription = async (rejectionData: { rejection_reason: string }) => {
        if (!selectedPrescription) return;
        
        try {
            setLoading(true);
            setError(null);
            const prescription = await prescriptionService.rejectPrescription(
                selectedPrescription.id, 
                rejectionData.rejection_reason
            );
            console.log('Prescription rejected successfully:', prescription);
            
            // Show success toast
            toast.success('Prescription rejected successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            
            setCurrentView('list');
        } catch (err: any) {
            console.error('Failed to reject prescription:', err);
            
            // Show error toast
            const errorMessage = err?.response?.data?.error || 'Failed to reject prescription. Please try again.';
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleDispensePrescription = async (dispenseData: DispensePrescriptionRequest) => {
        if (!selectedPrescription) return;
        
        try {
            setLoading(true);
            setError(null);
            const prescription = await prescriptionService.dispensePrescription(
                selectedPrescription.id, 
                dispenseData
            );
            console.log('Prescription dispensed successfully:', prescription);
            
            // Show success toast
            toast.success('Prescription dispensed successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            
            setCurrentView('list');
        } catch (err: any) {
            console.error('Failed to dispense prescription:', err);
            
            // Show error toast
            const errorMessage = err?.response?.data?.error || 'Failed to dispense prescription. Please try again.';
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleViewPrescription = (prescription: Prescription) => {
        setSelectedPrescription(prescription);
        if (prescription.status === 'PENDING_VALIDATION') {
            setCurrentView('validate');
        } else if (prescription.status === 'VALIDATED') {
            setCurrentView('dispense');
        }
    };

    const handleUploadClick = () => {
        setCurrentView('upload');
    };

    const handleScanClick = () => {
        // For now, redirect to upload with scan type
        setCurrentView('upload');
    };

    const handleExportClick = () => {
        // Implement export functionality
        console.log('Exporting prescriptions...');
        
        // Show info toast
        toast.info('Export functionality coming soon!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    if (currentView === 'upload') {
        return (
            <LayoutSkeleton
                header={
                    <DynamicHeader
                        maintext="Upload Prescription"
                        para="Upload and process prescription files"
                        children={
                            <div className="flex items-center gap-3">
                                <Button 
                                    variant="outline"
                                    onClick={() => setCurrentView('list')}
                                    disabled={loading}
                                >
                                    Back to Prescriptions
                                </Button>
                            </div>
                        }
                    />
                }
            >
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}
                <PrescriptionUpload
                    onUpload={handleUploadPrescription}
                    onCancel={() => setCurrentView('list')}
                    loading={loading}
                />
            </LayoutSkeleton>
        );
    }

    if (currentView === 'validate' && selectedPrescription) {
        return (
            <LayoutSkeleton
                header={
                    <DynamicHeader
                        maintext="Validate Prescription"
                        para="Review and validate prescription details"
                        children={
                            <div className="flex items-center gap-3">
                                <Button 
                                    variant="outline"
                                    onClick={() => setCurrentView('list')}
                                    disabled={loading}
                                >
                                    Back to Prescriptions
                                </Button>
                            </div>
                        }
                    />
                }
            >
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}
                <PrescriptionValidation
                    prescription={selectedPrescription}
                    onValidate={handleValidatePrescription}
                    onReject={handleRejectPrescription}
                    onCancel={() => setCurrentView('list')}
                    loading={loading}
                />
            </LayoutSkeleton>
        );
    }

    if (currentView === 'dispense' && selectedPrescription) {
        return (
            <LayoutSkeleton
                header={
                    <DynamicHeader
                        maintext="Dispense Prescription"
                        para="Dispense medications and update inventory"
                        children={
                            <div className="flex items-center gap-3">
                                <Button 
                                    variant="outline"
                                    onClick={() => setCurrentView('list')}
                                    disabled={loading}
                                >
                                    Back to Prescriptions
                                </Button>
                            </div>
                        }
                    />
                }
            >
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}
                <PrescriptionDispense
                    prescription={selectedPrescription}
                    onDispense={handleDispensePrescription}
                    onCancel={() => setCurrentView('list')}
                    loading={loading}
                />
            </LayoutSkeleton>
        );
    }

    return (
        <LayoutSkeleton
            header={
                <DynamicHeader
                    maintext="Prescription Management"
                    para="Manage patient prescriptions and medication orders"
                    children={
                        <div className="flex items-center gap-3">
                            <Button 
                                className="bg-[#0f766e] hover:bg-[#0d6660] text-white gap-2"
                                onClick={handleUploadClick}
                            >
                                <Upload className="w-4 h-4" />
                                Upload Prescription
                            </Button>
                            <Button 
                                className="bg-[#14b8a6] hover:bg-[#0f9488] text-white gap-2"
                                onClick={handleScanClick}
                            >
                                <Scan className="w-4 h-4" />
                                Scan Prescription
                            </Button>
                            <Button 
                                className="bg-[#06b6d4] hover:bg-[#0891b2] text-white gap-2"
                                onClick={handleExportClick}
                            >
                                <Download className="w-4 h-4" />
                                Export
                            </Button>
                        </div>
                    }
                />
            }
        >
            <PrescriptionContent 
                onViewPrescription={handleViewPrescription}
            />
        </LayoutSkeleton>
    )
}

export default page