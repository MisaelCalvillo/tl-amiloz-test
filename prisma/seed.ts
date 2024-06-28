import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create roles
  await prisma.role.upsert({
    where: { id: 'admin' },
    update: {},
    create: {
      id: 'admin',
      description: 'Administrator role with full access to all resources',
    },
  });

  await prisma.role.upsert({
    where: { id: 'user' },
    update: {},
    create: {
      id: 'user',
      description: 'User soliciting loans',
    },
  });

  console.log('📝 Roles have been seeded');

  // Create payment frequencies
  const paymentFrequencies = [
    { id: 'daily', description: 'Daily', days: 1 },
    { id: 'weekly', description: 'Weekly', days: 7 },
    { id: 'biweekly', description: 'Bi-weekly', days: 14 },
    { id: 'monthly', description: 'Monthly', days: 30 },
    { id: 'bimonthly', description: 'Bi-monthly', days: 60 },
    { id: 'quarterly', description: 'Quarterly', days: 90 },
    { id: 'semiannual', description: 'Semi-annual', days: 180 },
    { id: 'annual', description: 'Annual', days: 365 },
  ];

  for (const frequency of paymentFrequencies) {
    await prisma.paymentFrequency.upsert({
      where: { id: frequency.id },
      update: {},
      create: frequency,
    });
  }

  console.log('🗓️ Payment frequencies have been seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });