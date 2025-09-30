const { PrismaClient } = require('./src/generated/prisma');

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding database...');

  // Create suppliers
  const supplier1 = await prisma.supplier.create({
    data: {
      name: 'MediCore Pharmaceuticals',
      email: 'contact@medicore.com',
      phone: '+1234567890',
      address: '123 Medical District, Health City',
      gstNumber: 'GST123456789',
      contactPerson: 'John Medical',
    },
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      name: 'HealthPlus Distributors',
      email: 'info@healthplus.com',
      phone: '+1234567891',
      address: '456 Pharma Avenue, Medicine Town',
      gstNumber: 'GST987654321',
      contactPerson: 'Jane Health',
    },
  });

  console.log('✓ Suppliers created');

  // Create products
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
        reorderLevel: 50,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'MED002',
        name: 'Amoxicillin 250mg',
        description: 'Antibiotic for bacterial infections',
        category: 'PRESCRIPTION',
        unit: 'capsules',
        hsnCode: '30049099',
        gstRate: 12,
        price: 5.00,
        reorderLevel: 30,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'SUP001',
        name: 'Vitamin D3 1000 IU',
        description: 'Bone health supplement',
        category: 'SUPPLEMENT',
        unit: 'tablets',
        hsnCode: '30049099',
        gstRate: 18,
        price: 8.00,
        reorderLevel: 25,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'MED003',
        name: 'Ibuprofen 400mg',
        description: 'Anti-inflammatory pain reliever',
        category: 'OTC',
        unit: 'tablets',
        hsnCode: '30049099',
        gstRate: 12,
        price: 3.00,
        reorderLevel: 40,
      },
    }),
  ]);

  console.log('✓ Products created');

  // Create batches
  const now = new Date();
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + 1);

  const expiringSoonDate = new Date();
  expiringSoonDate.setDate(expiringSoonDate.getDate() + 20);

  await Promise.all([
    // Paracetamol - Good stock
    prisma.batch.create({
      data: {
        batchNumber: 'BAT001',
        productId: products[0].id,
        supplierId: supplier1.id,
        mfgDate: new Date('2024-06-01'),
        expiryDate: futureDate,
        quantity: 150,
        costPrice: 2.00,
        sellingPrice: 2.50,
      },
    }),

    // Amoxicillin - Low stock
    prisma.batch.create({
      data: {
        batchNumber: 'BAT002',
        productId: products[1].id,
        supplierId: supplier1.id,
        mfgDate: new Date('2024-07-01'),
        expiryDate: futureDate,
        quantity: 15, // Below reorder level
        costPrice: 4.00,
        sellingPrice: 5.00,
      },
    }),

    // Vitamin D3 - Good stock but expiring soon
    prisma.batch.create({
      data: {
        batchNumber: 'BAT003',
        productId: products[2].id,
        supplierId: supplier2.id,
        mfgDate: new Date('2024-05-01'),
        expiryDate: expiringSoonDate, // Expiring soon
        quantity: 80,
        costPrice: 6.00,
        sellingPrice: 8.00,
      },
    }),

    // Ibuprofen - Out of stock
    prisma.batch.create({
      data: {
        batchNumber: 'BAT004',
        productId: products[3].id,
        supplierId: supplier2.id,
        mfgDate: new Date('2024-08-01'),
        expiryDate: futureDate,
        quantity: 0, // Out of stock
        costPrice: 2.50,
        sellingPrice: 3.00,
      },
    }),
  ]);

  console.log('✓ Batches created');
  console.log('🎉 Database seeded successfully!');
}

seed()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });