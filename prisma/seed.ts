import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  // Delete all projects associated with users first to avoid foreign key constraints
  await prisma.userProjects.deleteMany({});

  // Now delete all users to ensure a clean slate before seeding new data
  await prisma.user.deleteMany({});

  // Add new user records here (seeding data)
  await prisma.user.createMany({
    data: [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',  // You must hash the password before storing in production
        role: 'ADMIN',  // Role can be either ADMIN, USER, etc.
      },
      {
        name: 'Regular User',
        email: 'user@example.com',
        password: 'hashedpassword',  // In a real case, this password should be hashed
        role: 'USER',
      },
      // Add more users as needed
    ],
  });

  console.log('Seeding completed');
}

// Call the seed function and handle errors
seed()
  .catch(e => {
    console.error(e);
    process.exit(1);  // Exit with error code if seeding fails
  })
  .finally(async () => {
    await prisma.$disconnect();  // Disconnect Prisma client after seeding
  });
