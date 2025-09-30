import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/rbac";
import { S3Service } from "@/lib/s3";
import { OCRService } from "@/lib/ocr";
import { z } from "zod";

const uploadPrescriptionSchema = z.object({
  patientName: z.string().min(2).max(100),
  patientPhone: z.string().min(10).max(15).optional(),
  patientAge: z.number().min(0).max(150).optional(),
  doctorName: z.string().min(2).max(100).optional(),
  notes: z.string().max(1000).optional(),
});

// POST /api/prescriptions/upload - Upload prescription file with OCR processing
export async function POST(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      
      // Validate file
      if (!file) {
        return NextResponse.json(
          { error: "No file uploaded" },
          { status: 400 }
        );
      }

      // Check file type (images and PDFs)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid file type. Only JPEG, PNG, and PDF files are allowed" },
          { status: 400 }
        );
      }

      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: "File size too large. Maximum size is 10MB" },
          { status: 400 }
        );
      }

      // Parse prescription metadata
      const prescriptionData = uploadPrescriptionSchema.parse({
        patientName: formData.get("patientName"),
        patientPhone: formData.get("patientPhone") || undefined,
        patientAge: formData.get("patientAge") ? parseInt(formData.get("patientAge") as string) : undefined,
        doctorName: formData.get("doctorName") || undefined,
        notes: formData.get("notes") || undefined,
      });

      // Create prescription record first
      const prescription = await prisma.prescription.create({
        data: {
          ...prescriptionData,
          uploadedBy: user.id,
          status: "UPLOADED",
        },
      });

      let fileUrl: string | undefined;
      let extractedText: string | undefined;
      let ocrResult: any;

      try {
        // Convert file to buffer
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        // Upload to S3 if configured
        if (S3Service.isConfigured()) {
          const s3Key = S3Service.generatePrescriptionKey(prescription.id, file.name);
          fileUrl = await S3Service.uploadFile(fileBuffer, s3Key, file.type);
        }

        // Process OCR for images (skip for PDFs for now)
        if (file.type.startsWith('image/')) {
          try {
            // Use mock OCR for development, real OCR for production
            if (process.env.NODE_ENV === 'development') {
              ocrResult = await OCRService.mockExtractText(file.name);
            } else {
              ocrResult = await OCRService.extractText(fileBuffer);
            }
            extractedText = ocrResult.extractedText;
          } catch (ocrError) {
            console.error("OCR processing failed:", ocrError);
            // Continue without OCR - file is still uploaded
          }
        }

        // Update prescription with file info and OCR results
        const updatedPrescription = await prisma.prescription.update({
          where: { id: prescription.id },
          data: {
            fileUrl,
            fileName: file.name,
            extractedText,
            status: "PENDING_VALIDATION",
          },
          select: {
            id: true,
            patientName: true,
            fileName: true,
            fileUrl: true,
            extractedText: true,
            status: true,
            createdAt: true,
          },
        });

        // Create prescription items from OCR results
        if (ocrResult?.medicines?.length > 0) {
          const prescriptionItems = ocrResult.medicines.map((medicine: any) => ({
            prescriptionId: prescription.id,
            medichineName: medicine.name,
            dosage: medicine.dosage,
            quantity: medicine.quantity,
            instructions: medicine.instructions,
          }));

          await prisma.prescriptionItem.createMany({
            data: prescriptionItems,
          });

          // Get updated prescription with items
          const finalPrescription = await prisma.prescription.findUnique({
            where: { id: prescription.id },
            select: {
              id: true,
              patientName: true,
              fileName: true,
              fileUrl: true,
              extractedText: true,
              status: true,
              createdAt: true,
              items: {
                select: {
                  id: true,
                  medichineName: true,
                  dosage: true,
                  quantity: true,
                  instructions: true,
                },
              },
            },
          });

          return NextResponse.json({ 
            message: "Prescription uploaded and processed successfully",
            prescription: finalPrescription,
            ocrProcessed: true,
            medicinesDetected: ocrResult.medicines.length
          }, { status: 201 });
        }

        return NextResponse.json({ 
          message: "Prescription uploaded successfully",
          prescription: updatedPrescription,
          ocrProcessed: !!extractedText,
          medicinesDetected: 0
        }, { status: 201 });

      } catch (uploadError) {
        console.error("File upload/processing error:", uploadError);
        
        // Clean up prescription record if file upload failed
        await prisma.prescription.delete({ where: { id: prescription.id } });
        
        return NextResponse.json(
          { error: "Failed to process prescription file" },
          { status: 500 }
        );
      }

    } catch (error) {
      console.error("Prescription upload error:", error);
      return NextResponse.json(
        { error: "Failed to upload prescription" },
        { status: 500 }
      );
    }
  });
}