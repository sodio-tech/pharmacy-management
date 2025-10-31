"use client";

import { useState } from "react";
import { toast } from 'react-toastify';
import DynamicHeader from '@/components/DynamicHeader'
import LayoutSkeleton from '@/components/layout-skeleton'
import { Button } from '@/components/ui/button'
import { Download, Scan, Upload } from 'lucide-react'
import { HeaderActions, HeaderAction } from '@/components/HeaderActions'
import PrescriptionContent from './prescription-content'
import { PrescriptionUpload } from './prescription-upload'
import { PrescriptionValidation } from './prescription-validation'
import { PrescriptionDispense } from './prescription-dispense'
import { 
  Prescription, 
  CreatePrescriptionRequest, 
  ValidatePrescriptionRequest, 
  DispensePrescriptionRequest 
} from './types'
import { backendApi } from "@/lib/axios-config"

const page = () => {
    const [currentView, setCurrentView] = useState<'list' | 'upload' | 'validate' | 'dispense'>('list');
    const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUploadPrescription = async (prescriptionData: CreatePrescriptionRequest) => {
        try {
            setLoading(true);
            setError(null);
            await backendApi.post('/prescriptions', prescriptionData);  
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
        } catch (err: unknown) {
            // Show error toast
            const error = err as { response?: { data?: { error?: string; message?: string } } }
            const errorMessage = error?.response?.data?.error || error?.response?.data?.message || 'Failed to upload prescription. Please try again.';
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
            const response = await backendApi.post(`/prescriptions/${selectedPrescription.id}/validate`, validationData);
            const prescription = response.data?.data || response.data;
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
        } catch (err: unknown) {
            console.error('Failed to validate prescription:', err);
            const error = err as { response?: { data?: { error?: string; message?: string } } }
            
            // Show error toast
            const errorMessage = error?.response?.data?.error || error?.response?.data?.message || 'Failed to validate prescription. Please try again.';
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
            const response = await backendApi.post(`/prescriptions/${selectedPrescription.id}/reject`, {
                rejection_reason: rejectionData.rejection_reason
            });
            const prescription = response.data?.data || response.data;
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
        } catch (err: unknown) {
            console.error('Failed to reject prescription:', err);
            const error = err as { response?: { data?: { error?: string; message?: string } } }
            
            // Show error toast
            const errorMessage = error?.response?.data?.error || error?.response?.data?.message || 'Failed to reject prescription. Please try again.';
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
            const response = await backendApi.post(`/prescriptions/${selectedPrescription.id}/dispense`, dispenseData);
            const prescription = response.data?.data || response.data;
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
        } catch (err: unknown) {
            console.error('Failed to dispense prescription:', err);
            const error = err as { response?: { data?: { error?: string; message?: string } } }
            
            // Show error toast
            const errorMessage = error?.response?.data?.error || error?.response?.data?.message || 'Failed to dispense prescription. Please try again.';
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

    const prescriptionActions: HeaderAction[] = [
        {
            label: "Upload Prescription",
            icon: Upload,
            onClick: handleUploadClick,
            variant: 'primary'
        },
        {
            label: "Scan Prescription",
            icon: Scan,
            onClick: handleScanClick,
            variant: 'secondary'
        },
        {
            label: "Export",
            icon: Download,
            onClick: handleExportClick,
            variant: 'tertiary'
        }
    ]

    return (
        <LayoutSkeleton
            header={
                <DynamicHeader
                    maintext="Prescription Management"
                    para="Manage patient prescriptions and medication orders"
                    children={<HeaderActions actions={prescriptionActions} />}
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