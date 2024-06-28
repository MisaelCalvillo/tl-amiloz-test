import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testOfferModel() {
  try {
    // Create a test user if it doesn't exist
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        idDocumentNumber: '1234567890',
        password: 'hashedpassword',
        phone: '1234567890',
        roleId: 'user', // Assuming you have a 'user' role in your database
      },
    });

    // Create a test payment frequency if it doesn't exist
    const paymentFrequency = await prisma.paymentFrequency.upsert({
      where: { id: 'monthly' },
      update: {},
      create: {
        id: 'monthly',
        description: 'Monthly payments',
        days: 30,
      },
    });

    console.log('Test setup complete');

    // Create an offer
    const newOffer = await prisma.offer.create({
      data: {
        userId: user.id,
        amount: 10000,
        interestRate: 0.05,
        termInDays: 365,
        installments: 12,
        installmentAmount: 856.07,
        totalAmount: 10272.84,
        paymentFrequencyId: paymentFrequency.id,
        status: 'PENDING',
      },
    });

    console.log('Created offer:', newOffer);

    // Read the offer
    const readOffer = await prisma.offer.findUnique({
      where: { id: newOffer.id },
      include: { user: true, paymentFrequency: true },
    });

    console.log('Read offer:', readOffer);

    // Update the offer
    const updatedOffer = await prisma.offer.update({
      where: { id: newOffer.id },
      data: { status: 'APPROVED' },
    });

    console.log('Updated offer:', updatedOffer);

    // Delete the offer
    const deletedOffer = await prisma.offer.delete({
      where: { id: newOffer.id },
    });

    console.log('Deleted offer:', deletedOffer);

    // Verify deletion
    const verifyDeletion = await prisma.offer.findUnique({
      where: { id: newOffer.id },
    });

    console.log('Verify deletion (should be null):', verifyDeletion);

    if (verifyDeletion === null) {
      console.log('All operations completed successfully');
    } else {
      console.error('Deletion verification failed');
    }

  } catch (error) {
    console.error('Error occurred during testing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testOfferModel();