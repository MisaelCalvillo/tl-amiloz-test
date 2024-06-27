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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });