import prisma from '../lib/prisma';
import { v4 as uuidv4 } from 'uuid';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const adminId = uuidv4();
    const admin = await prisma.user.create({
      data: {
        id: adminId,
        name: 'Admin User',
        email: 'admin@pharmacy.com',
        emailVerified: true,
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log('✅ Created admin user:', admin.email);

    // Create pharmacist user
    const pharmacistId = uuidv4();
    const pharmacist = await prisma.user.create({
      data: {
        id: pharmacistId,
        name: 'John Pharmacist',
        email: 'pharmacist@pharmacy.com',
        emailVerified: true,
        role: 'PHARMACIST',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create pharmacist profile
    await prisma.profile.create({
      data: {
        userId: pharmacist.id,
        phone: '+1234567890',
        specialization: 'Clinical Pharmacy',
        address: '123 Main St, City',
        licenseNumber: 'RPh12345',
      },
    });

    console.log('✅ Created pharmacist user:', pharmacist.email);

    // Create suppliers
    const suppliers = await Promise.all([
      prisma.supplier.create({
        data: {
          name: 'MediSupply Co.',
          email: 'contact@medisupply.com',
          phone: '+1234567891',
          address: '456 Supply St, City',
          gstNumber: 'GST123456789',
          contactPerson: 'Jane Doe',
        },
      }),
      prisma.supplier.create({
        data: {
          name: 'PharmaWholesale Ltd.',
          email: 'info@pharmawholesale.com',
          phone: '+1234567892',
          address: '789 Wholesale Ave, City',
          gstNumber: 'GST987654321',
          contactPerson: 'Bob Smith',
        },
      }),
    ]);

    console.log('✅ Created suppliers');

    // Create sample products
    const products = await Promise.all([
      prisma.product.create({
        data: {
          sku: 'MED001',
          name: 'Paracetamol 500mg',
          description: 'Pain relief and fever reducer',
          category: 'OTC',
          unit: 'tablets',
          hsnCode: '30049099',
          gstRate: 12,
          price: 2.50,
          reorderLevel: 100,
        },
      }),
      prisma.product.create({
        data: {
          sku: 'MED002',
          name: 'Amoxicillin 250mg',
          description: 'Antibiotic capsules',
          category: 'PRESCRIPTION',
          unit: 'capsules',
          hsnCode: '30049011',
          gstRate: 12,
          price: 5.00,
          reorderLevel: 50,
        },
      }),
      prisma.product.create({
        data: {
          sku: 'MED003',
          name: 'Vitamin D3 60000 IU',
          description: 'Vitamin D supplement',
          category: 'SUPPLEMENT',
          unit: 'sachets',
          hsnCode: '30049041',
          gstRate: 18,
          price: 15.00,
          reorderLevel: 20,
        },
      }),
      prisma.product.create({
        data: {
          sku: 'MED004',
          name: 'Cough Syrup',
          description: 'Dry cough relief syrup',
          category: 'OTC',
          unit: 'bottles',
          hsnCode: '30049099',
          gstRate: 12,
          price: 25.00,
          reorderLevel: 15,
        },
      }),
    ]);

    console.log('✅ Created products');

    // Create batches for products
    const batches = [];
    for (const product of products) {
      // Create 2-3 batches per product with different expiry dates
      for (let i = 0; i < 2; i++) {
        const mfgDate = new Date();
        mfgDate.setMonth(mfgDate.getMonth() - Math.floor(Math.random() * 12));
        
        const expiryDate = new Date(mfgDate);
        expiryDate.setFullYear(expiryDate.getFullYear() + 2);
        
        // Make some batches expire soon for testing
        if (i === 0 && Math.random() < 0.5) {
          expiryDate.setDate(expiryDate.getDate() + Math.floor(Math.random() * 20) + 5);
        }

        const quantity = Math.floor(Math.random() * 200) + 10;
        // Make some items low stock
        const finalQuantity = product.name.includes('Cough') && i === 0 ? 5 : quantity;

        const batch = await prisma.batch.create({
          data: {
            batchNumber: `${product.sku}-${Date.now()}-${i}`,
            productId: product.id,
            supplierId: suppliers[i % suppliers.length].id,
            mfgDate,
            expiryDate,
            quantity: finalQuantity,
            costPrice: product.price * 0.7,
            sellingPrice: product.price,
          },
        });
        batches.push(batch);
      }
    }

    console.log('✅ Created batches');

    // Create sample prescriptions
    const prescriptions = [];
    const patientNames = ['John Smith', 'Maria Garcia', 'David Johnson', 'Sarah Wilson', 'Michael Brown'];
    
    for (let i = 0; i < 3; i++) {
      const prescription = await prisma.prescription.create({
        data: {
          patientName: patientNames[i],
          patientPhone: `+123456789${i}`,
          patientAge: Math.floor(Math.random() * 60) + 20,
          doctorName: 'Dr. Smith',
          uploadedBy: pharmacist.id,
          validatedBy: i < 2 ? pharmacist.id : null,
          status: i < 2 ? 'VALIDATED' : 'PENDING_VALIDATION',
          extractedText: `Prescription for ${patientNames[i]}\n1. Paracetamol 500mg - Take twice daily\n2. Amoxicillin 250mg - Take three times daily`,
          notes: 'Regular checkup prescription',
        },
      });

      // Add prescription items
      if (i < 2) {
        await prisma.prescriptionItem.createMany({
          data: [
            {
              prescriptionId: prescription.id,
              productId: products[0].id,
              medichineName: 'Paracetamol 500mg',
              dosage: '500mg',
              quantity: 10,
              instructions: 'Take twice daily after meals',
            },
            {
              prescriptionId: prescription.id,
              productId: products[1].id,
              medichineName: 'Amoxicillin 250mg',
              dosage: '250mg',
              quantity: 15,
              instructions: 'Take three times daily',
            },
          ],
        });
      }

      prescriptions.push(prescription);
    }

    console.log('✅ Created prescriptions');

    // Create sample sales
    for (let i = 0; i < 2; i++) {
      const sale = await prisma.sale.create({
        data: {
          saleNumber: `SALE-2024-${String(i + 1).padStart(6, '0')}`,
          customerName: patientNames[i],
          customerPhone: `+123456789${i}`,
          prescriptionId: prescriptions[i].id,
          soldBy: pharmacist.id,
          subtotal: 75.00,
          gstAmount: 9.00,
          discount: 0,
          totalAmount: 84.00,
          paymentMethod: 'CASH',
          status: 'COMPLETED',
        },
      });

      // Add sale items
      await prisma.saleItem.createMany({
        data: [
          {
            saleId: sale.id,
            productId: products[0].id,
            batchId: batches.find(b => b.productId === products[0].id)?.id,
            quantity: 10,
            unitPrice: 2.50,
            gstRate: 12,
            gstAmount: 3.00,
            totalAmount: 28.00,
          },
          {
            saleId: sale.id,
            productId: products[1].id,
            batchId: batches.find(b => b.productId === products[1].id)?.id,
            quantity: 15,
            unitPrice: 5.00,
            gstRate: 12,
            gstAmount: 9.00,
            totalAmount: 84.00,
          },
        ],
      });

      // Update batch quantities
      const paracetamolBatch = batches.find(b => b.productId === products[0].id);
      const amoxicillinBatch = batches.find(b => b.productId === products[1].id);

      if (paracetamolBatch) {
        await prisma.batch.update({
          where: { id: paracetamolBatch.id },
          data: { quantity: { decrement: 10 } },
        });
      }

      if (amoxicillinBatch) {
        await prisma.batch.update({
          where: { id: amoxicillinBatch.id },
          data: { quantity: { decrement: 15 } },
        });
      }
    }

    console.log('✅ Created sales');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log('- 2 users created (admin, pharmacist)');
    console.log('- 2 suppliers created');
    console.log('- 4 products created');
    console.log('- 8 batches created');
    console.log('- 3 prescriptions created');
    console.log('- 2 sales created');
    console.log('\n🔑 Test Credentials:');
    console.log('Admin: admin@pharmacy.com');
    console.log('Pharmacist: pharmacist@pharmacy.com');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();