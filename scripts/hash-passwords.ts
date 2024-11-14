import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashPasswords() {
  try {
    const users = await prisma.user.findMany();  // Fetch all users

    for (const user of users) {
      if (!user.password.startsWith('$2b$')) {  // Check if the password is already hashed
        const hashedPassword = await bcrypt.hash(user.password, 10);  // Hash the password using bcrypt
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword },
        });
        console.log(`Password for user ${user.email} has been hashed.`);  // Log success message
      }
    }

    console.log('Password hashing completed.');
  } catch (error) {
    console.error('Error hashing passwords:', error);  // Catch any errors during the process
  } finally {
    await prisma.$disconnect();  // Disconnect Prisma client after processing
  }
}

hashPasswords();  // Invoke the hashing function
