import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth, UserRole } from "@/lib/rbac";
import { z } from "zod";

const validatePrescriptionSchema = z.object({
  status: z.enum(["VALIDATED", "REJECTED"]),
  notes: z.string().max(1000).optional(),
});

const updatePrescriptionSchema = z.object({
  patientName: z.string().min(2).max(100).optional(),
  patientPhone: z.string().min(10).max(15).optional(),
  patientAge: z.number().min(0).max(150).optional(),
  doctorName: z.string().min(2).max(100).optional(),
  notes: z.string().max(1000).optional(),
});

// GET /api/prescriptions/[id] - Get prescription details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (req, user) => {
    const prescriptionId = params.id;

    const prescription = await prisma.prescription.findUnique({
      where: { id: prescriptionId },
      select: {
        id: true,
        patientName: true,
        patientPhone: true,
        patientAge: true,
        doctorName: true,
        uploadedBy: true,
        validatedBy: true,
        fileUrl: true,
        fileName: true,
        extractedText: true,
        status: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        validatedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          select: {
            id: true,
            medichineName: true,
            dosage: true,
            quantity: true,
            instructions: true,
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                price: true,
                unit: true,
              },
            },
          },
        },
        sales: {
          select: {
            id: true,
            saleNumber: true,
            totalAmount: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!prescription) {
      return NextResponse.json(
        { error: "Prescription not found" },
        { status: 404 }
      );
    }

    // Check access permissions
    if (user.role === UserRole.USER && prescription.uploadedBy !== user.id) {
      return NextResponse.json(
        { error: "Forbidden - Can only view own prescriptions" },
        { status: 403 }
      );
    }

    return NextResponse.json({ prescription });
  });
}

// PUT /api/prescriptions/[id] - Update prescription or validate
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (req, user) => {
    const prescriptionId = params.id;
    const body = await req.json();

    const prescription = await prisma.prescription.findUnique({
      where: { id: prescriptionId },
      select: {
        id: true,
        uploadedBy: true,
        status: true,
      },
    });

    if (!prescription) {
      return NextResponse.json(
        { error: "Prescription not found" },
        { status: 404 }
      );
    }

    // Check if this is a validation request (only pharmacists/admins can validate)
    if (body.status && ["VALIDATED", "REJECTED"].includes(body.status)) {
      if (![UserRole.ADMIN, UserRole.PHARMACIST].includes(user.role)) {
        return NextResponse.json(
          { error: "Forbidden - Only pharmacists can validate prescriptions" },
          { status: 403 }
        );
      }

      const validationData = validatePrescriptionSchema.parse(body);
      
      const updatedPrescription = await prisma.prescription.update({
        where: { id: prescriptionId },
        data: {
          status: validationData.status,
          validatedBy: user.id,
          notes: validationData.notes || prescription.notes,
        },
        select: {
          id: true,
          patientName: true,
          status: true,
          notes: true,
          updatedAt: true,
          validatedUser: {
            select: {
              name: true,
            },
          },
        },
      });

      return NextResponse.json({ 
        message: `Prescription ${validationData.status.toLowerCase()} successfully`,
        prescription: updatedPrescription 
      });
    }

    // Regular update (only by uploader or admin/pharmacist)
    if (user.role === UserRole.USER && prescription.uploadedBy !== user.id) {
      return NextResponse.json(
        { error: "Forbidden - Can only update own prescriptions" },
        { status: 403 }
      );
    }

    // Prevent updates if already validated/rejected
    if (["VALIDATED", "REJECTED"].includes(prescription.status)) {
      return NextResponse.json(
        { error: "Cannot update prescription that has been validated or rejected" },
        { status: 400 }
      );
    }

    const updateData = updatePrescriptionSchema.parse(body);
    
    const updatedPrescription = await prisma.prescription.update({
      where: { id: prescriptionId },
      data: updateData,
      select: {
        id: true,
        patientName: true,
        patientPhone: true,
        patientAge: true,
        doctorName: true,
        notes: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ 
      message: "Prescription updated successfully",
      prescription: updatedPrescription 
    });
  });
}

// DELETE /api/prescriptions/[id] - Delete prescription
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (req, user) => {
    const prescriptionId = params.id;

    const prescription = await prisma.prescription.findUnique({
      where: { id: prescriptionId },
      select: {
        id: true,
        uploadedBy: true,
        patientName: true,
        sales: { select: { id: true } },
      },
    });

    if (!prescription) {
      return NextResponse.json(
        { error: "Prescription not found" },
        { status: 404 }
      );
    }

    // Check permissions (only uploader or admin can delete)
    if (user.role !== UserRole.ADMIN && prescription.uploadedBy !== user.id) {
      return NextResponse.json(
        { error: "Forbidden - Can only delete own prescriptions" },
        { status: 403 }
      );
    }

    // Prevent deletion if there are associated sales
    if (prescription.sales.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete prescription with associated sales" },
        { status: 400 }
      );
    }

    // Delete prescription items first, then prescription
    await prisma.prescriptionItem.deleteMany({
      where: { prescriptionId: prescriptionId },
    });

    await prisma.prescription.delete({
      where: { id: prescriptionId },
    });

    return NextResponse.json({ 
      message: `Prescription for ${prescription.patientName} deleted successfully` 
    });
  });
}